<script>

    import { store } from '../utils/store.js';
    export default {
        data() {
            return {
                averageRating: [],
                average: 0,
                ratings: 0,
                store,


                // dbItem: {
                //     productId: 2,
                //     bestSeller: false,
                //     brand: 'Camping',
                //     brandPageLink: 'Camping',
                //     pastMonthSales: '8K+',
                //     isLowestPrice: true,
                //     isPrimeEligible: true,
                //     isSubscribable: false,
                //     inStock: true,
                //     category: 'Camping',
                //     product: 'Camping amazing Camping',
                //     descr: ` So much`,
                //     isOnSale: true,
                //     salePercentage: .05,
                //     price: 50.00,
                //     pics: ['src/assets/images/camping/a-fire-by-the-lake.jpg', 'src/assets/images/camping/cabin.jpg','src/assets/images/camping/fiji.jpg']
                // },


                dbItem: {
                    productId: 1,
                    bestSeller: true,
                    brand: 'Adidas',
                    brandPageLink: 'Adidas',
                    pastMonthSales: '4K+',
                    isLowestPrice: false,
                    isPrimeEligible: true,
                    inStock: true,
                    category: 'Shoes',
                    product: 'Adidas Yeezes Fall Limited Edition Sneakers',
                    productReviewSummary: {
                        descr: 'Customers love how comfortable the shoes are, they are durable and stylish. However, some people want the old Yeezes back, the College Dropout Yeezes',
                        qualities: [{name: 'Breezy', type: 'positive'}, {name: 'Durable', type: 'positive'}, {name: 'Value', type: 'neutral'}, {name: 'Not old Yeezus', type: 'negative'}]
                    },
                    descr: ` These low-profile sneakers are your perfect casual wear companion. Featuring a 
                                durable rubber outer sole, they’ll withstand everything the weather can offer.`,
                    isOnSale: true,
                    salePercentage: .50,
                    price: 250.00,
                    pics: ['/src/assets/images/image-product-1.jpg', 'src/assets/images/image-product-2.jpg', 'src/assets/images/image-product-3.jpg', 'src/assets/images/image-product-4.jpg']
                },
            }
        },
        methods: {
            numReview(num) { this.ratings = num; },

            calculateCCDiscountPrice() {
                if (this.dbItem.isOnSale) {
                    let calc = (this.dbItem.price *
                        this.dbItem.salePercentage) - 50.00;
                    return calc > 0 ? calc.toFixed(2) : '0.00';
                } else {
                    let calc = this.dbItem.price - 50.00;
                    return calc > 0 ? calc.toFixed(2) : '0.00';
                }
            },
            displayAvg(avg) {
                let decimal = avg.toPrecision(2).split('.');
                this.average = avg;
                for (let i = 0; i < Number(decimal[0]); i++) {
                    this.averageRating.push('fa-star');
                }
                if (Number(decimal[1]) !== 0) {
                    this.averageRating.push('fa-star-half');
                }
            },
            addItem() {
                if (this.itemQuantity > 0) {
                    this.store.itemsInCart.find(x => x.productId === this.dbItem.productId) ?
                        Object.assign(this.store.itemsInCart.find(x => x.productId === this.dbItem.productId), { ...this.dbItem, quantity: this.itemQuantity }) :
                        this.store.itemsInCart = [...this.store.itemsInCart, { ...this.dbItem, quantity: this.itemQuantity }];
                }
            },
        }
    }

</script>

<template>
    <div class="desktop">
        <Item-Sidebar id="item-sidebar" :product="dbItem"></Item-Sidebar>
        <Pic-slider id="picSlide" :pics="dbItem.pics"></Pic-slider>
        <main class="mobile-main flex col font-gap">
            <h2 class="item-product">{{dbItem.product}}</h2>
            <p class="item-page-links">Visit the {{dbItem.brand}} Store</p>
            <div class="flex align-items-center gap">
                <p>{{average.toPrecision(2)}}</p>
                <div class="flex item-rating-section font-gap">
                    <font-awesome-icon class="item-average-rating" :icon="rating"
                        v-for="(rating, index) in averageRating" :key="index"></font-awesome-icon>
                    <font-awesome-icon icon="fa-caret-down"></font-awesome-icon>
                </div>
                <p class="item-page-links"><a href="#review">{{ratings}} ratings</a></p>
            </div>
            <div class="flex gap">
                <p class="item-bestseller">#1 Best Seller</p>
                <p class="item-page-links">in {{dbItem.category}}</p>
            </div>
            <p><span class="item-month-sales">{{dbItem.pastMonthSales}} bought</span> in past month</p>
            <hr>
            <p class="item-price-container">Price: <span class="item-price">${{ dbItem.isOnSale ? (dbItem.price - (dbItem.price *
                    dbItem.salePercentage)).toFixed(2) :
                    (dbItem.price.toFixed(2))}}</span></p>
            <div class="flex gap align-items-center" v-if="dbItem.isOnSale">
                <span class="item-sale">{{dbItem.salePercentage * 100}}%</span>
                <h5 class="item-original-price" v-if="dbItem.isOnSale"><s>${{(dbItem.price).toFixed(2)}}</s></h5>
            </div>
            <div class="flex justify-center">
                <p class="item-page-links">Get $50 off instantly: Pay ${{calculateCCDiscountPrice()}} <s>${{
                        dbItem.isOnSale ? (dbItem.price - (dbItem.price*
                        dbItem.salePercentage)).toFixed(2) :
                        (dbItem.price.toFixed(2))}}</s> upon approval for Amazon Visa. No annual fee</p>
            </div>
            <p v-if="!dbItem.isLowestPrice && dbItem.isPrimeEligible">Available at a lower price from <span
                    class="item-page-links">other sellers</span> that may not offer free Prime shipping.</p>
            <p v-else>Lowest price available</p>

        </main>
        <div class="flex gap item-reviews">
            <Review id="review" :productSummary="dbItem.productReviewSummary" @product-average="displayAvg" @num-reviews="numReview"></Review>
        </div>
    </div>
