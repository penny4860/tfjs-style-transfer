
import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';
tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4

// ImageElement class
// UI : stylize button 관련된 동작을 정의
// Model : tensorflow model 관련된 종작을 정의



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


class StyleModel {
    constructor () {
        // this.styleNet
        // this.transformNet
    }
    async loadMobileNetStyleModel() {
        if (!this.styleNet) {
          this.styleNet = await tf.loadGraphModel(
            'saved_model_style_js/model.json');
        }
    }
    
    async loadSeparableTransformerModel() {
        if (!this.transformNet) {
            this.transformNet = await tf.loadGraphModel(
            'saved_model_transformer_separable_js/model.json'
            );
        }
    }

    async startStyling(contentImg, styleImg, stylizedImg) {
        await tf.nextFrame();
        // this.styleButton.textContent = 'Generating 100D style representation';
        await tf.nextFrame();
        let bottleneck = await tf.tidy(() => {
          return this.styleNet.predict(tf.browser.fromPixels(styleImg).toFloat().div(tf.scalar(255)).expandDims());
        })
        // this.styleButton.textContent = 'Stylizing image...';
        await tf.nextFrame();
        const stylized = await tf.tidy(() => {
          return this.transformNet.predict([tf.browser.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]).squeeze();
        })
        await tf.browser.toPixels(stylized, stylizedImg);
        bottleneck.dispose();  // Might wanna keep this around
        stylized.dispose();
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

    // Initialize selectors
    this.contentSelect = document.getElementById('content-select');
    this.contentSelect.onchange = (evt) => this.setImage(this.imgElements.contentImg, evt.target.value);
    this.contentSelect.onclick = () => this.contentSelect.value = '';
    this.styleSelect = document.getElementById('style-select');
    this.styleSelect.onchange = (evt) => this.setImage(this.imgElements.styleImg, evt.target.value);
    this.styleSelect.onclick = () => this.styleSelect.value = '';
  }

  // Helper function for setting an image
  setImage(element, selectedValue) {
    element.src = 'images/' + selectedValue + '.jpg';
  }

  enableStylizeButtons() {
    this.styleButton.disabled = false;
    this.styleButton.textContent = 'Stylize';
  }

  disableStylizeButtons() {
    this.styleButton.disabled = true;
  }

  async startStyling() {
    this.styleModel.startStyling(this.imgElements.contentImg, this.imgElements.styleImg, this.imgElements.stylized)
  }
}

window.addEventListener('load', () => new Main());
