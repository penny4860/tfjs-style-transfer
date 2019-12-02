
// images
const ID_IMAGE_CONTENT = 'content-img';
const ID_IMAGE_STYLE = 'style-img';
const ID_IMAGE_STYLIZED = 'stylized';

// selectors
const ID_SELECT_CONTENT = 'content-select';
const ID_SELECT_STYLE = 'style-select';

// sliders
const ID_SLIDER_CONTENT = 'content-img-size';
const ID_SLIDER_STYLE = 'style-img-size';

// buttons
const ID_BUTTON_RUN = 'style-button';

// 1. html 에 의존성이 있는 element 들을 정의
export default class Element {
    constructor() {

        // image elements
        this.contentImg = document.getElementById(ID_IMAGE_CONTENT);
        this.contentImg.onerror = () => {
            alert("Error loading " + this.contentImg.src + ".");
        }
        this.styleImg = document.getElementById(ID_IMAGE_STYLE);
        this.styleImg.onerror = () => {
            alert("Error loading " + this.styleImg.src + ".");
        }
        this.stylized = document.getElementById(ID_IMAGE_STYLIZED);
        this.runButton = document.getElementById(ID_BUTTON_RUN);

        connectImgAndSelector(ID_IMAGE_CONTENT, ID_SELECT_CONTENT);
        connectImgAndSlider(ID_IMAGE_CONTENT, ID_SLIDER_CONTENT);

        connectImgAndSelector(ID_IMAGE_STYLE, ID_SELECT_STYLE);
        connectImgAndSlider(ID_IMAGE_STYLE, ID_SLIDER_STYLE);
    }

    enableRunButtons() {
        this.runButton.disabled = false;
        this.runButton.textContent = 'Stylize';
    }

    disableRunButtons() {
        this.runButton.disabled = true;
    }

}

/*
    img : image element
    slider : slider element
    square : check box element
*/
function connectImgAndSlider(imgId, sliderId) {

    let img = document.getElementById(imgId);
    let sizeSlider = document.getElementById(sliderId);

    sizeSlider.oninput = (evt) => {
        img.height = evt.target.value;
        if (img.style.width) {
            // If this branch is triggered, then that means the image was forced to a square using
            // a fixed pixel value.
            img.style.width = img.height + "px";  // Fix width back to a square
        }
    }
}

function connectImgAndSelector(imgId, selectorId) {
    /*
        imgId : img 태그의 ID
            <img id="content-img" class="centered" src="images/chicago.jpg" height=256></img>
        selectorId : select 태그의 ID
            <select id="content-select" class="centered custom-select">
                <option value="" disabled>Select content</option>
                <option value="stata">stata</option>
                ...
            </select>
    */
    let selector = document.getElementById(selectorId);
    let image = document.getElementById(imgId);
    selector.onchange = (evt) => {
        image.src = 'images/' + evt.target.value + '.jpg';
    };
    selector.onclick = () => selector.value = '';
}
