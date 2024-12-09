<script>

    import { store } from '../utils/store.js';

    export default {
        data() {
            return {
                counter: 0,
                beauties: [
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_1.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_2.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_3.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_4.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_5.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_6.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_7.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_8.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/beauty/beauty_9.jpg',
                    }
                ],
                
                furniture: [
                    {
                        bgSrc: '/src/assets/images/furniture/furn_1.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/furniture/furn_2.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/furniture/furn_3.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/furniture/furn_4.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/furniture/furn_5.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/furniture/furn_6.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/furniture/furn_7.jpg',
                    },
                    {
                        bgSrc: '/src/assets/images/furniture/furn_8.jpg',
                    }
                ],
                
                todays: [
                    {
                        bgSrc: '/src/assets/images/phones/P1.jpg',
                        descr: 'OnePlus Nord CE 3 Lite 5G',
                        saleAmount: 'Up to 10% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P2.jpg',
                        descr: 'iQoo Z6 Lite 5G',
                        saleAmount: 'Up to 27% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P3.jpg',
                        descr: 'Redmi 13C Limited Edition',
                        saleAmount: 'Up to 33% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P4.jpg',
                        descr: 'OnePlus Nord CE 3 Lite 5G',
                        saleAmount: 'Up to 22% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P5.jpg',
                        descr: 'OnePlus Nord CE 3 Lite 5G',
                        saleAmount: 'Up to 19% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P7.jpg',
                        descr: 'OnePlus Nord CE 3 Lite 5G',
                        saleAmount: 'Up to 7% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P8.jpg',
                        descr: 'OnePlus Nord CE 3 Lite 5G',
                        saleAmount: 'Up to 31% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P9.jpg',
                        descr: 'OnePlus Nord CE 3 Lite 5G',
                        saleAmount: 'Up to 24% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P10.jpg',
                        descr: 'OnePlus Nord CE 3 Lite 5G',
                        saleAmount: 'Up to 22% off'
                    },
                    {
                        bgSrc: '/src/assets/images/phones/P11.jpg',
                        descr: 'OnePlus Nord CE 3 Lite 5G',
                        saleAmount: 'Up to 16% off'
                    }
                ],
                cards: [
                    {
                        header: 'Up to 60% off | Styles for men',
                        linkText: 'End of Season sale',
                        link: '',
                        sections: [{
                            bgSrc: '/src/assets/images/home/MF-1.jpg',
                            descr: 'Clothing',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/MF-2.jpg',
                            descr: 'Footwear',
                            link: 'item'
                        }, {
                            bgSrc: '/src/assets/images/home/MF-3.jpg',
                            descr: 'Watches',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/MF-4.jpg',
                            descr: 'Bags & Wallets',
                            link: ''
                        }]
                    },
                    {
                        header: 'Appliances for your home | Up to 55% off',
                        linkText: 'See more',
                        link: '',
                        sections: [{
                            bgSrc: '/src/assets/images/home/SC2_2.jpg',
                            descr: 'Air Conditioners',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/SC2_3.jpg',
                            descr: 'Refrigerators',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/SC2_4.jpg',
                            descr: 'Microwaves',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/SC2_1.jpg',
                            descr: 'Washing Machines',
                            link: ''
                        }]
                    },       
                    {
                        header: 'Starting $99 | Home Improvement Needs',
                        linkText: 'See more',
                        link: '',
                        sections: [{
                            bgSrc: '/src/assets/images/home/QC_1.jpg',
                            descr: 'Spin mops, wipes & more',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/QC_2.jpg',
                            descr: 'Bathroom hardware',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/QC_3.jpg',
                            descr: 'All your tool needs',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/QC_4.jpg',
                            descr: 'Extension boards, plugs',
                            link: ''
                        }]
                    },                    {
                        header: 'Up to 75% off | Headphones',
                        linkText: 'See all offers',
                        link: '',
                        sections: [{
                            bgSrc: '/src/assets/images/home/HP_1.jpg',
                            descr: 'boAt',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/HP_2.jpg',
                            descr: 'boult',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/HP_3.jpg',
                            descr: 'Noise',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/HP_4.jpg',
                            descr: 'Zebronics',
                            link: ''
                        }]
                    },                    {
                        header: 'Revamp your home in style',
                        linkText: 'Explore All',
                        link: '',
                        sections: [{
                            bgSrc: '/src/assets/images/home/H1.jpg',
                            descr: 'Cushion covers, bedsheets',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/H2.jpg',
                            descr: 'Figurines, vases',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/H3.jpg',
                            descr: 'Home Storage',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/H4.jpg',
                            descr: 'Lighting Solutions',
                            link: ''
                        }]
                    },                    {
                        header: 'Up to 60% off | Styles for women',
                        linkText: 'End of Season sale',
                        link: '',
                        sections: [{
                            bgSrc: '/src/assets/images/home/WF1.jpg',
                            descr: 'Womens clothing',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/WF2.jpg',
                            descr: 'Footwear & Handbags',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/WF3.jpg',
                            descr: 'Watches',
                            link: ''
                        }, {
                            bgSrc: '/src/assets/images/home/WF4.jpg',
                            descr: 'Jewellery',
                            link: ''
                        }]
                    }
                ]
            }
        },
        methods: {
            scroll(ref, direction){
                direction === 'left' ? this.counter-- : this.counter++;
                this.counter = this.counter < 0 ? this.todays.length - 1 : this.counter;
                this.counter = this.counter > this.todays.length - 1 ? 0 : this.counter;
                let move = direction === 'right' ? `translateX(-${60 * this.counter}%)` : `translateX(${60 * this.counter}%)`;
                let elements = '';
                if(ref === 'todayItems'){
                    elements = this.$refs.todayItems;
                }
                else if(ref === 'furniture'){
                    elements = this.$refs.furnitureItems;
                }
                else {
                    elements = this.$refs.beautyItems;
                }
                Array.from(elements).forEach(element => {
                    element.style.transform = move
                });
            }
        }
    }
