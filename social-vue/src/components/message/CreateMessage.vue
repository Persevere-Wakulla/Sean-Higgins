<script>
    import { map } from 'rxjs';
    import { ajax } from 'rxjs/ajax';
    import { store } from '/src/utils/store.js';

    export default {
        data() {
            return {
                store,
                msgFriends: '',
                msgContent: '',
                message: {}
            }
        },
        methods: {
            addFriendToMessage(friend) {
                if (!this.msgFriends.includes(`${friend.friendFirstName} ${friend.friendLastName}`)) {
                    this.msgFriends.length > 0 ? this.msgFriends += `,${friend.friendFirstName} ${friend.friendLastName}` :
                        this.msgFriends += `${friend.friendFirstName} ${friend.friendLastName}`
                        ;
                }
            },
            sendMessage() {
                const msgArray = this.msgFriends.split(',');
                let receivingUserIds = [];
                msgArray.forEach((person) => {
                    let friend = this.store.friends.find((x) => `${x.friendFirstName} ${x.friendLastName}` === person);
                    if (friend) {
                        receivingUserIds.push(friend.friendId);
                    }
                });
                
                if (receivingUserIds.length > 0) {
                    this.message = {
                        msg: this.msgContent,
                        userId: parseInt(this.$route.params.id),
                        dateSent: Date.now(),
                        receivingUserIds
                    }
                    ajax.post(`http://localhost:3000/api/messages/`, this.message, { 'Authorization': `Bearer ${this.store.jwt}` }).pipe(
                        map(({ response }) => response.data)
                    ).subscribe((x) => {
                        store.loadMessages(this.userId, { 'Authorization': `Bearer ${this.store.jwt}` });
                        this.$router.push({
                            name: 'thread',
                            params: { threadId: x.threadId }
                        });
                    });
                }
            }
        }
    }
</script>

<template>
    <div class="flex gap">
        <div class="create-message-side-bar">
            <h5>Message Friend</h5>
            <div @click="addFriendToMessage(friend)" class="flex gap center create-message-side-bar-friend"
                v-for="friend in store.friends">
                <img alt="person" :src="friend.picSrc">
                <p>{{friend.friendFirstName}} {{friend.friendLastName}}</p>
            </div>
        </div>
        <div class="flex col gap create-message-main">
            <input ref="friendInput" v-model="msgFriends" placeholder="Send To">
            <textarea autofocus placeholder="Express yourself" v-model="msgContent" name="msg" id="msg" cols="30"
                rows="10"></textarea>
            <a @click="sendMessage()" class="btn-wall-post">Send</a>
        </div>
    </div>
</template>

<style scoped>
    input:focus {
        animation: unset;
    }

    input,
    textarea {
        padding: .5rem;
        border-radius: unset;
        box-shadow: 0 0 .5rem hsla(0, 3%, 46%, 0.514);
        resize: none;
    }

    .btn-wall-post {
        padding: .25rem 4rem;
        font-size: 12px;
        width: fit-content;
        align-self: flex-end;
    }

    .create-message-side-bar {
        width: 30%;
        border-right: 1px solid hsla(0, 3%, 46%, 0.514);
    }

    .create-message-side-bar-friend {
        cursor: pointer;
        transition: all .5s;
    }

    .create-message-side-bar-friend:hover {
        background-color: hsla(0, 3%, 46%, 0.514);
        color: white;
    }

    .create-message-side-bar-friend>img {
        border-radius: 50%;
        height: 30px;
        margin: .25rem 0;
    }

    .create-message-side-bar-friend>p {
        font-size: 12px;
        letter-spacing: 1px;
    }

    .create-message-main {
        width: 65%;
    }
</style>