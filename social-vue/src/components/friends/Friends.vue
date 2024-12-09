<script>
    import axios from 'axios';
    import { ajax } from 'rxjs/ajax';
    import { map } from 'rxjs';
    import { store } from '/src/utils/store.js';

    export default {
        inject: ['loggedInUser'],
        data() {
            return {
                store,
                profile: {},
                currentUserPage: this.$route.params.friendId ?? true,
                posts: [],
                wallPost: '',
                friendId: parseInt(this.$route.params.friendId),
                userId: parseInt(this.$route.params.id)
            }
        },
        async mounted() {
            await this.getFriend();
            await this.loadWallPosts();
        },
        methods: {
            isFriend() {
                let exisitingFriend = this.store.friends.find((user) => user.friendId === this.friendId);
                return exisitingFriend === undefined ? false : true;
            },
            async getFriend(friendId) {
                ajax.get(`http://localhost:3000/api/userProfile/${this.friendId}`, { 'Authorization': `Bearer ${store.jwt}` }).pipe(
                    map(({ response }) => response.data)
                ).subscribe((response) => {
                    this.profile = response;
                });
            },
            async getFriends() {
                await this.store.getFriends();
            },
            async loadWallPosts() {
                ajax.get(`http://localhost:3000/api/userPosts/${this.friendId}`, { 'Authorization': `Bearer ${store.jwt}` }).pipe(
                    map(({response}) => response.data)
                )
                .subscribe((response) => {
                    this.posts = response.sort((a, b) => {
                        return b.time - a.time;
                    }).map((x) => {
                        x.reactionsCount = Map.groupBy(x.reactions, (data) => data.reactId);
                        x.responses?.map((response) => {
                            response.reactionsCount = Map.groupBy(response.reactions, (data) => data.reactId);
                        });
                        return x;
                    })
                });
            },

            async postOnWall() {
                try {
                    if (this.wallPost !== '') {
                        ajax.post('http://localhost:3000/api/userPosts/', {
                            userId: this.userId,
                            wallId: parseInt(this.friendId),
                            message: this.wallPost,
                            like: [],
                            love: [],
                            dislike: [],
                            time: Date.now(),
                            statusChange: false,
                            picSrc: this.loggedInUser.picSrc,
                            hasImage: false,
                            imageSrc: ''
                        }, { 'Authorization': `Bearer ${store.jwt}` }).subscribe((x) => {
                            this.wallPost = '';
                            this.loadWallPosts();
                        })
                    }
                }
                catch (err) {
                    console.dir(err);
                }
            }
        }
    }
</script>

<template>
    <div class="container flex col gap">
        <user-profile :isFriendProfile="currentUserPage" :profile="profile"></user-profile>
        <wall-post></wall-post>
        <div class="post flex col gap" v-for="post in posts">
            <post :key="post.postId" :post="post" :original="post">
                <post v-if="post.hasOwnProperty('responses')" v-for="response in post.responses" :post="response"
                    :original="post" :key="response.responseId"></post>
            </post>
        </div>
    </div>
</template>

<style scoped>
    .container {
        grid-row: 2;
        grid-column: 2;
        padding: 1.5em;
        width: 100%;
    }

    textarea {
        width: 100%;
        padding: 1rem;

    }

    .response {
        font-size: 12px;
        position: relative;
        left: 40px;
    }

    .icon {
        width: 15px;
        margin-right: .75em;
        cursor: pointer;
        transition: transform 1s;
    }

    .avatar-response {
        place-self: center;
        border-radius: 50%;
        width: 35px !important;
    }


    .like {
        rotate: 0deg;
    }

    .heart:hover,
    .dislike:hover,
    .like:hover {
        transform: scale(1.5) rotate(25deg);
    }

    .btn {
        margin-top: 1rem;
        padding: .5rem 2rem;
    }

    .clippy-btn {
        cursor: pointer;
        position: relative;
        top: 10%;
        margin: 0 2rem;
    }

    .avatar {
        place-self: center;
        border-radius: 50%;
        max-width: 55px;
        max-height: 55px;
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