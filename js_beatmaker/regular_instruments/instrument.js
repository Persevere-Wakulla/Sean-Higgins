import * as Tone from "tone";

export default class Instrument {
    constructor(type, parentElem) {
        this.type = type;
        this.synthInstruments = ['synth', 'monosynth', 'membranesynth', 'plucksynth'];
        this.parentElem = parentElem;
        this.active = false;
        this.isChord = false;
        this.scale = 3;
        this.chords = (scale = 3) => [
            { key: 'q', type: 'C Minor', dataKey: 81, notes: [`C${scale}`, `Eb${scale}`, `G${scale}`] },
            { key: 'w', type: 'C# Minor', dataKey: 87, notes: [`C#${scale}`, `E${scale}`, `G#${scale}`] },
            { key: 'e', type: 'D Minor', dataKey: 69, notes: [`D${scale}`, `F${scale}`, `A${scale}`] },
            { key: 'r', type: 'Eb Minor', dataKey: 82, notes: [`Eb${scale}`, `Gb${scale}`, `Bb${scale}`] },
            { key: 't', type: 'Eb Minor', dataKey: 84, notes: [`Eb${scale}`, `Gb${scale}`, `Bb${scale}`] },
            { key: 'y', type: 'E Minor', dataKey: 89, notes: [`E${scale}`, `G${scale}`, `B${scale}`] },
            { key: 'u', type: 'F Minor', dataKey: 85, notes: [`F${scale}`, `Ab${scale}`, `C${scale}`] },
            { key: 'i', type: 'F# Minor', dataKey: 73, notes: [`F#${scale}`, `A${scale}`, `C#${scale}`] },
            { key: 'o', type: 'G Minor', dataKey: 79, notes: [`G${scale}`, `Bb${scale}`, `D${scale}`] },
            { key: 'p', type: 'Ab Minor', dataKey: 80, notes: [`Ab${scale}`, `Cb${scale}`, `Eb${scale}`] },
            { key: '[', type: 'A Minor', dataKey: 219, notes: [`A${scale}`, `C${scale}`, `E${scale}`] },
            { key: ']', type: 'Bb Minor', dataKey: 221, notes: [`B${scale}`, `D${scale}`, `F#${scale}`] },
            { key: 'a', type: 'C Major', dataKey: 65, notes: [`C${scale}`, `E${scale}`, `G${scale}`] },
            { key: 's', type: 'C# Major', dataKey: 83, notes: [`C#${scale}`, `E#${scale}`, `G#${scale}`] },
            { key: 'd', type: 'D Major', dataKey: 68, notes: [`D${scale}`, `F#${scale}`, `A${scale}`] },
            { key: 'f', type: 'Eb Major', dataKey: 70, notes: [`Eb${scale}`, `G${scale}`, `Bb${scale}`] },
            { key: 'g', type: 'E Major', dataKey: 71, notes: [`E${scale}`, `G#${scale}`, `B${scale}`] },
            { key: 'h', type: 'F Major', dataKey: 72, notes: [`F${scale}`, `A${scale}`, `C${scale}`] },
            { key: 'j', type: 'F# Major', dataKey: 74, notes: [`F#${scale}`, `A#${scale}`, `C#${scale}`] },
            { key: 'k', type: 'G Major', dataKey: 75, notes: [`G${scale}`, `B${scale}`, `D${scale}`] },
            { key: 'l', type: 'Ab Major', dataKey: 76, notes: [`Ab${scale}`, `C${scale}`, `Eb${scale}`] },
            { key: ';', type: 'A Major', dataKey: 186, notes: [`A${scale}`, `C#${scale}`, `E${scale}`] },
            { key: "'", type: 'Bb Major', dataKey: 222, notes: [`Bb${scale}`, `D${scale}`, `F${scale}`] },
            { key: 'z', type: 'B Major', dataKey: 90, notes: [`B${scale}`, `D#${scale}`, `F#${scale}`] },
            { key: 'x', type: 'C Major 7th', dataKey: 88, notes: [`C${scale}`, `E${scale}`, `G${scale}`, `B${scale}`] },
            { key: 'c', type: 'D Major 7th', dataKey: 67, notes: [`D${scale}`, `F#${scale}`, `A${scale}`, `C#${scale}`] },
            { key: 'v', type: 'C Dom 7th', dataKey: 86, notes: [`C${scale}`, `E${scale}`, `G${scale}`, `Bb${scale}`] },
            { key: 'b', type: 'B Dom 7th', dataKey: 66, notes: [`B${scale}`, `D#${scale}`, `F#${scale}`, `A${scale}`] },
            { key: 'n', type: 'A Dom 7th', dataKey: 78, notes: [`A${scale}`, `C#${scale}`, `E${scale}`, `G${scale}`] },
            { key: 'm', type: 'E Dom 7th', dataKey: 77, notes: [`E${scale}`, `G#${scale}`, `B${scale}`, `D${scale}`] },
            { key: ',', type: 'C Minor 7th', dataKey: 188, notes: [`C${scale}`, `Eb${scale}`, `G${scale}`, `Bb${scale}`] },
            { key: '.', type: 'E Minor 7th', dataKey: 190, notes: [`E${scale}`, `G${scale}`, `B${scale}`, `D${scale}`] },
        ];
        this.keys = [
            { key: 'q', type: 'C2', dataKey: 81 },
            { key: 'w', type: 'D2', dataKey: 87 },
            { key: 'e', type: 'E2', dataKey: 69 },
            { key: 'r', type: 'F2', dataKey: 82 },
            { key: 't', type: 'G2', dataKey: 84 },
            { key: 'y', type: 'A2', dataKey: 89 },
            { key: 'u', type: 'B2', dataKey: 85 },
            { key: 'i', type: 'C3', dataKey: 73 },
            { key: 'o', type: 'D3', dataKey: 79 },
            { key: 'p', type: 'E3', dataKey: 80 },
            { key: '[', type: 'F3', dataKey: 219 },
            { key: ']', type: 'G3', dataKey: 221 },
            { key: 'a', type: 'A3', dataKey: 65 },
            { key: 's', type: 'B3', dataKey: 83 },
            { key: 'd', type: 'C4', dataKey: 68 },
            { key: 'f', type: 'D4', dataKey: 70 },
            { key: 'g', type: 'E4', dataKey: 71 },
            { key: 'h', type: 'G4', dataKey: 72 },
            { key: 'j', type: 'A4', dataKey: 74 },
            { key: 'k', type: 'B4', dataKey: 75 },
            { key: 'l', type: 'C5', dataKey: 76 },
            { key: ';', type: 'D5', dataKey: 186 },
            { key: "'", type: 'E5', dataKey: 222 },
            { key: 'z', type: 'F5', dataKey: 90 },
            { key: 'x', type: 'G5', dataKey: 88 },
            { key: 'c', type: 'A5', dataKey: 67 },
            { key: 'v', type: 'B5', dataKey: 86 },
            { key: 'b', type: 'C6', dataKey: 66 },
            { key: 'n', type: 'D6', dataKey: 78 },
            { key: 'm', type: 'E6', dataKey: 77 },
            { key: ',', type: 'F6', dataKey: 188 },
            { key: '.', type: 'G6', dataKey: 190 },
        ]
        this.instrumentSong = [];
        this.effectBG = new Map([
            ['pingPongDelay', 'hue-rotate(190deg)'],
            ['reverb', 'sepia(160%)'],
            ['distortion', 'saturate(500%)'],
            ['chorus', 'hue-rotate(90deg)'],
            ['tremolo', 'brightness(3.4)'],
            ['freeverb', 'grayscale(50%)'],
            ['pitchShift', 'drop-shadow(16px 16px 20px blue)'],
            ['vibrato', 'drop-shadow(-53px -103px yellow)'],
            ['chebyshev', 'drop-shadow(-3px -3px blue)']
        ])
        this.availableEffects = [
            { effect: 'PingPongDelay', requiresStart: false }, { effect: 'Reverb', requiresStart: false },
            { effect: 'Chorus', requiresStart: true }, { effect: 'Freeverb', requiresStart: false },
            { effect: 'Distortion', requiresStart: false }, { effect: 'Tremolo', requiresStart: true },
            { effect: 'Chebyshev', requiresStart: false }, { effect: 'PitchShift', requiresStart: false },
            { effect: 'Vibrato', requiresStart: false }
        ]
        this.bpm = 60;
        this.backgroundRecordingColor = '';
        this.effects = {
            pingPongDelay: false,
            reverb: false,
            distortion: false,
            chorus: false,
            tremolo: false,
            freeverb: false,
            pitchShift: false,
            vibrato: false,
            chebyshev: false
        }
        this.pingPongDelaySetting = {
            feedback: 0.2,
            delayTime: 0.4
        };
        this.pingPongDelay = null;
        this.reverbSetting = {
            decay: 50
        };
        this.reverb = null;
        this.distortionSetting = {
            distortion: 2
        }
        this.distortion = null;
        this.chorusSetting = {
            frequency: 0,
            delayTime: 0,
            depth: 0,
        };
        this.chorus = null;
        this.tremoloSetting = {
            frequency: 900,
            depth: 1,
        }
        this.tremolo = null;
        this.chebyshevSetting = {
            order: 80
        }
        this.chebyshev = null;
        this.vibratoSetting = {
            frequency: 81,
            depth: 1
        }
        this.vibrato = null;
        this.pitchShiftSetting = {
            pitch: 3
        }
        this.pitchShift = null;
        this.freeverbSetting = {
            roomSize: .9,
            dampening: 500
        }
        this.freeverb = null;
        this.icon = null;
    }

