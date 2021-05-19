const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Port = process.env.PORT || 5000

//mongodb://localhost:27017/AppDB--Local Host
mongoose.connect('mongodb+srv://bloguser:1234@cluster0.uhf9t.mongodb.net/AppDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

// Checking if MongoDB is connected?
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB Connected ');
});
//Checker Code Finish


//middleware
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user", userRoute);

app.route('/').get((req, res) => res.json('My First Rest API 2'));
app.listen(Port, () => console.log(`Your Server is Running on Port ${Port}`));