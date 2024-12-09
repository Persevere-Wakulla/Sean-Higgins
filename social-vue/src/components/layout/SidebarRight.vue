<script>
    import { store } from '/src/utils/store.js';

    export default {
        data() {
            return {
                store
            }
        },
        methods: {
        }
    }

</script>

<template>
    <div class="sidebar-right">
        <div class="flex col gap">
            <h4>Most Joined Groups</h4>
            <div class="flex small-gap group" v-for="group in store.mostPopularGroups">
                <img class="sidebar-right-group-icon" :src="group?.groupImgSrc" alt="group-pic">
                <div class="flex col">
                    <h5 class="group-title">{{group?.groupName}}</h5>
                    <p class="group-members">{{ group?.members.length }} members</p>
                </div>
            </div>
            <h4>Most Liked Items</h4>
            <div class="flex gap">
                <span class="like-timeframe-selection">This Week</span>
                <span class="like-timeframe-selection">This Month</span>
                <span class="like-timeframe-selection">Overall</span>
            </div>
            <div class="flex small-gap">
                <img class="sidebar-right-group-icon" alt="most-liked-album" :src="store.mostLikedAlbum?.albumCover">
                <div class="flex col small-gap">
                    <h5 class="group-title">{{store.mostLikedAlbum?.albumName}}</h5>
                    <p class="group-members"><font-awesome-icon icon="fa-image"></font-awesome-icon> View Album</p>
                    <div class="flex space-between center">
                        <p class="group-members">{{store.mostLikedAlbum?.albumLikes.length}} Likes</p>
                        <span class="unlike-btn flex small-gap center">
                            <p>Unlike</p><font-awesome-icon icon="fa-thumbs-down"></font-awesome-icon>
                        </span>
                    </div>
                </div>
            </div>
            <h4>Want More Customers?</h4>
            <div class="flex col gap">
                <p>Advertise on Southside Facebook Clone</p>
                <div class="flex small-gap center-flex">
                    <img class="sidebar-right-user-pic" :src="store.profile?.picSrc" alt="">
                    <p class="sidebar-advertise-text"><b>{{store.profile?.firstName}} {{store.profile?.lastName}}</b>
                        New Southside Facebook Clone ads enable you to easier reach your target audience in a highly
                        effective way, easy to use. Get Started Now!</p>
                </div>
                <a class="sidebar-right-ad-btn">Create an Ad ></a>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .sidebar-right {
        grid-row: 2;
        right: 0;
        grid-column: 3;
        position: fixed;
        top: 75px;
        width: 250px;
        font-size: 12px;
        bottom: 0;
        background-color: var(--primary-background);
        padding: .75em;
    }
    
    .sidebar-right-user-pic,
    .sidebar-right-group-icon {
        width: 40px;
        height: 40px;
    }

    .sidebar-right-user-pic {
        border-radius: 50%;
    }

    .sidebar-right-ad-btn {
        cursor: pointer;
        color: white;
        font-weight: 300;
        background-color: #2478de;
        box-shadow: var(--small-box-shadow);
        width: fit-content;
        height: fit-content;
        padding: .5rem 2rem;
        transition: all 1s;
    }

    .sidebar-right-ad-btn:hover {
        box-shadow: unset;
    }

    .sidebar-right h4{
        text-align: left;
        font-weight: 700;
        font-size: 16px;
        letter-spacing: 1px;
        color: hsl(240, 1%, 28%);
    }
    
    .unlike-btn {
        cursor: pointer;
        padding: .1rem .3rem;
        border: 1px solid hsl(240, 3%, 73%);
    }

    .unlike-btn> :nth-child(2) {
        color: #6e89ba;
    }

    .like-timeframe-selection {
        font-size: 10px;
        cursor: pointer;
    }

    .like-timeframe-active {
        color: var(--light-blue);
    }

    .group {
        cursor: pointer;
    }

    .group-title {
        font-weight: 700;
        font-size: 12px;
    }

    .group-members {
        font-weight: 300;
        font-size: 10px;
    }

    .side-bar-small-text {
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
    }
    
    .sidebar-advertise-text {
        font-size: 10px;
    }

    @media screen and (max-width: 950px) {
        .sidebar-right {
            display: none;
        }
    }

</style>