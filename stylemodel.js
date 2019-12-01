
import * as tf from '@tensorflow/tfjs';
tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4


export default class StyleModel {
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

    async run(contentImg, styleImg, stylizedImg) {
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