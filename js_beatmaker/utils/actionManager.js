import Piano from "../regular_instruments/piano.js";
import Drums from "../regular_instruments/drums.js";
import Guitar from "../regular_instruments/guitar.js";
import MembraneSynth from "../synth_instruments/membraneSynth.js";
import PluckSynth from "../synth_instruments/pluckSynth.js";
import MonoSynth from "../synth_instruments/monoSynth.js";
import Synth from "../synth_instruments/synth.js";
import Toast from "./toast.js";

export default class ActionManager {
    static #currentSongInstance = null;
    static #toast = new Toast();
    static #isLoopDialogOpen = false;

    static getKeysElement(){
        return document.querySelector(`.keys`);
    }

    static toastInfo(msg){
        this.#toast.info(msg);
    }
    static toastWarning(msg){
        this.#toast.warning(msg);
    }

    static setLoopDialogStatus(val){
        this.#isLoopDialogOpen = val;
    }

    static isLoopDialogOpen(){
        return this.#isLoopDialogOpen;
    }

    static createInstrumentInstance = (type, element) => eval(`new ${type}('${type.toLowerCase()}', element)`)
    
    static setCurrentSong(song) {
        this.#currentSongInstance = song;
    }
    static getCurrentSong(){
        return this.#currentSongInstance;
    }
    static getCurrentInstrument(){
        return this.#currentSongInstance.currentInstrument;
    }
}