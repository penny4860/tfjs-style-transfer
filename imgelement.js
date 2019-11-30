

// 1. html 에 의존성이 있는 element 들을 정의
export default class Element {
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

        initImageSelector('content-img', 'content-select');
        initImageSelector('style-img', 'style-select');
    }

    connectImgSlider() {
        let contentImgSlider = document.getElementById('content-img-size');
        connectImageAndSizeSlider(this.contentImg, contentImgSlider);

        let styleImgSlider = document.getElementById('style-img-size');
        let styleImgSquare = document.getElementById('style-img-square');
        connectImageAndSizeSlider(this.styleImg, styleImgSlider, styleImgSquare);
    }
}

/*
    img : image element
    slider : slider element
    square : check box element
*/
function connectImageAndSizeSlider(img, slider, square=undefined) {
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

function initImageSelector(imageId, selectorId) {
    let selector = document.getElementById(selectorId);
    let image = document.getElementById(imageId);
    selector.onchange = (evt) => {
        image.src = 'images/' + evt.target.value + '.jpg';
    };
    selector.onclick = () => selector.value = '';
}
