const Meet = require('../models/Meet')
const User = require('../models/User')



exports.createMeet = async (req, res) => {
    try {

        await Meet.create({ ...req.body, usersHistory: req.body.users.map(userObj => userObj.user._id) })
        res.status(200).json({ message: 'meet saved' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.getMeet = async (req, res) => {
    try {
        const meet = await Meet.findOne({ room: req.params.meetId })
            .populate('users.user')


        return res.status(200).json({ meet })
    } catch (error) {
        res.status(500).json({ error })

    }
}


exports.deleteMeet = async (req, res) => {
    try {
        await Meet.deleteOne({ room: req.params.meetId })
        res.status(200).json({ message: 'meet deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}

exports.addParticipant = async (req, res) => {
    try {
        const meet = await Meet.findOne({ room: req.params.meetId })
        if (!meet.usersHistory.includes(req.body.user.user._id)) {
            meet.usersHistory.push(req.body.user.user._id)
        }
        meet.users.push(req.body.user)
        await meet.save()
        res.status(200).json({ message: 'user added' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}



exports.removeParticipant = async (req, res) => {
    try {
        await Meet.updateOne({ room: req.params.meetId }, { $pull: { users: { socketId: req.body.socketId } } })
        res.status(200).json({ message: 'user deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}

exports.updateUserAudio = async (req, res) => {
    try {
        const meetRoom = await Meet.findOne({ room: req.params.meetId })
        const currentUserIndex = meetRoom.users.findIndex(user => user.socketId == req.body.socketId)
        if (currentUserIndex >= 0)
            meetRoom.users[currentUserIndex].state.isAudio = req.body.value
        await meetRoom.save()
        res.status(200).json({ message: 'user media update' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}

exports.updateUserVideo = async (req, res) => {
    try {
        const meetRoom = await Meet.findOne({ room: req.params.meetId })
        const currentUserIndex = meetRoom.users.findIndex(user => user.socketId == req.body.socketId)
        if (currentUserIndex >= 0)
            meetRoom.users[currentUserIndex].state.isVideo = req.body.value
        await meetRoom.save()
        res.status(200).json({ message: 'user media update' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}