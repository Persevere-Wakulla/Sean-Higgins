export const formatTime = (datePosted) => {
    let today = new Date(Date.now());
    let dateString = new Date(datePosted).toDateString();
    let date = new Date(datePosted);
    if (date.getDate() === today.getDate() && date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
        if (date.getHours() === today.getHours()) {
            if (date.getMinutes() === today.getMinutes()) {
                datePosted = 'Just Now';
            }
            else if ((today.getMinutes() - date.getMinutes()) <= 59) {
                datePosted = `${today.getMinutes() - date.getMinutes()} mins ago`;
            }
        } else if ((today.getHours() - date.getHours()) === 1) {
            datePosted = '1hr ago';
        }
        else if ((today.getHours() - date.getHours()) <= 10) {
            datePosted = `< ${today.getHours() - date.getHours()}hrs ago`;
        }
        else {
            datePosted = new Date(datePosted).toLocaleTimeString();
        }
    }
    else {
        if(date.getFullYear() === today.getFullYear()){
            let beforeFormatting = new Date(datePosted)
            datePosted = `${beforeFormatting.toDateString().substring(0, beforeFormatting.toDateString().length - 4)} at ${beforeFormatting.getHours()}${beforeFormatting.toLocaleTimeString().substring(beforeFormatting.toLocaleTimeString().length -2)}`
        }
        else {
            datePosted = dateString;
        }
    }
    return datePosted;
}

export const formatMsg = (msg) => {
    if (msg.length > 40) {
        let formatted = '';
        formatted = msg.slice(0, 37);
        formatted += '...';
        return formatted;
    }
    return msg;
}

export const formatThreadImages = (thread, store) => {
    let receiverPics = [];
    thread.map((msg) => {
        let alreadyAdded = null;
        if (receiverPics.length > 0) {
            alreadyAdded = receiverPics.find((x) => x.userId === msg.userId);
        }
        if (msg.userId !== store.profile.userId && (alreadyAdded === null  || alreadyAdded === undefined)) {
            receiverPics.push({picSrc: msg.userPicSrc, userId: msg.userId});
        }
        msg.receivingProfiles.map((user) => {
            let alreadyAdded = null;
            if (receiverPics.length > 0) {
                alreadyAdded = receiverPics.find((x) => x.userId === user.userId);
            }
            if (user.userId !== store.profile.userId
                && (alreadyAdded === null || alreadyAdded === undefined)
            ) {
                receiverPics.push(user);
            }
        })
    });
    return receiverPics;
}
