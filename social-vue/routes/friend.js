import express from 'express';

import friendRepo from '../repository/friend/friendRepo.js';
import { authenticateToken } from '../authenticateToken.js';

const friendRouter = express.Router();


friendRouter.get('/:id', authenticateToken, (req, res, next) => {
    friendRepo.getByUserId(req.params.id, (data) => {
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
                    "message": "User Friends Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});

friendRouter.post('/', authenticateToken, (req, res, next)=> {
    friendRepo.addUser(req.body, (data) => {
        res.status(201).send({
            "status": 201,
            "statusText": "Following Friend",
            "message": "Following Friend",
            "data": data
        })
    }, (err) => {
        next(err);
    });
})



export default friendRouter;