    getEffect(effectName) {
        return this.effects[effectName];
    }

    setEffect(val, effectName, valuesToUse = null) {
        this.effects[effectName] = val;
        if (!this.effects[effectName]) {
            this[effectName].dispose();
        } else {
            if (this[effectName] === null || this[effectName].disposed) {
                this.renewEffect(effectName, valuesToUse);
            }
            this.chainEffects();
        }
    }

    turnOffAllEffects() {
        for (const key in this.effects) {
            if (Object.hasOwnProperty.call(this.effects, key)) {
                const effectOn = this.effects[key];
                if (effectOn) {
                    this.setEffect(false, key);
                }
            }
        }
    }

    chainEffects(getBg = false) {
        let effects = [];
        let effectsBgClasses = [];
        for (const key in this.effects) {
            if (Object.hasOwnProperty.call(this.effects, key)) {
                const effectOn = this.effects[key];
                if (effectOn) {
                    effects.push(this[key]);
                    effectsBgClasses.push(this.effectBG.get(key));
                }
            }
        }
        if (getBg) {
            return effectsBgClasses;
        }

        this.sampler.fan(...effects);
    }

    renewEffect(effectName, valuesToUse) {
        let chosenEffect = this.availableEffects.find(x => x.effect.toLowerCase() === effectName.toLowerCase());

        if (chosenEffect) {
            let effectValues = valuesToUse || Object.values(this[`${effectName}Setting`]);
            this[effectName] = !chosenEffect.requiresStart ?
                new Tone[chosenEffect.effect](...effectValues).toDestination() :
                new Tone[chosenEffect.effect](...effectValues).toDestination().start()
        }
    }

