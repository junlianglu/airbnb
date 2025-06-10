const authService = require('../services/authService');

exports.login = async (req, res, next) => {
    try {
        const token = await authService.login(req.body);
        res.status(200).json({token});
    } catch (err) {
        res.status(401).json({ error: 'Login failed' });
    }
};

exports.register = async (req, res, next) => {
    try {
        const newUser = await authService.register(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
