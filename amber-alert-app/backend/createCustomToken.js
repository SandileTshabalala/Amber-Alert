import express, { json } from 'express';
//import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import { admin } from './firebase-admin/firebaseAdmin.js';


dotenv.config();

const app = express();
app.use(express.json());

app.post('/generateCustomToken', async (req, res) => {
  const { badgeNumber } = req.body;

  try {
    // Fetch user record based on badge number
    const userDoc = await admin.firestore().collection('police_users').where('badgeNumber', '==', badgeNumber).get();

    if (userDoc.empty) {
      return res.status(404).send('User not found');
    }

    const user = userDoc.docs[0].data();
    const uid = user.uid;

    // Generate custom token
    const customToken = await admin.auth().createCustomToken(uid);

    res.json({ token: customToken });
  } catch (error) {
    console.error('Error generating custom token:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));