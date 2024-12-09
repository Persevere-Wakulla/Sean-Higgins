<script>
    import { computed } from 'vue';
    import { ajax } from 'rxjs/ajax';
    import { map } from 'rxjs';
    import { store } from '/src/utils/store.js';
    import axios from 'axios';

    export default {
        inject: ['loggedInUser'],
        data() {
            return {
                store,
                userId: parseInt(this.$route.params.id),
                currentUserPage: parseInt(this.$route.params.friendId) ?? false,
                posts: [],
                status: '',
                replyResponse: false,
                reply: false
            }
        },
        async mounted() {
            this.loadWallPosts();
        },
        methods: {
            async loadWallPosts() {
                await ajax.get(`http://localhost:3000/api/userPosts/${this.userId}`, { 'Authorization': `Bearer ${store.jwt}` }).pipe(
                    map(({ response }) => response.data)
                ).subscribe((data) => {

                    this.posts = data.sort((a, b) => {
                        return b.time - a.time;
                    });
                    this.posts.map((x) => {
                        x.reactionsCount = Map.groupBy(x.reactions, (data) => data.reactId);
                        x.responses?.map((response) => {
                            response.reactionsCount = Map.groupBy(response.reactions, (data) => data.reactId);
                        })
                        return x;
                    })
                });
            },

            async updatePost(post, name) {
                post[name].push(this.loggedInUser);
                await axios.put(`http://localhost:3000/api/userPosts/${post.postId}`, {
                    ...post
                }).then((data) => {
                    this.loadWallPosts();
                })
            },
            async update(post, name) {
                let existingLike = post.like.find((user) => user.userId === this.userId);
                let existingLove = post.love.find((user) => user.userId === this.userId);
                let existingDislike = post.dislike.find((user) => user.userId === this.userId);
                if (!existingLike && !existingLove && !existingDislike) {
                    await this.updatePost(post, name);
                }
                else if (existingLike) {
                    let index = post.like.indexOf(existingLike);
                    post.like.splice(index, 1);
                    await this.updatePost(post, name);
                }
                else if (existingLove) {
                    let index = post.love.indexOf(existingLove);
                    post.love.splice(index, 1);
                    await this.updatePost(post, name);
                }
                else if (existingDislike) {
                    let index = post.dislike.indexOf(existingDislike);
                    post.dislike.splice(index, 1);
                    await this.updatePost(post, name);
                }
            },
            async updateStatus() {
                if (this.status !== '') {
                    await axios.post('http://localhost:3000/api/userPosts/', {
                        userId: this.userId,
                        wallId: this.userId,
                        message: this.status,
                        like: [],
                        love: [],
                        dislike: [],
                        time: Date.now(),
                        statusChange: false,
                        picSrc: this.loggedInUser.picSrc,
                        hasImage: false,
                        imageSrc: ''
                    }).then((x) => {
                        this.status = '';
                        this.loadWallPosts();
                    })
                }
            }
        }
    }
</script>

<template>
    <div class="container flex col gap">
        <user-profile :isFriendProfile="currentUserPage" :profile="loggedInUser"></user-profile>
        <wall-post></wall-post>
        <div class="card post flex col" v-for="post in posts">
            <post :key="post.postId" :post="post" :original="post">
                <post v-if="post.hasOwnProperty('responses')" v-for="response in post.responses" :post="response"
                    :original="post" :key="response.responseId"></post>
            </post>
        </div>
    </div>
</template>

<style scoped>
    .container {
        position: relative;
        grid-row: 2;
        grid-column: 2;
        padding: 1.5em;
        width: 100%;
    }

    @media (max-width: 950px) {
        .container {
            grid-column: 2 / span 3;
        }
    }
    @media (max-width: 700px) {
        .container {
            grid-column: 1 / span 3;
        }
    }
</style>