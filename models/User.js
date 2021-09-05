const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    profileImage: { type: String }

})


module.exports = mongoose.model('User', userSchema)