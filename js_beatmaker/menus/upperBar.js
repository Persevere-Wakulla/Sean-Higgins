import Loop from "../loop.js";
import ActionManager from "../utils/actionManager.js";

export class Upperbar {

    static #menuElem = null;
    static #keepOpen = {edit: false, loop: false};
    static #currentSong = null;
    static #activeEdit = false;
    static #isCreatingLoop = false;
    static #loop = null;

    static #isOpen() {
        return this.#menuElem.classList.contains('open');
    }

    static getCurrentLoop(){
        return this.#loop;
    }

    static #createHandlers(elem) {
        let toggleMenu = elem.querySelector('.upperbar-menu-toggle-switch');
        elem.querySelectorAll('.side-bar-selections').forEach(div => {
            div.addEventListener('click', (e) => this.#handleClick(div.id, toggleMenu, elem))
        });
        let keepEditOpenElem = elem.querySelector('#keepEditOpen');
        keepEditOpenElem.addEventListener('change', () => {
            this.#keepOpen.edit = keepEditOpenElem.checked;
        })
        let keepLoopOpenElem = elem.querySelector('#keepLoopOpen');
        keepLoopOpenElem.addEventListener('change', () => {
            this.#keepOpen.loop = keepLoopOpenElem.checked;
        })
        let createLoop = elem.querySelector('#loop-create');
        let stopLoop = elem.querySelector('#loop-stop');
        let playLoop = elem.querySelector('#loop-play');
        let saveLoopIcon = elem.querySelector('#save-loop-icon');
        elem.querySelector('#loop-play').addEventListener('click', () => {
        })
        document.querySelector('#loop-name').addEventListener('keydown', (e) =>{
            if(e.keyCode === 32){
                e.preventDefault();
                return;
            }
        })

        createLoop.addEventListener('click', () => {
            this.#isCreatingLoop = true;
            this.#loop = new Loop(this.#currentSong.currentInstrument.type);
            document.querySelector('#loop-name').classList.remove('hide');
            createLoop.classList.add('hide');
            stopLoop.classList.remove('hide');
        })
        stopLoop.addEventListener('click', () => {
            this.#isCreatingLoop = false;
            stopLoop.classList.add('hide');
            createLoop.classList.remove('hide');
        })
        playLoop.addEventListener('click', () => {
            if(!this.#loop){
                ActionManager.toastInfo('Must either create a loop or load an existing loop to play');
                return;
            }
            // if(!this.#loop.currentLoop.length){
            //     ActionManager.toastInfo('No notes in current loop to play!');
            //     return;
            // }
            this.#loop.playLoop();
        })
        this.#createLoopDropdownAction();

        document.querySelector('#loop-bpm').addEventListener('change', (e) => {
            document.querySelector('#loop-bpm-value').textContent = e.target.value;
        })

        saveLoopIcon.addEventListener('click', () => {
            if(!this.#loop){
                ActionManager.toastInfo('Must create a loop before trying to save it');
                return;
            }
            if(this.#loop.loopName !== ''){
                this.#loop.saveLoop();
                ActionManager.toastInfo(`Exisiting loop ${this.#loop.loopName} updated`);
                return;
            }
            document.querySelector('#save-loop').showModal();
            ActionManager.setLoopDialogStatus(true);
        })

        document.querySelector('#loop-dialog-close-icon').addEventListener('click', ()=> {
            ActionManager.setLoopDialogStatus(false);
            document.querySelector('#save-loop').close();
        })

        document.querySelector('#save-loop-dialog-icon').addEventListener('click', () => {
            document.querySelector('#loop-name').classList.remove('error')
            let loopName = document.querySelector('#loop-name').value;
            if(loopName === ''){
                document.querySelector('#loop-name').classList.add('error')
                return;
            }
            this.#loop.setName(loopName);
            this.#loop.saveLoop();
            document.querySelector('#save-loop').close();
            ActionManager.toastInfo('Loop saved');
        })
        
    }

    static #createLoopDropdownAction() {
        this.#menuElem.querySelector('#loopDropdown').addEventListener('click', () => {
            this.#menuElem.querySelector('#loopDropdown').innerHTML = `
                ${this.#createLoopDropdown()}
            `
        })
        this.#menuElem.querySelector('#loopDropdown').addEventListener('change', this.#handleDropdownChange.bind(this));
    }

    static #createEdit() {
        let bodyElem = this.#menuElem.querySelector('#body');
        bodyElem.innerHTML += `
        <div id="edit" class="song-editor col">
            <div class="flex space-between">
                <div class="flex small-gap align-center ">
                <input id="keepEditOpen" type="checkbox">
                    <h6>Keep Open</h6>
                </div>
                <input type="text" class="edit-input" placeholder="Song Name" />
                <div>
                    <svg class="save-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy2-fill" viewBox="0 0 16 16">
                        <path d="M12 2h-2v3h2z"/>
                        <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
                    </svg>
                </div>
            </div>
            ${this.#drawInstruments()}
            <div id="edit" class="song-container open">
                <div class="song-position"></div>
                <div class="song-sounds-container">
                    <div class="song-sound"></div>
                </div>
            </div>
        </div>
        `;
        this.#createInstrumentHandlers(bodyElem.querySelector('#instrument-layers'))
    }

    static #getLoops() {
        return JSON.parse(localStorage.getItem('loops')) || [];
    }

    static #createLoopDropdown() {
        let options = `<option value="default">Load exisiting Loop</option>`;
        options += this.#getLoops().map(x =>
            `<option value=${x.name}>${x.name}</option>`).join('')
        return options
    }

    static #handleDropdownChange(ev){
        if(ev.target.value === "")
            return;
        if(!this.#loop){
            this.#loop = new Loop();
        }
        this.#loop.loadLoop(ev.target.value);
    }

    static #createLoop() {
        let bodyElem = this.#menuElem.querySelector('#body');
        bodyElem.innerHTML += `
        <dialog id="save-loop">
            <div class="flex space-between">
                <h4>Save Loop</h4>
                <img id="loop-dialog-close-icon" src="./assets/close.svg" />
            </div>
            <div class="loop-dialog-body"> 
                <input id="loop-name" type="text" placeholder="Song Name..." />
            </div>
            <div class="loop-dialog-footer">
                <svg id="save-loop-dialog-icon" class="save-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy2-fill" viewBox="0 0 16 16">
                    <path d="M12 2h-2v3h2z"/>
                    <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
                </svg>
            </div>
        </dialog>
        <div id="loop" class="loop-container flex col gap">
            <div class="flex space-between">
                <h3>Loop Creation Tool</h3>
                <div class="flex small-gap align-center ">
                    <input id="keepLoopOpen" type="checkbox">
                    <h6>Keep Open</h6>
                </div>
            </div>
            
            <div class="flex gap wrap">
                <div id="loop-create"  class="loop-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                        d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                    </svg>Create
                </div>
                <div id="loop-stop"  class="loop-btn hide">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-stop-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5z"/>
                    </svg>Finish
                </div>
                <div id="loop-play" class="loop-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                        <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                        <path
                            d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                    </svg>Play
                </div>
                <select id="loopDropdown">
                    ${this.#createLoopDropdown()}
                </select>
                <div class="flex align-center">
                    <svg id="save-loop-icon" class="save-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy2-fill" viewBox="0 0 16 16">
                        <path d="M12 2h-2v3h2z"/>
                        <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
                    </svg>
                </div>
            </div>
            <div class="flex gap">
                <label>BPM: <b id="loop-bpm-value">60</b></label>
                <input id="loop-bpm" step="1" min="10" max="250" type="range" />
            </div>
        </div>
        `;
    }

    static #createLoad() {
        let bodyElem = this.#menuElem.querySelector('#body');
        bodyElem.innerHTML += `
        <div id="load" class="load-container">
            <h6>Load</h6>
        </div>
        `;
    }

    static #createSections() {
        this.#createEdit();
        this.#createLoop();
        this.#createLoad();
    }

    static #handleClick(id, ...args) {
        let clickedElement = id;
        args.forEach(x => {
            x.classList.contains('upperbar-menu-toggle-switch') ?
                x.classList.add('close') :
                x.classList.add('open');
        });
        let sections = this.#menuElem.querySelector('#body').querySelectorAll('div[id]');

        sections.forEach(x => {
            x.id === clickedElement ? x.classList.add('openMenu') : x.classList.remove('openMenu');
        });
    }

    static creatingLoop() {
        return this.#isCreatingLoop;
    }

    static createUpperBar() {
        this.#currentSong = ActionManager.getCurrentSong();
        if (!this.#currentSong) {
            ActionManager.toastWarning('No song was applied during creation')
        }
        let upperBarContainer = document.createElement('div');
        upperBarContainer.classList.add('upperbar');
        upperBarContainer.innerHTML = `
            <div class="upperbar-menu">
                <div class="upperbar-menu-toggle-switch">
                    <div class="upperbar-menu-toggle-switch-menu-items flex col gap">
                        <div class="side-bar-selections"  id="edit">
                        <h5 class="upperbar-menu-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                        </svg>
                                Edit Song
                            </h5>
                        </div>
                        <div class="side-bar-selections" id="loop">
                        <h5 class="upperbar-menu-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16">
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
                        </svg>
                                Create Loop
                            </h5>
                        </div>
                        <div class="side-bar-selections" id="load">
                        <h5 class="upperbar-menu-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z"/>
                        </svg>
                                Load Song
                            </h5>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                    </svg>
                </div>
                <div class="flex gap" id="body"></div>
            </div>
        `;
        this.#menuElem = upperBarContainer;
        this.#createSections();
        
        document.body.append(upperBarContainer);

        this.#createHandlers(upperBarContainer);

    }

    static closeMenu() {
        if (this.#isOpen() && (!this.#keepOpen.edit && !this.#keepOpen.loop)) {
            let toggleMenu = this.#menuElem.querySelector('.upperbar-menu-toggle-switch');
            this.#menuElem.classList.remove('open');
            toggleMenu.classList.remove('close');
        }
    }

    static checkEditNeedsRedraw() {
        let parent = document.querySelector('#instrument-layers');
        let alreadyDrawn = this.#currentSong.instrumentsUsed.every(x => parent.querySelector(`#${x.type}`));
        if (!alreadyDrawn) {
            parent.innerHTML = this.#instrumentIcons();
            this.#createInstrumentHandlers(parent);
        }
    }

    static #drawInstruments() {
        return `
        <h6>Select Instrument layer to edit</h6>
        <div id="instrument-layers" class="flex gap wrap">
            ${this.#instrumentIcons()}
        </div>
        `
    }

    static #createDefaultSelector() {
        return `<img id="all" class="edit-instruments-icon" src="./assets/All.png" />`
    }

    static #instrumentIcons() {
        let string = this.#createDefaultSelector();
        return string += this.#currentSong.instrumentsUsed.map(x => `<img id=${x.type} class="edit-instruments-icon" src=${x.icon} />`).join('')
    }

    static #createInstrumentHandlers(parent) {
        parent.querySelectorAll('img').forEach(elem => {
            elem.addEventListener('click', () => {
                const soundBars = Array.from(document.querySelectorAll(`div[data-instrument-type]`));
                soundBars.forEach(x => {
                    x.style.visibility = elem.id === 'all' ? 'visible' : x.dataset.instrumentType !== elem.id ?
                        'hidden' : 'visible';
                })
            })
        })
    }

    static createSoundBar() {
        let numOfCurrentSounds = this.#currentSong.currentInstrument.getInstrumentSong().filter(sound => sound.songPosition === this.#currentSong.songPosition);

        let divSound = document.createElement('div');
        let currentSongPosition = this.#currentSong.songPosition;
        divSound.setAttribute('id', this.#currentSong.songPosition);
        divSound.addEventListener('mousedown', () => this.#activeEdit = true);
        divSound.addEventListener('mouseup', () => this.#activeEdit = false);
        divSound.addEventListener('mouseover', () => {
            if (this.#activeEdit) {
                divSound.classList.add('active');
            }
        });
        divSound.addEventListener('click', () => { this.#currentSong.setSongPosition(currentSongPosition) })
        divSound.classList.add('song-sound');
        let soundHeight = numOfCurrentSounds.length * 5 > 100 ? 95 : numOfCurrentSounds.length * 5;
        divSound.style.height = soundHeight > 0 ? `${soundHeight}px` : '100px';
        divSound.style.left = `${this.#currentSong.songPosition}px`
        divSound.style.backgroundColor = soundHeight > 0 ? this.#currentSong.currentInstrument.backgroundRecordingColor : 'transparent';
        divSound.setAttribute('data-instrument-type', soundHeight > 0 ? this.#currentSong.currentInstrument.type : 'blank');
        if (!soundHeight > 0) {
            divSound.style.borderColor = 'transparent';
        }
        document.querySelector('.song-sounds-container').append(divSound);
    }
}
