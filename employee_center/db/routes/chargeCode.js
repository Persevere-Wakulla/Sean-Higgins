import express from 'express'
import chargeCodeRepo from '../repo/chargeCodeRepo.js';

const chargeCodeRouter = express.Router();

chargeCodeRouter.get('/:id', (req, res, next) => {
    chargeCodeRepo.getById(req.params.id, (data) => {
        if(data){
            res.send({
                status: 200,
                statusText: 'OK',
                data
            })
        }
    }, (err) => next(err))
})

chargeCodeRouter.get('/project/:id', async (req, res, next) => {
    chargeCodeRepo.getAllByProjectId(req.params.id, req.query, (codes) => {
        if(codes){
            res.send({
                status: 200,
                statusText: 'OK',
                data: codes
            })
        }
    }, (err) => next(err))
})

chargeCodeRouter.put('/project/:id', async (req, res, next) => {
    chargeCodeRepo.updateChargeCode(req.params.id, req.body, (code) => {
        if(code){
            res.send({
                status: 200,
                statusText: 'OK',
                data: code
            })
        }
    }, (err) => next(err))
})

chargeCodeRouter.post('/', async (req, res, next) => {
    chargeCodeRepo.createProjectChargeCode(req.body, (code) => {
        if(code){
            res.send({
                status: 201,
                statusText: 'OK',
                data: code
            })
        }
    }, (err) => next(err))
})

export default chargeCodeRouter;