
const express = require('express');
const  authMiddleware  = require('../middleware');
const Account = require('../models/account');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            // Create a new account with 0 balance if it doesn't exist
            const newAccount = await Account.create({
                userId: req.userId,
                balance: 1000 // Give initial balance of 1000
            });
            return res.json({
                balance: newAccount.balance
            });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching balance",
            error: error.message
        });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;
        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

router.post("/deposit", authMiddleware, async (req, res) => {
    const { amount } = req.body;

    const account = await Account.findOne({ userId: req.userId });
    if (!account) {
        return res.status(400).json({ message: "Account not found" });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: amount } });
    res.json({ message: "Deposit successful" });
});

module.exports = router;