<script>
    export default {
        props: ['reviews', 'average'],
        data() {
            return {
                averageRating: [],
                stars: [
                    {
                        star: 5,
                        percentage: 0
                    },
                    {
                        star: 4,
                        percentage: 0
                    },
                    {
                        star: 3,
                        percentage: 0
                    },
                    {
                        star: 2,
                        percentage: 0
                    },
                    {
                        star: 1,
                        percentage: 0
                    }
                ]
            }
        },
        methods: {
            calculatePercentage(star) {
                let amount = this.reviews.filter(review => review.productRating === star.star).map(review => review.productRating);
                let maxReviewPercentageAmount = 100 / this.reviews.length;
                return amount.length * maxReviewPercentageAmount;
            },
            displayAvg(avg) {
                let array = [];
                let decimal = avg.toPrecision(2).split('.');
                for (let i = 0; i < Number(decimal[0]); i++) {
                    array.push('fa-star');
                }
                if (Number(decimal[1]) !== 0) {
                    array.push('fa-star-half');
                }
                return array;
            },
        }
    }
</script>


<template>
    <div class="flex col gap graph">
        <h4>Customer Reviews</h4>
        <div class="flex gap align-items-center">
            <div class="flex font-gap">
                <font-awesome-icon class="item-average-rating" :icon="rating" v-for="(rating, index) in displayAvg(average)"
                    :key="index"></font-awesome-icon>
            </div>
            <p>{{average.toPrecision(2)}} out of 5</p>
        </div>
        <p class="review-text">{{this.reviews.length}} global Reviews</p>
        <div class="flex gap" v-for="star in stars">
            <p class="percentage-text review-link">{{star.star}} Star</p>
            <div class="percentage-container">
                <div class="percentage-amount"
                    :style="{width: (calculatePercentage(star) * 2) + 'px', borderColor: calculatePercentage(star) > 0 ? '#de7921' : '', backgroundColor: calculatePercentage(star) > 0 ? '#ffa41c' : ''}">
                </div>
            </div>
            <p class="percentage-text">{{calculatePercentage(star) > 0 ? (calculatePercentage(star)).toPrecision(2) :
                0}}%</p>
        </div>
        <p class="review-text review-link">How customer reviews and ratings work</p>
        <hr>
    </div>
</template>

<style scoped>
    .graph {
        min-width: 270px;
    }

    .item-average-rating {
        color: var(--Star-Color);
    }
    .review-text {
        font-size: 12px;
    }
    .review-link {
        cursor: pointer;
        color: hsl(217, 59%, 48%);
    }
    .percentage-container {
        position: relative;
        background-color: hsl(0, 3%, 88%);
        border: 1px solid hsl(0, 0%, 64%);
        height: 20px;
        width: 200px;
        border-radius: 4px;
    }

    .percentage-text {
        font-size: 12px;
        font-weight: 600;
    }

    .percentage-amount {
        position: absolute;
        left: -1px;
        top: -1px;
        height: 20px;
        background-color: #ffa41c;
        border-bottom: 1px solid #de7921;
        border-left: 1px solid #de7921;
        border-top: 1px solid #de7921;
        border-color: transparent;
        background-color: transparent;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
</style>