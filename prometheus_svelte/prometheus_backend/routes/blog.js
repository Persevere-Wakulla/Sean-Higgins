import express from 'express'
import blogModel from '../schema/blog.js'

const blogRouter = express.Router()

blogRouter.get('/', async (req, res, next) => {
    const results = await blogModel.find({}).select('symbol').lean();
    console.dir(results)
    // results.forEach(x => {
    //     console.log(x.symbol);
    //     // fetch(`http://192.168.1.45:3000/stocks/${x.symbol}`).then(data => data.json()).then(json => console.log(json))

    // })
    res.send(results)
})

blogRouter.get('/:slug', async(req, res, next) => {
    const {slug} = req.params;
    const title = slug.replaceAll('-', ' ');
    const blog = await blogModel.findOne({title}).lean();

    res.send(blog)
})


export default blogRouter