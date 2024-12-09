<script>
    import { formatMsg, formatTime, formatThreadImages } from '/src/utils/formatting.js';
    import { store } from '/src/utils/store.js';

    export default {
        data() {
            return {
                store
            }
        },
        methods: {
            readThread(threadId) {
                this.$router.push({
                    name: 'thread',
                    params: { threadId }
                })
            },
            threadImages(thread) {return formatThreadImages(thread, this.store)},
            dateFormat(date) { return formatTime(date); },
            format(msg) { return formatMsg(msg); }

        }
    }
</script>

<template>
    <div class="side-message flex col small-gap">
        <div @click="readThread(thread[0])" class="flex gap thread" v-for="thread in store.msgPosts">
            <div class="flex col" >
                <div class="side-message-image-container flex" v-for="msg in threadImages(thread[1])">
                    <img class="side-message-msg-pic" :class="{'multiple-msg-pic': threadImages(thread[1]).length > 1}" alt="pic" :src="msg.picSrc">
                </div>
            </div>
            <div class="flex col full-width">
                <div class="flex align-center space-between">
                    <h4 class="message-user-name">{{thread[1][0].userFirstName}} {{thread[1][0].userLastName}}</h4>
                    <h6 class="message-date">{{ dateFormat(thread[1][0].dateSent)}}</h6>
                </div>
                <p class="side-message-msg-p">{{format(thread[1][0].msg)}}</p>
            </div>

        </div>
    </div>
    <div class="container">
        <h2 class="message-welcome">Message Center</h2>
        <router-view></router-view>
    </div>
</template>


<style scoped>
    .message-welcome {
        text-align: center;
        margin-bottom: 2rem;
        font-weight: 300;
        letter-spacing: 2px;
        color: hsl(240, 3%, 34%);
    }

    .message-date {
        color: hsl(240, 3%, 75%);
        font-size: 8px;
        align-self: center;
    }

    .thread {
        cursor: pointer;
        transition: all .5s;
    }

    .thread:hover {
        color: hsl(240, 2%, 40%);
    }

    .side-message {
        padding: 1.5rem;
        grid-row: 2 / 4;
        grid-column: 1;
        position: fixed;
        font-size: 12px;
        top: 60px;
        left: 0;
        bottom: 0;
        max-width: 250px;
        overflow: auto;
        width: 100%;
        z-index: 1;
        background-color: hsl(240, 5%, 13%);
        color: hsl(248, 17%, 91%);
    }

    .container {
        position: relative;
        grid-row: 2;
        grid-column: 2;
        padding: 1.5em;
        width: 100%;
    }

    .side-message-image-container {
        position: relative;
    }

    .side-message-msg-pic {
        flex-shrink: 0;
        height: 50px;
        width: 50px;
        border-radius: 50%;
    }

    .multiple-msg-pic {
        position: relative;
        flex-shrink: 0;
        top: -10px;
        left: 5px;
        height: 40px;
        width: 40px;
        border-radius: 50%;
    }
    .side-message-image-container:not(:first-child) > .side-message-msg-pic {
        position: absolute;
        top: -35px;
        left: -15px;
        height: 40px;
        width: 40px;
        border: 4px solid var(--background-color);
    }

    .side-message-msg-p {
        letter-spacing: .75px;
        line-height: 1.3;
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

        .side-message {
            display: none;
        }
    }
</style>