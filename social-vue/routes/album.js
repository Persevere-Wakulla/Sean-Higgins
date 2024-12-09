import express from 'express';

import albumRepo from '../repository/albumRepo.js';
import { authenticateToken } from '../authenticateToken.js';

const albumRouter = express.Router();


albumRouter.get('/mostliked/:id', authenticateToken, (req, res, next) => {
    albumRepo.getUserMostLikedAlbum(req.params.id, (data) => {
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
                "message": "Most Liked Album Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "Most Liked Album Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});




export default albumRouter;