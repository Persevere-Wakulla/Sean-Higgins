import fs from 'fs';

const DATA_FILE = './db/logindb.json';
const registerRepo = {};

registerRepo.insert = (user, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let logins = JSON.parse(data);
            let lastUser = logins.pop();
            let lastUserId = lastUser.userId;
            user.userId = lastUserId++;
            logins.push(user);
            fs.writeFile(DATA_FILE, JSON.stringify(logins), (err) => {
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

export default registerRepo;