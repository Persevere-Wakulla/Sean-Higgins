<script>
    import { store } from '/src/utils/store.js';
    export default {
        data() {
            return {
                store,
                categorySelected: 'All',
                categories: [
                    'All',
                    'Alexa Skills',
                    'Amazon Devices',
                    'Amazon Fashion',
                    'Amazon Fresh',
                    'Amazon Pharmacy',
                    'Appliances',
                    'App & Games',
                    'Audible AudioBooks',
                    'Baby',
                    'Beauty',
                    'Books',
                    'Car',
                    'Clothing & Accessories',
                    'Collectibles',
                    'Computers',
                    'Deals',
                    'Electronics',
                    'Furniture',
                    'Garden & Outdoors'
                ]
            }
        },
        methods: {

            removeItem(item, index) {
                this.$refs.cartItem[index].style.transform = 'translateX(-120%)';
                setTimeout(() => {
                    this.store.itemsInCart.splice(index, 1);
                }, 500)
            },

            calculateCartItems() {
                let amountOfItemsInCart = 0;

                this.store.itemsInCart.forEach(x => amountOfItemsInCart += x.quantity);

                return amountOfItemsInCart;
            },

            navigate(path) {
                console.dir(path);
            },

            dropdownAction(opacity, display, action = 'open') {
                if (action === 'open') {
                    this.$refs.cartDropdown.style.display = display;
                    setTimeout(() => this.$refs.cartDropdown.style.opacity = opacity, 100);
                } else {
                    this.$refs.cartDropdown.style.opacity = opacity;
                    setTimeout(() => this.$refs.cartDropdown.style.display = display, 500);
                }
            },
        }
    }
</script>

