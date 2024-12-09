import * as Tone from "tone";
import Instrument from "./instrument.js";

export default class Guitar extends Instrument {
    constructor(type, parentElem) {
        super(type, parentElem);
        this.backgroundRecordingColor = 'var(--Guitar-bg)';
        
        this.buffers = {
            urls: {
                A2: "./assets/guitar/A2.wav",
                A4: "./assets/guitar/A4.wav",
                C4: "./assets/guitar/C4.wav",
                C5: "./assets/guitar/C5.wav",
                C6: "./assets/guitar/C6.wav",
                E2: "./assets/guitar/E2.wav",
                'D#3': "./assets/guitar/DSharp3.wav",
                'D#4': "./assets/guitar/DSharp4.wav",
                'D#5': "./assets/guitar/DSharp5.wav",
                'F#4': "./assets/guitar/FSharp4.wav",
                'F#5': "./assets/guitar/FSharp5.wav",
                'G#3': "./assets/guitar/GSharp3.wav"
            },
        }
        this.sampler = new Tone.Sampler({
            urls: {
                A2: "./assets/guitar/A2.wav",
                A4: "./assets/guitar/A4.wav",
                C4: "./assets/guitar/C4.wav",
                C5: "./assets/guitar/C5.wav",
                C6: "./assets/guitar/C6.wav",
                E2: "./assets/guitar/E2.wav",
                'D#3': "./assets/guitar/DSharp3.wav",
                'D#4': "./assets/guitar/DSharp4.wav",
                'D#5': "./assets/guitar/DSharp5.wav",
                'F#4': "./assets/guitar/FSharp4.wav",
                'F#5': "./assets/guitar/FSharp5.wav",
                'G#3': "./assets/guitar/GSharp3.wav"
            }
        }).toDestination();
        this.guitarSampler = this.sampler;
        this.icon = './assets/guitarAlt.png';
    }

    playSound(keyCode, time) {
        super.playSound(keyCode, this.sampler, time);
    }

    getNewSampler(cb) {
        return new Tone.Sampler({
            ...this.buffers,
            onload: () => {
                cb();
            },
        }).toDestination();
    }
}