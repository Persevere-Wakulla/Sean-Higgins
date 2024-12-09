import * as Tone from "tone";
import Instrument from "../regular_instruments/instrument.js";

export default class MonoSynth extends Instrument {
    constructor(type, parentElem) {
        super(type, parentElem);
        this.backgroundRecordingColor = 'var(--Piano-bg)';
        this.sampler = this.getNewSampler();
        this.icon = '../assets/symbal.png';
    }

    playSound(keyCode, time) {
        super.playSound(keyCode, this.sampler, time);
        this.sampler.triggerRelease("+1")
    }

    getNewSampler() {
        return new Tone.MonoSynth().toDestination();
    }

}