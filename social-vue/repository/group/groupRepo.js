import fs from 'fs';

const DATA_FILE = './db/groupdb.json';

const groupRepo = {};

groupRepo.getMostJoined = (resolve, reject) => {
    fs.readFile(DATA_FILE, (err, groupData) => {
        if (err) {
            reject(err);
        }
        else {
            let groups = JSON.parse(groupData);
            let popular = groups.filter(row => row.members.length > 5);
            
            resolve(popular);
        }
    });
}

export default groupRepo;