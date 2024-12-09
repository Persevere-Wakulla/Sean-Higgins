import fs from 'fs';

const DATA_FILE = './db/postdb.json';
const DATA_FILE_PROFILES = './db/userProfiledb.json';
const DATA_FILE_FRIENDS = './db/frienddb.json';

const userPostRepo = {};

userPostRepo.getAllUserAndFriendPostsByUserId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if(err) {
            reject(err)
        }
        else {
            fs.readFile(DATA_FILE_FRIENDS, (friendErr, friendData) => {
                if(friendErr) {
                    reject(friendErr)
                }
                else {
                    let friends = JSON.parse(friendData);
                    let posts = JSON.parse(data);

                    let userFriendIds = friends.filter((x) => x.userId === parseInt(id)).map((x) => x.friendId).flat();
                    userFriendIds = [...userFriendIds, parseInt(id)];

                    let allPosts = posts.filter((x) => userFriendIds.includes(x.userId))

                    allPosts = allPosts.sort((a, b) => b.time - a.time);

                    resolve(allPosts);
                }
            })
        }
    })
}

userPostRepo.getByWallId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            fs.readFile(DATA_FILE_PROFILES, (err, profileData) => {
                let profiles = JSON.parse(profileData);
                
                let posts = JSON.parse(data);
                let userPosts = posts.filter(row => row.wallId === parseInt(id));
                userPosts.map((post) => {
                    let userProfile = profiles.find((user) => user.userId === post.userId);
                    post.userName = `${userProfile.firstName} ${userProfile.lastName}`;
                    post.responses?.map((response) => {
                        let userProfile = profiles.find((user) => user.userId === parseInt(response.userId));
                        response.userName = `${userProfile.firstName} ${userProfile.lastName}`; 
                    });
                })
                resolve(userPosts);
            })
        }
    });
}

userPostRepo.getByPostId = (id, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let posts = JSON.parse(data);
            let post = posts.find(row => row.postId === parseInt(id));
            resolve(post);
        }
    });
}


userPostRepo.update = (id, updatedPost, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let posts = JSON.parse(data);
            let post = posts.find(row => row.postId === parseInt(id));
            
            Object.assign(post, updatedPost);
            
            fs.writeFile(DATA_FILE, JSON.stringify(posts), (err) => {
                err ? reject(err) : resolve(post);
            })
        }
    })
}


userPostRepo.createPost = (post, resolve, reject) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            let posts = JSON.parse(data);
            let sorted = posts.sort((a, b) => a.postId - b.postId);
            let lastPost = sorted[sorted.length -1];
            post.postId = lastPost.postId++;
            posts.push(post);
            fs.writeFile(DATA_FILE, JSON.stringify(posts), (err) => {
                err ? reject(err) : resolve(post);
            })
        }
    })
}

export default userPostRepo;