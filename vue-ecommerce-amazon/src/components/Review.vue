<script>
    export default {
        props: ['productSummary'],
        data() {
            return {
                productSpotlightReviews: [
                    {
                        productId: 111,
                        productRating: 5,
                        userId: 1,
                        userName: 'Southside',
                        userAvatar: '/src/assets/images/camping/waterfront-wood-cabin-surrounded-by-lush-forest.jpg',
                        userLocation: 'Norway',
                        reviewDate: 'October 11, 2023',
                        reviewId: 1,
                        reviewTitle: 'Praise Yeezus!',
                        reviewDescr: 'My feet are floating on clouds and I can now rap thanks to these shoes'
                    },
                    {
                        productId: 112,
                        productRating: 5,
                        userId: 2,
                        userName: 'Brian Formman',
                        userAvatar: '/src/assets/images/camping/aubi_dabi.jpg',
                        userLocation: 'United States',
                        reviewDate: 'February 15, 2023',
                        reviewId: 2,
                        reviewTitle: 'A Gift from the gods',
                        reviewDescr: 'Better than any other shoes you done ever had, I guarantee it.'
                    },
                    {
                        productId: 112,
                        productRating: 1,
                        userId: 3,
                        userName: 'Patrick Star',
                        userLocation: 'United States',
                        userAvatar: '/src/assets/images/camping/Wall-street-bull.jpg',
                        reviewDate: 'April 5, 2023',
                        reviewId: 3,
                        reviewTitle: 'Bring back the old Yeezus',
                        reviewDescr: 'I like the old Kanye, bring back College Dropout Kanye.'
                    }
                ]
            }
        },
        mounted() {
            this.calculateAverage();
        },
        methods: {
            calculateAverage() {
                this.$emit('product-average', this.productSpotlightReviews.map(x => x.productRating).reduce((accum, curr) => accum + curr) / this.productSpotlightReviews.length);
                this.$emit('num-reviews', this.productSpotlightReviews.length);
            },
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
    <div class="flex big-gap mobile">
        <div class="flex gap col">
            <Review-Percentage
                :average="productSpotlightReviews.map(x => x.productRating).reduce((accum, curr) => accum + curr) / productSpotlightReviews.length"
                :reviews="productSpotlightReviews"></Review-Percentage>
            <h4>Review this product</h4>
            <p>Share your thoughts with other customers</p>
            <div class="review-btn">Write a customer review</div>
            <hr>
        </div>
        <div class="flex col gap">
            <h4>Customers Say</h4>
            <p>{{productSummary.descr}}</p>
            <div class="flex gap">
                <span class="summary-type" :class="item.type" v-for="item in productSummary.qualities">
                    <font-awesome-icon class="positive-icon" v-if="item.type === 'positive'"
                        icon="check-circle"></font-awesome-icon>
                    <font-awesome-icon class="negative-icon" v-else-if="item.type === 'negative'"
                        icon="minus-circle"></font-awesome-icon>
                    {{item.name}}</span>
            </div>
            <hr>
            <select class="select">
                <option class="option">Top Reviews</option>
            </select>
            <h4 class="spotlight-header">Top reviews Worldwide</h4>
            <div class="flex col wrap align-items-center gap">
                <div class="review-card flex col gap justify-center" v-for="review in productSpotlightReviews">
                    <Review-Card :review="review" :key="review.reviewId"></Review-Card>
                    <hr>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .select {
        cursor: pointer;
        padding: .2rem;
        border-radius: 8px;
        background-color: #f3f3f3;
        box-shadow: 0 2px 4px rgb(125, 125, 125);
        max-width: 40%;
        margin: 1rem 0;
        font-size: 12px;
    }

    .review-card {
        padding: .5rem;
        width: 100%;
        align-self: stretch;
    }

    .summary-type {
        padding: .25rem .5rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgb(204, 190, 179);
        margin-bottom: 2rem;
    }

    .positive {
        background-color: palegreen;
    }

    .positive-icon {
        color: rgb(69, 182, 69);
    }

    .neutral {
        background-color: lightgray;
    }

    .negative {
        background-color: rgb(252, 202, 95);
    }

    .negative-icon {
        color: rgb(243, 146, 18);
    }

    .review-btn {
        cursor: pointer;
        background-color: hsl(0, 100%, 99%);
        border: 2px solid rgb(200, 198, 198);
        text-align: center;
        border-radius: 4px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px hsl(0, 2%, 75%);
    }

    @media screen and (max-width: 700px) {
        .mobile {
            flex-direction: column;
            align-items: center;
        }
    }
</style>