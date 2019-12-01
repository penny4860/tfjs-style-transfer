

// 1. html 에 의존성이 있는 element 들을 정의
export default class Element {
    constructor(styleModel) {

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
        this.runButton = document.getElementById('style-button');

        connectImgAndSelector('content-img', 'content-select');
        connectImgAndSlider('content-img', 'content-img-size');

        connectImgAndSelector('style-img', 'style-select');
        connectImgAndSlider('style-img', 'style-img-size');

        // Initialize buttons
        this.runButton.onclick = () => {
            this.disableRunButtons();
            styleModel.run(this.contentImg, this.styleImg, this.stylized).finally(() => {
                this.enableRunButtons();
            })
        };

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
