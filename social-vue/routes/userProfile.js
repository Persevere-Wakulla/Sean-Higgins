import express from 'express';
import userProfileRepo from '../repository/userProfile/userProfileRepo.js';
import { authenticateToken } from '../authenticateToken.js';

const userProfileRouter = express.Router();

userProfileRouter.get('/:id',authenticateToken, (req, res, next) => {
    userProfileRepo.getById(req.params.id, (data) => {
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
                "message": "User Profile Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User Profile Not Found"
                }
            });
        }
    }, (err) => {
        next(err);
    })
});

userProfileRouter.put('/:id',authenticateToken, (req, res, next) => {
    userProfileRepo.getById(req.params.id, (data) => {
        if (data) {
            userProfileRepo.update(req.body, req.params.id, (data) => {
                res.send({
                    "status": 200,
                    "statusText": "OK",
                    "message": `User Profile ${req.params.id} updated`,
                    "data": data
                });
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "User Profile Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User Profile Not Found"
                }
            });
        }
    }, (err) => {
        next(err);
    })
})


export default userProfileRouter;