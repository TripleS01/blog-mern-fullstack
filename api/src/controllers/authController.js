const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { SECRET_KEY } = require('../config/constants');

const saltRounds = 10;

exports.register = async (request, response) => {
    const { email, username, password, repeatPassword } = request.body;

    if (password !== repeatPassword) {
        return response.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        response.json(user);

    } catch (error) {
        response.status(400).json(error);
    }

};

exports.login = async (request, response) => {
    const { identifier, password } = request.body;

    const user = await User.findOne({
        $or: [
            { username: identifier },
            { email: identifier },
        ]
    });

    if (!user) {
        return response.status(400).json('Wrong credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        jwt.sign({ username: user.username, id: user._id }, SECRET_KEY, {}, (error, token) => {
            if (error) return response.status(401).json('Invalid token');

            response.cookie('token', token).json({
                id: user._id,
                username: user.username,
            });

        });
    } else {
        response.status(400).json('Wrong credentials');
    }

};

exports.authentication = (request, response) => {
    const { token } = request.cookies;

    jwt.verify(token, SECRET_KEY, {}, (error, info) => {
        if (error) return response.status(401).json('Invalid token');

        response.json(info);
    });

};

exports.logout = (request, response) => {
    response.cookie('token', '').json('ok');

};