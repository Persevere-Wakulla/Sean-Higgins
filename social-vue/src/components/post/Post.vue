<script>
    import { computed } from 'vue';
    import { formatTime } from '../../utils/formatting.js';
    import { store } from '/src/utils/store.js'
    import { ajax } from 'rxjs/ajax';
    import { map, catchError } from 'rxjs';
    import axios from 'axios';

    export default {
        inject: {
            profile: 'loggedInUser',
        },
        props: ['post', 'original'],
        data() {
            return {
                store,
                replying: false,
                replyMsg: '',
                reactionCounts: []
            }
        },
        methods: {
            format(datePosted) {
                return formatTime(datePosted);
            },

            reply(post, msg = null) {
                let responseId = 0;
                if (post.hasOwnProperty('responses')) {
                    responseId = post.responses.length;
                }
                else {
                    post = this.original;
                    responseId = post.responses.length;
                }
                post.responses.push({
                    postId: post.postId,
                    responseId,
                    time: Date.now(),
                    reactions: [],
                    like: [],
                    dislike: [],
                    message: msg ?? this.replyMsg,
                    ...this.profile
                });
                this.replying = false;
                this.submit(post);
            },

            formatLikes(arr) { return arr.length },

            formatEmoji(userReactId) {
                let emoji = this.store.reactions.find((x) => userReactId === x.reactionId);
                return emoji?.reaction;
            },

            async submit(post, isResponse = false) {
                ajax.put(`http://localhost:3000/api/userPosts/${post.postId}`, { ...post }, { 'Authorization': `Bearer ${this.store.jwt}` })
                    .subscribe((x) => {
                        this.loadWallPosts();
                        this.replyMsg = '';
                        this.replying = false;
                    });
            },

            loadWallPosts() {
                this.$parent.loadWallPosts();
            },
            goTo(userId) {
                userId === this.$route.params.id ?
                    this.$router.push({
                        name: 'home',
                        params: { id: userId }
                    }) :
                    this.$router.push({
                        name: 'user',
                        params: { friendId: userId }
                    });
            },

            checkIfResponse(post) {
                if (post.hasOwnProperty('responseId')) {
                    let existingResponse = this.original.responses.find((res) => res.responseId === post.responseId);
                    Object.assign(existingResponse, post);
                    return true;
                }
                return false;
            },

            async finishUpdate(post, name) {
                post[name].push(this.profile);
                let isResponse = this.checkIfResponse(post);
                isResponse ? await this.submit(this.original, true) : await this.submit(post);
            },

            async updateReaction(reactId, post) {
                let exisitingReaction = post.reactions.find((user) =>
                    user.userId === this.profile.userId &&
                    user.reactId === reactId
                );
                if (exisitingReaction) {
                    return;
                }
                post.reactions.push({
                    reactId,
                    ...this.profile
                });
                let isResponse = this.checkIfResponse(post);
                isResponse ? await this.submit(this.original, true) : await this.submit(post);
            },

            async update(post, name) {
                let existingLike = post.like.find((user) => user.userId === this.profile.userId);
                let existingDislike = post.dislike.find((user) => user.userId === this.profile.userId);
                if (!existingLike && !existingDislike) {
                    this.finishUpdate(post, name);
                }
                else if (existingLike) {
                    let index = post.like.indexOf(existingLike);
                    post.like.splice(index, 1);
                    this.finishUpdate(post, name);
                }
                else if (existingDislike) {
                    let index = post.dislike.indexOf(existingDislike);
                    post.dislike.splice(index, 1);
                    this.finishUpdate(post, name);
                }
            }
        }
    }
</script>

