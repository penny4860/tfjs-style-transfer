
import 'babel-polyfill';

// ImageElement class
// UI : stylize button 관련된 동작을 정의
// Model : tensorflow model 관련된 종작을 정의

import StyleModel from './stylemodel';

// 1. html 에 의존성이 있는 element 들을 정의
class Element {
    constructor() {

        // image elements
        this.contentImg = document.getElementById('content-img');
        this.contentImg.onerror = () => {
          alert("Error loading " + this.contentImg.src + ".");
        }
        this.styleImg = document.getElementById('style-img');
        this.styleImg.onerror = () => {
          alert("Error loading " + this.styleImg.src + ".");
        }
        this.stylized = document.getElementById('stylized');

        this.contentImgSlider = document.getElementById('content-img-size');
        this.connectImageAndSizeSlider(this.contentImg, this.contentImgSlider);

        // Initialize images
        this.styleImgSlider = document.getElementById('style-img-size');
        this.styleImgSquare = document.getElementById('style-img-square');
        this.connectImageAndSizeSlider(this.styleImg, this.styleImgSlider, this.styleImgSquare);

        // Initialize selectors
        this.contentSelect = document.getElementById('content-select');
        this.contentSelect.onchange = (evt) => this.setImage(this.contentImg, evt.target.value);
        this.contentSelect.onclick = () => this.contentSelect.value = '';
        this.styleSelect = document.getElementById('style-select');
        this.styleSelect.onchange = (evt) => this.setImage(this.styleImg, evt.target.value);
        this.styleSelect.onclick = () => this.styleSelect.value = '';
    }

    // Helper function for setting an image
    setImage(element, selectedValue) {
        element.src = 'images/' + selectedValue + '.jpg';
    }

    /*
        img : image element
        slider : slider element
        square : check box element
    */
    connectImageAndSizeSlider(img, slider, square=undefined) {
        slider.oninput = (evt) => {
          img.height = evt.target.value;
          if (img.style.width) {
            // If this branch is triggered, then that means the image was forced to a square using
            // a fixed pixel value.
            img.style.width = img.height+"px";  // Fix width back to a square
          }
        }
        if (square !== undefined) {
          square.onclick = (evt) => {
            if (evt.target.checked) {
              img.style.width = img.height+"px";
            } else {
              img.style.width = '';
            }
          }
        }
      }
}

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
