# Arbitrary style transfer in TensorFlow.js

## Note

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



