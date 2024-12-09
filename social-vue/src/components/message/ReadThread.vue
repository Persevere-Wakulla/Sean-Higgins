<script>
    import { ajax } from 'rxjs/ajax';
    import { map, distinct, from, of, distinctUntilKeyChanged } from 'rxjs';
    import { formatTime } from '/src/utils/formatting.js';
    import { store } from '/src/utils/store.js'


    export default {
        data() {
            return {
                store,
                userId: parseInt(this.$route.params.id),
                thread: [],
                threadReply: {
                    msg: '',
                    userId: parseInt(this.$route.params.id),
                    threadId: parseInt(this.$route.params.threadId),
                    receivingUserIds: []
                }
            }
        },
        created() {
            let thread$ = this.getThread(parseInt(this.$route.params.threadId));
            thread$.subscribe((data) => {
                this.thread = data.sort((x, y) => x.dateSent - y.dateSent);
                this.updateThreadReadStatus(parseInt(this.$route.params.threadId));
            });
        },
        methods: {
            format(date) {
                return formatTime(date);
            },
            formatHeader(thread) {
                let talkingWith = [];
                const users = thread.map((x) => {
                    if (x.userId !== this.store.profile.userId) {
                        talkingWith.push({
                            userId: x.userId,
                            picSrc: x.userPicSrc,
                            firstName: x.userFirstName,
                            lastName: x.userLastName
                        });
                    }
                    return x;
                }).map((x) => x.receivingProfiles).flat().filter((x) => x.userId !== this.store.profile.userId);
                
                of(...users).pipe(
                    distinctUntilKeyChanged('userId')
                ).subscribe((x) => {
                    let exists = talkingWith.find((user) => user.userId === x.userId);
                    if(!exists) {
                        talkingWith.push(x);
                    }
                })
                return talkingWith;
            },
            updateThreadReadStatus(threadId) {
                ajax.put(`http://localhost:3000/api/messages/read`, {
                    threadId,
                    userId: this.userId
                }, { 'Authorization': `Bearer ${this.store.jwt}` }).subscribe(() => this.store.loadMessages(this.userId, { 'Authorization': `Bearer ${this.store.jwt}` }));
            },
            getThread(threadId) {
                try {
                    return ajax.get(`http://localhost:3000/api/messages/thread/${threadId}`, { 'Authorization': `Bearer ${this.store.jwt}` }).pipe(
                        map(({ response }) => response.data)
                    );
                }
                catch (err) {
                    console.dir(err);
                }
            },
            goToUser(userId) {
                userId === parseInt(this.$route.params.id) ?
                    this.$router.push({
                        name: 'home',
                        params: { id: userId }
                    }) :
                    this.$router.push({
                        name: 'user',
                        params: { friendId: userId }
                    });
            },
            submitReply() {
                try {
                    let ids = [];
                    this.threadReply.messageId = Math.max(...this.thread.map((x) => x.messageId)) + 1;
                    this.threadReply.dateSent = Date.now();
                    let users = this.thread.map((x) => x.receivingUserIds).flat();
                    from(users).pipe(
                        distinct()
                    ).subscribe((x) => { ids.push(x); });
                    this.threadReply.receivingUserIds.push(...ids);
                    ajax.post(`http://localhost:3000/api/messages/`, this.threadReply, { 'Authorization': `Bearer ${this.store.jwt}` }).subscribe((x) => {
                        this.getThread(parseInt(this.$route.params.threadId)).subscribe((data) => {
                            store.loadMessages(this.userId, { 'Authorization': `Bearer ${this.store.jwt}` })
                            this.thread = data.sort((x, y) => x.dateSent - y.dateSent);
                            this.threadReply = {
                                msg: '',
                                userId: this.userId,
                                threadId: parseInt(this.$route.params.threadId),
                                receivingUserIds: []
                            };
                        });
                    })
                }
                catch (err) {
                    console.dir(err);
                }
            }
        }
    }
</script>
<template>
    <div class="flex col gap">
        <div class="flex center gap header">
            <div class="flex small-gap" v-for="header in formatHeader(thread)">
                <img class="message-card-user-pic" :src="header.picSrc" alt="">
                <h2 class="conversation-title">{{header.firstName}} {{header.lastName}}</h2>
            </div>
        </div>
        <div class="flex gap" :class="{'reverse': userMsg.userId === store.profile.userId}" v-for="userMsg in thread">
            <img @click="goToUser(userMsg.userId)" class="message-card-user-pic" alt="avatar" :src="userMsg.userPicSrc">
            <p class="message-body message-card-p" :class="{'user-msg': userMsg.userId === store.profile.userId,
                    'received-msg': userMsg.userId !== store.profile.userId}">{{userMsg.msg}}</p>
        </div>
        <div class="flex small-gap">
            <input autofocus v-model="threadReply.msg" class="message-card-text-area" placeholder="Start Typing..."
                name="direct-msg" id="direct-msg">
            <font-awesome-icon @click="submitReply()" class="align-self-center clickable" icon="fa-paper-plane"></font-awesome-icon>
        </div>
    </div>
</template>

<style scoped>
    .message-card {
        grid-template-columns: 90px auto;
        background-color: var(--msg-card-color);
        padding: 1rem;
        border-bottom: 1px solid hsla(0, 1%, 45%, 0.26);
    }

    input {
        border-radius: 10px;
        box-shadow: unset;
        background-color: var(--type-msg-background);
        font-size: 14px;
        padding: .5rem 1rem;
        width: 100%;
    }

    input:focus {
        animation: unset;
    }

    .message-date {
        color: hsl(240, 0%, 61%);
        font-size: 12px;
        font-weight: 300;
        letter-spacing: 1px;
        align-self: center;
    }

    .btn-wall-post {
        padding: unset;
        padding: .5rem 4rem;
        font-size: 12px;
        grid-row: 2;
        grid-column: 2;
        justify-self: flex-end;
    }

    .message-card-user-pic {
        cursor: pointer;
        width: 20%;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        box-shadow: var(--small-box-shadow);
    }

    .message-card-p {
        font-weight: 300;
        font-size: 14px;
        letter-spacing: .75px;
    }

    .message-card-like {
        margin: .8rem 0;
        cursor: pointer;
        height: 12px;
        width: 12px;
    }

    .message-body {
        position: relative;
        border-radius: 20px;
        padding: .4rem .75rem;
        max-width: 85%;
        width: fit-content;
        text-align: justify;
    }

    .user-msg {
        background-color: var(--user-msg-background);
        color: var(--user-msg-font-color);
        border-top-right-radius: unset;

    }

    .header {
        justify-content: center;
    }

    .conversation-title {
        color: hsl(208, 31%, 58%);
        letter-spacing: 2px;
    }

    .received-msg {
        background-color: var(--received-msg-background);
        color: var(--received-msg-font-color);
        border-top-left-radius: unset;
    }

    .send-msg-icon {
        cursor: pointer;
        align-self: center;
        width: 20px;
        height: 20px;
    }

    .message-user-name {
        cursor: pointer;
        font-weight: 400;
        color: hsl(240, 1%, 27%);
        letter-spacing: 2px;
        margin-bottom: 1rem;
        transition: all 1s;
    }

    .message-user-name:hover {
        color: hsl(240, 26%, 39%);
    }

</style>