</template>

<style scoped>
    #item-sidebar {
        display: none;
    }

    .mobile-main {
        padding: .5rem 1.5rem .5rem .5rem;
    }

    .item-brand {
        color: var(--Orange);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .item-bestseller {
        background-color: var(--Bestseller);
        color: white;
        padding: .1rem .5rem;
        font-size: 12px;
        font-weight: 300;
        border-radius: 4px;
        width: fit-content;
        height: fit-content;
    }

    .item-month-sales {
        color: var(--Monthly-sales);
        font-weight: 700;
    }

    .item-descr {
        font-size: 14px;
        text-align: justify;
        letter-spacing: 1px;
    }

    .item-product {
        color: var(--Very-dark-blue);
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 1rem;
    }

    .item-sale {
        color: var(--Orange);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1px;
        background-color: var(--Pale-orange);
        border-radius: 4px;
        padding: .1rem .25rem;
    }

    .item-price-container {
        font-size: 14px;
    }

    .item-price {
        font-size: 18px;
        color: var(--Item-Price);
        font-weight: 600;
    }

    .item-original-price {
        color: var(--Dark-grayish-blue)
    }

    .item-rating-section {
        margin-right: 1rem;
    }

    .item-average-rating {
        color: var(--Star-Color);
    }

    .item-reviews {
        padding: 1rem 2rem;
    }

    .number-selector {
        background-color: var(--Light-grayish-blue);
        padding: .5rem;
        border-radius: 6px;
        width: 100%;
        display: grid;
        align-items: center;
    }

    .number-selector-icon {
        cursor: pointer;
        color: var(--Orange);
    }

    .number-selector-counter {
        font-size: 14px;
        font-weight: 700;
        grid-row: 1;
        justify-self: center;
    }

    .number-selector> :nth-child(1) {
        justify-self: flex-start;
        grid-row: 1;
    }

    .number-selector> :nth-child(3) {
        justify-self: flex-end;
        grid-row: 1;
    }

    .btn-add {
        cursor: pointer;
        border-radius: 6px;
        padding: .5rem 0;
        align-items: center;
        justify-content: center;
        background-color: var(--Orange);
        width: 100%;
        box-shadow: var(--Small-shadow);
        transition: all .5s;
    }

    .btn-shopping-icon {
        width: 25px;
    }

    .btn-add:hover {
        box-shadow: unset;
    }

    .btn-add-text {
        color: var(--White);
        font-weight: 500;
    }


    @media screen and (min-width: 700px) {
        #item-sidebar {
            display: block;
            grid-column: 3;
            grid-row: 1 / span 3;
        }

        #picSlide {
            grid-column: 1;
            grid-row: 1;
        }

        main {
            grid-row: 1;
            grid-column: 2;
        }

        .item-product {
            font-size: 1.5rem;
        }

        .item-reviews {
            grid-row: 4;
            grid-column: 1 / span 3;
        }

        .sidebar {
            max-width: 30vw;
        }

        .desktop {
            display: grid;
            grid-template-columns: 40% 1fr 300px;
            font-size: 14px;
            font-weight: 400;
        }

        .number-selector {
            width: 40%;
        }

        .wrap {
            flex-wrap: nowrap;
        }

        .nav-dropdown-content {
            width: 300px;
        }
    }

    @media screen and (min-width: 1400px) {
        .desktop {
            display: grid;
            grid-template-columns: 200px minmax(400px, 1fr) auto 300px 200px;
            font-size: 14px;
            font-weight: 400;
        }

        main {
            grid-row: 1;
            grid-column: 3;
        }

        #item-sidebar {
            grid-column: 4;
        }

        #picSlide {
            grid-row: 1 / span 2;
            grid-column: 2;
        }

        .item-reviews {
            grid-column: 2 / span 3;
        }
    }
</style>