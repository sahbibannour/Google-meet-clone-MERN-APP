const User = require('../models/User')

exports.createUser = async (req, res) => {
    try {
        req.body.user.profileImage = `https://avatars.dicebear.com/api/initials/${req.body.user.firstName}.svg`
        const createdUser = await User.create({ ...req.body.user })
        res.status(200).json({ user: createdUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};
