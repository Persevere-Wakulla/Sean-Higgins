<script>
    import { store } from '../utils/store.js';
    export default {
        props: ['product'],
        data() {
            return {
                store,
                purchaseType: 'single',
                companies: [{
                    product: 1,
                    companyId: 1,
                    companyName: 'Payless',
                    price: 200.00,
                    isOnSale: false,
                    condition: 'New'
                }, {
                    product: 1,
                    companyId: 2,
                    companyName: 'Gap',
                    price: 175.00,
                    isOnSale: false,
                    condition: 'Like New'
                }]
            }
        },
        methods: {
            calculateRemainingShippingTime() {
                const today = new Date();
                let shippingDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                let parts = shippingDate.toDateString().split(' ');
                let formatted = `${parts[1]} ${parts[2]}`;
                return formatted;
            },
            calculateFastestShipping() {
                const today = new Date();
                let shippingDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                let parts = shippingDate.toDateString().split(' ');
                let formatted = `${parts[1]} ${parts[2]}`;
                return formatted;
            },
            calculatePrimeShipping() {
                const today = new Date();
                let shippingDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
                let parts = shippingDate.toDateString().split(' ');
                let formatted = `${parts[0]}, ${parts[1]} ${parts[2]}`;
                return formatted;
            }
        }
    }
</script>

