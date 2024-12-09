
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import blogRouter from './routes/blog.js'
import tickersRouter, { getCryptoCloses, getPrevDayCloses } from './routes/tickers.js'
import * as schedule from 'node-schedule'
const app = express()
const port = 3001


const router = express.Router()

router.use('/blog', blogRouter)
router.use('/tickers', tickersRouter)

app.use(express.json())

app.use(cors())


app.use('/api', router)

var mongoDB = 'mongodb://127.0.0.1/prometheus';


schedule.scheduleJob('15 1 * * *', async () => {
    await getCryptoCloses();
})

schedule.scheduleJob('30 5 * * *', async () => {
    await getPrevDayCloses();
})

mongoose.connect(mongoDB).then(() => {
    var db = mongoose.connection;
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
});


