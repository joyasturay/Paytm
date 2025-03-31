const express = require('express');
const router = express.Router();
const User = require('../models/user');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../config'); 
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware');
const Account = require('../models/account');

// Define the signup schema using zod
const signUpSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    password: zod.string().min(6, "Password must be at least 6 characters")
});

router.post('/signup', async (req, res) => {
    const body = req.body;
    
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
        return res.status(400).json({ 
            message: "Validation failed", 
            errors: result.error.errors 
        });
    }

    try {
        const existingUser = await User.findOne({ username: body.username });
        if (existingUser) {
            return res.status(411).json({ 
                message: "Email already taken"
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = await User.create({
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            password: hashedPassword
        });

        const userId = newUser._id;
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        });

        const token = jwt.sign({ userId }, jwt_secret.JWT_SECRET);
        res.status(200).json({ 
            message: "User created successfully",
            token: token
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Internal server error"
        });
    }
});

router.post('/signin', async (req, res) => {
    const { success, data, error } = signUpSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: error.errors });
    }

    const { username, password } = data;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Incorrect password." });
        }

        const token = jwt.sign({ id: user._id }, jwt_secret.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/", authMiddleware, async (req, res) => {
    const result = updateBody.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Error while updating information.",
            errors: result.error.errors
        });
    }

    try {
        const updateResult = await User.updateOne({ _id: req.userId }, req.body);
        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ message: "User not found or no changes made." });
        }

        res.json({ message: "Updated successfully." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstName: { "$regex": filter, "$options": "i" } },
            { lastName: { "$regex": filter, "$options": "i" } }
        ]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = router;
