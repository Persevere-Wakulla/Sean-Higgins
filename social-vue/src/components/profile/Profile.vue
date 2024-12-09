<script>
    import axios from 'axios';
    import { computed } from 'vue';

    import { store } from '/src/utils/store.js';

    export default {
        props: ['isFriendProfile', 'profile'],
        data() {
            return {
                store,
                updateBio: false,
                originalStatus: '',
                userId: parseInt(this.$route.params.id)
            }
        },
        methods: {
            isFriend() { return this.$parent.isFriend?.() },
            async follow() {
                try {
                    await axios.post('http://localhost:3000/api/friends/', {
                        userId: this.userId,
                        friendId: this.profile.userId,
                        friendFirstName: this.profile.firstName,
                        friendLastName: this.profile.lastName,
                        picSrc: this.profile.picSrc
                    }).then(() => {
                        this.$parent.getFriends();
                    })
                }
                catch (err) {
                    console.dir(err);
                }
            },
            changeAvatar() {
                if (!this.isFriendProfile) {
                }
            },
            openModal() {
                if (!this.isFriendProfile) {
                    this.$refs.relationshipModal.style.display = 'block';
                    this.originalStatus = this.profile.relationshipStatus;
                }
            },
            cancelModal() {
                this.profile.relationshipStatus = this.originalStatus;
                this.$refs.relationshipModal.style.display = 'none';
            },
            editBio() {
                if (!this.isFriendProfile) this.updateBio = true;
            },

            async update(withNotification) {
                try {
                    this.$refs.relationshipModal.style.display = 'none';
                    this.updateBio = false;
                    await axios.put(`http://localhost:3000/api/userProfile/${this.$route.params.id}`, {
                        ...this.profile
                    }).then(async (x) => {
                        if (withNotification) {
                            await axios.post('http://localhost:3000/api/userPosts/', {
                                userId: parseInt(this.$route.params.id),
                                wallId: parseInt(this.$route.params.id),
                                message: `${this.profile.firstName} ${this.profile.lastName} changed relationship status to ${this.profile.relationshipStatus}`,
                                like: [],
                                love: [],
                                dislike: [],
                                time: Date.now(),
                                statusChange: true,
                                picSrc: this.profile.picSrc,
                                hasImage: false,
                                imageSrc: ''
                            }).then((x) => {
                                this.$parent.loadWallPosts();
                            })
                        }
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
    <!-- Modal for changing relationship -->
    <div class="profile-relationship-modal" ref="relationshipModal">
        <div class="profile-relationship-modal-banner">
            <h4 class="profile-relationship-modal-banner-heading">Update Relationship Status</h4>
        </div>
        <div class="profile-relationship-modal-body">
            <form class="flex col" v-on:submit.prevent="update">
                <label for="complicated">
                    <input value="It's Complicated" v-model="profile.relationshipStatus" class="radio-form-control"
                        type="radio" name="relationship" id="complicated">
                    It's Complicated
                </label>
                <label for="single">
                    <input value="Single" v-model="profile.relationshipStatus" class="radio-form-control" type="radio"
                        name="relationship" id="single">
                    Single
                </label>
                <label for="married">
                    <input value="Married" v-model="profile.relationshipStatus" class="radio-form-control" type="radio"
                        name="relationship" id="married">
                    Married
                </label>
                <label for="partner">
                    <input value="Life Partner" v-model="profile.relationshipStatus" class="radio-form-control"
                        type="radio" name="relationship" id="partner">
                    Life Partner
                </label>
                <label for="taken">
                    <input value="In a Relationship" v-model="profile.relationshipStatus" class="radio-form-control"
                        type="radio" name="relationship" id="taken">
                    In a Relationship
                </label>
                <div class="profile-relationship-modal-body-buttons flex justify-center">
                    <a @click="cancelModal()" class="form-btn cancel">Cancel</a>
                    <button type="submit" class="form-btn">Update</button>
                </div>
            </form>
        </div>
    </div>
    <!-- End Modal for changing relationship -->

    <!-- Beginning of Profile -->
    <div class="grid gap profile-container">
        <div class="profile-background-image-container">
            <div class="profile-background-image" :style="{'backgroundImage':'url(' +profile.backgroundSrc+')'}"></div>
            <div class="profile-background-image-edit-overlay" v-if="!isFriendProfile">
                <p>Change Background</p>
            </div>
        </div>
        <div class="profile-picture-container">
            <img @click="changeAvatar()" class="profile-picture" :class="{'profile-picture-edit': !isFriendProfile}"
                alt="profilePic" :src="profile.picSrc">
            <div @click="changeAvatar()" class="profile-picture-edit-overlay" v-if="!isFriendProfile">
                <p>Change Avatar</p>
            </div>

        </div>

        <div class="profile-status">
            <h5 @click="openModal()" :class="{'profile-relationship-status': !isFriendProfile}">
                {{profile.relationshipStatus}}</h5>
            <h5 class="profile-friend-count"><span class="profile-friend-amount">{{profile.friends}}</span> Friends</h5>
        </div>

        <div class="profile-description">
            <div class="flex align-center gap space-between">
                <div class="flex align-center gap">
                    <h3 class="profile-username">{{profile.firstName}} {{profile.lastName}}</h3>
                    <h5 class="profile-user-location">{{profile.city}}, {{profile.state}}</h5>
                </div>
                <img v-if="!isFriend() && isFriendProfile" @click="follow()" class="add-user-icon" alt="add_user"
                    src="../../assets/user.svg">
            </div>
            <p v-if="!updateBio" :class="{'clickable': !isFriendProfile}" @click="editBio()">{{profile.bio}}</p>
            <div v-if="!isFriendProfile && updateBio" class="flex col profile-bio-edit">
                <textarea v-model="profile.bio"></textarea>
                <div class="flex pull-right">
                    <button @click="updateBio = false" class="form-btn cancel">Cancel</button>
                    <button @click="update()" class="form-btn">Update</button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
    label {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 2px;
    }

    a {
        border-radius: 10px;
        cursor: pointer;
    }

    textarea {
        border-bottom: 1px solid hsl(240, 1%, 42%);
        padding: .5rem;
        box-shadow: inset 0 2px 2px rgb(78, 71, 71);
        border-radius: 10px;
        width: 100%;
        height: max-content;
        resize: none;
        font-size: 16px;
    }

    textarea:focus {
        outline: 0;
    }

    form>button {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .pull-right {
        align-self: flex-end;
    }

    .add-user-icon {
        border: 2px solid black;
        padding: .5rem;
        border-radius: 50%;
        transition: all 1s;
    }

    .add-user-icon:hover {
        border-color: hsl(0, 2%, 65%);
        cursor: pointer;
    }

    .radio-form-control {
        box-shadow: unset;
        animation: unset;
        margin: .5rem;
    }

    .profile-bio-edit>div>button {
        margin-top: 1rem;
    }

    .profile-bio-edit>div {
        gap: 2rem;
    }

    .profile-relationship-modal {
        display: none;
        position: absolute;
        align-self: center;
        box-shadow: var(--large-box-shadow);
        top: 40vh;
        width: 80%;
        border-radius: 10px;
        max-width: 300px;
        z-index: 1;
        transition: all 1s;
    }

    .profile-relationship-modal-banner {
        width: 100%;
        text-align: center;
        letter-spacing: 1px;
        color: hsl(0, 0%, 70%);
        background-color: var(--background-color);
        padding: .5rem;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .profile-relationship-modal-body {
        background-color: hsl(0, 0%, 89%);
        padding: .5rem;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    .profile-relationship-modal-body-buttons {
        margin: 2rem 0;
        gap: 2rem;
    }

    .profile-container {
        position: relative;
        grid-template-columns: 125px auto;
        margin-bottom: 4rem;
    }

    .profile-background-image-container {
        grid-row: 1 / span 2;
        grid-column: 1 / span 2;
        display: grid;
        background: transparent;
        position: relative;
        height: 300px;
        width: 100%;
    }

    .profile-background-image-edit-overlay,
    .profile-background-image {
        grid-row: 1;
        grid-column: 1 / span 2;
        width: inherit;
        max-height: inherit;
    }

    .profile-background-image {
        box-shadow: 0 2px 10px hsl(0, 0%, 19%);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        transition: background-position-y 2s;
    }

    .profile-background-image-container:hover>.profile-background-image {
        background-position-y: .05%;
    }

    .profile-background-image-edit-overlay {
        display: none;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        background-color: rgba(240, 128, 128, 0.596);
    }

    .profile-background-image-edit-overlay>p {
        color: white;
        font-weight: 600;
        text-shadow: 0 0 10px black;
        letter-spacing: 2px;
        font-size: 24px;
    }

    .profile-background-image-container:hover>.profile-background-image-edit-overlay {
        display: flex;
    }

    .profile-picture-container {
        grid-row: 2;
        grid-column: 1;
        position: absolute;
        top: 100px;
        left: 20px;
    }

    .profile-picture,
    .profile-picture-edit-overlay {
        width: 100px;
        height: 100px;
        box-shadow: var(--small-box-shadow);
        border-radius: 50%;
        position: inherit;
    }

    .profile-picture-edit {
        cursor: pointer;
    }

    .profile-picture-edit-overlay {
        display: none;
        align-items: center;
        justify-items: center;
        background-color: rgba(68, 60, 60, 0.664);
    }

    .profile-picture-edit-overlay>p {
        color: rgb(253, 253, 253);
        text-shadow: 0 0 10px black;
        text-align: center;
        letter-spacing: 4px;
        font-weight: 700;
    }

    .profile-picture-container:hover>.profile-picture-edit-overlay {
        display: flex;
        cursor: pointer;
    }

    .profile-relationship-status {
        letter-spacing: 1px;
        color: var(--light-blue) !important;
    }

    .profile-relationship-status:hover {
        cursor: pointer;
        color: hsl(0, 1%, 40%) !important;
    }

    .profile-friend-count {
        font-weight: 300 !important;
        letter-spacing: 1px;
    }

    .profile-friend-amount {
        font-weight: 700;
    }

    .profile-username {
        letter-spacing: 2px;
    }

    .profile-user-location {
        letter-spacing: 1px;
    }

    .profile-description {
        grid-row: 3;
        grid-column: 2;
    }

    .profile-status {
        grid-row: 3 / 5;
        grid-column: 1 / span 2;
        position: relative;
        top: 50px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: max-content;
    }

    .profile-status>* {
        color: hsl(0, 15%, 20%);
        font-size: 14px;
        font-weight: 700;
    }
</style>