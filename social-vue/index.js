import express from 'express';


import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import userPostRouter from './routes/userPost.js';
import friendRouter from './routes/friend.js';
import userProfileRouter from './routes/userProfile.js';
import notificationRouter from './routes/notification.js';
import directMessageRouter from './routes/directMessage.js';
import reactionRouter from './routes/reaction.js';
import groupRouter from './routes/group.js';
import albumRouter from './routes/album.js';
import shortcutRouter from './routes/shortcut.js';

import cors from 'cors';
import config from 'config';

const app = express();

const router = express.Router();

router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/userPosts', userPostRouter);
router.use('/friends', friendRouter);
router.use('/userProfile', userProfileRouter);
router.use('/notifications', notificationRouter);
router.use('/messages', directMessageRouter);
router.use('/reactions', reactionRouter);
router.use('/group', groupRouter);
router.use('/album', albumRouter);
router.use('/shortcut', shortcutRouter)

const port = config.get('serverConfig.port');

app.use(cors())

app.use(express.json());

app.use(config.get('serverConfig.prefix'), router);


let server = app.listen(port, function () {
});