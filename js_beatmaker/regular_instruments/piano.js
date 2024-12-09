import * as Tone from "tone";
import Instrument from "./instrument.js";

export default class Piano extends Instrument {
    constructor(type, parentElem) {
        super(type, parentElem);
        this.backgroundRecordingColor = 'var(--Piano-bg)';
        this.sampler = this.getNewSampler();
        this.pianoSampler = this.sampler;
        this.icon = './assets/grand.png';
    }

    playSound(keyCode, time) {
        super.playSound(keyCode, this.sampler, time);
    }

    getNewSampler(cb) {
        return new Tone.Sampler({
            urls: {
                A3: "./assets/piano/A3vH.flac",
                A4: "./assets/piano/A4vh.flac",
                A5: "./assets/piano/A5vh.flac",
                A6: "./assets/piano/A6vh.flac",
                A7: "./assets/piano/A7vh.flac",
                B1: "./assets/piano/B1vh.flac",
                B2: "./assets/piano/B2vh.flac",
                B7: "./assets/piano/B7vh.flac",
                C4: "./assets/piano/C4vh.flac",
                C5: "./assets/piano/C5vh.flac",
                C6: "./assets/piano/C6vh.flac",
                C7: "./assets/piano/C7vh.flac",
                'D#3': "./assets/piano/D3vh.flac",
                'D#4': "./assets/piano/D4vh.flac",
                'D#5': "./assets/piano/D5vh.flac",
                'D#6': "./assets/piano/D6vh.flac",
                'D#7': "./assets/piano/D7vh.flac",

                'F#1': "./assets/piano/F1vh.flac",
                'F#2': "./assets/piano/F2vh.flac",
                'F#3': "./assets/piano/F3vh.flac",
                'F#4': "./assets/piano/F4vh.flac",
                'F#5': "./assets/piano/F5vh.flac",
                'F#6': "./assets/piano/F6vh.flac",
                'F#7': "./assets/piano/F7vh.flac",
            },
            onload: () => {
                cb();
            }
        }).toDestination();
    }

}