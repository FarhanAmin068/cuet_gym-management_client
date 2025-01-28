import React, { useState } from 'react';
import { Scale, Activity, Target, Clock } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import workout from './images/workout.jpeg'

interface WorkoutPlan {
  warmup: string[];
  cardio: {
    exercise: string;
    duration: string;
    intensity: string;
  }[];
  strength: {
    exercise: string;
    sets: number;
    reps: number;
    rest: string;
  }[];
  cooldown: string[];
}

const WorkoutPlanner = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const calculateWorkoutPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      setError('Please login to get your workout plan');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const ageNum = parseFloat(age);
    const bmi = weightInKg / (heightInM * heightInM);

    let newWorkoutPlan: WorkoutPlan;

    // Determine fitness level based on age and BMI
    const isBeginner = ageNum > 45 || bmi > 30 || bmi < 18.5;
    const isIntermediate = (ageNum >= 25 && ageNum <= 45) && (bmi >= 18.5 && bmi <= 25);
    const isAdvanced = ageNum < 25 && (bmi >= 18.5 && bmi <= 25);

    if (isBeginner) {
      newWorkoutPlan = {
        warmup: [
          'Light walking in place - 5 minutes',
          'Arm circles - 30 seconds',
          'Shoulder rolls - 30 seconds',
          'Knee lifts - 30 seconds'
        ],
        cardio: [
          {
            exercise: 'Brisk Walking',
            duration: '20 minutes',
            intensity: 'Moderate - You should be able to hold a conversation'
          }
        ],
        strength: [
          {
            exercise: 'Wall Push-ups',
            sets: 2,
            reps: 10,
            rest: '60 seconds'
          },
          {
            exercise: 'Chair Squats',
            sets: 2,
            reps: 12,
            rest: '60 seconds'
          },
          {
            exercise: 'Standing Dumbbell Curls (Light weight)',
            sets: 2,
            reps: 12,
            rest: '60 seconds'
          },
          {
            exercise: 'Seated Resistance Band Rows',
            sets: 2,
            reps: 12,
            rest: '60 seconds'
          }
        ],
        cooldown: [
          'Light stretching - 5 minutes',
          'Deep breathing exercises',
          'Gentle shoulder and neck stretches'
        ]
      };
    } else if (isIntermediate) {
      newWorkoutPlan = {
        warmup: [
          'Dynamic stretching - 5 minutes',
          'Jumping jacks - 2 minutes',
          'Mountain climbers - 1 minute',
          'Arm and leg swings - 2 minutes'
        ],
        cardio: [
          {
            exercise: 'High-Intensity Interval Training (HIIT)',
            duration: '20 minutes',
            intensity: 'Alternate between 30 seconds high intensity and 30 seconds rest'
          }
        ],
        strength: [
          {
            exercise: 'Regular Push-ups',
            sets: 3,
            reps: 12,
            rest: '45 seconds'
          },
          {
            exercise: 'Dumbbell Squats',
            sets: 3,
            reps: 15,
            rest: '45 seconds'
          },
          {
            exercise: 'Bent-Over Rows',
            sets: 3,
            reps: 12,
            rest: '45 seconds'
          },
          {
            exercise: 'Dumbbell Shoulder Press',
            sets: 3,
            reps: 12,
            rest: '45 seconds'
          },
          {
            exercise: 'Lunges with Dumbbells',
            sets: 3,
            reps: 12,
            rest: '45 seconds'
          }
        ],
        cooldown: [
          'Static stretching - 5 minutes',
          'Foam rolling - 5 minutes',
          'Light walking - 5 minutes'
        ]
      };
    } else {
      newWorkoutPlan = {
        warmup: [
          'Dynamic stretching - 5 minutes',
          'Burpees - 2 minutes',
          'High knees - 2 minutes',
          'Jump rope - 3 minutes'
        ],
        cardio: [
          {
            exercise: 'Tabata Intervals',
            duration: '25 minutes',
            intensity: '20 seconds max effort, 10 seconds rest'
          }
        ],
        strength: [
          {
            exercise: 'Barbell Bench Press',
            sets: 4,
            reps: 8,
            rest: '90 seconds'
          },
          {
            exercise: 'Barbell Squats',
            sets: 4,
            reps: 8,
            rest: '90 seconds'
          },
          {
            exercise: 'Deadlifts',
            sets: 4,
            reps: 8,
            rest: '90 seconds'
          },
          {
            exercise: 'Pull-ups',
            sets: 4,
            reps: 8,
            rest: '90 seconds'
          },
          {
            exercise: 'Military Press',
            sets: 4,
            reps: 8,
            rest: '90 seconds'
          },
          {
            exercise: 'Barbell Rows',
            sets: 4,
            reps: 8,
            rest: '90 seconds'
          }
        ],
        cooldown: [
          'Static stretching - 10 minutes',
          'Foam rolling - 10 minutes',
          'Light jogging - 5 minutes'
        ]
      };
    }

    setWorkoutPlan(newWorkoutPlan);

    try {
      await addDoc(collection(db, 'workoutPlans'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        userName: auth.currentUser.displayName,
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseFloat(age),
        bmi: bmi,
        workoutPlan: newWorkoutPlan,
        createdAt: new Date().toISOString()
      });

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error saving workout plan:', err);
      setError('Failed to save workout plan. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Personalized Workout Plans</h1>
            <p className="text-lg text-gray-600 mb-6">
              Get a customized workout routine tailored to your body metrics and fitness level. 
              Our intelligent system analyzes your profile and provides specific exercise 
              recommendations to help you achieve your fitness goals.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Target className="w-6 h-6 text-blue-500 mr-3" />
                <span className="text-gray-700">Personalized exercise selection</span>
              </div>
              <div className="flex items-center">
                <Activity className="w-6 h-6 text-blue-500 mr-3" />
                <span className="text-gray-700">Balanced workout structure</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-blue-500 mr-3" />
                <span className="text-gray-700">Optimized rest periods</span>
              </div>
            </div>
          </div>
          <div>
            <img
              src={workout}
              alt="Workout Equipment"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>

        {/* Workout Calculator Form */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Get Your Workout Plan</h2>
            <p className="mt-2 text-gray-600">Enter your measurements to get started</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">
                Workout plan generated successfully!
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <form onSubmit={calculateWorkoutPlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Scale className="inline-block w-5 h-5 mr-2" />
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter height in cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Scale className="inline-block w-5 h-5 mr-2" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight in kg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline-block w-5 h-5 mr-2" />
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Generating Plan...' : 'Get Workout Plan'}
              </button>
            </form>
          </div>

          {workoutPlan && (
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-500" />
                Your Personalized Workout Plan
              </h3>
              
              <div className="space-y-8">
                {/* Warm-up Section */}
                <div>
                  <h4 className="font-medium text-lg text-blue-600 mb-3">Warm-up</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {workoutPlan.warmup.map((exercise, index) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ul>
                </div>

                {/* Cardio Section */}
                <div>
                  <h4 className="font-medium text-lg text-blue-600 mb-3">Cardio</h4>
                  {workoutPlan.cardio.map((cardio, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-800">{cardio.exercise}</p>
                      <p className="text-gray-600">Duration: {cardio.duration}</p>
                      <p className="text-gray-600">Intensity: {cardio.intensity}</p>
                    </div>
                  ))}
                </div>

                {/* Strength Training Section */}
                <div>
                  <h4 className="font-medium text-lg text-blue-600 mb-3">Strength Training</h4>
                  <div className="grid gap-4">
                    {workoutPlan.strength.map((exercise, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">{exercise.exercise}</p>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-gray-600">
                          <p>Sets: {exercise.sets}</p>
                          <p>Reps: {exercise.reps}</p>
                          <p>Rest: {exercise.rest}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cool-down Section */}
                <div>
                  <h4 className="font-medium text-lg text-blue-600 mb-3">Cool-down</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {workoutPlan.cooldown.map((exercise, index) => (
                      <li key={index}>{exercise}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanner;