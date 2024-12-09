import express from 'express'
import projectRepo from '../repo/projectRepo.js';

const projectRouter = express.Router();

projectRouter.get('/:id', (req, res, next) => {
    projectRepo.getById(req.params.id, (data) => {
        if(data){
            res.send({
                status: 200,
                statusText: 'OK',
                data
            })
        }
    }, (err) => next(err))
})

projectRouter.get('/', async (req, res, next) => {
    projectRepo.getAll((projects) => {
        if(projects){
            res.send({
                status: 200,
                statusText: 'OK',
                data: projects
            })
        }
    }, (err) => next(err))
})

projectRouter.post('/', async (req, res, next) => {
    projectRepo.createProject(req.body, (project) => {
        if(project){
            res.send({
                status: 200,
                statusText: 'OK',
                data: project
            })
        }
    }, (err) => next(err))
})

export default projectRouter;