<script>
    import { store } from '/src/utils/store.js';
    export default {
        data() {
            return {
                store,
                navLinks: [{
                    path: 'today',
                    name: 'Todays Deals'
                }, {
                    path: 'apparel',
                    name: 'Apparel'
                }, {
                    path: 'beauty',
                    name: 'Beauty'
                }, {
                    path: 'electronics',
                    name: 'Electronics'
                }, {
                    path: 'applicances',
                    name: 'Appliances'
                }],
            }
        },
        watch: {
            store(val) {
                console.dir(val);
            }
        },
        methods: {

            navigate(path) {
                console.dir(path);
            },

            closeSideBar() {
                this.$refs.sideBar.classList.add('closed');
                setTimeout(() => {
                    this.$refs.sideBar.classList.remove('closed');
                    this.$refs.sideBar.style.display = 'none';
                }, 800);
            },

            openSideBar() {
                this.$refs.sideBar.classList.add('open');
                this.$refs.sideBar.style.display = 'block';
                setTimeout(() => {
                    this.$refs.sideBar.classList.remove('open');
                }, 800);
            },
        }
    }
</script>

<template>
    <div ref="sideBar" class="sidebar">
        <div class="flex col mid-gap sidebar-body">
            <img @click="closeSideBar()" width="15px" src="../assets/images/icon-close.svg" alt="">
            <h4 @click="navigate(link.path)" v-for="link in navLinks">{{link.name}}</h4>
        </div>
    </div>
</template>

<style scoped>
    .sidebar {
        display: none;
        padding: 1rem;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 50vw;
        overflow: hidden;
        z-index: 100;
        background-color: var(--White);
        transition: all .5s;
        box-shadow: var(--Small-shadow);
    }

    .sidebar.open {
        animation: open 1s;
    }

    .sidebar.closed {
        animation: close 1s;
    }

    @keyframes open {
        0% {
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(0);
        }
    }

    @keyframes close {
        0% {
            transform: translateX(0);
        }

        100% {
            transform: translateX(-100%);
        }
    }

    .sidebar-body> :nth-child(1) {
        margin-bottom: 2rem;
        cursor: pointer;
    }

    .sidebar::backdrop {
        background-color: hsla(0, 4%, 20%, 0.644);
    }

    @media screen and (min-width: 650px) {
        .sidebar {
            max-width: 30vw;
        }

    }
</style>