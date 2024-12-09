<script>
    import { formatMsg, formatTime, formatThreadImages } from '/src/utils/formatting.js';
    import { store } from '/src/utils/store.js';

    export default {
        data() {
            return {
                store,
            }
        },
        methods: {
            format(msg) {
                return formatMsg(msg);
            },
            formatting(date) {
                return formatTime(date);
            },
            formatUser(profile) {
                return `${profile?.firstName} ${profile?.lastName[0]}...`
            },
            threadImages(thread) {
                return formatThreadImages(thread, this.store);
            },
            goToMessages() {
                this.$router.push({
                    name: 'msg'
                })
            },
            openThread(threadId) {
                this.$router.push({
                    name: 'thread',
                    params: { threadId }
                });
            },
            beenRead(receivingUsers) {
                return receivingUsers.filter((user) => user.userId !== this.store.profile.userId).every((user) => user.receiverReadMsg);
            },
            goTo(name) {
                this.$router.push({
                    name,
                });
            },
            home() {
                this.$router.push({
                    name: 'home',
                    params: { id: this.userId }
                });
            }
        }
    }
</script>

<template>
    <nav>
        <div class="flex nav-links large-screen-nav">

            <div class="flex small-gap">
                <a @click="home()" class="flex center"><img class="home-icon" alt="logo"
                        src="../../assets/icon-facebook.svg"></a>
                <input placeholder="Start Searching..." class="nav-search" type="text">
            </div>
            <font-awesome-icon @click="home()" class="profile-icon"
                :class="{'profile-route-active': $route.name === 'home'}" icon="fa-home"></font-awesome-icon>
            <font-awesome-icon class="profile-icon"  icon="fa-image"></font-awesome-icon>
            <font-awesome-icon @click="goTo('calendar')" class="profile-icon" 
                :class="{'profile-route-active': $route.name === 'calendar'}" icon="fa-calendar"></font-awesome-icon>
            <font-awesome-icon class="profile-icon" icon="fa-user"></font-awesome-icon>
            <font-awesome-icon class="profile-icon" icon="fa-video-camera"></font-awesome-icon>
            <div class="flex gap">
                <div @click="goTo('profile')" class="flex center small-gap nav-logged-in-user">
                    <img class="navbar-user-pic" alt="profile-pic" :src="store.profile?.picSrc">
                    <h5 class="navbar-profile-avatar">{{ formatUser(store.profile)}}</h5>
                </div>
                <div class="nav-link nav-dropdown">
                    <font-awesome-icon class="profile-icon-dropdown" icon="fa-bars"></font-awesome-icon>
                    <div class="nav-dropdown-content">
                        <div class="flex col small-gap center">
                            <router-link to="/"> <h5>Log Out</h5></router-link>
                        </div>
                    </div>
                </div>
                <div class="nav-link nav-dropdown">
                    <font-awesome-icon @click="goToMessages()" class="profile-icon-dropdown"
                        icon="fa-message"></font-awesome-icon>
                    <span v-if="store.unReadMsgs > 0" class="nav-notifications-unread">{{store.unReadMsgs}}</span>
                    <div class="nav-dropdown-content">
                        <div @click="openThread(thread[0])" class="flex small-gap nav-notifications-dropdown-content-msg"
                            v-for="thread in store.msgPosts">
                            <div class="flex col">
                                <img v-for="msg in threadImages(thread[1])" class="msg-avatar" alt="pic" :src="msg.picSrc">
                            </div>
                            <div class="flex col full-width">
                                <div class="flex space-between">
                                    <h5>{{thread[1][0].userFirstName}} {{thread[1][0].userLastName}}</h5>
                                    <h6>{{formatting(thread[1][0].dateSent)}}</h6>
                                </div>
                                <div class="flex space-between">
                                    <p>{{format(thread[1][0].msg)}}</p>
                                    <p class="read-by-img" v-if="beenRead(thread[1][0].receivingProfiles)"><img
                                            src="../../assets/check.png"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nav-link nav-dropdown">
                    <font-awesome-icon class="profile-icon-dropdown" icon="fa-bell"></font-awesome-icon>
                    <span v-if="store.unReadNotifications > 0"
                        class="nav-notifications-unread">{{store.unReadNotifications}}</span>
                    <div class="nav-dropdown-content">
                        <div class="flex col small-gap">
                            <p v-for="notification in store.notifications" class="nav-notifications-dropdown-content-msg">
                                {{notification.msg }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="small-screen-nav full-width space-between">
            
            <div class="flex small-gap">
                <a @click="home()" class="flex center"><img class="home-icon" alt="logo"
                        src="../../assets/icon-facebook.svg"></a>
                <input placeholder="Start Searching..." class="nav-search" type="text">
            </div>
            <div class="nav-link nav-dropdown">
                <font-awesome-icon @click="goToMessages()" class="profile-icon-dropdown"
                    icon="fa-bars"></font-awesome-icon>
                
                <div class="nav-dropdown-content">
                   
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
    nav {
        grid-row: 1;
        grid-column: 1 / span 3;
        position: fixed;
        top: 0;
        width: 100%;
        height: 60px;
        padding: 0 2em;
        background-color: hsl(240, 5%, 13%);
        box-shadow: var(--small-box-shadow);
        display: flex;
        align-items: center;
        z-index: 1;
    }

    .large-screen-nav {
        place-items: center;
        display: none;
    }

    .small-screen-nav {
        display: flex;
    }

    .navbar-user-pic {
        width: 25px;
        height: 25px;
        border-radius: 50%;
    }

    .nav-logged-in-user {
        cursor: pointer;
    }

    .nav-search {
        padding: unset;
        padding: .35rem .5rem;
        background-color: transparent;
        border-bottom: 2px solid rgb(59, 58, 58);
        border-radius: 15px;
        color: white;
    }

    input:focus {
        animation: unset;
    }

    .read-by-img {
        align-self: center;
    }

    .search-input-icon {
        position: relative;
        width: 15px;
    }

    .friend-list {
        max-height: 50%;
        overflow: auto;
    }

    .profile-icon-dropdown,
    .profile-icon {
        color: var(--user-msg-font-color);
        cursor: pointer;
        padding: .5rem;
        transition: all 1s;
        border-radius: 50%;
        width: 15px;
        height: 15px;
    }

    .profile-icon-dropdown {
        width: 15px;
        height: 15px;
        padding: .5rem;
        color: var(--light-blue);
        background: hsla(240, 4%, 30%, 0.589);
    }

    .profile-route-active,
    .profile-icon:hover {
        background: hsla(240, 4%, 30%, 0.589);
    }

    .profile-route-active {
        animation: flash infinite 2.5s;
    }

    .navbar-profile-avatar {
        color: #717f92;
        font-weight: 500;
        font-size: 14px;
    }
    

    .nav-links {
        align-items: center;
        justify-content: space-evenly;
    }

    .nav-link {
        cursor: pointer;
        border: transparent 1px solid;
        transition: color 1s;
    }

    .nav-link:hover>a {
        cursor: pointer;
        color: white;
    }

    .nav-setting {
        transition: transform 2s;
        cursor: pointer;
    }

    .nav-setting:hover {
        transform: rotate(1.5turn);
    }

    .nav-notifications-unread {
        position: absolute;
        top: -10px;
        right: -5px;
        color: white;
        background-color: var(--light-blue);
        padding: .15rem .45rem;
        border-radius: 50%;
        font-size: 8px;
        font-weight: 600;
    }

    .nav-dropdown {
        position: relative;
        display: inline-block;
    }

    .nav-dropdown-content {
        display: none;
        position: absolute;
        right: 0;
        z-index: 1;
        padding: .5rem;
        width: 225px;
        background-color: #f9f9f9;
        box-shadow: var(--large-box-shadow);
        border-radius: 10px;
        transition: all 1s;
    }

    .nav-notifications-dropdown-content-msg {
        font-size: 12px;
        padding: .5rem;
        cursor: pointer;
        transition: all 1s;
    }

    .nav-notifications-dropdown-content-msg:hover {
        background-color: hsl(240, 5%, 74%);
        color: var(--light-blue);
    }

    .nav-dropdown:hover .nav-dropdown-content {
        display: block;
    }

    .msg-avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        box-shadow: 0 .1rem .2rem black;
    }

    .msg-avatar:not(:first-child) {
        position: relative;
        top: -15px;
    }

    .person {
        cursor: pointer;
        align-items: center;
        color: rgb(146, 137, 137);
        padding-bottom: .5em;
        transition: background-color 1s;
    }

    .person img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
    }


    @keyframes flash {

        0%,
        100% {
            background: hsla(240, 4%, 30%, 0.589);
        }

        50% {
            background: transparent;
        }

    }
    @media screen and (min-width: 550px) {
        .large-screen-nav {
            display: flex;
            width: 100%;
        }
        .small-screen-nav {
            display: none;
        }
    }

</style>