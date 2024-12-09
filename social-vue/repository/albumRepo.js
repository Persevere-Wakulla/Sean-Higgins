import fs from 'fs';

const DATA_FILE = './db/albumdb.json';

const albumRepo = {};

albumRepo.getUserMostLikedAlbum = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let albums = JSON.parse(data);
            let mostLiked = albums.filter((x) => x.albumLikes.includes(parseInt(id)))
                .sort((a, b) => { 
                    return b.albumLikes.length - a.albumLikes.length });
            resolve(mostLiked?.[0]);
        }
    });
}

export default albumRepo;