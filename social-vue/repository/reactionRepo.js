import fs from 'fs';

const DATA_FILE = './db/reactionsdb.json';

const reactionRepo = {};

reactionRepo.getAll = (resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let reactions = JSON.parse(data);
            resolve(reactions);
        }
    });
}


export default reactionRepo;