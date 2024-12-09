import express from 'express'
import userRepo from '../repo/userRepo.js';

const setupUserRouter = express.Router();

setupUserRouter.get('/project/:id/filter', (req, res, next) => {
    userRepo.getUsersWithFilteringAndPaging(req.params.id, req.query, (data) => {
        if(data){
            res.send({
                status: 200,
                statusText: 'OK',
                data
            })
        }
    }, (err) => next(err))
})

export default setupUserRouter;
