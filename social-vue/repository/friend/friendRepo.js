import fs from 'fs';

const DATA_FILE = './db/frienddb.json';
const friendRepo = {};


friendRepo.getByUserId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let friends = JSON.parse(data);
            let userFriends = friends.filter(row => row.userId === parseInt(id));
            resolve(userFriends);
        }
    });
}

friendRepo.addUser = (user, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let friends = JSON.parse(data);
            friends.push(user);
            fs.writeFile(DATA_FILE, JSON.stringify(friends), (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(user);
                }
            });
        }
    });
}


export default friendRepo;