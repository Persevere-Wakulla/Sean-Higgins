<script>
    import axios from 'axios';
    import {ajax} from 'rxjs/ajax';


    import { defineProps } from 'vue';

    import { store } from '/src/utils/store.js';

    export default {
        defineProps: {
            wallPost: String
        },
        inject: ['loggedInUser'],
        data() {
            return {
                store,
                userId: parseInt(this.$route.params.id),
                friendId: this.$route.params.friendId,
                currentDateTime: Date.now(),
                wallPost: defineProps.wallPost,
            }
        },
        methods: {

            tagUser() {
                this.$refs.autoComplete.style.display = 'revert';
            },

            selectedTag(friend) {
                this.$refs.autoComplete.style.display = 'none';
                this.wallPost += `${friend.friendFirstName} ${friend.friendLastName}`;
            },

            async submit() {
                let wallId = this.friendId ?? this.userId;
                if (this.wallPost !== '') {
                    ajax.post('http://localhost:3000/api/userPosts/', {
                        userId: this.userId,
                        wallId: parseInt(wallId),
                        message: this.wallPost,
                        like: [],
                        reactions: [],
                        responses: [],
                        time: Date.now(),
                        statusChange: false,
                        picSrc: this.loggedInUser.picSrc,
                        hasImage: false,
                        imageSrc: ''
                    }, {'Authorization': `Bearer ${store.jwt}`}).subscribe((x)=> {
                        this.wallPost = '';
                        this.$parent.loadWallPosts();
                    });
                }
            }
        }
    }
</script>

<template>
    <div class="card flex col small-gap">
        <div id="wall-post-container" class="flex gap">
            <div ref="autoComplete" class="auto-complete-tag">
                <div class="flex gap auto-complete-row" @click="selectedTag(friend)" v-for="friend in store.friends">
                    <img class="auto-complete-avatar" :src="friend.picSrc">
                    <p>{{friend.friendFirstName}} {{friend.friendLastName}}</p>
                </div>
            </div>
            <img class="user-pic-wall" alt="profile-avatar" :src="store.profile?.picSrc">
            <textarea rows="2" v-on:keydown.@="tagUser()" v-model="wallPost" autofocus placeholder="Post Something..."></textarea>
        </div>
        <div class="text-editor-selection-area flex space-between">
            <div class="flex center-flex gap">
                <font-awesome-icon class="text-editor-icon" icon="fa-location-pin"></font-awesome-icon>
                <font-awesome-icon class="text-editor-icon" icon="fa-calendar-alt"></font-awesome-icon>
                <font-awesome-icon class="text-editor-icon" icon="fa-user-plus"></font-awesome-icon>
                <font-awesome-icon class="text-editor-icon" icon="fa-smile"></font-awesome-icon>
                <font-awesome-icon class="text-editor-icon" icon="fa-chain"></font-awesome-icon>
                <font-awesome-icon class="text-editor-icon" icon="fa-image"></font-awesome-icon>
                <font-awesome-icon class="text-editor-icon" icon="fa-tags"></font-awesome-icon>
                <font-awesome-icon class="text-editor-icon" icon="fa-music"></font-awesome-icon>
                <font-awesome-icon class="text-editor-icon" icon="fa-video-camera"></font-awesome-icon>
            </div>
            <font-awesome-icon @click="submit()" class="text-editor-icon" icon="fa-paper-plane"></font-awesome-icon>
        </div>
    </div>
</template>

<style scoped>
    p {
        color: hsl(240, 1%, 59%);
        font-size: 12px;
    }

    textarea {
        padding: .25rem;
        width: 100%;
        resize: none;
        font-size: 16px;
    }

    textarea:focus {
        outline: 0;
    }

    .text-editor-icon {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin-bottom: .25rem;
    }

    .text-editor-selection-area {
        margin-bottom: .5rem;
        padding: 0 .5rem;
    }

    .text-editor-selection-area> div > :nth-child(1) {
        color: #32ab9e;
    }

    .text-editor-selection-area> div >  :nth-child(2) {
        color: #fa6d62;
    }

    .text-editor-selection-area> div >  :nth-child(3) {
        color: #5392f5;
    }

    .text-editor-selection-area> div >  :nth-child(4) {
        color: #d966be;
    }

    .text-editor-selection-area> div >  :nth-child(5) {
        color: #feb26f;
    }

    .text-editor-selection-area> div >  :nth-child(6) {
        color: #49ae4f;
    }

    .text-editor-selection-area> div >  :nth-child(7) {
        color: #a395f3;
    }

    .text-editor-selection-area> div >  :nth-child(8) {
        color: #59d7ea;
    }

    .text-editor-selection-area> div >  :nth-child(9) {
        color: #fa5532;
    }

    .text-editor-selection-area> :nth-child(2) {
        color: #32aafa;
    }

    .auto-complete-avatar {
        width: 35px;
        height: 35px;
        border-radius: 10px;
    }

    #wall-post-container {
        width: 100%;
        position: relative;
        border-bottom: 1px solid hsla(240, 1%, 42%, 0.363);
        padding: .5rem;
    }

    .user-pic-wall {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    .auto-complete-tag {
        position: absolute;
        display: none;
        top: 60%;
        background-color: rgb(221, 217, 217);
        box-shadow: 0 2px 10px hsl(240, 1%, 42%);
        width: 100%;
        padding: .5rem;
        border-radius: 10px;
    }

    .auto-complete-row {
        align-items: center;
    }

    .auto-complete-row>p {
        font-size: 14px;
        color: hsl(240, 2%, 29%);
        letter-spacing: 1px;
    }

    .auto-complete-row:hover {
        background-color: rgb(187, 184, 184);
        border-radius: 10px;
        cursor: pointer;
    }

    .auto-complete-row:hover>p {
        font-weight: 600;
    }

    .wall-post-icon {
        position: absolute;
        bottom: 0;
        right: 50px;
    }

</style>