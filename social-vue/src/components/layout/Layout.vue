<script>
    import { ajax } from 'rxjs/ajax';
    import axios from 'axios';
    import { map } from 'rxjs';
    import { computed } from 'vue';
    import { store } from '/src/utils/store.js';

    export default {
        data() {
            return {
                store,
                profile: {},
                userId: parseInt(this.$route.params.id)
            }
        },
        provide() {
            return {
                loggedInUser: computed(() => this.profile)
            }
        },
        created() {
            this.getProfile();
            
            store.retrieveLoginData(this.userId);
            store.getMostPopularGroups({ 'Authorization': `Bearer ${this.store.jwt}` });
        },
        methods: {
            async getProfile() {
                await axios.post(`https://fakestoreapi.com/auth/login`, {
                username: "mor_2314",
                password: "83r5^_"
            }).then((data) => {
                console.dir('hello')
            })
                await ajax.get(`http://localhost:3000/api/userProfile/${this.userId}`, { 'Authorization': `Bearer ${this.store.jwt}` }).pipe(
                    map(({ response }) => response.data)
                ).subscribe((data) => {
                    this.profile = data;
                });
            },
        }
    }

</script>

<template>
    <nav-bar></nav-bar>
    <sidebar-left></sidebar-left>
    <sidebar-right></sidebar-right>
    <router-view :key="$route.path"></router-view>
</template>

<style scoped>
</style>