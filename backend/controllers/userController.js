const userService = require('../services/userService');

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: 'User not found' });
    }
};
