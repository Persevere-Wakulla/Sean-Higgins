import express from 'express';
import directMessageRepo from '../repository/message/messageRepo.js';
import { authenticateToken } from '../authenticateToken.js';

const directMessageRouter = express.Router();

directMessageRouter.get('/:id', authenticateToken, (req, res, next) => {
    directMessageRepo.getByUserId(req.params.id, (data) => {
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
                "message": "User Messages Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User Messages Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});

directMessageRouter.get('/thread/:threadId', authenticateToken, (req, res, next) => {
    directMessageRepo.getByThreadId(req.params.threadId, (data) => {
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
                "message": "Message Thread Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "Message Thread Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});

directMessageRouter.post('/', authenticateToken, (req, res, next) => {
    directMessageRepo.createMsg(req.body, (data) => {
        res.status(201).send({
            "status": 201,
            "statusText": "Created Message",
            "message": "Created Message",
            data
        })
    },
        (err) => {
            next(err);
        }
    )
});


directMessageRouter.put('/read', authenticateToken, (req, res, next) => {
    directMessageRepo.readMessage(req.body, (data) => {
        res.status(201).send({
            "status": 201,
            "statusText": "Updated Thread Read Status",
            "message": "Updated Thread Read Status",
            data
        })
    },
        (err) => {
            next(err);
        }
    )
});

directMessageRouter.delete('/:id', authenticateToken, (req, res, next) => {
    directMessageRepo.getByUserId(req.params.id, (data) => {
        if (data) {
            directMessageRepo.delete(req.params.id, req.body, (data) => {
                res.send({
                    "status": 200,
                    "statusText": "OK",
                    "message": `Deleted Message ${req.params.id}`,
                    "data": data
                });
            },
                (err) => next(err)
            )
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "User Message Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User Message Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
})




export default directMessageRouter;