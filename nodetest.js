
// NodeJS로 ES6 코드 실행 : https://www.daleseo.com/js-babel-node/
//      1) yarn add -D babel-cli
//      2) npx babel --presets env .\nodetest.js | node
// import { sequential, layers } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [200] }));
model.compile({
    loss: 'meanSquaredError',
    optimizer: 'sgd',
    metrics: ['MAE']
});

console.log(model);
console.log("done");
