import ActionManager from "../utils/actionManager.js";

export class Menu {
  static #availableEffects = ['pingPongDelay', 'reverb', 'distortion', 'chorus', 'tremolo', 'freeverb', 'pitchShift', 'vibrato', 'chebyshev'];
  static #instruments = [{
    type: 'Drums',
    imgSrc: './assets/drumsAlt.png'
  },
  {
    type: 'Piano',
    imgSrc: './assets/grand.png'
  },
  {
    type: 'Guitar',
    imgSrc: './assets/guitarAlt.png'
  },
  {
    type: 'MembraneSynth',
    imgSrc: './assets/synthAlt.png'
  },
  {
    type: 'PluckSynth',
    imgSrc: './assets/note.png'
  },
  {
    type: 'MonoSynth',
    imgSrc: './assets/symbal.png'
  },
  {
    type: 'Synth',
    imgSrc: './assets/synth.png'
  }
  ]
  static #currentSong = null;
  static #effects = (song) => [{
    element: `<input step="1" min="1" max="400" class="input-control" id="bpm" value=${song.currentInstrument.getBPM()} type="range" />`,
    label: 'BPM (1-400)',
    id: 'bpm',
    wrapperClasses: ['flex', 'gap']
  },
  {
    element: `<input class="input-control" id="pingPongDelay" type="checkbox" />`,
    label: 'Ping Pong Delay',
    id: 'pingPongDelay',
    children: function () {
      let usingPong = song.currentInstrument.getEffect('pingPongDelay');
      return `
      <div id="pingPongDelay-container" class="${usingPong ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="pong-feedback">Pong Feedback</label>
          <input step=".1" min="0" max="1" value="${song.currentInstrument.getSetting('pingPongDelay', 'feedback')}" id="pong-feedback"  type="range">
        </div>
        <div class="flex gap">
          <label class="effect-label" for="pong-feedback">Pong Delay</label>
          <input step=".1" min="0" max="1" value="${song.currentInstrument.getSetting('pingPongDelay', 'delayTime')}" id="pong-delayTime"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  },
  {
    element: `<input class="input-control" id="reverb" type="checkbox" />`,
    label: 'Reverb',
    id: 'reverb',
    children: function () {
      let usingReverb = song.currentInstrument.getEffect('reverb');
      return `
      <div id="reverb-container" class="${usingReverb ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="pong-feedback">Reverb Decay</label>
          <input step=".5" min="0" max="500" value="${song.currentInstrument.getSetting('reverb', 'decay')}" id="reverb-decay"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  },
  {
    element: `<input class="input-control" id="distortion" type="checkbox" />`,
    label: 'Distortion',
    id: 'distortion',
    children: function () {
      let usingDistortion = song.currentInstrument.getEffect('distortion');
      return `
      <div id="distortion-container" class="${usingDistortion ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="pong-feedback">Distortion Amount</label>
          <input step=".1" min="0" max="5" value="${song.currentInstrument.getSetting('distortion', 'distortion')}" id="distortion-distortion"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  },
  {
    element: `<input class="input-control" id="chorus" type="checkbox" />`,
    label: 'Chorus',
    id: 'chorus',
    children: function () {
      let usingChorus = song.currentInstrument.getEffect('chorus');
      return `
      <div id="chorus-container" class="${usingChorus ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="chorus-frequency">Chorus Frequency</label>
          <input step=".5" min="0" max="500" value="${song.currentInstrument.getSetting('chorus', 'frequency')}" id="chorus-frequency"  type="range">
        </div>
        <div class="flex gap">
          <label class="effect-label" for="chorus-delay">Chorus Delay</label>
          <input step=".5" min="0" max="500" value="${song.currentInstrument.getSetting('chorus', 'delayTime')}" id="chorus-delayTime"  type="range">
        </div>
        <div class="flex gap">
          <label class="effect-label" for="chorus-depth">Chorus Depth</label>
          <input step=".5" min="0" max="500" value="${song.currentInstrument.getSetting('chorus', 'depth')}" id="chorus-depth"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  },
  {
    element: `<input class="input-control" id="tremolo" type="checkbox" />`,
    label: 'Tremolo',
    id: 'tremolo',
    children: function () {
      let usingTremolo = song.currentInstrument.getEffect('tremolo');
      return `
      <div id="tremolo-container" class="${usingTremolo ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="tremolo-delay">Tremolo Delay</label>
          <input step=".5" min="0" max="500" value="${song.currentInstrument.getSetting('tremolo', 'delayTime')}" id="tremolo-delayTime"  type="range">
        </div>
        <div class="flex gap">
          <label class="effect-label" for="tremolo-depth">Tremolo Depth</label>
          <input step=".1" min="0" max="1" value="${song.currentInstrument.getSetting('tremolo', 'depth')}" id="tremolo-depth"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  },
  {
    element: `<input class="input-control" id="freeverb" type="checkbox" />`,
    label: 'Freeverb',
    id: 'freeverb',
    children: function () {
      let usingFreeverb = song.currentInstrument.getEffect('freeverb');
      return `
      <div id="freeverb-container" class="${usingFreeverb ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="freeverb-roomSize">Freeverb Roomsize</label>
          <input step=".1" min="0" max=".9" value="${song.currentInstrument.getSetting('freeverb', 'roomSize')}" id="freeverb-roomSize"  type="range">
        </div>
        <div class="flex gap">
          <label class="effect-label" for="freeverb-dampening">Freeverb Dampening</label>
          <input step="1" min="0" max="1000" value="${song.currentInstrument.getSetting('freeverb', 'dampening')}" id="freeverb-dampening"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  },
  {
    element: `<input class="input-control" id="pitchShift" type="checkbox" />`,
    label: 'Pitch Shift',
    id: 'pitchShift',
    children: function () {
      let usingPitchShift = song.currentInstrument.getEffect('pitchShift');
      return `
      <div id="pitchShift-container" class="${usingPitchShift ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="pitchShift-pitch">Pitch</label>
          <input step="1" min="0" max="500" value="${song.currentInstrument.getSetting('pitchShift', 'pitch')}" id="pitchShift-pitch"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  },
  {
    element: `<input class="input-control" id="vibrato" type="checkbox" />`,
    label: 'Vibrato',
    id: 'vibrato',
    children: function () {
      let usingVibrato = song.currentInstrument.getEffect('vibrato');
      return `
      <div id="vibrato-container" class="${usingVibrato ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="vibrato-roomSize">Vibrato Frequency</label>
          <input step="1" min="0" max="500" value="${song.currentInstrument.getSetting('vibrato', 'frequency')}" id="vibrato-frequency"  type="range">
        </div>
        <div class="flex gap">
          <label class="effect-label" for="vibrato-dampening">Vibrato Depth</label>
          <input step=".1" min="0" max="1" value="${song.currentInstrument.getSetting('vibrato', 'depth')}" id="vibrato-depth"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  },
  {
    element: `<input class="input-control" id="chebyshev" type="checkbox" />`,
    label: 'Chebyshev',
    id: 'chebyshev',
    children: function () {
      let usingChebyshev = song.currentInstrument.getEffect('chebyshev');
      return `
      <div id="chebyshev-container" class="${usingChebyshev ? 'flex' : 'hide'} col gap"> 
        <div class="flex gap">
          <label class="effect-label" for="chebyshev-roomSize">Chebyshev Order</label>
          <input step="1" min="0" max="500" value="${song.currentInstrument.getSetting('chebyshev', 'order')}" id="chebyshev-order"  type="range">
        </div>
      </div>
      `
    },
    wrapInput: function (position) {
      if (this.hasOwnProperty('children')) {
        return position === 'start' ? '<div class="flex gap">' : '</div>'
      }
      return '';
    },
    wrapperClasses: ['flex', 'gap', 'col']
  }
  ]
  static #instrumentsIsOpen = false;
  static #effectsIsOpen = false;

  static createInstruments = (elem, cb) => {
    let menuBodyElem = elem.querySelector('.menu-body');
    menuBodyElem.replaceChildren();
    menuBodyElem.innerHTML = this.#instruments.map((instrument) => {
      return `
        <div class="menu-btn">
          <img class="menu-btn-icon" src="${instrument.imgSrc}">
          ${instrument.type}
        </div>`
    }).join().replaceAll(',', '');
    if (cb) {
      cb();
    }
  }

  static closeMenu() {
    let menuElem = document.querySelector('.instrument-menu');
    menuElem.classList.remove('open');
    this.#effectsIsOpen = false;
    this.#instrumentsIsOpen = false;
  }

  static isEffectsOpen() {
    return this.#effectsIsOpen;
  }

  static toggleMenu(menuElem, elem, cb) {
    if (this.#effectsIsOpen) {
      this.#instrumentsIsOpen = true;
      this.#effectsIsOpen = !this.#effectsIsOpen;
      this.createInstruments(elem, cb);
    }
    else if (menuElem.classList.contains('open')) {
      this.#instrumentsIsOpen = false;
      menuElem.classList.remove('open');
    }
    else {
      this.#instrumentsIsOpen = true;
      menuElem.classList.add('open');
      this.createInstruments(elem, cb);
    }
  }

  static createMenu(elem, cb) {
    this.#currentSong = ActionManager.getCurrentSong();
    elem.innerHTML = `
      <div class="menu-control">Instruments</div>
      <div class="menu-control effects-control">Effects</div>
      <div class="flex wrap align-center menu-body">
      </div>
      `
    let menuElem = document.querySelector('.instrument-menu');

    elem.querySelector('.menu-control').addEventListener('click', () => this.toggleMenu(menuElem, elem, cb))
    elem.querySelector('.effects-control').addEventListener('click', () => {
      if (this.#instrumentsIsOpen) {
        this.#effectsIsOpen = true;
        this.#instrumentsIsOpen = !this.#instrumentsIsOpen;
        this.createEffects(elem);
      }
      else if (menuElem.classList.contains('open')) {
        this.#effectsIsOpen = false;
        menuElem.classList.remove('open');
      }
      else {
        this.#effectsIsOpen = true;
        menuElem.classList.add('open');
        this.createEffects(elem);
      }
    })
  }

  static createEffects = (elem) => {
    let menuBodyElem = elem.querySelector('.menu-body');
    menuBodyElem.replaceChildren();
    menuBodyElem.innerHTML = this.#effects(this.#currentSong).map((effect) => {
      return `
        <div class="menu-btn ${effect.wrapperClasses.join().replaceAll(',', ' ')}">
          ${effect.wrapInput?.('start') ?? ''}
          <label class="effect-label" for=${effect.id}>${effect.label}</label>
          ${effect.element}
          ${effect.wrapInput?.('end') ?? ''}
          ${effect.children?.() ?? ''}
        </div>`
    }).join('');

    this.#availableEffects.forEach(x => {
      let elem = menuBodyElem.querySelector(`#${x}`);
      if (this.#currentSong.currentInstrument.getEffect(x)) {
        elem.setAttribute('checked', true);
      }
      elem.addEventListener('change', (ev) => {
        let inputContainer = menuBodyElem.querySelector(`#${x}-container`);
        inputContainer.classList.contains('hide') ?
          inputContainer.classList.replace('hide', 'flex') :
          inputContainer.classList.replace('flex', 'hide');

        this.#currentSong.currentInstrument.setEffect(ev.target.checked, x);
      });

      let containerElem = elem.parentElement.parentElement.querySelector(`#${x}-container`);
      containerElem.querySelectorAll('input').forEach(elem => {
        let id = elem.id.split('-')[1];

        elem.addEventListener('change', (ev) => {
          this.#currentSong.currentInstrument.setSetting(x, id, ev.target.value);
        })
      })
    })

    menuBodyElem.querySelector('#bpm')?.addEventListener('change', (ev) => {
      this.#currentSong.currentInstrument.setBPM(ev.target.value);
    });
  }
}
