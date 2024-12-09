import express from 'express';

import loginRepo from '../repository/login/loginRepo.js';
import { generateAccessToken } from '../authenticateToken.js';

const loginRouter = express.Router();

loginRouter.get('/', (req, res, next) => {
    loginRepo.get((data) => {
        res.send({
            "status": 200,
            "statusText": "OK",
            "data": data
        });
    }, (err) => {
        next(err);
    })
});

loginRouter.get('/:id', (req, res, next) => {
    loginRepo.getByUserId(req.params.id, (data) => {
        if (data) {

            res.send({
                "status": 200,
                "statusText": "OK",
                "data": data
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "User Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});

loginRouter.get('/find/:user', (req, res, next) => {
    let user = req.params.user;
    loginRepo.getByUserName(user, (data) => {
        if (data) {
            res.status(200).send({
                "status": 200,
                "statusText": "OK",
                data
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "User Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});

loginRouter.post('/', (req, res, next) => {
    loginRepo.login(req.body, (data) => {
        const token = generateAccessToken(data.userName);
        res.status(201).send({
            "status": 201,
            "statusText": "Logged In",
            "message": "Logged In",
            "data": token
        })
    }, (err) => {
        next(err);
    });
})


export default loginRouter;