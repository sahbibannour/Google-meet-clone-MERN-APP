const express = require('express')
const router = express.Router()

const {
    createMeet,
    getMeet,
    deleteMeet,
    addParticipant,
    updateUserAudio,
    updateUserVideo,
    removeParticipant
} = require('../controllers/meet')

router.post('/', createMeet)


router.get('/:meetId', getMeet)

router.patch('/add-user/:meetId', addParticipant)
router.patch('/remove-user/:meetId', removeParticipant)
router.patch('/user-audio/:meetId', updateUserAudio)
router.patch('/user-video/:meetId', updateUserVideo)

router.delete('/:meetId', deleteMeet)


module.exports = router