<template>
    <nav class="nav-main flex big-gap align-items-center">
        <div class="flex nav-gap align-items-center">
            <font-awesome-icon @click="$emit('open-sidebar')" class="nav-icon" icon="fa-bars"></font-awesome-icon>
            <img @click="() => this.$router.push({name:'home'})" class="nav-logo"
                src="/src/assets/images/ecommerce.png">
        </div>
        <div class="flex col">
            <p class="nav-location">Delivering to Denver, CO</p>
            <p class="nav-location nav-location-change">Update Location</p>
        </div>
        <div class="nav-search-container flex">
            <div class="nav-search-select-container flex">
                <select class="nav-select" v-model="categorySelected" name="categories" id="categories">
                    <option class="nav-option" :value="cat" v-for="cat in categories">{{cat}}</option>
                </select>
            </div>
            <div class="flex align-items-center full-width">
                <input placeholder="Search Amazon" class="nav-search-input" type="text">
                <img class="nav-search-qr" src="../assets/images/MLT.png" alt="">
            </div>
        </div>
        <div @mouseleave="dropdownAction(0, 'none', 'close')" class="flex nav-gap align-items-center nav-dropdown">
            <img @mouseenter="dropdownAction(1, 'block')" v-if="store.itemsInCart.length === 0"
                class="nav-shopping-icon" src="../assets/images/shoppingCart.png" alt="cart">
            <img @mouseenter="dropdownAction(1, 'block')" v-if="store.itemsInCart.length > 0" class="nav-shopping-icon"
                src="../assets/images/shoppingCartFull.png" alt="cart">
            <span v-if="store.itemsInCart.length > 0" class="nav-cart-item-counter">{{calculateCartItems()}}</span>
            <img class="nav-avatar" src="../assets/images/image-avatar.png" alt="avatar">
            <div ref="cartDropdown" class="nav-dropdown-content">
                <div class="nav-cart-dropdown-header">
                    <h4 class="nav-cart-dropdown-header-text">Cart</h4>
                </div>
                <div class="nav-cart-dropdown-body flex col mid-gap">
                    <div class="grid" v-if="store.itemsInCart.length === 0">
                        <p class="nav-cart-empty-cart">Your cart is empty.</p>
                    </div>
                    <div :key="index" ref="cartItem" class="flex space-between nav-cart-item"
                        v-for="(item, index) in store.itemsInCart">
                        <div class="flex gap">
                            <img class="nav-cart-dropdown-item-pic" :src="item.pics[0]" alt="cart-item">
                            <div class="flex col gap">
                                <h6 class="nav-cart-product">{{item.product}}</h6>
                                <p class="flex gap nav-cart-dropdown-price">${{item.isOnSale ? (item.price *
                                    item.salePercentage).toFixed(2) : (item.price).toFixed(2) }} x {{item.quantity}}
                                    <span class="nav-cart-dropdown-total">${{item.isOnSale ? ((item.price *
                                        item.salePercentage) * item.quantity).toFixed(2) : (item.price).toFixed(2) *
                                        item.quantity }}</span>
                                </p>
                            </div>
                        </div>
                        <font-awesome-icon @click="removeItem(item, index)" class="nav-cart-remove"
                            icon="fa-trash-can"></font-awesome-icon>
                    </div>
                    <a v-if="store.itemsInCart.length > 0" class="nav-cart-btn-checkout">Checkout</a>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
    .nav-main {
        position: sticky;
        top: 0;
        z-index: 1;
        padding: .5rem;
        background-color: var(--Navbar-Gray-Blue);
        box-shadow: var(--Extra-Small-shadow);
        width: 100%;
        height: var(--Nav-bar-height);
        z-index: 100;
    }

    .nav-location {
        color: white;
        font-size: 14px;
    }

    .nav-location-change {
        cursor: pointer;
        font-weight: 700;
    }

    .nav-icon {
        color: white;
        cursor: pointer;
    }

    .nav-shopping-icon {
        width: 25px;
    }

    .nav-shopping-icon,
    .nav-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        transition: all .5s;
        border: transparent 2px solid;
        border-radius: 50%;
    }

    .nav-avatar:hover {
        border-radius: 50%;
        border: var(--Orange) 2px solid;
    }

    .nav-search-container {
        width: 40%;
        border-radius: 4px;
        background-color: aliceblue;
    }

    .nav-search-qr {
        width: 22px;
        height: 22px;
    }

    .nav-search-input {
        padding: .5rem;
        width: 90%;
        font-size: 14px;
        background-color: transparent;
        border: none;
    }

    .nav-search-input:focus {
        outline-color: rgba(210, 207, 207, 0.334);
    }

    .nav-gap {
        gap: 1rem;
    }

    .nav-logo {
        cursor: pointer;
        width: 60px;
    }

    .nav-dropdown {
        position: relative;
    }

    .nav-search-select-container {
        background-color: hsl(0, 2%, 78%);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    .nav-select {
        max-width: 50px;
        color:rgb(77, 77, 77);
        background-color: transparent;
        border: none;
    }

    .nav-option {
        padding: .5rem;
    }

    .nav-select:focus {
        outline: none;
    }

    .nav-dropdown-content {
        display: none;
        opacity: 0;
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1;
        width: 90vw;
        background-color: var(--White);
        border-radius: 8px;
        box-shadow: var(--Modal-shadow);
        transition: all .5s;
    }

    .nav-cart-dropdown-header {
        padding: 1rem;
        border-bottom: 1px solid var(--Shadow);
    }

    .nav-cart-dropdown-body {
        padding: 1rem;
        min-height: 100px;
        overflow: hidden;
        transition: all .5s;
    }

    .nav-cart-dropdown-header-text {
        color: var(--Dark-grayish-blue);
        font-weight: 500;
        font-size: 14px;
    }

    .nav-cart-dropdown-item-pic {
        width: 60px;
        border-radius: 8px;
    }

    .nav-cart-empty-cart {
        margin: 2rem;
        text-align: center;
        color: var(--Dark-grayish-blue);
    }

    .nav-cart-dropdown-price {
        font-size: 14px;
        color: var(--Dark-grayish-blue);
        font-weight: 300;
    }

    .nav-cart-dropdown-total {
        font-weight: 700;
    }

    .nav-cart-item-counter {
        position: absolute;
        top: -5px;
        left: 30px;
        font-size: 10px;
        font-weight: 400;
        color: var(--White);
        background-color: var(--Orange);
        padding: .125rem .35rem;
        border-radius: 50%;
    }

    .nav-cart-product {
        font-size: 14px;
    }

    .nav-cart-item {
        position: relative;
        transition: all .5s;
    }

    .nav-cart-btn-checkout {
        width: 100%;
        background-color: var(--Orange);
        text-align: center;
        padding: .5rem;
        border-radius: 8px;
        color: var(--White);
        cursor: pointer;
        box-shadow: var(--Small-shadow);
        transition: all .5s;
    }

    .nav-cart-btn-checkout:hover {
        box-shadow: unset;
    }

    .nav-cart-remove {
        color: var(--Dark-grayish-blue);
        align-self: center;
        cursor: pointer;
    }

    @media screen and (min-width: 650px) {
        .nav-dropdown-content {
            width: 300px;
        }
    }
</style>