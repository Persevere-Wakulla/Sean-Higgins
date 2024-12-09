import { reactive } from 'vue';
import { ajax } from 'rxjs/ajax';
import { map, catchError, of, distinct, filter } from 'rxjs';


export const store = reactive({
    unReadMsgs: 0,
    unReadNotifications: 0,
    authentication: null,
    jwt: null,
    mostLikedAlbum: null,
    profile: null,
    currentViewingUser: null,
    currentWallPosts: [],
    msgPosts: [],
    mostPopularGroups: [],
    reactions: [],
    notifications: [],
    friends: [],
    shortcuts: [],
    loadMessages(userId, auth) {
        let posts$ = ajax.get(`http://localhost:3000/api/messages/${userId}`, auth).pipe(
            map(({ response }) => response.data),
            catchError((err) => console.dir(err))
        ).subscribe((x) => {
            this.msgPosts = x;
            this.unReadMsgs = x.filter((xx) => !xx.isRead).length;
            this.msgPosts = Map.groupBy(this.msgPosts, ({ threadId }) => threadId);
        });
    },

    getTimelineUpdates(userId, auth){
        ajax.get(`http://localhost:3000/api/userPosts/all/${userId}`, auth).pipe(
            map(({response}) => response.data)
        ).subscribe((x) => this.currentWallPosts = x);
    },

    getMostPopularGroups(auth) {
        ajax.get(`http://localhost:3000/api/group/mostJoined`, auth).pipe(
            map(({response}) => response.data)
        ).subscribe((x) => this.mostPopularGroups = x);
    },
    getMostLikedAlbum(userId, auth) {
        ajax.get(`http://localhost:3000/api/album/mostliked/${userId}`, auth).pipe(
            map(({response}) => response.data)
        ).subscribe((x) => this.mostLikedAlbum = x);
    },
    getReactions() {
        let reactions$ = ajax.get(`http://localhost:3000/api/reactions`).pipe(
            map(({ response }) => response.data),
            catchError((err) => console.dir(err))
        ).subscribe((x) => this.reactions = x);
    },
    getNotifications(userId, auth) {
        let notifications$ = ajax.get(`http://localhost:3000/api/notifications/${userId}`, auth).pipe(
            map(({ response }) => response.data),
            catchError((err) => console.dir(err))
        ).subscribe((x) => {
            this.notifications = x;
            this.unReadNotifications = x.filter((notif) => !notif.isRead).length
        });
    },
    getFriends(userId, auth) {
        let friends$ = ajax.get(`http://localhost:3000/api/friends/${userId}`, auth).pipe(
            map(({ response }) => response.data),
            catchError((err) => console.dir(err))
        ).subscribe((x) => this.friends = x);
    },
    getProfile(userId, auth) {
        let profile$ = ajax.get(`http://localhost:3000/api/userProfile/${userId}`, auth).pipe(
            map(({ response }) => response.data),
            catchError((err) => console.dir(err))
        ).subscribe((x) => this.profile = x);
    },
    getUserShortcuts(userId, auth) {
        ajax.get(`http://localhost:3000/api/shortcut/${userId}`, auth).pipe(
            map(({response}) => response.data),
            catchError((err) => console.dir(err))
        ).subscribe((x) => this.shortcuts = x);
    },
    retrieveLoginData(userId) {
        this.authentication = { 'Authorization': `Bearer ${this.jwt}` }
        this.getProfile(userId, this.authentication);
        this.getUserShortcuts(userId, this.authentication);
        this.getMostLikedAlbum(userId, this.authentication);
        this.getReactions();
        this.getTimelineUpdates(userId, this.authentication);
        this.loadMessages(userId, this.authentication);
        this.getNotifications(userId, this.authentication);
        this.getFriends(userId, this.authentication);
    }
});