    getBPM() {
        return this.bpm;
    }

    setBPM(val) {
        this.bpm = Number(val);
    }

    getSetting(effectName, setting) {
        return this[`${effectName}Setting`][setting];
    }

    setSetting(effectName, setting, val) {
        this[`${effectName}Setting`][setting] = Number(val);
        this[effectName].set(this[`${effectName}Setting`]);
    }

    isValidKey(keyCode) {
        return !!this.keys.find(key => key.dataKey === keyCode);
    }

    removeBG() {
        document.querySelector('#bg-wrapper').classList.forEach(x => {
            document.querySelector('#bg-wrapper').classList.remove(x);
        })
        document.querySelector('#bg-wrapper').style.filter = '';
    }

    playSound(keyCode, sampler, time = 0, cb = null) {
        this.removeBG();

        document.querySelector('#bg-wrapper').classList.add(this.type);

        document.querySelector('#bg-wrapper').style.filter = this.chainEffects(true).join(' ');

        if (!this.isValidKey(keyCode)) {
            return;
        }
        const now = Tone.now();
        if (!this.isChord) {
            let note = this.keys.find(key => key.dataKey === keyCode);
            sampler.triggerAttack(note.type, now + time);
        } else {
            let note = this.chords(this.scale).find(key => key.dataKey === keyCode);
            if (!note) return;
            if (!this.synthInstruments.includes(this.type)) {
                sampler.triggerAttack(note.notes, now + time);
            } else {
                let part = new Tone.Part((time, obj) => {
                    sampler.triggerAttackRelease(obj.note, 1, now + obj.time);
                })
                let time = 0;
                note.notes.forEach(x => {
                    time += .05
                    part.add(time, { time, note: x });
                })
                part.start();
                Tone.getTransport().start();
            }
        }

        let btn = document.querySelector(`div[data-key="${keyCode}"]`)
        btn.classList.add('playing');

        document.querySelector('#bg-wrapper').style.animation = `burst .3s ease-in-out`;
        if (cb) {
            cb()
        }
    }

    recordNote(obj) {
        let effectsUsed = [];
        for (const key in this.effects) {
            if (Object.hasOwnProperty.call(this.effects, key)) {
                const isUsing = this.effects[key];
                if (isUsing) {
                    effectsUsed.push({
                        effect: key,
                        settings: Object.values(this[`${key}Setting`])
                    })
                }
            }
        }
        if (!this.isValidKey(obj.key)) {
            return;
        }
        this.instrumentSong.push({ ...obj, effectsUsed, bpm: this.bpm });
        console.dir(this.instrumentSong);
    }

    getInstrumentSong() {
        return this.instrumentSong;
    }

    toggleChords(cb) {
        this.isChord = !this.isChord;
        this.createKeys(cb, this.isChord);
    }

    createKeys(cb, isChord = false) {
        this.parentElem.replaceChildren();
        let flexDiv = document.createElement('div');
        flexDiv.classList.add('flex', 'wrap');
        !isChord ? this.keys.forEach(element => this.buildKeys({ cb, flexDiv, element })) :
            this.chords().forEach(element => this.buildKeys({ cb, flexDiv, element }));
    }

    buildKeys({ cb, flexDiv, element }) {
        let keyDiv = document.createElement('div');
        keyDiv.addEventListener('click', cb);
        keyDiv.addEventListener('mousedown', (ev) => this.active = true);
        keyDiv.addEventListener('mouseup', (ev) => { this.active = false });
        keyDiv.addEventListener('mouseover', (ev) => { if (this.active) { cb.call(keyDiv, ev) } });
        keyDiv.setAttribute('data-key', element.dataKey);
        keyDiv.classList.add('key', 'clickable');
        let kBD = document.createElement('kbd');
        kBD.textContent = element.key.toUpperCase();
        let span = document.createElement('span');
        span.classList.add('sound');
        span.textContent = element.type;
        keyDiv.append(kBD, span);
        flexDiv.append(keyDiv);
        this.parentElem.append(flexDiv);
    }
}