import fs from 'fs';

const DATA_FILE = './db/notificationdb.json';
const notificationRepo = {};


notificationRepo.getByNotificationId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let notifications = JSON.parse(data);
            let notification = notifications.find(row => row.notificationId === parseInt(id));
            resolve(notification);
        }
    });
}
notificationRepo.getByUserId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let notifications = JSON.parse(data);
            let userNotifications = notifications.filter(row => row.userId === parseInt(id));
            resolve(userNotifications);
        }
    });
}

notificationRepo.createNotification = (notification, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let notifications = JSON.parse(data);
            let sorted = notifications.sort((a, b) => a.postId - b.postId);
            let lastNotification = sorted[sorted.length -1];
            lastNotification.notificationId = lastNotification.notificationId++;
            notifications.push(notification);
            fs.writeFile(DATA_FILE, JSON.stringify(notifications), (err) => {
                err ? reject(err) : resolve(post);
            })
        }
    })
}

export default notificationRepo;