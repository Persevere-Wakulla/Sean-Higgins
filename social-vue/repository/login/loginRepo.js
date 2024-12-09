import fs from 'fs';

const DATA_FILE = './db/logindb.json';
const loginRepo = {};

loginRepo.get = (resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let logins = JSON.parse(data);
            resolve(logins);
        }
    });
}

loginRepo.getByUserId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let logins = JSON.parse(data);
            let user = logins.find(row => row.userId === parseInt(id));
            resolve(user);
        }
    });
}

loginRepo.getByUserName = (userName, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let logins = JSON.parse(data);
            let user = logins.find(row => row.userName.toLowerCase() === userName.toLowerCase());
            resolve(user);
        }
    });
}

loginRepo.login = (user, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let logins = JSON.parse(data);
            let userFound = logins.find(row => row.userName.toLowerCase() === user.username 
                && row.password === user.password);
            if(userFound){
                resolve(userFound);
            }
            else{
                reject({
                    "status": 404,
                    "statusText": "Password incorrect",
                    "message": "Password / Username incorrect"
                })
            }
        }
    })
}

export default loginRepo;