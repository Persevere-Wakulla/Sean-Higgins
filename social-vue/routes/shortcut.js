import express from 'express';


import shortcutRepo from '../repository/shortcutRepo.js';
import { authenticateToken } from '../authenticateToken.js';

const shortcutRouter = express.Router();


shortcutRouter.get('/:id', authenticateToken, (req, res, next) => {
    shortcutRepo.getShortcutsByUserId(req.params.id, (data) => {
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
                "message": "User shortcuts Not Found",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "User shortcuts Not Found"
                }
            })
        }
    }, (err) => {
        next(err);
    })
});




export default shortcutRouter;