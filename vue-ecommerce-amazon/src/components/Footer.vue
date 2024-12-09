<script>

    import { store } from '../utils/store.js';

    export default {
        data() {
            return {
                websites: [{
                    header: 'AbeBooks',
                    link: 'https://www.abebooks.com',
                    highlights: ['Books, arts', '& collectibles']
                }, {
                    header: 'Amazon Web Services',
                    link: 'https://www.aws.com',
                    highlights: ['Scalable Cloud', 'Computing Services',]
                }, {
                    header: 'Audible',
                    link: 'https://www.audible.com',
                    highlights: ['Download', 'Audio Books',]
                }, {
                    header: 'IMDb',
                    link: 'https://www.imdb.com',
                    highlights: ['Movies Tv', '& Celebrities',]
                },{
                    header: 'Shopbop',
                    link: 'https://www.shopbop.com',
                    highlights: ['Designer', 'Fashion Brands']
                }, {
                    header: 'Amazon Business',
                    link: 'https://www.amazon.com/business',
                    highlights: ['Everything for', 'Your Business',]
                }, {
                    header: 'Prime Now',
                    link: 'https://www.amazon.com/now',
                    highlights: ['2-hr delivery', 'on everyday items',]
                }, {
                    header: 'Prime Music',
                    link: 'https://www.amazon.com/music',
                    highlights: ['100 mil songs, ad-free', 'Over 15 mil podcasts',]
                }]
            }
        },
        methods: {

        }
    }
</script>

<template>
    <Footer-Secondary id="Footer-Secondary"></Footer-Secondary>
    <footer>
        <div class="flex col gap">
            <div class="flex footer-gap wrap">
                <div class="flex col" v-for="(website, index) in websites">
                    <h6>{{website.header}}</h6>
                    <a :href="website.link" v-for="highlight in website.highlights">{{highlight}}</a>
                </div>
            </div>

            <div class="flex col align-items-center">
                <div class="flex gap justify-center">
                    <a>Conditions of Use & Sale</a><a>Privacy Notice</a><a>Interest-Based Ads</a>
                </div>
                <p>© 1996-2024, Amazon.com, Inc. or its affiliates</p>
            </div>
        </div>
    </footer>
</template>

<style scoped>

    #Footer-Secondary {
        margin-top: 5rem;
    }

    p,
    h6 {
        color: white;
        font-size: 12px;
        font-weight: 400;
    }

    h6,
    a {
        cursor: pointer;
    }

    a {
        color: hsl(0, 1%, 65%);
        font-size: 12px;
        font-weight: 400;
    }

    h6:hover,
    a:hover {
        text-decoration: underline;
    }

    footer {
        background-color: var(--Navbar-Gray-Blue);
        padding: 1.5rem;
    }

    .footer-gap {
        gap: 1rem 2rem;
        max-width: 60%;
        margin: 0 auto;
    }
    .footer-gap > div {
        width: 120px;
    }
</style>