import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface DietPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

const DietManagement = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const calculateBMI = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      setError('Please login to get your diet plan');
      navigate('/login');
      return;
    }

    if (!age || isNaN(parseInt(age)) || parseInt(age) <= 0) {
      setError('Please enter a valid age');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const calculatedBMI = weightInKg / (heightInM * heightInM);
    setBmi(parseFloat(calculatedBMI.toFixed(1)));

    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weightInKg + 6.25 * parseFloat(height) - 5 * parseInt(age) + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * parseFloat(height) - 5 * parseInt(age) - 161;
    }

    const tdee = bmr * activityLevel;
    setCalories(tdee);

    let newDietPlan: DietPlan;

    if (calculatedBMI < 18.5) {
      newDietPlan = {
        breakfast: ['Paratha with egg curry', 'Tea with toast and jam', 'Lassi'],
        lunch: ['Rice with beef curry', 'Fried vegetables', 'Chicken kebab'],
        dinner: ['Bhuna Khichuri with beef or chicken curry', 'Raita'],
        snacks: ['Samosa', 'Fruits like banana or apple', 'Sweet yogurt (mishti doi)'],
      };
    } else if (calculatedBMI < 25) {
      newDietPlan = {
        breakfast: ['Toast with butter and boiled eggs', 'Fresh fruit juice or tea', 'Light porridge'],
        lunch: ['Rice with dal', 'Grilled fish or chicken', 'Mixed vegetable salad'],
        dinner: ['Steamed rice with chicken or fish curry', 'Stir-fried vegetables', 'Salad'],
        snacks: ['Roasted peanuts or nuts', 'Whole wheat biscuits', 'Yogurt with honey'],
      };
    } else {
      newDietPlan = {
        breakfast: ['Vegetable omelet with whole wheat toast', 'Tea with minimal sugar', 'Cucumber and tomato slices'],
        lunch: ['Grilled chicken breast with steamed rice', 'Steamed vegetables', 'Green salad with lemon dressing'],
        dinner: ['Light rice with boiled vegetables', 'Baked or grilled fish', 'Small portion of dal'],
        snacks: ['Carrot sticks with hummus', 'Green tea', 'Cucumber slices'],
      };
    }

    setDietPlan(newDietPlan);

    try {
      await addDoc(collection(db, 'dietPlans'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        userName: auth.currentUser.displayName,
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age),
        bmi: calculatedBMI,
        dietPlan: newDietPlan,
        calories: tdee,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving diet plan:', err);
      setError('Failed to save diet plan. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Personalized Diet Plans</h1>
          <p className="text-lg text-gray-600 mb-6">
            Get a customized diet plan tailored to your body metrics and fitness goals. 
            Our intelligent system calculates your BMI and provides specific meal 
            recommendations to help you achieve optimal health.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <span className="text-gray-700">BMI-based meal recommendations</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <span className="text-gray-700">Balanced nutrition guidance</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <span className="text-gray-700">Customized portion control</span>
            </div>
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061"
            alt="Healthy Food"
            className="rounded-lg shadow-xl w-full"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Calculate Your Diet Plan</h2>

          <form onSubmit={calculateBMI} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  required
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age (years)
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="1.2">Sedentary (little or no exercise)</option>
                  <option value="1.375">Lightly Active (light exercise)</option>
                  <option value="1.55">Moderately Active (moderate exercise)</option>
                  <option value="1.725">Very Active (hard exercise)</option>
                  <option value="1.9">Super Active (very hard exercise)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md mt-4 hover:bg-blue-700 transition duration-300"
            >
              Calculate
            </button>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Diet plan successfully calculated!</p>}

          {bmi && (
            <div className="mt-6 p-6 border rounded-lg bg-gray-50">
              <h3 className="text-2xl font-bold">Your BMI: {bmi}</h3>
              <div className="mt-4 space-y-4">
                <h4 className="font-semibold">Diet Plan</h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Breakfast:</strong> {dietPlan?.breakfast.join(', ')}
                  </li>
                  <li>
                    <strong>Lunch:</strong> {dietPlan?.lunch.join(', ')}
                  </li>
                  <li>
                    <strong>Dinner:</strong> {dietPlan?.dinner.join(', ')}
                  </li>
                  <li>
                    <strong>Snacks:</strong> {dietPlan?.snacks.join(', ')}
                  </li>
                </ul>
                <p className="mt-2 font-semibold">
                  Total Calories: {calories?.toFixed(0)} kcal
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default DietManagement;
