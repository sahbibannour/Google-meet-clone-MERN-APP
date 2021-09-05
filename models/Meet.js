const mongoose = require('mongoose')

const meetSchema = new mongoose.Schema({
    room: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    users: [{
        socketId: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        state: {
            isVideo: { type: Boolean, default: false },
            isAudio: { type: Boolean, default: false },

        }
    }],
    usersHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})


module.exports = mongoose.model('Meet', meetSchema)