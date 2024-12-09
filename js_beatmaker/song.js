import * as Tone from "tone";
import Toast from "./utils/toast.js";
import { Upperbar } from "./menus/upperBar.js";

export default class Song {
    constructor(currentInstrument) {
        this.currentInstrument = currentInstrument;
        this.instrumentsUsed = [];
        this.currentSong = [];
        this.isRecording = false;
        this.isEditingName = false;
        this.recordingDisabled = false;
        this.recordStartedTimeStamp = null;
        this.recordBtn = document.querySelector('div[data-record]');
        this.playBtn = document.querySelector('div[data-play]');
        this.recorder = new Tone.Recorder();
        this.recordingInterval = 0;
        this.songPlayingInterval = 0;
        this.songPosition = 0;
        this.songLength = 0;
        this.songName = null;
        this.isDownloading = false;
        this.toast = new Toast();
    }

    toggleRecording() {
        this.isRecording = !this.isRecording;
        this.recordBtn.classList.toggle('recording');
    }

    setRecordStartedTimeStamp(timestamp) {
        this.recordStartedTimeStamp = timestamp;
    }

    setInstrument(newInstrument) {
        this.currentInstrument = newInstrument;
    }

    setSongPosition(position) {
        this.songPosition = position;
        document.querySelector('.song-position').style.right = `calc(100% - ${position + 4}px)`
        
    }

    setIsEditingName(val) {
        this.isEditingName = val;
    }

    setSongName({ target }) {
        this.songName = target.value;
    }

    getAllInstruments() {
        return this.instrumentsUsed.filter(instrument => instrument.instrumentSong.length > 0);
    }

    getCurrentSong() {
        return this.currentSong;
    }

    pushNote(ev, keyCode) {
        let keyNote = keyCode ?? ev.keyCode;
        let noteOfficial = undefined;
        noteOfficial = !this.currentInstrument.isChord ? this.currentInstrument.keys.find(key => key.dataKey === keyNote)
            :  this.currentInstrument.chords(this.currentInstrument.scale).find(key => key.dataKey === keyNote);
        if (noteOfficial === undefined) return;

        if (this.currentInstrument.instrumentSong.length > 0) {
            this.currentInstrument.recordNote(
                {
                    key: keyCode ?? ev.keyCode,
                    type: noteOfficial.type,
                    timeStamp: ev.timeStamp,
                    isChord: this.currentInstrument.isChord,
                    chords: noteOfficial?.notes,
                    songPosition: this.songPosition,
                    isEmptySpace: false,
                    tempo: Math.ceil(ev.timeStamp - this.currentInstrument.instrumentSong[this.currentInstrument.instrumentSong.length - 1].timeStamp),
                    instrument: this.currentInstrument.type
                }
            )
        } else {
            let timeBetweenRecordAndStart = ev.timeStamp - this.recordStartedTimeStamp;
            this.currentInstrument.recordNote({
                key: 0,
                type: noteOfficial.type,
                songPosition: -1,
                isChord: this.currentInstrument.isChord,
                chords: noteOfficial?.notes,
                isEmptySpace: true,
                timeStamp: ev.timeStamp,
                tempo: timeBetweenRecordAndStart,
                instrument: this.currentInstrument.type
            })
            this.currentInstrument.recordNote({
                key: keyCode ?? ev.keyCode,
                type: noteOfficial.type,
                isChord: this.currentInstrument.isChord,
                chords: noteOfficial?.notes,
                songPosition: this.songPosition,
                isEmptySpace: false,
                timeStamp: ev.timeStamp,
                tempo: 500,
                instrument: this.currentInstrument.type
            })
        }
    }

    async playPart(position) {
        let max = Math.max(...this.currentSong.map(part => part.songPosition));
        if (position >= max + 2) {
            if (this.isDownloading) {
                const recording = await this.recorder.stop();
                const url = URL.createObjectURL(recording);
                const anchor = document.createElement('a');
                if (this.songName) {
                    this.songName += '.webm';
                }

                anchor.download = this.songName || 'song.webm';
                anchor.href = url;
                anchor.click();
                this.cleanup();
            }
            return;
        }

        let currentNotes = this.currentSong.filter(x => x.songPosition === position).map((x, index) => {
            if (position === 0 && index === 0) {
                return {
                    note: x.type,
                    time: 0,
                    velocity: 0.5,
                    ...x
                }
            }
            return {
                note: x.type,
                time: x.tempo / 1000,
                velocity: 1,
                ...x
            }
        })
        let timeLapse = 0;
        let parts = [];
        this.instrumentsUsed.forEach(x => {
            parts.push({
                instrument: x.type,
                part: new Tone.Part((_, obj) => {
                    obj.index === 0 ? timeLapse = 0 : timeLapse += obj.time;
                    this.triggerNote(x.type, timeLapse, obj);
                })
            });
        });

        this.instrumentsUsed.forEach(x => {
            currentNotes.filter(note => note.instrument === x.type).forEach((note, index) => {
                parts.find(part => part.instrument.toLowerCase() === note.instrument.toLowerCase()).part.add('0', { ...note, index })

            })
        })
        parts.forEach(x => {
            x.part.start();
        })
        Tone.getTransport().start();

        setTimeout(() => {
            Tone.getTransport().stop();
            parts.forEach(x => {
                x.part.clear();
            })

            position += 2;
            this.playPart(position);
        }, 1000);
    }

