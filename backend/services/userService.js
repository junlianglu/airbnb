const User = require('../models/User');

exports.getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    return user;
};
