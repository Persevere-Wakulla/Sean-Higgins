import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import {library } from '@fortawesome/fontawesome-svg-core';
import * as all from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import './style.css';
import App from './App.vue';
import Layout from './components/Layout.vue';
import Item from './components/Item.vue';
import Home from './components/Home.vue';
import Footer from './components/Footer.vue';
import FooterSecondary from './components/FooterSecondary.vue';
import ItemSideBar from './components/ItemSideBar.vue';
import PicSlider from './components/PicSlider.vue';
import Review from './components/Review.vue';
import ReviewCard from './components/ReviewCard.vue';
import ReviewPercentage from './components/ReviewPercentage.vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '', component: Layout, children: [{
            path: '/item', name: 'item', component: Item,
        },
        {path: '', name: 'home', component: Home}
    ] },
        // { path: '/', component: Item },
        
    ]
});

library.add([all.faHome, all.faUser, all.faCalendar,
    all.faCheck, all.faSave, all.faMailReply, all.faCog, all.faPortrait, all.faVideoCamera, all.faBell,
    all.faCalendarAlt, all.faUserPlus, all.faSmile, all.faChain, all.faTags, all.faMusic, all.faMessage,
    all.faImagePortrait, all.faImage, all.faThumbsUp, all.faFlag, all.faSignsPost, all.faCopyright, all.faMapPin, all.faLocationPin,
    all.faThumbsDown, all.faPlusCircle, all.faPlus, all.faHamburger, all.faExpand, all.faBars, all.faReply, all.faShare, all.faPaperPlane,
    all.faCancel, all.faShare, all.faX, all.faHeart, all.faShoppingCart, all.faCartShopping, all.faMinus, all.faTrash, all.faTrashAlt, all.faTrashCan, all.faTrashArrowUp, all.faStar, all.faStarHalf,
    all.faCaretSquareDown, all.faCaretDown, all.faArrowLeftLong, all.faArrowRightLong, all.faMinusCircle, all.faCheckCircle, all.faLocation, all.faLocationDot, all.faLocationArrow
]);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.component('Navbar', Navbar);
app.component('Footer', Footer);
app.component('Footer-Secondary', FooterSecondary);
app.component('Review', Review);
app.component('Review-Card', ReviewCard);
app.component('Review-Percentage', ReviewPercentage);
app.component('Item-Sidebar', ItemSideBar);
app.component('Pic-slider', PicSlider);
app.component('Sidebar', Sidebar);
app.use(router);
app.mount('#app');

