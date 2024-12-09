import express from 'express';
import userPostRepo from '../repository/userPost/userPostRepo.js';
import { authenticateToken } from '../authenticateToken.js';

const userPostRouter = express.Router();

userPostRouter.get('/:id',authenticateToken, (req, res, next) => {
    userPostRepo.getByWallId(req.params.id, (data) => {
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
                "message": "User Posts Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User Posts Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});

userPostRouter.get('/all/:id', (req, res, next) => {
    userPostRepo.getAllUserAndFriendPostsByUserId(req.params.id, (data) => {
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
                "message": `Wall Posts For User ${req.params.id} Not Found`,
                "error": {
                    "code": "NOT_FOUND",
                    "message": `Wall Posts For User ${req.params.id} Not Found`
                }
            })
        }
    })
});

userPostRouter.post('/',authenticateToken, (req, res, next) => {
    userPostRepo.createPost(req.body, (data) => {
        res.status(201).send({
            "status": 201,
            "statusText": "Created Post",
            "message": "Created Post",
            data
        })
    },
        (err) => {
            next(err);
        }
    )
});

userPostRouter.put('/:id',authenticateToken, (req, res, next) => {
    userPostRepo.getByPostId(req.params.id, (data) => {
        if (data) {
            userPostRepo.update(req.params.id, req.body, (data) => {
                res.send({
                    "status": 200,
                    "statusText": "OK",
                    "message": `Updated Post ${req.params.id}`,
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
                "message": "User Post Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User Post Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
})




export default userPostRouter;