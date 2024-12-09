<script>
    import axios from 'axios';

    import { store } from '/src/utils/store.js';

    export default {
        data() {
            return {
                store,
                currentStory: null,
                currentTimeOuts: [],
                currentIndex: 0,
                watchingStory: false,
                storyMsg: '',
                stories: [{
                    storyId: 1,
                    userId: 200,
                    storyParts: ['/src/assets/camping/yoga-meditating.webp', '/src/assets/camping/wooden-cabin-surrounded-by-fresh-snowfall.jpg'],
                    userProfilePic: '/src/assets/image-jeanette.jpg'
                }, {
                    storyId: 2,
                    userId: 111,
                    storyParts: ['/src/assets/camping/person-silhouetted-on-a-horse-in-a-open-field.jpg'],
                    userProfilePic: '/src/assets/image-kira.jpg'
                }, {
                    storyId: 3,
                    userId: 666,
                    storyParts: ['/src/assets/person-with-fishing-rod-of-mossy-green-rocks.jpg'],
                    userProfilePic: '/src/assets/image-patrick.jpg'
                }]
            }
        },
        methods: {
            clearTimeouts() {
                this.currentTimeOuts.forEach(id => {
                    clearTimeout(id);
                });
                this.currentTimeOuts = [];
            },
            pauseStory() {
                this.clearTimeouts();
            },
            advanceStory() {
                this.storyMsg = '';
                if (this.currentTimeOut !== null) {
                    this.clearTimeouts();
                    this.currentIndex++;
                }
            },
            renderStory() {
                if (this.watchingStory && this.storyMsg === '') {
                    if (this.currentIndex === 0) {
                        let currentTimeOut = setTimeout(() => {
                            this.currentIndex++;
                            this.storyMsg = '';
                        }, 2500);
                        this.currentTimeOuts.push(currentTimeOut);
                        return this.currentStory?.storyParts[this.currentIndex];
                    }
                    else if (this.currentIndex < this.currentStory?.storyParts.length) {
                        let currentTimeOut = setTimeout(() => {
                            this.currentIndex++;
                            this.storyMsg = '';
                        }, 2500);
                        this.currentTimeOuts.push(currentTimeOut);
                        return this.currentStory?.storyParts[this.currentIndex];
                    }
                    else {
                        this.storyMsg = '';
                        this.currentIndex = 0;
                        if (this.stories.indexOf(this.currentStory) < this.stories.length - 1) {
                            this.currentStory = this.stories[this.stories.indexOf(this.currentStory) + 1];
                        }
                        else {
                            this.$refs.storyModal.close();
                            this.watchingStory = false;
                        }
                    }
                }
                else return this.currentStory?.storyParts[this.currentIndex];
            }
        }
    }
</script>

<template>
    <dialog v-show="watchingStory" ref="storyModal">
        <div class="grid story-modal">
            <img @click="advanceStory()" ref="storyImg" alt="storyman" :src="renderStory()">
            <img class="current-story-avatar-pic" alt="current-story-avatar" :src="currentStory?.userProfilePic">
            <input v-model="storyMsg" @keydown="pauseStory()" @click="pauseStory()" type="text"
                placeholder="Start Typing...">
            <font-awesome-icon class="story-icon" icon="fa-heart"></font-awesome-icon>
        </div>
    </dialog>
    <div class="flex small-screen justify-center small-gap">
        <div class="user-story-card flex gap col" :style="{'background-image': 'url(' + store.profile?.backgroundSrc + ')'}">
            <font-awesome-icon class="add-story-icon" icon="fa-circle-plus"></font-awesome-icon>
            <p class="overlay-text">Create Your Story</p>
        </div>
        <div v-for="story in stories"
            @click="() => {watchingStory = true;$refs.storyModal.showModal(); currentStory = story}"
            class="story-card flex gap col" :style="{'background-image': 'url('+ story.storyParts[0] +')'}">
            <img alt="user-avatar" class="story-avatar-pic" :src="story.userProfilePic">
        </div>
    </div>
</template>

<style scoped>
    input {
        grid-column: 3;
        grid-row: 2;
        background-color: hsla(0, 0%, 15%, 0.363);
        color: white;
        border-radius: 0;
        border: unset;
        box-shadow: unset;
        margin: unset;
        padding: unset;
        padding-left: .5rem;
    }

    input:focus {
        animation: unset;
    }

    input::placeholder {
        color: white;
        font-weight: 500;
        letter-spacing: 2px;
        text-shadow: 8px 8px 16px black;
    }

    dialog {
        margin: 0 auto;
        height: 350px;
        width: 250px;
        margin-top: 10%;
        border: none;
        border-radius: 5px;
        outline: 0;
        box-shadow: var(--large-box-shadow);
        overflow: hidden;
    }

    dialog:active {
        outline: 0;
    }

    dialog>.story-modal>img {
        width: inherit;
        height: inherit;
        grid-column: 1 / span 3;
        grid-row: 1 / span 2;
    }

    .story-modal {
        height: inherit;
        width: inherit;
        grid-template-rows: 90% 10%;
        grid-template-columns: 3% 5% 92%;
    }

    .story-modal>.current-story-avatar-pic {
        grid-row: 1;
        grid-column: 1 / span 3;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid white;
        margin: .5rem;
    }

    .story-icon {
        cursor: pointer;
        height: 100%;
        width: 100%;
        color: rgb(255, 255, 255);
        grid-row: 2;
        grid-column: 2;
        place-self: center;
    }

    dialog::backdrop {
        background-color: hsla(0, 5%, 22%, 0.705);
    }

    .user-story-card,
    .story-card {
        min-width: 125px;
        background-repeat: no-repeat;
        height: 250px;
        border-radius: 20px;
        background-size: cover;
        background-position: center;
        box-shadow: var(--small-box-shadow);
    }

    .story-card {
        cursor: pointer;
    }

    .user-story-card {
        justify-content: flex-end;
    }

    .story-avatar-pic {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid white;
        margin: .5rem;
    }

    .overlay-text {
        font-weight: 300;
        font-size: 14px;
        color: hsl(0, 0%, 82%);
        height: 15%;
        text-align: center;
        background-color: hsla(0, 5%, 22%, 0.705);
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        width: 100%;
    }

    .add-story-icon {
        cursor: pointer;
        color: hsl(0, 0%, 82%);
        width: fit-content;
        align-self: center;
        font-size: 30px;
        transition: all 1s;
    }

    .add-story-icon:hover {
        color: rgb(63, 110, 238)
    }

    @media screen and (max-width:1000px) {
        .small-screen {
            flex-direction: column;
        }

        .user-story-card,
        .story-card {
            height: 100px;
            width: 100%;
        }
    }
</style>