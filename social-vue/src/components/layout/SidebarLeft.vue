<script>
    import { store } from '/src/utils/store.js';

    export default {
        data() {
            return {
                store
            }
        },
        methods: {
            selectFriend(friend) {
                this.$router.push({
                    name: 'user',
                    params: { friendId: friend.friendId }
                });
            },
            goToProfile() {
                this.$router.push({
                    name: 'profile',
                });
            },
        }
    }
</script>

<template>
    <dialog ref="privacy" @click="$refs.privacy.close()">
        <div class="flex col gap">
            <h3>Privacy Policy</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quae, a sed assumenda hic sequi id sapiente
                eligendi fugiat ab amet ducimus saepe animi recusandae? Provident accusamus aliquid repellat obcaecati?
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum quas repudiandae ducimus libero dolorem
                corporis eum autem commodi nam dignissimos sit minima quam dolore aperiam, aliquam voluptatibus sequi cum
                nisi.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste aperiam placeat dolores atque provident eius
                odio soluta eos dolore. Aperiam numquam at culpa aspernatur eaque inventore dolor enim facilis vitae?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aut eligendi, soluta laudantium omnis
                distinctio? Quam culpa ex neque tenetur rem fuga expedita molestias rerum. Consequatur illum quo error
                veritatis?
            </p>
        </div>
    </dialog>
    <dialog ref="terms" @click="$refs.terms.close()">
        <div class="flex col gap">
            <h3>Terms and conditions</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quae, a sed assumenda hic sequi id sapiente
                eligendi fugiat ab amet ducimus saepe animi recusandae? Provident accusamus aliquid repellat obcaecati?
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum quas repudiandae ducimus libero dolorem
                corporis eum autem commodi nam dignissimos sit minima quam dolore aperiam, aliquam voluptatibus sequi cum
                nisi.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste aperiam placeat dolores atque provident eius
                odio soluta eos dolore. Aperiam numquam at culpa aspernatur eaque inventore dolor enim facilis vitae?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aut eligendi, soluta laudantium omnis
                distinctio? Quam culpa ex neque tenetur rem fuga expedita molestias rerum. Consequatur illum quo error
                veritatis?
            </p>
        </div>
    </dialog>
    <div class="sidebar" id="mainBody">
        <div class="flex col gap">
            <div @click="goToProfile()" class="flex center small-gap">
                <img class="user-pic" alt="profile-pic" :src="store.profile?.picSrc">
                <h5 class="side-bar-profile-welcome">Hi {{store.profile?.firstName}} {{store.profile?.lastName}}!</h5>
            </div>
            <h4>Browse</h4>
            <div class="flex col small-gap side-bar-sub-section">
                <div class="flex small-gap center side-bar-row">
                    <font-awesome-icon class="sidebar-icon" icon="fa-image"></font-awesome-icon>
                    <p>Albums</p>
                </div>
                <div class="flex small-gap center side-bar-row">
                    <font-awesome-icon class="sidebar-icon" icon="fa-flag"></font-awesome-icon>
                    <p>Pages</p>
                </div>
                <div class="flex small-gap center side-bar-row">
                    <font-awesome-icon class="sidebar-icon" icon="fa-video-camera"></font-awesome-icon>
                    <p>Videos</p>
                </div>
                <div class="flex small-gap center side-bar-row">
                    <font-awesome-icon class="sidebar-icon" icon="fa-thumbs-up"></font-awesome-icon>
                    <p>Likes</p>
                </div>
            </div>
            <div class="friend-list">
                <a class="flex gap person" v-for="friend in store.friends" :key="friend.friendId">
                    <img @click="selectFriend(friend)" alt="person" :src="friend.picSrc">
                    <p @click="selectFriend(friend)">{{friend.friendFirstName}} {{friend.friendLastName}}</p>
                </a>
            </div>
            <h4>Shortcuts</h4>
            <div class="flex small-gap center" v-for="short in store.shortcuts">
                <img class="sidebar-shortcut-icon" alt="shortcut-avatar" :src="short.shortcutCover">
                <p class="sidebar-shortcut-p">{{short.shortcutName}}</p>
            </div>
            <div class="flex gap">
                <span class="side-bar-small-text">English</span>
                <span class="side-bar-small-text">Chinese</span>
            </div>
            <div class="flex gap">
                <span @click="$refs.privacy.showModal()" class="side-bar-small-text">Privacy</span>
                <span @click="$refs.terms.showModal()" class="side-bar-small-text">Terms</span>
                <span class="side-bar-small-text">Contact</span>
            </div>
            <div class="flex">
                <span class="side-bar-small-text">Copyright <font-awesome-icon icon="fa-copyright"></font-awesome-icon>
                    2024</span>
            </div>

        </div>
    </div>
</template>

<style scoped>

    dialog {
        margin: 25% auto;
        outline: 0;
        border: none;
        padding: 1rem;
        max-width: 400px;
        max-height: 300px;
        border-radius: 4px;
    }

    dialog::backdrop {
        background-color: hsla(0, 0%, 11%, 0.582);
    }

    .sidebar {
        grid-row: 2;
        grid-column: 1;
        position: fixed;
        top: 75px;
        width: 250px;
        font-size: 12px;
        bottom: 0;
        background-color: var(--primary-background);
        padding: .75em;
    }

    .side-bar-small-text {
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
    }


    .sidebar-icon {
        width: 14px;
        height: 14px;
        padding: .5rem;
        border-radius: 50%;
    }

    .sidebar h4 {
        text-align: left;
        font-weight: 700;
        font-size: 16px;
        letter-spacing: 1px;
        color: hsl(240, 1%, 28%);
    }

    .sidebar p {
        color: hsl(240, 1%, 38%);
        letter-spacing: .75px;
    }

    .sidebar-shortcut-icon {
        cursor: pointer;
        width: 25px;
        height: 25px;
        border-radius: 4px;
    }

    .sidebar-shortcut-p {
        cursor: pointer;
        font-weight: 500;
    }

    .side-bar-profile-welcome {
        color: #717f92;
        font-weight: 500;
        font-size: 14px;
    }

    .side-bar-row {
        cursor: pointer;
    }

    .side-bar-row:hover>p {
        font-weight: 500;
    }

    .side-bar-sub-section {
        position: relative;
        width: 80%;
        left: 20px;
        padding-bottom: 1rem;
        margin-bottom: .5rem;
        border-bottom: 1px solid hsla(240, 1%, 38%, 0.438);
    }

    .side-bar-sub-section> :nth-child(1)>.sidebar-icon {
        color: lightblue;
        padding: unset;
        width: 30px;
        height: 30px;
    }

    .side-bar-sub-section> :nth-child(2)>.sidebar-icon {
        color: lightsalmon;
        width: 30px;
        height: 30px;
        padding: unset;
    }

    .side-bar-sub-section> :nth-child(3)>.sidebar-icon {
        background-color: lightcoral;
        color: white;
    }

    .side-bar-sub-section> :nth-child(4)>.sidebar-icon {
        background-color: #2478de;
        color: white;
    }

    .person {
        cursor: pointer;
        align-items: center;
        color: rgb(146, 137, 137);
        padding-bottom: .5em;
        transition: background-color 1s;
    }

    .person img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
    }

    @media (max-width: 700px) {
        .sidebar {
            display: none;
        }
    }
</style>