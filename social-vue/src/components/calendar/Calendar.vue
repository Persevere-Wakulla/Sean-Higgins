<script>
    import { store } from '../../utils/store.js';
    export default {
        data() {
            return {
                store,
                createdEvent: { color: '', name: '', date: '' },
                currentMonth: new Date(),
                currentDay: new Date(),
                daysInMonth: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                daysInWeek: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
                calendarEvents: [{
                    eventId: 1,
                    name: "Jeanette turns 30",
                    date: 1710856434570,
                    color: 'palegreen'
                },
                {
                    eventId: 2,
                    name: "Day after your birthday",
                    date: 1708605442503,
                    color: 'rgb(198, 181, 226)'
                }
                ]
            }
        },
        methods: {
            createEvent() {
                let eventId = Math.max(...this.calendarEvents.map((x) => x.eventId));
                eventId++;
                this.calendarEvents.push({ ...this.createdEvent, eventId });
                this.createdEvent = { color: '', name: '', date: '' };
                this.$refs.addEvent.close();
            },
            openExisitingEvent(event) {

            },
            openCreateModal(obj) {
                this.createdEvent.date = Date.parse(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), obj.day));
                this.$refs.addEvent.showModal()
                console.dir(this.createdEvent);
            },
            changeMonth(change) {
                let month = this.currentMonth.getMonth();
                this.currentMonth = change === 'forward' ?
                    new Date(this.currentMonth.getFullYear(), month += 1) :
                    new Date(this.currentMonth.getFullYear(), month -= 1);
            },
            getMonth(days) {
                let arrOfDays = [];
                let startOfTime = 1;
                while (startOfTime <= days) {
                    let builtDay = {
                        day: startOfTime,
                        dayOfWeek: this.daysInWeek[new Date(this.currentDay.getFullYear(), this.currentDay.getMonth(), startOfTime).getDay()],
                        isCurrentDay: false,
                        event: []
                    };
                    if (startOfTime === this.currentDay.getDate() && this.currentMonth.getMonth() === this.currentDay.getMonth()) {
                        builtDay.isCurrentDay = true;
                    }
                    this.calendarEvents.filter((event) => {
                        let date = new Date(event.date);
                        if (date.getDate() === startOfTime && date.getFullYear() === this.currentMonth.getFullYear() && date.getMonth() === this.currentMonth.getMonth()) {
                            builtDay.event.push({
                                name: event.name,
                                color: event.color
                            })
                        }
                    })
                    arrOfDays.push(builtDay);
                    startOfTime++;
                }
                return arrOfDays;
            }
        }
    }
</script>

<template>
    <dialog ref="addEvent">
        <div class="flex col">
            <font-awesome-icon class="self-end" icon="fa-x"></font-awesome-icon>
            <div class="flex col gap">
                <div class="flex gap align-center">
                    <label for="eventName">Name</label>
                    <input v-model="createdEvent.name" type="text" id="eventName">
                </div>
                <div class="flex gap align-center">
                    <label for="colorPicker">Color</label>
                    <input v-model="createdEvent.color" type="color" id="colorPicker" value="#ff0000">
                </div>
                <a @click="createEvent()" class="calendar-modal-add-btn">Add</a>
            </div>
        </div>
    </dialog>
    <div class="container">
        <div class="flex col gap">
            <div class="flex gap align-center justify-center">
                <font-awesome-icon @click="changeMonth('back')" class="calendar-month-control"
                    icon="fa-arrow-left-long"></font-awesome-icon>
                <h2 class="calendar-month">{{currentMonth.toDateString().split(' ')[1]}}</h2>
                <h2 class="calendar-year">{{currentMonth.getFullYear()}}</h2>
                <font-awesome-icon @click="changeMonth('forward')" class="calendar-month-control"
                    icon="fa-arrow-right-long"></font-awesome-icon>
            </div>
            <div class="flex wrap">
                <div v-for="day in getMonth(daysInMonth[currentMonth.getMonth()])" class="calendar-day">
                    <div class="calendar-day-header flex space-between">
                        <h6 :class="{'current': day.isCurrentDay}">{{day.day}}</h6>
                        <h6>{{day.dayOfWeek}}</h6>
                    </div>
                    <div class="calendar-day-body flex small-gap col justify-center"
                        @click.shift="openCreateModal(day)">
                        <span @click="openExistingEvent(event)" :style="{'background-color': event?.color}"
                            class="calendar-day-event" v-for="event in day.event">{{event?.name}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    input {
        width: 100%;
        padding: unset;
        box-shadow: unset;
        border-radius: unset;
        padding: .25rem;
        background-color: hsla(0, 1%, 58%, 0.301);
    }

    input:focus {
        animation: unset;
    }

    dialog {
        margin: 25% auto;
        max-width: 300px;
        width: 80%;
        padding: .5rem;
        outline: 0;
        border: none;

    }

    dialog::backdrop {
        background-color: hsla(0, 1%, 16%, 0.301);
    }

    .container {
        grid-row: 2;
        grid-column: 2;
        padding: 1.5em;
        width: 100%;
    }

    .calendar-year {
        letter-spacing: 1px;
        font-weight: 400;
        color: hsl(240, 1%, 28%);
    }

    .calendar-month {
        color: hsl(240, 1%, 28%);
    }

    .calendar-day {
        border: 1px solid hsla(0, 1%, 16%, 0.301);
        width: 120px;
    }

    .calendar-day-header {
        background-color: #2478de;
        color: white;
        padding: .25rem;
        width: 100%;
        height: 30px;
        align-items: center;
    }

    .calendar-day-body {
        height: 100px;
        padding: .25rem;
    }

    .calendar-day-event {
        font-size: 10px;
        font-weight: 700;
        height: max-content;
        padding: .25rem;
        box-shadow: 0 2px 4px hsla(0, 1%, 16%, 0.301);
    }

    .calendar-month-control {
        cursor: pointer;
    }

    .current {
        background-color: hsl(0, 1%, 38%);
        padding: .05rem .08rem;
        border-radius: 50%;
    }

    .calendar-modal-add-btn {
        cursor: pointer;
        color: white;
        font-weight: 300;
        background-color: #2478de;
        box-shadow: var(--small-box-shadow);
        width: fit-content;
        height: fit-content;
        padding: .2rem 2rem;
        transition: all 1s;
    }

    .calendar-modal-add-btn:hover {
        box-shadow: unset;
    }


    @media (max-width: 950px) {
        .container {
            grid-column: 2 / span 3;
        }
    }

    @media (max-width: 700px) {
        .container {
            grid-column: 1 / span 3;
        }
    }
</style>