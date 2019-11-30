
import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';
tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4

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



/**
 * Main application to start on window load
 */
class Main {
  constructor() {

    this.imgElements = new Element();

    // Initialize model selection
    this.initializeStyleTransfer();

    Promise.all([
      this.loadMobileNetStyleModel(),
      this.loadSeparableTransformerModel(),
    ]).then(([styleNet, transformNet]) => {
      console.log('Loaded styleNet');
      this.styleNet = styleNet;
      this.transformNet = transformNet;
      this.enableStylizeButtons()
    });
  }

  async loadMobileNetStyleModel() {
    if (!this.mobileStyleNet) {
      this.mobileStyleNet = await tf.loadGraphModel(
        'saved_model_style_js/model.json');
    }

    return this.mobileStyleNet;
  }

  async loadSeparableTransformerModel() {
    if (!this.separableTransformNet) {
      this.separableTransformNet = await tf.loadGraphModel(
        'saved_model_transformer_separable_js/model.json'
      );
    }

    return this.separableTransformNet;
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
    await tf.nextFrame();
    this.styleButton.textContent = 'Generating 100D style representation';
    await tf.nextFrame();
    let bottleneck = await tf.tidy(() => {
      return this.styleNet.predict(tf.browser.fromPixels(this.imgElements.styleImg).toFloat().div(tf.scalar(255)).expandDims());
    })
    this.styleButton.textContent = 'Stylizing image...';
    await tf.nextFrame();
    const stylized = await tf.tidy(() => {
      return this.transformNet.predict([tf.browser.fromPixels(this.imgElements.contentImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]).squeeze();
    })
    await tf.browser.toPixels(stylized, this.imgElements.stylized);
    bottleneck.dispose();  // Might wanna keep this around
    stylized.dispose();
  }
}

window.addEventListener('load', () => new Main());
