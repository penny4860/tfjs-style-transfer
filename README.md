# Arbitrary style transfer in TensorFlow.js

## Note

#### js 파일을 html과 브라우저 독립적으로 실행하는 방법

* 참고자료 : https://www.daleseo.com/js-babel-node/
* Method
    * babel-cli를 설치
        * ```yarn add -D babel-cli```
        * es6문법을 사용하기 위함.
    * node를 이용해서 자바스크립트를 실행
        * ```npx babel --presets env .\nodetest.js | node```

#### image와 size slider 사용 방법

1) html 에서 img / input 태그를 구현

```html
<img id="content-img" class="centered" src="images/chicago.jpg" height=256></img>
<input type="range" min="256" max="400" value="256" class="custom-range centered" id="content-img-size" >
```

2) js 에서 두 태그를 연결

```js
function connectImgAndSlider(imgId, sliderId) {

    let img = document.getElementById(imgId);
    let sizeSlider = document.getElementById(sliderId);

    sizeSlider.oninput = (evt) => {
        img.height = evt.target.value;
        if (img.style.width) {
            img.style.width = img.height + "px";
        }
    }
}
```

#### 비동기처리, async awati, promise 코드 이해하기

* https://joshua1988.github.io/web-development/javascript/promise-for-beginners/

## Todo

* dependency 문제 해결

