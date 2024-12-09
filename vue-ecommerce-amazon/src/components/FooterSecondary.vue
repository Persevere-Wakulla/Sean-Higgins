<script>
    export default {
        data() {
            return {
                selections: [
                    {
                        header: 'Get to Know Us',
                        options: [
                            {
                                link: '',
                                descr: 'About Us'
                            },
                            {
                                link: '',
                                descr: 'Careers'
                            },
                            {
                                link: '',
                                descr: 'Press Releases'
                            },
                            {
                                link: '',
                                descr: 'Amazon Science'
                            }
                        ]
                    }, {
                        header: 'Connect with Us',
                        options: [
                            {
                                link: '',
                                descr: 'Facebook'
                            },
                            {
                                link: '',
                                descr: 'X'
                            },
                            {
                                link: '',
                                descr: 'Instagram'
                            }
                        ]
                    }, {
                        header: 'Make Money with Us',
                        options: [
                            {
                                link: '',
                                descr: 'Sell on Amazon'
                            },
                            {
                                link: '',
                                descr: 'Sell under Amazon Accelerator'
                            },
                            {
                                link: '',
                                descr: 'Protect and Build Your Brand'
                            },
                            {
                                link: '',
                                descr: 'Amazon Global Selling'
                            },
                            {
                                link: '',
                                descr: 'Become an Affiliate'
                            },
                            {
                                link: '',
                                descr: 'Fulfilment by Amazon'
                            },
                            {
                                link: '',
                                descr: 'Advertise Your Products'
                            },
                            {
                                link: '',
                                descr: 'Amazon Pay on Merchants'
                            }
                        ]
                    }, {
                        header: 'Let Us Help You',
                        options: [
                            {
                                link: '',
                                descr: 'COVID-19 and Amazon'
                            },
                            {
                                link: '',
                                descr: 'Your Account'
                            },
                            {
                                link: '',
                                descr: 'Returns Centre'
                            },
                            {
                                link: '',
                                descr: '100% Purchase Protection'
                            },
                            {
                                link: '',
                                descr: 'Amazon App Download'
                            },
                            {
                                link: '',
                                descr: 'Help'
                            }
                        ]
                    }
                ],
                languages: [
                    'Australia',
                    'Brazil',
                    'Canada',
                    'China',
                    'France',
                    'Germany',
                    'Italy',
                    'Japan',
                    'Mexico',
                    'Netherlands',
                    'Poland',
                    'Singapore',
                    'Spain',
                    'Turkey',
                    'United Arab Emirates',
                    'United Kingdom',
                    'United States',
                ]
            }
        },
    }
</script>

<template>
    <footer>
        <div class="footer-body flex gap-section justify-center">
            <div class="flex col" v-for="selection in selections">
                <h4 class="footer-selection-heading">{{selection.header}}</h4>
                <a class="footer-selection-link" :href="option.link"
                    v-for="option in selection.options">{{option.descr}}</a>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="flex gap wrap justify-center">
                <h6 v-for="lang in languages">{{lang}}</h6>
            </div>
        </div>
    </footer>
</template>

<style scoped>
    .gap {
        gap: 1.5rem;
    }

    .gap-section {
        gap: 4rem;
    }

    h6 {
        cursor: pointer;
        color: white;
        font-weight: 400;
    }

    footer {
        background-color: var(--Footer-Main-Color);
        padding: 0;
    }

    .footer-body {
        padding: 2rem;
        border-bottom: 1px solid hsla(0, 0%, 66%, 0.22);
    }

    .footer-selection-heading {
        color: white;
        font-weight: 500;
    }

    .footer-selection-link {
        color: white;
        font-weight: 200;
        font-size: 12px;
    }

    .footer-selection-link:hover {
        text-decoration: underline;
    }

    .footer-bottom {
        padding: 1rem;
    }
</style>