<script>
    export default {
        props: ['pics'],
        data(){
            return {
                counter: 0
            }
        },
        methods: {
            makeActive(event, index) {
                this.counter = index;
                this.updateImgFromCounter();
            },

            removeActiveClass() {
                this.$refs.picThumbNailParent.querySelectorAll('.pic-slider-thumbnail').forEach(elem => {
                    elem.classList.remove('active');
                });
            },

            updateImgFromCounter() {
                const imgChildren = this.$refs.picSlider.querySelectorAll('.pic-slider-img');
                this.counter = this.counter < 0 ? imgChildren.length - 1 : this.counter;

                this.counter = this.counter > imgChildren.length - 1 ? 0 : this.counter;

                imgChildren.forEach(element => {
                    element.style.transform = `translateX(-${this.counter * 100}%)`
                });

                this.removeActiveClass();
                this.$refs.picThumbNailParent.children[this.counter].classList.add('active');
            },

            changeSlide(event) {
                const action = event.target.id;

                action === 'prev' ? this.counter-- : this.counter++;

                this.updateImgFromCounter();
            }
        }
    }
</script>

<template>
    <div class="flex pic-container gap">
        <div ref="picThumbNailParent" class="pic-slider-thumbnails flex col gap">
            <img @click="makeActive($event, index)" @mouseover="makeActive($event, index)" v-for="(picSrc, index) in pics" class="pic-slider-thumbnail"
                :src="picSrc" :class="{'active': index === 0}" alt="thumbnail item">
        </div>
        <div ref="picSlider" class="flex pic-slider">
            <div @mouseover="" class="pic-slider-img"  v-for="picSrc in pics" :style="{backgroundImage: 'url(' + picSrc + ')'}"></div>
            <!-- <img v-for="picSrc in pics" class="pic-slider-img" :src="picSrc" alt=""> -->
            <img id="prev" @click="changeSlide($event)" class="pic-slider-control pic-slider-control-prev"
                src="../assets/images/icon-previous.svg" alt="prev icon">
            <img id="next" @click="changeSlide($event)" class="pic-slider-control pic-slider-control-next"
                src="../assets/images/icon-next.svg" alt="next icon">
        </div>
    </div>
</template>

<style scoped>
.pic-slider {
        position: relative;
        width: 100%;
        overflow: hidden;
        transition: all ease-in 1s;
    }

    .pic-slider-img {
        min-width: 100%;
        min-height: 400px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        transition: all 1s;
    }

    /* .pic-slider>img {
        width: inherit;
        transition: all 1s;
    } */

    .pic-slider-control {
        position: absolute;
        cursor: pointer;
        bottom: 45%;
        background-color: var(--White);
        padding: 1rem 1rem;
        border-radius: 50%;
        width: 50px !important;
        transition: all .3s ease-in-out;
    }

    .pic-slider-control:hover {
        background-color: var(--Grayish-blue);
    }

    .pic-slider-control-prev {
        left: 10px;
    }

    .pic-slider-control-next {
        right: 10px;
    }

    .pic-slider-thumbnails {
        display: none;
    }

    .pic-slider-thumbnail {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        transition: all .3s;
    }

    .pic-slider-thumbnail:hover {
        opacity: .5;
    }

    .pic-slider-thumbnail.active {
        opacity: .5;
        border: 2px solid var(--Orange)
    }

    @media screen and (min-width: 700px) {
        .pic-container {
            width:auto;
            margin-top: 1rem;
            margin-bottom: 1rem;
            margin-left: 1rem;
            margin-right: 10px;
            transition: all 1s;
        }

        .pic-slider {
            box-shadow: var(--Extra-Small-shadow);
        }

        .pic-slider-thumbnails {
            display: flex;
            overflow: auto;
            overflow-x: hidden;
            max-height: 400px;
            width: 50px;
        }

        .pic-slider-control {
            display: none;
        }

    }
</style>