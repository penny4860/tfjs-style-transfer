
import 'babel-polyfill';

// ImageElement class
// UI : stylize button 관련된 동작을 정의
// Model : tensorflow model 관련된 종작을 정의

import StyleModel from './stylemodel';
import Element from './imgelement'

/**
 * Main application to start on window load
 */
class Main {
  constructor() {

    this.imgElements = new Element();
    this.styleModel = new StyleModel();

    // Initialize model selection
    this.initializeStyleTransfer();

    Promise.all([
      this.styleModel.loadMobileNetStyleModel(),
      this.styleModel.loadSeparableTransformerModel(),
    ]).then(() => {
      console.log('Loaded styleNet');
      this.enableStylizeButtons()
    });
  }


  initializeStyleTransfer() {    

    // Initialize buttons
    this.styleButton = document.getElementById('style-button');
    this.styleButton.onclick = () => {
      this.disableStylizeButtons();
      this.startStyling().finally(() => {
        this.enableStylizeButtons();
      });
    };
  }

  enableStylizeButtons() {
    this.styleButton.disabled = false;
    this.styleButton.textContent = 'Stylize';
  }

  disableStylizeButtons() {
    this.styleButton.disabled = true;
  }

  async startStyling() {
    this.styleModel.run(this.imgElements.contentImg, this.imgElements.styleImg, this.imgElements.stylized)
  }
}

window.addEventListener('load', () => new Main());
