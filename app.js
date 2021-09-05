const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose')
const app = express();
const userApi = require('./routes/user')
const meetApi = require('./routes/meet')
mongoose.connect(process.env.MONGO_INFO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log('connected to database successfully')
    })
    .catch(err => {
        console.log(err)
    })

// Enable CORS
app.use(cors());
// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.get('/health', (req, res) => {
    res.status(200).send(`backend is active`)
})
// API routes 

app.use('/meet', meetApi)
app.use('/user', userApi)

module.exports = app;
