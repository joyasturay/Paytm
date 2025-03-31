const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter=require('./routes/user');
const accountRouter = require('./routes/accounts');

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use('/user',userRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/account',accountRouter);

// MongoDB Connection
const MONGO_URL = 'mongodb+srv://joyasturay999:iamjoy@cluster0.twymzrv.mongodb.net/paytm';
async function connect() {
    try {
        await mongoose.connect(MONGO_URL, {});
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

app.listen(8080, () => {
    console.log("Server started on port 8080");
});



