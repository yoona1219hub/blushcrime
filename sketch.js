let carpetImg;
let carpetReverseImg;
let brushImg;
let logoImg;
let pg;
let maskedCarpetPatch;
let isCanvasReady = false;
let canvasElement;
const MOBILE_BREAKPOINT = 768;

function preload() {
    carpetImg = loadImage('./asset/carpet.jpg');
    carpetReverseImg = loadImage('./asset/carpet-reverse.jpg');
    brushImg = loadImage('./asset/icon/brush.png');
    logoImg = loadImage('./asset/icon/cursor.svg');
}

function setup() {
    const DISPLAY_WIDTH = windowWidth; 
    const DISPLAY_HEIGHT = windowHeight;

    let canvas = createCanvas(DISPLAY_WIDTH, DISPLAY_HEIGHT);
    canvasElement = canvas.elt;
    canvas.parent('carpet');

    canvasElement.style.transition = 'opacity 1s ease-in-out';

    pg = createGraphics(width, height);
    pg.image(carpetReverseImg, 0, 0, width, height);
    
    const BRUSH_SCALE = 0.0005*windowWidth;
    brushImg.resize(brushImg.width*BRUSH_SCALE, brushImg.height*BRUSH_SCALE);

    maskedCarpetPatch = createImage(brushImg.width, brushImg.height);

    let logoScaleWidth;
    if (windowWidth <= MOBILE_BREAKPOINT) {
        logoScaleWidth = 100; 
    } else {
        logoScaleWidth = logoImg.width * 0.0003 * windowWidth;
    }

    const aspectRatio = logoImg.height / logoImg.width;
    const newHeight = logoScaleWidth * aspectRatio;

    logoImg.resize(logoScaleWidth, newHeight);


}

function draw() {
    if (!isCanvasReady) {
        document.body.style.opacity = 1;
        setTimeout(hideCanvas, 3000);
        isCanvasReady = true;
    }

    image(carpetImg, 0, 0, width, height);
    image(pg, 0, 0);
    
    if (pmouseX !== mouseX || pmouseY !== mouseY) {
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        const BRUSH_JITTER_AMOUNT = 5;

        let jitterX = random(-BRUSH_JITTER_AMOUNT, BRUSH_JITTER_AMOUNT);
        let jitterY = random(-BRUSH_JITTER_AMOUNT, BRUSH_JITTER_AMOUNT);
        let jitteredBrushX = (mouseX + jitterX) - brushImg.width / 2;
        let jitteredBrushY = (mouseY + jitterY) - brushImg.height / 2;

        let brushX = mouseX - brushImg.width / 2;
        let brushY = mouseY - brushImg.height / 2;
        let brushW = brushImg.width;
        let brushH = brushImg.height;

        let scaleX = carpetReverseImg.width / width;
        let scaleY = carpetReverseImg.height / height;

        let sourceX = brushX * scaleX;
        let sourceY = brushY * scaleY;
        let sourceW = brushW * scaleX;
        let sourceH = brushH * scaleY;

        if (dx > 0 || dy > 0) {
            pg.push();
            pg.blendMode(REMOVE);
            pg.image(brushImg, jitteredBrushX, jitteredBrushY);
            pg.pop();
        } else if (dx < 0 || dy < 0) {
            let carpetPatch = carpetReverseImg.get(sourceX, sourceY, sourceW, sourceH);
            carpetPatch.copy(carpetPatch, 0, 0, carpetPatch.width, carpetPatch.height, 0, 0, brushW, brushH);
            carpetPatch.mask(brushImg);
            pg.push();
            pg.blendMode(BLEND);
            pg.image(carpetPatch, jitteredBrushX, jitteredBrushY, brushW, brushH);
            pg.pop();
            
        }
    }

    image(logoImg, mouseX + logoImg.width/9, mouseY + logoImg.width/9);
   
}

function hideCanvas() {
    canvasElement.style.opacity = 0;
    
    setTimeout(() => {
        canvasElement.style.zIndex = -1;
    }, 5000);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pg = createGraphics(width, height);
    pg.image(carpetImg, 0, 0, width, height);

    const logoScaleWidth = (windowWidth <= MOBILE_BREAKPOINT) ? 100 : (logoImg.width / 0.0003 / windowWidth) * 0.0003 * windowWidth;

    let tempLogoScaleWidth;
    const ORIGINAL_SCALE_FACTOR = 0.0003;

    if (windowWidth <= MOBILE_BREAKPOINT) {
        tempLogoScaleWidth = 100; 
    } else {
        tempLogoScaleWidth = logoImg.width * (windowWidth / width); 
        tempLogoScaleWidth = windowWidth * ORIGINAL_SCALE_FACTOR;
    }
    const resizeLogo = (img, currentWindowWidth) => {
        let desiredWidth;
        if (currentWindowWidth <= MOBILE_BREAKPOINT) {
            desiredWidth = 100;
        } else {
            desiredWidth = currentWindowWidth * ORIGINAL_SCALE_FACTOR;
        }
        img.resize(desiredWidth, 0);
    }
    resizeLogo(logoImg, windowWidth);
}