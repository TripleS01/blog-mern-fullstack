const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config/constants');

const isAuth = (request, response, next) => {
    const { token } = request.cookies;
    if (!token) {
        return response.status(401).json('No token provided');
    }

    jwt.verify(token, SECRET_KEY, (error, info) => {
        if (error) return response.status(401).json('Invalid token');

        request.user = info;
        next();
    });

};

module.exports = isAuth;