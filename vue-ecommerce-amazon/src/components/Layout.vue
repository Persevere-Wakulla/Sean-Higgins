<script>
    export default {
        methods: {
        }
    }
</script>

<template>
    <div class="layout">
        <Navbar @open-sidebar="$refs.sidebar.openSideBar()"></Navbar>
        <Sidebar ref="sidebar"></Sidebar>
        <router-view v-slot="{ Component }">
            <transition>
                <component :is="Component" />
            </transition>
        </router-view>
        <Footer></Footer>

    </div>
</template>

<style scoped>

    .v-leave-active {
        transition: all 0.4s;
    }

    .v-leave-from {
        opacity: 1;
        transform: translateX(0);
    }

    .v-leave-to {
        opacity: 0;
        transform: translateX(100%);
    }
</style>