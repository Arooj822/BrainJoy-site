import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// --- 1. HOSTINGER EMAIL SETUP ---
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: 'info@brainjoy.site', 
    pass: 'YOUR_EMAIL_PASSWORD' // The password you created in Hostinger hPanel
  }
});

// --- 2. TEMPORARY DATABASE ---
// In a real project, use MongoDB. For now, this stores users in memory.
const users = []; 

// --- 3. SIGN UP ROUTE ---
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Create a unique human-verification token
  const token = crypto.randomBytes(32).toString('hex');

  // Save the user as "pending"
  users.push({ email, password, isActive: false, token });

  // The link the user clicks
  const activationLink = `https://brainjoy.site/activate/${token}`;

  const mailOptions = {
    from: '"BrainJoy Support" <info@brainjoy.site>',
    to: email,
    subject: 'Activate your BrainJoy account',
    html: `
      <h2>Welcome to BrainJoy!</h2>
      <p>A real human wants to welcome you. Please click the link below to verify your email:</p>
      <a href="${activationLink}" style="padding: 10px 20px; background: #7c3aed; color: white; text-decoration: none; border-radius: 5px;">Activate Account</a>
      <p>If the button doesn't work, copy this link: ${activationLink}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Activation email sent! Please check your inbox." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not send email." });
  }
});

// --- 4. ACTIVATION ROUTE ---
app.get('/activate/:token', (req, res) => {
  const { token } = req.params;
  const user = users.find(u => u.token === token);

  if (user) {
    user.isActive = true;
    user.token = null; // Token used, so clear it
    res.send("<h1>Success!</h1><p>Your account is active. You can now login.</p>");
  } else {
    res.status(400).send("Invalid or expired activation link.");
  }
});

// Your existing Gemini route
app.post('/gemini', async (req, res) => {
    // ... your existing code
});

app.listen(3000, () => console.log('Server running on port 3000'));