<template>

    <div class="item-sidebar">
        <div class="flex col gap item-sidebar-body">
            <div class="sidebar-section flex col gap">
                <img class="prime-logo" src="../assets/images/prime_blue.png" alt="prime">
                <p class="prime-text-ad">Enjoy fast, free delivery, exclusive deals, and award-winning movies & TV shows
                    with prime</p>
                <p class="prime-text-ad-reg"><span class="item-page-links">Try Prime</span> and start saving today with
                    <b>fast, free delivery</b>
                </p>
            </div>
            <div class="flex col without-space">
                <div class="sidebar-section off-white">
                    <div class="flex space-between">
                        <p><b>One-time purchase:</b></p>
                        <input value="single" v-model="purchaseType" @click="$refs.subscribeBody.classList.add('minimize')" type="radio" name="purchase" id="oneTime">
                    </div>
                    <div class="flex col">
                        <p class="one-time-purchase-text">${{ product.isOnSale ? (product.price -(product.price *
                            product.salePercentage)).toFixed(2) :
                            (product.price.toFixed(2))}}</p>
                        <p class="one-time-purchase-text">FREE delivery: <b>{{calculatePrimeShipping()}}</b> on orders
                            over $35.00 shipped by Amazon</p>
                        <p class="one-time-purchase-text small">Ships from: Amazon.com</p>
                        <p class="one-time-purchase-text small">Sold by: Amazon.com</p>
                    </div>
                    <div class="flex gap wrap">
                    </div>
                </div>
                <div v-if="product.isSubscribable" class="sidebar-section flex col">
                    <div class="flex space-between">
                        <p><b>Subscribe & Save:</b></p>
                        <input value="subscribe" v-model="purchaseType" @click="$refs.subscribeBody.classList.remove('minimize')" type="radio" name="purchase" id="subscribe">
                    </div>
                    <div ref="subscribeBody" class="flex col subscribe-body">
                        <div class="flex font-gap">
                            <p class="subscribe-left">5%</p>
                            <p class="subscribe-right">15%</p>
                        </div>
                        <div class="flex col gap">
                            <p class="subscribe-price">${{ product.isOnSale ? ((product.price -(product.price *
                                product.salePercentage)) - (product.price *
                                product.salePercentage * .05)).toFixed(2) :
                                ((product.price - (product.price * .05)).toFixed(2))}}</p>
                            <p>Save 5% now and up to 15% on repeat deliveries</p>
                            <div class="flex col font-gap">
                                <ul>
                                    <li>No fees</li>
                                    <li>Cancel anytime</li>
                                </ul>
                                <p class="item-page-links">Learn More</p>
                            </div>
                            <p><span class="item-page-links">FREE delivery</span> <b>{{calculatePrimeShipping()}}</b>
                                on orders shipped by Amazon over $35
                            </p>
                            <p>Or fastest delivery <b>Tomorrow, {{calculateFastestShipping()}}.</b> Order within <span
                                    class="remaining-time">{{calculateRemainingShippingTime()}}</span></p>
                            <p v-if="product.inStock" class="product-stock available">In Stock</p>
                            <p v-else class="product-stock">Out of Stock</p>
                            <select class="select quantity-select" name="quantity" id="quantity-select">
                                <option value="1">Qty: 1</option>
                                <option value="2">Qty: 2</option>
                                <option value="3">Qty: 3</option>
                                <option value="4">Qty: 4</option>
                                <option value="5">Qty: 5</option>
                            </select>

                            <div class="flex col">
                                <label class="delivery-select-label" for="delivery-select">Deliver Every:
                                </label>
                                <select class="select delivery-select" name="delivery" id="delivery-select">
                                    <option value="1">1 month (Most Common)</option>
                                    <option value="2">2 months</option>
                                    <option value="3">3 months</option>
                                    <option value="4">4 months</option>
                                    <option value="5">5 months</option>
                                    <option value="6">6 months</option>
                                </select>
                            </div>
                            <a class="subscribe-btn">Set Up Now</a>
                            <p class="small-text text-center">Ships from and Sold by Amazon.com</p>
                        </div>
                    </div>
                </div>
                <div v-if="purchaseType === 'single'" class="sidebar-section off-white flex mid-gap col">
                    <div class="flex gap align-items-center">
                        <font-awesome-icon icon="location-dot"></font-awesome-icon>
                        <p class="location">Delivering to Denver, CO - Update Location</p>
                    </div>
                    <p v-if="product.inStock" class="product-stock available">In Stock</p>
                    <p v-else class="product-stock">Out of Stock</p>
                    <select v-model="itemQuantity" v-if="product.inStock" class="select quantity-select" name="quantity" id="quantity-select">
                        <option value="1">Quantity: 1</option>
                        <option value="2">Quantity: 2</option>
                        <option value="3">Quantity: 3</option>
                        <option value="4">Quantity: 4</option>
                        <option value="5">Quantity: 5</option>
                    </select>
                    <div class="flex col gap">
                        <div class="btn add-cart-btn">Add to Cart</div>
                        <div class="btn buy-btn">Buy Now</div>
                    </div>
                    <div class="flex">
                        <p>Ships from</p>
                        <p>Amazon.com</p>
                    </div>
                    <div class="flex">
                        <p>Sold by</p>
                        <p>Amazon.com</p>
                    </div>
                    <div class="flex">
                        <p>Returns</p>
                        <p>Eligible for Return, Refund or Replacement within 30 days of receipt</p>
                    </div>
                    <div class="flex">
                        <p>Payment</p>
                        <p>Secure transaction</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    ul {
        list-style: inside;
    }

    .location {
        font-size: 12px;
        color: var(--Link);
        cursor: pointer;
    }

    .btn {
        border-radius: 20px;
        text-align: center;
        padding: .2rem 0;
        box-shadow: 0 2px 4px hsl(0, 0%, 54%);
        cursor: pointer;
    }
    .add-cart-btn {
        background-color: var(--Subscribe-Btn);
    }

    .buy-btn {
        background-color: var(--Orange);
    }

    .subscribe-btn {
        cursor: pointer;
        margin-top: .5rem;
        align-self: center;
        text-align: center;
        border-radius: 20px;
        width: 95%;
        background-color: var(--Subscribe-Btn);
        box-shadow: var(--Extra-Small-shadow);
        padding: .25rem 3rem;
        transition: all .5s;
    }

    .subscribe-btn:hover {
        box-shadow: unset;
    }

    .subscribe-body {
        overflow: hidden;
        transition: all 1s;
    }

    .subscribe-body.minimize {
        height: 0;
    }

    .prime-text-ad-reg,
    .prime-text-ad {
        font-size: 14px;
    }

    .prime-text-ad {
        font-weight: 700;
    }

    .prime-logo {
        width: 50px;
    }

    .without-space> :nth-child(2){
        border-top: none;
        border-top-left-radius: unset;
        border-top-right-radius: unset;
    }

    .without-space > .sidebar-section:has(+ .sidebar-section){
        border-bottom-left-radius: unset;
        border-bottom-right-radius: unset;
    }


    .subscribe-left {
        display: flex;
        align-items: center;
        font-size: 14px;

        background-color: var(--Subscribe-Color);
        padding: 0 .6rem;
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
    }

    .subscribe-right {
        display: flex;
        align-items: center;
        font-size: 14px;
        background-color: #dddddd;
        padding: 0 .6rem;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
    }

    .subscribe-price {
        color: var(--Item-Price);
    }

    .one-time-purchase-text {
        color: #696c6c;
    }

    .one-time-purchase-text.small {
        font-size: 10px;
    }

    .sidebar-section {
        padding: 1rem;
        border: 1px solid #d5d9d9;
        border-radius: 4px;
    }

    .sidebar-section.off-white {
        background-color: #f3f3f3;
    }

    .sidebar-heading {
        text-align: center;
        letter-spacing: 1px;
        font-weight: 400;
        color: white;
    }

    .product-stock {
        font-size: 16px;
        color: var(--Stock-Out-Text)
    }

    .product-stock.available {
        color: var(--Stock-Text);
    }

    .remaining-time {
        color: var(--Stock-Text)
    }

    .item-sidebar {
        margin: 2rem;
    }

    .select {
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        box-shadow: var(--Extra-Small-shadow);
        background-color: #f0f2f2;

    }

    .select:active {
        outline: 0;
    }

    .quantity-select {
        padding: .15rem;
    }

    .delivery-select-label {
        margin-top: 1rem;
        ;
    }

    .delivery-select {
        padding: .4rem;
    }

    [type='radio'] {
        cursor: pointer;
    }

    .company-product-card {
        border: 1px solid rgba(35, 33, 43, 0.767);
        padding: .3rem;
    }
</style>