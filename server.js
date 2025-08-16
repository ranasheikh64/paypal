require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Validation for amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number.' });
        }

        // Create a PaymentIntent with the specified amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card'],
        });

        // Respond with the client secret
        res.status(200).json({
            client_secret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});