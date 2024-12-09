import express from 'express';

import notificationRepo from '../repository/notification/notificationRepo.js';
import { authenticateToken } from '../authenticateToken.js';

const notificationRouter = express.Router();


notificationRouter.get('/:id',authenticateToken, (req, res, next) => {
    notificationRepo.getByUserId(req.params.id, (data) => {
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
                    "message": "User Notifications Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});

notificationRouter.get('/:id/notification/:notificationId', authenticateToken, (req, res, next) => {
    notificationRepo.getByNotificationId(req.params.notificationId, (data) => {
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
                "message": "Notification Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "Notification Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});

notificationRouter.post('/',authenticateToken, (req, res, next)=> {
    notificationRepo.createNotification(req.body, (data) => {
        res.status(201).send({
            "status": 201,
            "statusText": "Created Notification",
            "message": "Created Notification",
            "data": data
        })
    }, (err) => {
        next(err);
    });
})



export default notificationRouter;