import jwt from 'jsonwebtoken';
import config from 'config';


export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, config.get('serverConfig.auth'), (err, user) => {

        if (err) return res.sendStatus(403);

        req.user = user;

        next();
    })
}

export const generateAccessToken = (username) => {
    return jwt.sign({userName: username}, 'mySecret', { expiresIn: '1h' });
}