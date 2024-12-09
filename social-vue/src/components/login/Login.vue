<script>
    import axios from 'axios';
    import fs from 'fs';
    import {store} from '/src/utils/store.js';

    export default {
        data() {
            return {
                store,
                userName: '',
                password: '',
                userNameFound: false,
                disabled: true,
                userImageSrc: '',
                displayWelcome: false,
                loggedIn: {}
            }
        },
        watch: {
            userName(val) {
                if (val === '') {
                    this.$refs.userNameInfo.innerHTML = ''
                    this.displayWelcome = false;
                }
            }
        },
        methods: {
            async findUserName(enteredUserName) {
                try {
                    await axios.get(`http://localhost:3000/api/login/find/${enteredUserName}`)
                        .then((items) => {
                            let user = items.data.data;
                            this.loggedIn = user;
                            this.$refs.userNameInfo.innerHTML = ''
                            this.userNameFound = true;
                            this.userImageSrc = user.picSrc;
                            this.displayWelcome = true;
                            this.$refs.welcome.innerHTML = `Welcome ${user.firstName} ${user.lastName}`;
                            this.$refs.error.innerHTML = '';

                        });
                }
                catch (error) {
                    this.userNameFound = false;
                    this.displayWelcome = false;
                    this.$refs.userNameInfo.innerHTML = 'Not found, please signup or check spelling';

                }
            },
            async login() {
                try {
                    await axios.post('http://localhost:3000/api/login/', {
                        username: this.userName,
                        password: this.password,
                    }).then((response) => {
                        this.store.jwt = response.data.data;
                        this.$refs.error.innerHTML = '';
                        this.$router.push({name: 'home', params: {id: this.loggedIn.userId}});
                    });

                } catch (error) {
                    let message = 'Password / Username was incorrect';
                    this.$refs.error.innerHTML = message;
                }
            }
        }
    }
</script>


<template>
    <div class="container">
        <div class="login-card">
            <section id="header" class="flex col gap">
                <img v-show="!displayWelcome" alt="facebook" src="../../assets/icon-facebook.svg">
                <div v-show="displayWelcome" class="flex col">
                    <img class="avatar" alt="userImage" :src="userImageSrc">
                    <p ref="welcome"></p>
                </div>
            </section>
            <section id="body">
                <form ref="loginForm" @submit.prevent="login" class="flex col gap center">
                    <label class="flex col">Username
                        <input type="text" v-model="userName" @change="findUserName(userName)" autofocus
                            placeholder="User Name">
                    </label>
                    <div class="input-info" ref="userNameInfo"></div>
                    <label class="flex col"> Password
                        <input type="password" placeholder="Password" v-on:keydown.enter="login" v-model="password">
                    </label>
                    <div ref="error" class="input-error">
                    </div>

                    <button id="btn" :disabled="(userName && password === '') || !userNameFound" type="button"
                        class="btn" @click="login">Login</button>
                    <router-link to="/register" class="btn">Join</router-link>
                    <a class="btn btn-cancel">Forgot Password</a>
                </form>
            </section>
        </div>
    </div>
</template>


<style scoped>
    p {
        margin-top: 2em;
        color: hsl(0, 3%, 38%);
        font-weight: 700;
    }

    .input-info {
        font-size: .7em;
        color: hsl(152, 42%, 26%);
    }

    .input-error {
        font-size: .7em;
        color: hsl(7, 85%, 26%);
        font-weight: 900;
    }

    #header {
        margin-bottom: 2em;
        display: grid;
        text-align: center;
    }

    #header img {
        place-self: center;
        width: 100%;
        max-width: 75px;
    }

    #btn {
        margin-bottom: 2em;
    }

    .container {
        min-width: inherit;
        min-height: inherit;
        display: grid;
        align-items: center;
        justify-content: center;
        grid-row: 1 / span 3;
        grid-column: 1 / span 3;
        background-color: #242424;
    }

    .avatar {
        border-radius: 50%;
        width: 75px;
        height: 75px;
    }

    .gap {
        gap: .75em;
    }
</style>