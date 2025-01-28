const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Existing email function
exports.sendBookingConfirmation = functions.runWith({
  secrets: ['EMAIL_USER', 'EMAIL_PASS']
}).firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const booking = snap.data();
    // Rest of the email code...
});

// New function to list users
exports.listUsers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Verify if request is from admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      
      // Verify admin session token
      if (token !== 'admin123') { // Use the same password as in AdminLogin.tsx
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // List all users
      const listUsersResult = await admin.auth().listUsers();
      const users = listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.metadata.creationTime
      }));

      res.status(200).json({ users });
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Failed to list users' });
    }
  });
});