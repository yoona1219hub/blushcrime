let carpetImg;
let carpetReverseImg;
let brushImg;
let pg;
let maskedCarpetPatch;
let isCanvasReady = false;
let canvasElement;

function preload() {
    carpetImg = loadImage('./asset/carpet.jpeg');
    carpetReverseImg = loadImage('./asset/carpet-reverse.jpeg');
    brushImg = loadImage('./asset/icon/brush.png');
}

function setup() {
    const DISPLAY_WIDTH = windowWidth; 
    const DISPLAY_HEIGHT = windowHeight;

    let canvas = createCanvas(DISPLAY_WIDTH, DISPLAY_HEIGHT);
    canvasElement = canvas.elt;
    canvas.parent('carpet');

    canvasElement.style.transition = 'opacity 5s ease-in-out';

    pg = createGraphics(width, height);
    pg.image(carpetReverseImg, 0, 0, width, height);
    
    const BRUSH_SCALE = 0.0005*windowWidth;
    brushImg.resize(brushImg.width*BRUSH_SCALE, brushImg.height*BRUSH_SCALE);

    maskedCarpetPatch = createImage(brushImg.width, brushImg.height);
}

function draw() {
    if (!isCanvasReady) {
        document.body.style.opacity = 1;
        setTimeout(hideCanvas, 5000);
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
   
}

function hideCanvas() {
    canvasElement.style.opacity = 0;
    
    const logoCursor = document.getElementById('logo-cursor');
    if (logoCursor) {
        logoCursor.style.opacity = 0; 

        setTimeout(() => {
            canvasElement.style.zIndex = -1;
            logoCursor.style.zIndex = -1; 
        }, 5000);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pg = createGraphics(width, height);
    pg.image(carpetImg, 0, 0, width, height);
}



document.addEventListener('DOMContentLoaded', () => {
    
    const logoCursor = document.getElementById('logo-cursor');

    const MOBILE_BREAKPOINT = 768; 
    const ORIGINAL_SCALE_FACTOR = 0.0003; 

    function setLogoSize(windowWidth) {
        if (!logoCursor) return;
        let desiredWidth;
        logoCursor.style.width = `${desiredWidth}px`;
    }

    document.addEventListener('mousemove', (event) => {
        if (!logoCursor) return;
        const x = event.clientX;
        const y = event.clientY;

        const offsetX = logoCursor.offsetWidth / 9;
        const offsetY = logoCursor.offsetWidth / 9;

        logoCursor.style.transform = `translate(${x + offsetX}px, ${y + offsetY}px)`;
    });

    if (logoCursor) {
        setLogoSize(window.innerWidth);
    }

    window.addEventListener('resize', () => {
        if (logoCursor) {
            setLogoSize(window.innerWidth);
        }
    });
});