    handleDownload() {
        if (!this.songName || !this.getAllInstruments().some(x => x.instrumentSong.length)) {
            this.toast.warning('Please type in a song name and record a song');
            return;
        }
        this.isDownloading = true;
        this.playSong(0, 0);
    }

    triggerNote(type, time, obj) {
        let cbInstruments = ['piano', 'guitar', 'drums']
        const now = Tone.now();
        let instrument = this.instrumentsUsed.find(x => x.type === type);
        let sampler = instrument.getNewSampler(executeTrigger);
        let effects = [];
        obj.effectsUsed.forEach(x => {
            effects.push(this.getEffect(x.effect, x.settings, instrument));
        })
        sampler.fan(...effects, this.recorder);
        function executeTrigger() {
            if(!obj.isChord){
                obj.index > 0 ?
                    sampler.triggerAttackRelease(obj.note, 2, now + time) :
                    sampler.triggerAttackRelease(obj.note, 2, now);
            }
            else{
                if (!instrument.synthInstruments.includes(type)) {
                    obj.index > 0 ?
                        sampler.triggerAttackRelease(obj.chords, 2, now + time) :
                        sampler.triggerAttackRelease(obj.chords, 2, now);
                } else {
                    let part = new Tone.Part((time, obj) => {
                        sampler.triggerAttackRelease(obj.note, 1, now + obj.time);
                    })
                    let time = 0;
                    obj.chords.forEach(x => {
                        time += .05
                        part.add(time, { time, note: x });
                    })
                    part.start();
                    Tone.getTransport().start();
                }
            }

        }
        if (!cbInstruments.includes(instrument.type)) {
            executeTrigger();
        }

    }

    getEffect(effectName, valuesToUse, instrument) {
        let chosenEffect = instrument.availableEffects.find(x => x.effect.toLowerCase() === effectName.toLowerCase());

        if (chosenEffect) {
            let effectValues = valuesToUse || Object.values(this[`${effectName}Setting`]);
            return !chosenEffect.requiresStart ?
                new Tone[chosenEffect.effect](...effectValues).toDestination() :
                new Tone[chosenEffect.effect](...effectValues).toDestination().start()
        }
    }

    moveTimeTrackerKnob() {
        // if (this.songPlayingInterval === 0) {
            let dialPosition = 0;
            let maxSongPosition = this.songLength * 2;
            document.querySelector('.song-position').style.right = `calc(100% - ${dialPosition}px)`
            this.songPlayingInterval = setInterval(() => {
                if (maxSongPosition >= dialPosition) {
                    dialPosition += 2;
                    this.songPosition = dialPosition;
                    document.querySelector('.song-position').style.right = `calc(100% - ${dialPosition}px)`
                } else {
                    clearInterval(this.songPlayingInterval);
                }
            }, 1000);
        // }
    }

    async playSong(index, tempo) {
        let instrumentsUsed = this.getAllInstruments();
        let instrumentSongs = instrumentsUsed.map(instrument => instrument.instrumentSong).flat();
        if (!instrumentSongs.length) {
            return;
        }
        else {
            this.instrumentsUsed.forEach(x => x.turnOffAllEffects());
            this.recordingDisabled = true;
            this.setSongPosition(0);
            this.currentSong = instrumentSongs;
            this.moveTimeTrackerKnob();
            if (this.isDownloading) {
                this.recorder.start();
            }
            await this.playPart(index); 
            this.recordingDisabled = false;
        }
    }
    cleanup() {
        this.recordingDisabled = false;
        this.isDownloading = false;
    }

    record(ev) {
        if (!this.recordingDisabled) {
            this.toggleRecording();
            this.setRecordStartedTimeStamp(ev.timeStamp);
            if (this.isRecording) {
                this.recordingInterval = setInterval(() => {
                    Upperbar.createSoundBar();
                    this.songPosition += 2;
                    if (this.songLength * 2 === this.songPosition) {
                        this.songLength += 1;
                    }
                    document.querySelector('.song-position').style.right = `calc(100% - ${this.songPosition}px)`
                    this.songLength++;
                }, 1000);
            } else {
                clearInterval(this.recordingInterval);
            }
        }
    }
}