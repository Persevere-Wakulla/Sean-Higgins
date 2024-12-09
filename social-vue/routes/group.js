import express from 'express';
import groupRepo from '../repository/group/groupRepo.js';

const groupRouter = express.Router();


groupRouter.get('/mostJoined', (req, res, next) => {
    groupRepo.getMostJoined((data) => {
        if (data) {
            res.status(200).send({
                "status": 200,
                "statusText": "OK",
                "data": data
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "Groups Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "Groups Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});



export default groupRouter;