<template>
    <dialog ref="shareModal">
        <div class="flex space-between">
            <div class="flex gap col">
                <div class="share flex small-gap">
                    <img class="post-avatar" alt="user" :src="post.picSrc">
                    <div class="flex col post-body-share full-width">
                        <span class="post-username">{{post.userName}}</span>
                        <p class="post-msg" :key="post.postId">
                            {{post.message}}</p>
                    </div>
                </div>
                <span class="share-btn" @click="$refs.shareModal.close()"><span>Share</span> <font-awesome-icon
                        class="modal-share" icon="fa-share"></font-awesome-icon></span>
            </div>
            <font-awesome-icon @click="$refs.shareModal.close()" class="modal-close-icon" icon="fa-x"></font-awesome-icon>
        </div>
    </dialog>
    <div class="flex col small-gap full-width" @mouseleave="replying = false">
        <div class="flex gap post-header">
            <img @click="goTo(post.userId)" class="post-avatar" alt="user" :src="post.picSrc">
            <div class="flex col">
                <div>
                    <span class="post-username" @click="goTo(post.userId)">{{post.userName}}</span>
                    <span v-if="!Object.hasOwn(post, 'responseId')" class="post-creation-text"> created a new
                        post</span>
                    <span v-if="Object.hasOwn(post, 'responseId')" class="post-creation-text"> replied</span>
                </div>
                <h5 class="time">{{format(post.time)}}</h5>
            </div>
        </div>
        <div class="flex post-body full-width">
            <p class="post-msg" :key="post.postId" :class="{'status-update': post.statusChange}">
                {{post.message}}</p>
        </div>
        <div class="flex post-footer space-between">
            <div class="flex">
                <div class="flex col text-center" v-for="reaction in post.reactionsCount">

                    <h3 class="emoji reaction-emoji-dropdown">
                        {{formatEmoji(reaction[0])}}
                        <div class="reaction-emoji-dropdown-content">
                            <div class="flex col small-gap" v-for="user in reaction[1]">
                                <div class="flex col">
                                    <h5 class="reaction-emoji-dropdown-item">{{user.firstName}} {{user.lastName}}
                                    </h5>
                                </div>
                            </div>
                            <p>{{reaction[1].length}} reacted</p>
                        </div>
                    </h3>
                </div>
            </div>

            <div class="flex gap" @mouseleave="$refs.reactionSelection.style.display = 'none'">
                <div class="flex small-gap center">

                    <div class="reaction-dropdown align-center text-center">
                        <font-awesome-icon @click="$refs.reactionSelection.style.display = 'flex'"
                            class="post-interaction-icon" icon="fa-thumbs-up"></font-awesome-icon>
                        <span @click="$refs.reactionSelection.style.display = 'flex'" class="post-interaction-text"> Like</span>
                        <div ref="reactionSelection" class="flex reaction-dropdown-content">
                            <h2 v-for="react in store.reactions" @click="updateReaction(react.reactionId, post)"
                                class="reaction-emoji">{{react.reaction}}</h2>
                        </div>
                    </div>
                </div>
                <div @click="replying = !replying" class="flex small-gap center">
                    <font-awesome-icon class="post-interaction-icon" icon="fa-message"></font-awesome-icon>
                    <span class="post-interaction-text">Comment</span>
                </div>
                <div class="flex small-gap center" @click="$refs.shareModal.showModal()">
                    <font-awesome-icon class="post-interaction-icon" icon="fa-share"></font-awesome-icon>
                    <span class="post-interaction-text">Share</span>
                </div>
            </div>
        </div>
        <div v-if="replying" class="flex col gap">
            <div class="text-area-container flex small-gap">
                <textarea placeholder="Start Typing..." v-model="replyMsg" :key="post.postId"></textarea>
                <font-awesome-icon @click="reply(post)" class="text-editor-icon send"
                    icon="fa-paper-plane"></font-awesome-icon>
            </div>
        </div>
    </div>

    <div class="reply-msg flex col gap">
        <slot></slot>
    </div>

</template>

