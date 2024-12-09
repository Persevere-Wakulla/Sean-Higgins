<script>

    import axios from 'axios';

    export default {
        data() {
            return {
                register: {
                    userName: '',
                    picSrc: '/src/assets/default.jpg',
                    pic: '',
                    password: '',
                    email: '',
                    city: '',
                    street: '',
                    zip: '',
                    phone: '',
                    firstName: '',
                    lastName: ''
                }
            }
        },
        methods: {
            async verifyUserName() {
                try {
                    await axios.get(`http://localhost:3000/api/login/find/${this.register.userName}`)
                        .then((items) => {
                            this.$refs.existingUser.innerHTML = 'Username already exists'
                        });
                }
                catch (error) {
                    this.$refs.existingUser.innerHTML = ''
                }
            },
            async registerUser() {
                try {
                    await axios.post('http://localhost:3000/api/register/', this.register).then((response) => {
                        let user = response.data.data;
                        this.$router.push({name: 'home', params: {id: user.userId}});
                    })
                }
                catch (error) {
                    console.dir(error);
                }

            }
        }
    }
</script>

<template>
    <div class="container">

        <div class="card flex col gap">
            <section id="header" class="flex col gap">
                <img alt="facebook" src="../../assets/icon-facebook.svg">
            </section>
            <form class="flex col gap">
                <label class="flex col">User Name
                    <input v-model="register.userName" @change="verifyUserName()" autofocus type="text"
                        placeholder="User Name">
                </label>
                <div class="center input-error" ref="existingUser"></div>
                <label class="flex col">Password
                    <input v-model="register.password" type="password" placeholder="Password">
                </label>
                <div></div>
                <label class="flex col">Email
                    <input v-model="register.email" type="email" placeholder="Email">
                </label>
                <div></div>
                <label class="flex col">First Name
                    <input v-model="register.firstName" type="text" placeholder="First Name">
                </label>
                <div></div>
                <label class="flex col">Last Name
                    <input v-model="register.lastName" type="text" placeholder="Last Name">
                </label>
                <div></div>
                <label class="flex col">City
                    <input v-model="register.city" type="text" placeholder="e.g Jacksonville">
                </label>
                <div></div>
                <label class="flex col">State
                    <input v-model="register.state" type="text" placeholder="e.g FL">
                </label>
                <div></div>
            </form>
            <a @click="registerUser()" class="btn" to="/dashboard">Register</a>
            <router-link class="btn btn-cancel" to="/">Cancel</router-link>
        </div>
    </div>
</template>

<style scoped>
    .card {
        min-width: 80vw;
    }

    #header {
        margin-bottom: 2em;
        display: grid;
    }

    #header img {
        place-self: center;
        width: 100%;
        max-width: 75px;
    }

    .container {
        place-self: center;
        grid-row: 1 / span 3;
        grid-column: 1 / span 2;
    }

    .center {
        text-align: center;
    }

    .input-error {
        font-size: .7em;
        color: hsl(7, 85%, 26%);
        font-weight: 900;
    }


    .gap {
        gap: .75em;
    }
</style>