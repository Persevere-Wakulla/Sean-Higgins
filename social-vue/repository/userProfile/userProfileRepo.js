import fs from 'fs';

const DATA_FILE = './db/userProfiledb.json';

const userProfileRepo = {};

userProfileRepo.getById = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let profiles = JSON.parse(data);
            let userProfile = profiles.find(row => row.userId === parseInt(id));
            resolve(userProfile);
        }
    });
}

userProfileRepo.update = (profile, id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let profiles = JSON.parse(data);
            let userProfile = profiles.find(row => row.userId === parseInt(id));
            if (userProfile) {
                Object.assign(userProfile, profile);
                fs.writeFile(DATA_FILE, JSON.stringify(profiles), (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(profile);
                    }
                })
            }
        }
    });
}

export default userProfileRepo;