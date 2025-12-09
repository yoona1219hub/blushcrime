let carpetImg;
let carpetReverseImg;
let brushImg;
let pg;
let maskedCarpetPatch;
let isCanvasReady = false;
let canvasElement;
let carpetScaleFactor;
let displayCarpetWidth;
let displayCarpetHeight;

function preload() {
    carpetImg = loadImage('./asset/carpet2.jpeg');
    carpetReverseImg = loadImage('./asset/carpet-reverse2.jpeg');
    brushImg = loadImage('./asset/icon/brush.png');

    const canvasRatio = windowWidth / windowHeight;
    const imgRatio = carpetImg.width / carpetImg.height;

    if (canvasRatio > imgRatio) {
        carpetScaleFactor = windowWidth / carpetImg.width;
        displayCarpetWidth = windowWidth;
        displayCarpetHeight = carpetImg.height * carpetScaleFactor;
    } else {
        carpetScaleFactor = windowHeight / carpetImg.height;
        displayCarpetWidth = carpetImg.width * carpetScaleFactor;
        displayCarpetHeight = windowHeight;
    }
}

function setup() {
    const DISPLAY_WIDTH = windowWidth; 
    const DISPLAY_HEIGHT = windowHeight;

    let canvas = createCanvas(DISPLAY_WIDTH, DISPLAY_HEIGHT);
    canvasElement = canvas.elt;
    canvas.parent('carpet');

    canvasElement.style.transition = 'opacity 5s ease-in-out';

    pg = createGraphics(width, height);

    const offsetX = (width - displayCarpetWidth) / 2;
    const offsetY = (height - displayCarpetHeight) / 2;

    pg.image(carpetReverseImg, offsetX, offsetY, displayCarpetWidth, displayCarpetHeight);
    
    const BRUSH_SCALE = 0.0003*windowWidth;
    brushImg.resize(brushImg.width*BRUSH_SCALE, brushImg.height*BRUSH_SCALE);

    maskedCarpetPatch = createImage(brushImg.width, brushImg.height);
}

function draw() {
    if (!isCanvasReady) {
        document.body.style.opacity = 1;
        setTimeout(hideCanvas, 5000);
        isCanvasReady = true;
    }

    const offsetX = (width - displayCarpetWidth) / 2;
    const offsetY = (height - displayCarpetHeight) / 2;

    image(carpetImg, offsetX, offsetY, displayCarpetWidth, displayCarpetHeight);
    image(pg, 0, 0);
    
    if (pmouseX !== mouseX || pmouseY !== mouseY) {
        
        applyBrushEffect(mouseX, mouseY, pmouseX, pmouseY);
    }
   
}

function touchMoved() {
    applyBrushEffect(mouseX, mouseY, pmouseX, pmouseY);
    return false;
}

function applyBrushEffect(currentX, currentY, previousX, previousY) {
    // 기존 draw() 함수 내의 핵심 로직을 이 함수로 옮깁니다.
    
    let dx = currentX - previousX; // 마우스와 동일하게 터치 움직임 감지
    let dy = currentY - previousY;
    const BRUSH_JITTER_AMOUNT = 5;

    let jitterX = random(-BRUSH_JITTER_AMOUNT, BRUSH_JITTER_AMOUNT);
    let jitterY = random(-BRUSH_JITTER_AMOUNT, BRUSH_JITTER_AMOUNT);
    let jitteredBrushX = (currentX + jitterX) - brushImg.width / 2;
    let jitteredBrushY = (currentY + jitterY) - brushImg.height / 2;

    let brushX = currentX - brushImg.width / 2;
    let brushY = currentY - brushImg.height / 2;
    let brushW = brushImg.width;
    let brushH = brushImg.height;

    let scaleX = carpetReverseImg.width / width;
    let scaleY = carpetReverseImg.height / height;

    let sourceX = brushX * scaleX;
    let sourceY = brushY * scaleY;
    let sourceW = brushW * scaleX;
    let sourceH = brushH * scaleY;

    if (dx > 0 || dy > 0) { // 양탄자를 긁는 효과 (REMOVE)
        pg.push();
        pg.blendMode(REMOVE);
        pg.image(brushImg, jitteredBrushX, jitteredBrushY);
        pg.pop();
    } else if (dx < 0 || dy < 0) { // 양탄자를 되돌리는 효과 (BLEND)
        let carpetPatch = carpetReverseImg.get(sourceX, sourceY, sourceW, sourceH);
        carpetPatch.copy(carpetPatch, 0, 0, carpetPatch.width, carpetPatch.height, 0, 0, brushW, brushH);
        carpetPatch.mask(brushImg);
        pg.push();
        pg.blendMode(BLEND);
        pg.image(carpetPatch, jitteredBrushX, jitteredBrushY, brushW, brushH);
        pg.pop();
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

    document.addEventListener('touchmove', (event) => {
        if (!logoCursor) return;
        
        const touch = event.touches[0]; 
        const x = touch.clientX;
        const y = touch.clientY;

        const offsetX = logoCursor.offsetWidth / 9;
        const offsetY = logoCursor.offsetWidth / 9;

        logoCursor.style.transform = `translate(${x + offsetX}px, ${y + offsetY}px)`;
        
        event.preventDefault(); 
    }, { passive: false });

    if (logoCursor) {
        setLogoSize(window.innerWidth);
    }

    window.addEventListener('resize', () => {
        if (logoCursor) {
            setLogoSize(window.innerWidth);
        }
    });
});