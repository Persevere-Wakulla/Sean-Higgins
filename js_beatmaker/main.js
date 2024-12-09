import './style.css'
import Piano from "./regular_instruments/piano.js";
import Drums from "./regular_instruments/drums.js";
import Guitar from "./regular_instruments/guitar.js";
import MembraneSynth from "./synth_instruments/membraneSynth.js";
import PluckSynth from "./synth_instruments/pluckSynth.js";
import MonoSynth from "./synth_instruments/monoSynth.js";
import Synth from "./synth_instruments/synth.js";
import Song from "./song.js";
import { Menu } from './menus/menu.js';
import { Upperbar } from './menus/upperBar.js';
import ActionManager from './utils/actionManager.js';


const availableInstruments = new Map([
  [49, 'Drums'],
  [50, 'Piano'],
  [51, 'Guitar'],
  [52, 'MembraneSynth'],
  [53, 'PluckSynth'],
  [54, 'MonoSynth'],
  [55, 'Synth'],
]);
const availableEffects = new Map([
  [97, 'pingPongDelay'],
  [98, 'reverb'],
  [99, 'distortion'],
  [100, 'chorus'],
  [101, 'tremolo'],
  [102, 'chebyshev'],
  [103, 'vibrato'],
  [104, 'pitchShift'],
  [105, 'freeverb'],
]);

const recordBtn = document.querySelector('div[data-record]');
const playBtn = document.querySelector('svg[data-play]');
const instrumentElements = document.querySelectorAll('.instrument');
let currentInstrument = new Piano('piano', document.querySelector('.keys'));
const songCreated = new Song(currentInstrument);


const playSound = (ev, keyCode = null) => {
  if(ActionManager.isLoopDialogOpen()) return;
  Upperbar.closeMenu();

  if (songCreated.isEditingName) return;

  let selectedInstrument = availableInstruments.get(keyCode || ev.keyCode);
  if (!Upperbar.creatingLoop() && selectedInstrument) {
    createInstrument(selectedInstrument);
  }
  else if (selectedInstrument) {
    ActionManager.toastWarning('Cannot change instrument while creating loop')
    return;
  }

  let selectedEffect = availableEffects.get(keyCode || ev.keyCode);

  if (selectedEffect) {
    currentInstrument.setEffect(!currentInstrument.getEffect(selectedEffect), selectedEffect);
    Menu.createEffects(document.querySelector('#menu'))
  }

  switch (ev.keyCode) {
    case 16:
      ev.preventDefault();
      currentInstrument.toggleChords(handleKeyClick);
      return;
    case 27:
      ev.preventDefault();
      Menu.toggleMenu(document.querySelector('#menu'), document.querySelector('.instrument-menu'), createInstrumentHandlers);
      break;
    case 32:
      ev.preventDefault();
      if (!Upperbar.creatingLoop()) {
        songCreated.record(ev);
      }
      else {
        ActionManager.toastWarning('Cannot record while creating a loop')
      }
      return;
    case 187:
      if (currentInstrument.scale < 8)
        currentInstrument.scale++;
      return;
    case 189:
      if (currentInstrument.scale > 0)
        currentInstrument.scale--;
      return;
  }

  currentInstrument.playSound(keyCode ?? ev.keyCode);
  if (songCreated.isRecording) {
    songCreated.pushNote(ev, keyCode);
  }
  if (Upperbar.creatingLoop()) {
    let loop = Upperbar.getCurrentLoop();
    loop.addPart(ev.keyCode || keyCode)
  }
}

document.querySelector('#songName').addEventListener('focus', () => songCreated.setIsEditingName(true))
document.querySelector('#songName').addEventListener('focusout', () => songCreated.setIsEditingName(false))
document.querySelector('#songName').addEventListener('keyup', songCreated.setSongName.bind(songCreated))

document.querySelector('#download').addEventListener('click', songCreated.handleDownload.bind(songCreated))

function setInstrumentIcon() {
  document.querySelector('#currentInstrumentImg').src = currentInstrument.icon;
}
setInstrumentIcon();

recordBtn.addEventListener('click', (event) => songCreated.record(event));
playBtn.addEventListener('click', () => songCreated.playSong(0, 500));

instrumentElements.forEach(elem => {
  elem.addEventListener('click', createInstrument)
})

window.addEventListener('transitionend', (ev) => {
  ev.target.classList.remove('playing');
})

window.addEventListener('keyup', playSound);

window.addEventListener('load', () => {
  currentInstrument.createKeys(handleKeyClick);
  songCreated.instrumentsUsed.push(currentInstrument);
  ActionManager.setCurrentSong(songCreated);
  Menu.createMenu(document.querySelector('#menu'), createInstrumentHandlers);
  Upperbar.createUpperBar();
});

document.querySelector('#bg-wrapper').addEventListener('click', () => {
  Upperbar.closeMenu()
  Menu.closeMenu();
})

function handleKeyClick(ev) {
  playSound(ev, Number(this.dataset.key))
}

window.addEventListener("animationend", () => {
  document.querySelector('#bg-wrapper').style.animation = 'unset';
});


function createInstrument(type) {
  let instrumentType = type || this.outerText;
  let existingInstrument = songCreated.instrumentsUsed.find(x => x.type === instrumentType.toLowerCase());
  if (existingInstrument) {
    currentInstrument = existingInstrument;
    songCreated.setInstrument(currentInstrument);
    currentInstrument.createKeys(handleKeyClick);
  }
  else {
    currentInstrument = ActionManager.createInstrumentInstance(instrumentType, document.querySelector('.keys'));
    songCreated.instrumentsUsed.push(currentInstrument);
    songCreated.setInstrument(currentInstrument);
    currentInstrument.createKeys(handleKeyClick);
  }
  if (Menu.isEffectsOpen()) {
    Menu.createEffects(document.querySelector('#menu'))
  }
  currentInstrument.removeBG();
  setInstrumentIcon();
  songCreated.getAllInstruments();
  Upperbar.checkEditNeedsRedraw();
}

function createInstrumentHandlers() {
  document.querySelectorAll('.menu-btn').forEach(element => {
    element.addEventListener('click', function () {
      if (!Upperbar.creatingLoop()) {
        createInstrument.call(this);
      } else {
        ActionManager.toastWarning('Cannot change instrument while creating loop');
      }
    });
  });
}
