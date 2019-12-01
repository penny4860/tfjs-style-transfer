
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

        // Initialize buttons
        this.imgElements.runButton.onclick = () => {
            this.imgElements.disableRunButtons();
            this.styleModel.run(this.imgElements.contentImg, this.imgElements.styleImg, this.imgElements.stylized).finally(() => {
                this.imgElements.enableRunButtons();
            })
        };

        Promise.all([
            this.styleModel.loadMobileNetStyleModel(),
            this.styleModel.loadSeparableTransformerModel(),
        ]).then(() => {
            console.log('Loaded styleNet');
            this.imgElements.enableRunButtons()
        });
    }
}

window.addEventListener('load', () => new Main());
