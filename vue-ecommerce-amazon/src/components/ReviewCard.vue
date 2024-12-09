<script>
    export default {
        props: ['review'],
        data() {
            return {

            }
        },
        methods: {
            productReview(rating) {
                let iconArr = [];
                let decimal = rating.toPrecision(2).split('.');
                for (let i = 0; i < Number(decimal[0]); i++) {
                    iconArr.push('fa-star');
                }
                if (Number(decimal[1]) !== 0) {
                    iconArr.push('fa-star-half');
                }
                return iconArr;
            }
        }
    }
</script>

<template>
    <div class="review-card-title flex gap col">
        <div class="flex gap center">
            <div class="review-user-avatar" :style="{backgroundImage: 'url(' + review.userAvatar + ')'}"></div>
            <div class="flex col">
                <h5 class="review-user">{{review.userName}}</h5>
            </div>
        </div>
        <div class="flex gap align-items-center">
            <div class="flex">
                <font-awesome-icon class="review-star" :icon="star"
                    v-for="star in productReview(review.productRating)"></font-awesome-icon>
            </div>
            <h3 class="review-title">{{review.reviewTitle}}</h3>
        </div>
        <div class="flex">
            <p class="review-date">Reviewed in {{review.userLocation}} on {{review.reviewDate}}</p>
        </div>
    </div>
    <div class="review-card-body">
        <p class="review-descr">{{review.reviewDescr}}</p>
    </div>
</template>

<style scoped>
    .review-user-avatar {
        height: 25px;
        width: 25px;
        border-radius: 50%;
        box-shadow: var(--Extra-Small-shadow);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }

    .review-title {
        font-size: 12px;
        letter-spacing: 1.5px !important;
        line-height: 1;
    }

    .review-date {
        font-size: 12px;
        font-weight: 300;
    }

    .review-user {
        font-size: 10px;
    }

    .review-descr {
        font-size: 14px;
    }

    .review-star {
        flex-shrink: 0;
        color: var(--Star-Color);
        font-size: 10px;
    }
</style>