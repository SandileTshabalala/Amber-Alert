import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';


dotenv.config({ path: '../../.env' }); 
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error('Twilio credentials are missing in .env file!');
  process.exit(1); // Stop server if credentials are missing
}

const client = twilio(accountSid, authToken);

app.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;

    // Validate nuumber 'to' is an array and not empty
    if (!Array.isArray(to) || to.length === 0) {
      return res.status(400).json({ success: false, error: 'No recipients provided.' });
    }

    // Send to array
    const sendMessages = to.map((recipient) =>
      client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: recipient,
      })
    );

    const results = await Promise.all(sendMessages);
    res.status(200).json({ success: true, message: 'SMS sent.....', results });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, error: 'Failed to send SMS' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
