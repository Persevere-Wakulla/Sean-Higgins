import * as Tone from "tone";
import Instrument from "./instrument.js";

export default class Drums extends Instrument {
    constructor(type, parentElem){
        super(type, parentElem);
        this.icon = './assets/drumsAlt.png';
        this.backgroundRecordingColor = 'var(--Drum-bg)';
        this.buffers = {
            urls: {
                A1: "./assets/drums/boom.wav",
                A4: "./assets/drums/hihat.wav",
                E4: "./assets/drums/kick.wav",
                F1: "./assets/drums/openhat.wav",
                G6: "./assets/drums/snare.wav",
                B2: "./assets/drums/clap.wav",
                C6: "./assets/drums/tink.wav",
            }
        }
        this.sampler = new Tone.Sampler(this.buffers).toDestination();
    }
    
    playSound(keyCode, time){
        super.playSound(keyCode, this.sampler, time);
    }
    
    getNewSampler(cb) {
        return new Tone.Sampler({
            ...this.buffers,
            onload: ()=> {
                cb();
            },
    }).toDestination();
    }
}