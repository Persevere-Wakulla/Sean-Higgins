import express from 'express';

import registerRepo from '../repository/register/registerRepo.js';


const registerRouter = express.Router();


registerRouter.post('/', (req, res, next) => {
    registerRepo.insert(req.body, (data) => {
        res.status(201).send({
            "status": 201,
            "statusText": "Created User",
            "message": "Created User",
            "data": data
        });
    }, (err) => {
        next(err);
    })
});

export default registerRouter;