<style scoped>
    a {
        cursor: pointer;
        align-self: center;
        justify-self: right;
    }

    h5 {
        color: hsl(240, 1%, 42%);
        font-size: 12px;
    }

    dialog {
        margin: 0 auto;
        margin-top: 25%;
        border: none;
        border-radius: 10px;
        max-width: 350px;
        outline: 0;
        padding: 2rem 1rem;
        box-shadow: var(--large-box-shadow);
    }

    .text-area-container {
        background-color: var(--type-msg-background);
        align-items: center;
        margin: .5rem;
    }

    .text-area-container> :nth-child(2) {

        position: relative;
        right: 10px;
    }

    textarea {
        border-radius: 10px;
        resize: none;
        font-size: 14px;
        padding: .5rem;
        align-self: center;
        background-color: var(--type-msg-background);
        width: 100%;
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

    .cancel-reply {
        color: hsl(17, 74%, 50%)
    }

    .send {
        color: #32aafa;
    }

    .share-btn-cancel,
    .share-btn {
        cursor: pointer;
        background-color: #32aafa;
        color: white;
        font-weight: 300;
        font-size: 12px;
        width: fit-content;
        padding: .25rem .5rem;
        align-items: center;
        align-self: flex-end;
        box-shadow: var(--small-box-shadow);
        transition: all 1s;
    }

    .share-btn:hover {
        box-shadow: unset;
    }

    .share-btn> :nth-child(1) {
        margin: .2rem;
    }

    .modal-close-icon {
        cursor: pointer;
        color:lightgrey;
        position: relative;
        top: -25px;
        right: -10px;
    }

    .share-btn-cancel {
        background-color: lightcoral;
    }

    .reply-msg {
        margin: 0 2rem;
    }

    .post-header {
        padding: .5rem;
    }

    .share {
        border: 1px solid hsla(240, 2%, 67%, 0.432);
        padding: 1rem;
    }

    .post-body {
        padding: .5rem;
        border-bottom: 1px solid hsla(240, 1%, 42%, 0.336);
    }

    .post-interaction-icon {
        cursor: pointer;
        width: 15px;
        color: hsl(240, 1%, 57%)
    }

    .post-interaction-text {
        cursor: pointer;
        font-size: 12px;
    }

    .border-bottom {
        border-bottom: 10px solid hsl(2, 2, 2);
    }

    .btn-wall-reply {
        font-size: 14px;
        padding: .2em 1.5em;
    }

    .reaction-emoji {
        transition: all 1s;
    }

    .reaction-emoji:hover {
        cursor: pointer;
        transform: scale(1.2);
    }

    .reaction-dropdown {
        position: relative;
        display: inline-block;
    }

    .reaction-dropdown-content {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        padding: .5rem;
        width: max-content;
        background-color: #f9f9f9;
        box-shadow: var(--large-box-shadow);
        border-radius: 40px;
        transition: all 1s;
    }

    /* .reaction-dropdown:hover .reaction-dropdown-content {
        display: flex;
    } */


    .reaction-emoji-dropdown {
        position: relative;
        display: inline-block;
    }

    .reaction-emoji-dropdown-content {
        display: none;
        cursor: default;
        position: absolute;
        font-size: 12px;
        top: 100%;
        left: 0;
        width: 100px;
        z-index: 1;
        padding: .5rem;
        background-color: #f9f9f9;
        box-shadow: var(--large-box-shadow);
        border-radius: 10px;
        transition: all 1s;
    }

    .reaction-emoji-dropdown:hover .reaction-emoji-dropdown-content {
        display: flex;
        flex-direction: column;
    }

    .emoji {
        cursor: pointer;
    }


    .container {
        position: relative;
        background-color: hsl(248, 17%, 91%);
        grid-row: 2;
        grid-column: 2;
        padding: 1.5em;
        width: 100%;
    }

    .post-reply-button-container {
        justify-content: flex-end;
    }

    .post-username {
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
        letter-spacing: 1px;
        transition: all 1s;
    }

    .post-username:hover {
        color: hsl(240, 26%, 39%);
    }

    .post-creation-text {
        font-size: 12px;
        font-weight: 300;
    }

    .post-msg {
        letter-spacing: 1px;
        color: hsl(240, 9%, 18%);
        font-size: 14px;
        font-weight: 300;
    }

    .full-width {
        width: 100%;
    }

    .post-avatar {
        border-radius: 50%;
        height: 50px;
        width: 50px;
        cursor: pointer;
    }

    .status-update {
        font-weight: 700;
    }

    .clickable {
        cursor: pointer;
        margin-left: 2em;
    }

    .time {
        letter-spacing: 1px;
        font-weight: 300;
        font-size: 10px;
    }

    .icon {
        width: 18px;
        margin-right: .75em;
        cursor: pointer;
        transition: transform .5s;
    }

    .avatar-response {
        place-self: center;
        border-radius: 50%;
        width: 35px !important;
    }

    .like {
        transform: rotate(0deg) rotateY(180deg);

    }

    .heart:hover,
    .dislike:hover,
    .like:hover {
        transform: scale(1.4);
    }
</style>