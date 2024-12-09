import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from './App.vue';

import { library } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faWindowClose, faWindowMaximize, faWindowMinimize, faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import * as fab from '@fortawesome/free-brands-svg-icons';
import * as all from '@fortawesome/free-solid-svg-icons';

import Navbar from './components/layout/Navbar.vue';
import SidebarLeft from './components/layout/SidebarLeft.vue';
import SidebarRight from './components/layout/SidebarRight.vue';

import WallPost from './components/post/WallPost.vue';
import Post from './components/post/Post.vue';
import PostFilter from './components/post/PostFilter.vue';
import Profile from './components/profile/Profile.vue';
import Join from './components/join/Join.vue';
import Login from './components/login/Login.vue';
import Story from './components/profile/Story.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Login },
        { path: '/register', component: Join },
        {
            path: '/dashboard/:id/', component: () => import('./components/Layout/Layout.vue'),
            children:
                [
                    { path: '', component: () => import('./components/Timeline.vue'), name: 'home', },
                    { path: 'profile', component: () => import('./components/ProfileView.vue'), name: 'profile', },
                    { path: 'user/:friendId', name: 'user', component: () => import('./components/friends/Friends.vue') },
                    {
                        path: 'message/', component: () => import('./components/message/Message.vue'), children: [
                            { path: '', name: 'msg', component: () => import('./components/message/CreateMessage.vue') },
                            { path: 'thread/:threadId', name: 'thread', component: () => import('./components/message/ReadThread.vue') },
                        ]
                    },
                    { path: 'calendar', name: 'calendar', component: () => import('./components/calendar/Calendar.vue') },
                    { path: 'settings', name: 'settings', component: () => import('./components/setting/Setting.vue') }
                ]
        }
    ]
});

library.add([all.faHome, faWindowClose, faWindowMaximize, faWindowMinimize, all.faUser, all.faCalendar,
    faWindowRestore, all.faCheck, all.faSave, all.faMailReply, all.faCog, all.faPortrait, all.faVideoCamera, all.faBell,
all.faCalendarAlt, all.faUserPlus, all.faSmile, all.faChain, all.faTags, all.faMusic, all.faMessage, fab.faFacebookMessenger,
all.faImagePortrait, all.faImage, all.faThumbsUp, all.faFlag, all.faSignsPost, all.faCopyright, all.faMapPin, all.faLocationPin,
all.faThumbsDown, all.faPlusCircle, all.faPlus, all.faHamburger, all.faExpand, all.faBars, all.faReply, all.faShare, all.faPaperPlane,
all.faCancel, all.faShare, all.faX, all.faHeart, all.faArrowRightLong, all.faArrowLeftLong
]);

const app = createApp(App);

app.component('user-profile', Profile);
app.component('post-filter', PostFilter);
app.component('story', Story);
app.component('wall-post', WallPost);
app.component('nav-bar', Navbar);
app.component('sidebar-left', SidebarLeft);
app.component('sidebar-right', SidebarRight);
app.component('post', Post);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app');

