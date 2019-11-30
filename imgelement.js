

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

        // Initialize selectors
        this.contentSelect = document.getElementById('content-select');
        this.contentSelect.onchange = (evt) => this.setImage(this.contentImg, evt.target.value);
        this.contentSelect.onclick = () => this.contentSelect.value = '';
        this.styleSelect = document.getElementById('style-select');
        this.styleSelect.onchange = (evt) => this.setImage(this.styleImg, evt.target.value);
        this.styleSelect.onclick = () => this.styleSelect.value = '';
    }

    connectImgSlider() {
        contentImgSlider = document.getElementById('content-img-size');
        connectImageAndSizeSlider(this.contentImg, contentImgSlider);

        styleImgSlider = document.getElementById('style-img-size');
        styleImgSquare = document.getElementById('style-img-square');
        connectImageAndSizeSlider(this.styleImg, styleImgSlider, styleImgSquare);
    }

    // Helper function for setting an image
    setImage(element, selectedValue) {
        element.src = 'images/' + selectedValue + '.jpg';
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

