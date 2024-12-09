import express from 'express'
import { generateAccessToken } from '../authToken.js';
import timesheetRepo from '../repo/timesheetRepo.js';

const timesheetRouter = express.Router();


timesheetRouter.get('/user/:id', async (req, res, next) => {
    timesheetRepo.getAllByUserId(req.params.id, (user) => {
        if(user){
            res.send({
                status: 200,
                statusText: 'OK',
                data: user
            })
        }
    }, (err) => next(err))
})

timesheetRouter.get('/:id', async (req, res, next) => {
    timesheetRepo.getById(req.params.id, (timesheet) => {
        if(timesheet){
            res.send({
                status: 200,
                statusText: 'OK',
                data: timesheet
            })
        }
    }, (err) => next(err))
})

timesheetRouter.get('/review/:id', async (req, res, next) => {
    timesheetRepo.getAllToReviewByUserId(req, req.params.id, (timesheet) => {
        if(timesheet){
            res.send({
                status: 200,
                statusText: 'OK',
                data: timesheet
            })
        }
    }, (err) => next(err))
})


timesheetRouter.post('/:id', async (req, res, next) => {
    timesheetRepo.updateTimesheet(req.params.id, req.body, (timesheet) => {
        if(timesheet){
            res.send({
                status: 201,
                statusText: 'OK',
                data: timesheet
            })
        }
    })
})

timesheetRouter.post('/', async (req, res, next) => {
    timesheetRepo.createTimesheet( req.body, (timesheet) => {
        if(timesheet){
            res.send({
                status: 201,
                statusText: 'OK',
                data: timesheet
            })
        }
    })
})


timesheetRouter.post('/review/status', async (req, res, next) => {
    timesheetRepo.reRouteTimesheet( req.body, (timesheet) => {
        if(timesheet){
            res.send({
                status: 201,
                statusText: 'OK',
                data: timesheet
            })
        }
    })
})

timesheetRouter.post('/user/submit', async (req, res, next) => {
    timesheetRepo.routeTimesheet( req.body, (timesheet) => {
        if(timesheet){
            res.send({
                status: 201,
                statusText: 'OK',
                data: timesheet
            })
        }
    })
})

export default timesheetRouter;