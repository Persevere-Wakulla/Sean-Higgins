import fs from 'fs';

const DATA_FILE = './db/shortCutsdb.json';

const shortcutRepo = {};

shortcutRepo.getShortcutsByUserId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let shortcuts = JSON.parse(data);
            let userShortcuts = shortcuts.filter((x) => x.userId === (parseInt(id)));
            resolve(userShortcuts);
        }
    });
}

export default shortcutRepo;