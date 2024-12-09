import fs from 'fs';

const DATA_FILE = './db/directMessagesdb.json';
const DATA_FILE_PROFILES = './db/userProfiledb.json';
const DATA_FILE_IS_READ = './db/msgIsRead.json';

const directMessageRepo = {};

directMessageRepo.getByUserId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, msgData) => {
        if (err) {
            reject(err);
        }
        else {
            fs.readFile(DATA_FILE_PROFILES, (err, profileData) => {

                fs.readFile(DATA_FILE_IS_READ, (err, isReadData) => {
                    const msgs = JSON.parse(msgData);
                    const profiles = JSON.parse(profileData);
                    const isReadMsgs = JSON.parse(isReadData);
                    const userMsgs = msgs.filter(row => row.userId === parseInt(id) || row.receivingUserIds.includes(parseInt(id)));
                    userMsgs.map((msg) => {
                        let userProfile = profiles.find((user) => user.userId === msg.userId);

                        let msgReadData = isReadMsgs.find((isRead) => parseInt(id) === isRead.userId && isRead.messageId === msg.messageId && isRead.threadId === msg.threadId);
                        msg.userPicSrc = userProfile.picSrc;
                        msg.userFirstName = userProfile.firstName;
                        msg.userLastName = userProfile.lastName;
                        msg.isDeleted = msgReadData?.isDeleted ?? false;
                        msg.isRead = msgReadData?.isRead ?? false;
                        msg.receivingProfiles = [];
                        msg.receivingUserIds.map((rid) => {
                            let msgReadData = isReadMsgs.find((isRead) => rid !== parseInt(id) && rid === isRead.userId && isRead.messageId === msg.messageId && isRead.threadId === msg.threadId);
                            let receivingProfile = profiles.find((user) => user.userId === rid);
                            msg.receivingProfiles.push({
                                userId: receivingProfile.userId,
                                picSrc: receivingProfile.picSrc,
                                firstName: receivingProfile.firstName,
                                lastName: receivingProfile.lastName,
                                receiverReadMsg: msgReadData?.isRead ?? true
                            });
                        })
                    });
                    userMsgs.sort((a, b) => b.dateSent - a.dateSent);
                    resolve(userMsgs);
                })
            })
        }
    });
}

directMessageRepo.getByThreadId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            fs.readFile(DATA_FILE_PROFILES, (err, profileData) => {
                let msgs = JSON.parse(data);
                let thread = msgs.filter(row => row.threadId === parseInt(id));
                const profiles = JSON.parse(profileData);
                thread.map((msg) => {
                    let userProfile = profiles.find((user) => user.userId === msg.userId);
                    msg.userPicSrc = userProfile.picSrc;
                    msg.userFirstName = userProfile.firstName;
                    msg.userLastName = userProfile.lastName;
                    msg.receivingProfiles = [];
                    msg.receivingUserIds.map((id) => {
                        let receivingProfile = profiles.find((user) => user.userId === id);
                        msg.receivingProfiles.push({
                            userId: receivingProfile.userId,
                            picSrc: receivingProfile.picSrc,
                            firstName: receivingProfile.firstName,
                            lastName: receivingProfile.lastName
                        });
                    })
                });
                thread.sort((a, b) => b.dateSent - a.dateSent);
                resolve(thread);
            })
        }
    });
}


directMessageRepo.delete = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let msgs = JSON.parse(data);
            let msgIndex = msgs.indexOf(row => row.messageId === parseInt(id));
            msgs.splice(msgIndex, 1);

            fs.writeFile(DATA_FILE, JSON.stringify(msgs), (err) => {
                err ? reject(err) : resolve(msgs);
            })
        }
    })
}

directMessageRepo.readMessage = (msg, resolve, reject) => {
    fs.readFile(DATA_FILE_IS_READ, (err, data) => {
        let messageReadStatus = JSON.parse(data);

        messageReadStatus.map((x) => {
            if (x.userId === msg.userId && x.threadId === msg.threadId) {
                x.isRead = true;
            }
        });

        fs.writeFile(DATA_FILE_IS_READ, JSON.stringify(messageReadStatus), (err) => {
            err ? reject(err) : resolve(msg);
        })
    })
}


directMessageRepo.createMsg = (msg, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            const defaultIsRead = {
                threadId: msg.threadId,
                messageId: msg.messageId,
                isRead: false,
                isDeleted: false
            };
            fs.readFile(DATA_FILE_IS_READ, (err, isReadData) => {
                let msgs = JSON.parse(data);
                let isRead = JSON.parse(isReadData);

                if (!msg.hasOwnProperty('threadId')) {
                    const threadIds = msgs.map((x) => x.threadId);
                    const maxThreadId = Math.max(...threadIds);
                    msg.threadId = maxThreadId + 1;
                    msg.messageId = 1;
                }

                msg.receivingUserIds.forEach((user) => {
                    isRead.push({...defaultIsRead, userId: user.userId});
                });

                isRead.push({
                    ...defaultIsRead,
                    isRead: true
                });

                fs.writeFile(DATA_FILE_IS_READ, JSON.stringify(isRead), (err) => {
                    if (!err) {
                        msgs.push(msg);
                        fs.writeFile(DATA_FILE, JSON.stringify(msgs), (err) => {
                            err ? reject(err) : resolve(msg);
                        })
                    } else {
                        reject(err);
                    }
                });

            })
        }
    })
}

export default directMessageRepo;