</script>

<template>
    <div class="bg flex col mid-gap">
        <header class="flex col"></header>
        <section class="flex wrap mid-gap justify-center">
            <div class="card flex col gap justify-center" v-for="card in cards">
                <h3 class="card-header">{{card.header}}</h3>
                <div class="flex gap wrap justify-center">
                    <span class="flex col" v-for="(section, index) in card.sections">
                        <img @click="$router.push({name: section.link})" class="card-image" :src="section.bgSrc" alt="">
                        <p class="card-image-descr">{{section.descr}}</p>
                    </span>
                </div>
                <div class="card-footer">
                    <a class="card-footer-link">{{card.linkText}}</a>
                </div>
            </div>
        </section>
        <section class="flex mid-gap justify-center">
            <div class="card long flex mid-gap">
                <font-awesome-icon @click="scroll('todayItems', 'left')" class="card-arrow card-arrow-left" icon="fa-arrow-left-long"></font-awesome-icon>
                <span ref="todayItems" v-for="(deal, index) in todays" class="flex col gap card-deal-holder" :key="index">
                    <img class="card-image card-image-scroll" :src="deal.bgSrc" alt="">
                    <p class="card-today-sale">{{deal.saleAmount}}</p>
                    <p class="card-today-sale-descr">{{deal.descr}}</p>
                </span>
                <font-awesome-icon @click="scroll('todayItems','right')" class="card-arrow card-arrow-right" icon="fa-arrow-right-long"></font-awesome-icon>
            </div>
        </section>
        <section class="flex mid-gap justify-center">
            <div class="card long flex mid-gap">
                <font-awesome-icon @click="scroll('beauty', 'left')" class="card-arrow card-arrow-left" icon="fa-arrow-left-long"></font-awesome-icon>
                <span ref="beautyItems" v-for="(beauty, index) in beauties" class="flex col gap card-deal-holder" :key="index">
                    <img class="card-image card-image-scroll" :src="beauty.bgSrc" alt="">
                </span>
                <font-awesome-icon @click="scroll('beauty','right')" class="card-arrow card-arrow-right" icon="fa-arrow-right-long"></font-awesome-icon>
            </div>
        </section>
        <section class="flex mid-gap justify-center">
            <div class="card long flex mid-gap">
                <font-awesome-icon @click="scroll('furniture', 'left')" class="card-arrow card-arrow-left" icon="fa-arrow-left-long"></font-awesome-icon>
                <span ref="furnitureItems" v-for="(furn, index) in furniture" class="flex col gap card-deal-holder" :key="index">
                    <img class="card-image card-image-scroll" :src="furn.bgSrc" alt="">
                </span>
                <font-awesome-icon @click="scroll('furniture', 'right')" class="card-arrow card-arrow-right" icon="fa-arrow-right-long"></font-awesome-icon>
            </div>
        </section>
    </div>
</template>

<style scoped>
    section {
        position: relative;
        max-width: 95%;
        top: -8vh;
        padding: 0 2rem;
    }

    header {
        color: white;
        height: 350px;
        background-image: url(../assets/images/home/phone.jpg);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center top;
        line-height: 2;
    }

    header>h2 {
        margin-left: 40%;
        letter-spacing: 4px;
        width: 50%;
    }

    .card {
        background-color: white;
        padding: 1rem;
        max-width: 400px;
        align-items: center;
        box-shadow: 0 2px 8px hsl(0, 2%, 18%);
    }
    .long {
        position: relative;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
    }
    .card-arrow {
        cursor: pointer;
        position: absolute;
        top: 40%;
        background-color: hsl(0, 3%, 85%);
        padding: 1rem;
        z-index: 1;
        box-shadow: 0 4px 8px hsl(0, 2%, 18%);
    }
    .card-today-sale {
        background-color: hsl(0, 73%, 55%);
        padding: .25rem .5rem;
        width: fit-content;
        color: white;
        font-size: 12px;
        font-weight: 700;
    }
    .card-today-sale-descr {
        font-size: 12px;
    }
    .card-deal-holder {
        position: relative;
        transition: all 1s;
    }
    .card-arrow-left {
        display: none;
        left: 0;
    }
    .card-arrow-right {
        right: 0;
    }
    .card-header {
        font-size: 16px;
    }
    .card-image {
        cursor: pointer;
        max-width: 180px;
    }
    .card-image-scroll {
        width: 155px;
        height: 200px;
    }

    .card-image-descr {
        cursor: pointer;
        font-size: 14px;
    }
    .card-footer {
        padding: 1rem .5rem;
        margin-right: auto;
    }
    .card-footer-link {
        cursor: pointer;
        color: rgb(105, 189, 246);
        font-size:12px;
        font-weight: 500;
    }

    .bg {
        background: linear-gradient(#e22162, #e22162, #e22162, hsl(0, 0%, 98%), hsl(0, 0%, 98%))
    }
    @media screen and (max-width:700px) {
        header {
            height: 200px;
        }
    }
</style>