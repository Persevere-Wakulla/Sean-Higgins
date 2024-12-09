import express from 'express';

import reactionRepo from '../repository/reactionRepo.js';

const reactionRouter = express.Router();

reactionRouter.get('/', (req, res, next) => {
    reactionRepo.getAll((data) => {
        res.send({
            "status": 200,
            "statusText": "OK",
            "data": data
        });
    }, (err) => {
        next(err);
    })
});

export default reactionRouter;