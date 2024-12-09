import * as Tone from "tone";
import ActionManager from "./utils/actionManager.js";

export default class Loop {
    constructor(instrument = null) {
        this.currentLoop = [];
        this.instrument = instrument;
        this.loopName = '';
        this.bpm = 60;
        this.loopPosition = 0;
    }

    setName(name) {
        this.loopName = name;
    }

    setBPM(val) {
        this.bpm = val;
    }

    addPart(keyCode) {
        let instrument = ActionManager.getCurrentInstrument();
        if (instrument.isChord) {
            let note = instrument.chords(instrument.scale).find(key => key.dataKey === keyCode);
            this.currentLoop.push({
                isChord: true,
                chords: note.notes,
                loopPosition: this.loopPosition
            })
        }
        else {
            let noteOfficial = instrument.keys.find(key => key.dataKey === keyCode);
            this.currentLoop.push({
                type: noteOfficial.type,
                isChord: false,
                loopPosition: this.loopPosition
            })
        }
        this.loopPosition++;
    }

    playLoop() {
        Tone.getTransport().stop();
        Tone.getTransport().cancel();
        let song = ActionManager.getCurrentSong();
        let instrument = song.instrumentsUsed.find(x => x.type === this.instrument.toLowerCase());
        if (!instrument) {
            let capitalized = this.instrument.substring(0, 1).toUpperCase();
            let split = this.instrument.split('');
            split[0] = capitalized;
            instrument = ActionManager.createInstrumentInstance(split.join(''), ActionManager.getKeysElement());
        }
        let sampler = instrument.sampler;
        const now = Tone.now();
        let time = 0;
        let altered = this.currentLoop.map((x, index) => {
            time += .1;
            return { note: !x.isChord ? x.type : x.chords, time, velocity: 0, chord: x.isChord }
        });
        let loopPart = new Tone.Part((time, obj) => {
            if (obj.chord) {
                sampler.triggerAttackRelease(obj.note, 1);
            }
            else {
                sampler.triggerAttack(obj.note);
            }
        }, altered);

        // this.currentLoop.forEach(x=> {
        //     loopPart.add('0', x);
        // });
        loopPart.start(0);


        Tone.getTransport().bpm.value = 30;

        Tone.getTransport().start();
    }

    saveLoop(songPosition = null) {
        let existingLoops = JSON.parse(localStorage.getItem('loops'));

        if (existingLoops) {
            let loop = existingLoops.find(x => x.name === this.loopName);
            loop ? Object.assign(loop, { name: this.loopName, bpm: this.bpm, songPosition, instrument: this.instrument, loop: this.currentLoop })
                : existingLoops = [...existingLoops, { name: this.loopName, bpm: this.bpm, songPosition, instrument: ActionManager.getCurrentInstrument().type, loop: this.currentLoop }];
            localStorage.setItem('loops', JSON.stringify(existingLoops));
        } else {
            localStorage.setItem('loops', JSON.stringify([{ name: this.loopName, bpm: this.bpm, songPosition, instrument: ActionManager.getCurrentInstrument().type, loop: this.currentLoop }]));
        }

    }

    loadLoop(name) {
        let loops = JSON.parse(localStorage.getItem('loops'));
        let selectedLoop = loops.find(x => x.name === name);
        this.currentLoop = selectedLoop.loop;
        this.instrument = selectedLoop.instrument;
        this.bpm = selectedLoop.bpm;
        this.loopName = name;
    }
}