
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

        this.styleModel = new StyleModel();

        // model 로드 로직이 끝나고 run 버튼을 enable
        Promise.all([
            this.styleModel.loadMobileNetStyleModel(),
            this.styleModel.loadSeparableTransformerModel(),
        ]).then(() => {
            console.log('Loaded styleNet');
            this.imgElements = new Element(this.styleModel);
            this.imgElements.enableRunButtons()
        });

    }
}

window.addEventListener('load', () => new Main());
