const express = require("express");
require('dotenv').config();
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require('./routes/user');
const accountRouter = require('./routes/accounts');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/account', accountRouter);

// MongoDB Connection
async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}
connect();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await mongoose.connection.close();
    process.exit(0);
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});



