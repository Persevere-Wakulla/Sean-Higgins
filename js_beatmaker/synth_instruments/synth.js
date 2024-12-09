import * as Tone from "tone";
import Instrument from "../regular_instruments/instrument.js";

export default class Synth extends Instrument {
    constructor(type, parentElem) {
        super(type, parentElem);
        this.backgroundRecordingColor = 'var(--Synth-bg)';
        this.sampler = this.getNewSampler();
        this.icon = '../assets/synth.png';
    }

    playSound(keyCode, time) {
        super.playSound(keyCode, this.sampler, time);
        this.sampler.triggerRelease("+1");
    }

    getNewSampler() {
        return new Tone.Synth().toDestination();
    }

}