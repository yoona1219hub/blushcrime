const TOC_CONTAINER = document.getElementById('toc');
let tocInstance;

if (TOC_CONTAINER) {
    class Rect {
        constructor(spanElement, x, y) {
        this.span = spanElement;
        this.width = this.span.offsetWidth;
        this.height = this.span.offsetHeight;
        this.initialPos = {x, y};
        this.velocity = null;
        this.acceleration = null;
        this.mass = 1;
        }

        initVectors(p) {
        this.position = p.createVector(this.initialPos.x, this.initialPos.y);
        this.velocity = p.createVector(0, 0);
        this.acceleration = p.createVector(0, 0);
        }

        applyForce(p, force) {
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
        }

        update(p) {
        this.velocity.add(this.acceleration);
        this.velocity.limit(10);
        this.position.add(this.velocity);
        this.velocity.mult(0.8);
        this.acceleration.mult(0);
        }

        display() {
        this.span.style.left = `${this.position.x - this.width / 2}px`;
        this.span.style.top = `${this.position.y - this.height / 2}px`;
        }
    }

    function checkCollision(p, r1, r2) {
        let dx = r2.position.x - r1.position.x;
        let dy = r2.position.y - r1.position.y;

        let combinedHalfWidth = r1.width / 2 + r2.width / 2;
        let combinedHalfHeight = r1.height / 2 + r2.height / 2;

        const COLLISION_THRESHOLD = 0;

        let detectWidth = combinedHalfWidth + COLLISION_THRESHOLD;
        let detectHeight = combinedHalfHeight + COLLISION_THRESHOLD;

        if (p.abs(dx) < combinedHalfWidth && p.abs(dy) < combinedHalfHeight) {
            let overlapX = detectWidth - p.abs(dx);
            let overlapY = detectHeight- p.abs(dy);

            const RESTITUTION = 0.98;

            if (overlapX < overlapY) {
                let directionX = dx > 0 ? -1 : 1;
                let separationDistance = overlapX / (r1.mass + r2.mass);
                r1.position.x += directionX * separationDistance * r2.mass;
                r2.position.x -= directionX * separationDistance * r1.mass;

                let v1x = r1.velocity.x;
                let v2x = r2.velocity.x;
                let newV1x = (v1x * (r1.mass - r2.mass) + 2 * r2.mass * v2x) / (r1.mass + r2.mass) * RESTITUTION;
                let newV2x = (v2x * (r2.mass - r1.mass) + 2 * r1.mass * v1x) / (r1.mass + r2.mass) * RESTITUTION;

                r1.velocity.x = newV1x;
                r2.velocity.x = newV2x;
            } else {
                let directionY = dy > 0 ? -1 : 1;
                let separationDistance = overlapY / (r1.mass + r2.mass);

                r1.position.y += directionY * separationDistance * r2.mass;
                r2.position.y -= directionY * separationDistance * r1.mass;

                let v1y = r1.velocity.y;
                let v2y = r2.velocity.y;
                let newV1y = (v1y * (r1.mass - r2.mass) + 2 * r2.mass * v2y) / (r1.mass + r2.mass) * RESTITUTION;
                let newV2y = (v2y * (r2.mass - r1.mass) + 2 * r1.mass * v1y) / (r1.mass + r2.mass) * RESTITUTION;

                r1.velocity.y = newV1y;
                r2.velocity.y = newV2y;
            }
        }
    }

    const tocSketch = function(p) {
        let canvas;
        let rects = [];
        let listTargetPositions = [];
        let targetIndex = -1;
        let isIndexMode = false;

        let TOC_WIDTH;
        let TOC_HEIGHT;
        const BREAKPOINT_MOBILE = 768;

        const updateCanvasSize = function() {
            if (TOC_CONTAINER) {
                TOC_WIDTH = TOC_CONTAINER.offsetWidth;
                TOC_HEIGHT = TOC_CONTAINER.offsetHeight;

                if (canvas) {
                    p.resizeCanvas(TOC_WIDTH, TOC_HEIGHT);
                }
            }
        };

        p.setTargetIndex = function(index) {
                targetIndex = index;
        };

        p.getIsIndexMode = function() {
                return isIndexMode;
        };

        function setTocModeByScreenSize() {
            const spans = TOC_CONTAINER.querySelectorAll('span');
            const indexSpan = spans[spans.length - 1]; 
            const BREAKPOINT_MOBILE = 768;

            const viewportWidth = window.innerWidth;
        
            if (viewportWidth <= BREAKPOINT_MOBILE) {
                // if (!isIndexMode) {
                //     toggleIndexMode(); 
                // }
                if (indexSpan) {
                    indexSpan.style.display = 'none';
                }
            } else {
                // if (isIndexMode) {
                //     toggleIndexMode();
                // }
                if (indexSpan) {
                    indexSpan.style.display = 'flex';
                }
            }
        }

        p.setup = function() {
            updateCanvasSize();

            canvas = p.createCanvas(TOC_WIDTH, TOC_HEIGHT);
            canvas.parent(TOC_CONTAINER);

            p.noStroke();

            const spans = TOC_CONTAINER.querySelectorAll('span');
            let placedRects = [];
            let currentY = spans[0].offsetHeight / 2;


            spans.forEach((span, index) => {
                const rectW = span.offsetWidth;
                const rectH = span.offsetHeight;

                const targetX = rectW / 2;
                const targetY = currentY + rectH / 2;

                listTargetPositions.push(p.createVector(targetX, targetY));
                currentY = targetY + rectH / 2 + 5;
            });


            spans.forEach((span, index) => {
                let rectW = span.offsetWidth;
                let rectH = span.offsetHeight;
                let attempts = 0;
                let isOverlapping = true;
                let finalX = 0, finalY = 0;


                while (isOverlapping && attempts < 1000) {
                    attempts++;
                    isOverlapping = false;

                    finalX = p.random(rectW / 2, TOC_WIDTH - rectW / 2);
                    finalY = p.random(rectH / 2, TOC_HEIGHT - rectH / 2);

                    const newRectBounds = {
                        left: finalX - rectW / 2,
                        right: finalX + rectW / 2,
                        top: finalY - rectH / 2,
                        bottom: finalY + rectH / 2,
                    };

                    for (const placed of placedRects) {
                        if (
                            newRectBounds.right > placed.left &&
                            newRectBounds.left < placed.right &&
                            newRectBounds.bottom > placed.top &&
                            newRectBounds.top < placed.bottom
                        ){
                            isOverlapping = true;
                            break;
                        }
                    }

                    if (!isOverlapping) {
                        let newRect = new Rect(span, finalX, finalY);
                        newRect.initVectors(p);
                        rects.push(newRect);
                        placedRects.push(newRectBounds);
                    }
                }

                if(isOverlapping) {
                    let newRect = new Rect(span, finalX, finalY);
                    newRect.initVectors(p);
                    rects.push(newRect);
                }

            });

            const indexSpan = spans[spans.length - 1];
            indexSpan.addEventListener('click', () => {
                toggleIndexMode();
            });

            rects.forEach(rect => rect.display());

            setTocModeByScreenSize();
        };



        function toggleIndexMode() {
            isIndexMode = !isIndexMode;

            const descElements = TOC_CONTAINER.querySelectorAll('.number-description');
            const spans = TOC_CONTAINER.querySelectorAll('span');
            const indexSpan = spans[spans.length - 1];
            const indexRect = rects[rects.length - 1];


            if (isIndexMode) {
                TOC_CONTAINER.style.height = 'auto';
                TOC_CONTAINER.style.width = 'auto';
                TOC_CONTAINER.style.transform = 'translate(0, 0)';
                TOC_CONTAINER.style.top = '0';
                TOC_CONTAINER.style.left = '0';

                rects.forEach(rect => {
                    rect.span.style.position = 'static';
                    rect.span.style.display = 'block';
                });

                descElements.forEach(desc => {
                    desc.style.opacity = '1';
                    desc.style.color = '#b70000';
                    desc.style.position = 'static';
                    desc.style.left = '';
                    desc.style.top = '';
                    desc.style.display = 'inline-block';
                    desc.style.marginTop = '0.3rem';
                });

                indexRect.span.style.marginTop = '1.5rem';

                canvas.hide();

            } else {
                TOC_CONTAINER.style.height = TOC_HEIGHT + 'px';
                TOC_CONTAINER.style.width = TOC_WIDTH + 'px';
                TOC_CONTAINER.style.transform = 'translate(-50%, -50%)';
                TOC_CONTAINER.style.top = '50%';
                TOC_CONTAINER.style.left = '50%';
                TOC_CONTAINER.classList.remove('index-mode');

                rects.forEach(rect => {
                    rect.span.style.position = 'absolute';
                    rect.span.style.display = '';
                    rect.display();
                });

                descElements.forEach(desc => {
                    desc.style.opacity = '';
                    desc.style.color = '';
                    desc.style.position = '';
                    desc.style.display = '';
                    desc.style.marginTop = '';
                    desc.style.left = '';
                    desc.style.top = '';
                });

                indexRect.span.style.marginTop = '';

                canvas.show();
            }

        }


        p.windowResized = function() {
            updateCanvasSize();
            setTocModeByScreenSize();
        };


        p.draw = function() {

            p.clear();

            if (isIndexMode) {
                return;
            }

            if (targetIndex !== -1) {
                let targetRect = rects[targetIndex];
                const center = p.createVector(TOC_WIDTH / 2, TOC_HEIGHT / 2);
                let desired = p5.Vector.sub(center, targetRect.position);
                let distance = desired.mag();

                desired.normalize();

                let maxForce = 0.5;
                let maxSpeed = 9;

                if (distance < 5) {
                    desired.mult(0);
                    targetRect.velocity.mult(0);
                    targetIndex = -1;
                } else if (distance < 100) {
                    let speed = p.map(distance, 0, 100, 0, maxSpeed);

                    desired.mult(speed);
                } else {
                    desired.mult(maxSpeed);
                }

                let steering = p5.Vector.sub(desired, targetRect.velocity);

                steering.limit(maxForce);
                targetRect.applyForce(p, steering);
            }


            for (let i = 0; i < rects.length; i++) {
                let r1 = rects[i];

                for (let j = i + 1; j < rects.length; j++) {
                    let r2 = rects[j];

                    checkCollision(p, r1, r2);
                }

                const HALF_W = r1.width / 2;
                const HALF_H = r1.height / 2;
                const ELASTICITY = 0.8;

                if (r1.position.x < HALF_W) {
                    r1.position.x = HALF_W;
                    r1.velocity.x *= -ELASTICITY;
                } else if (r1.position.x > TOC_WIDTH - HALF_W) {
                    r1.position.x = TOC_WIDTH - HALF_W;
                    r1.velocity.x *= -ELASTICITY;
                }

                if (r1.position.y < HALF_H) {
                    r1.position.y = HALF_H;
                    r1.velocity.y *= -ELASTICITY;
                } else if (r1.position.y > TOC_HEIGHT - HALF_H) {
                    r1.position.y = TOC_HEIGHT - HALF_H;
                    r1.velocity.y *= -ELASTICITY;
                }

                r1.update(p);
                r1.display();
            }
        };
    };

    tocInstance = new p5(tocSketch);
}


// document.addEventListener('DOMContentLoaded', () => {

//     const iframe = document.querySelector('.video-container iframe');
//     const playPauseBtn = document.getElementById('play-pause-btn');
//     const fullscreenBtn = document.getElementById('fullscreen-btn');
//     const videoContainer = document.querySelector('.video-container');
//     const progressTrack = document.getElementById('progress-track');
//     const progressFill = document.getElementById('progress-fill');

//     if (!iframe) return;

//     const player = new Vimeo.Player(iframe);
//     let isVerticalVideo = false;

//     async function setContainerAspectRatio() {
//         try {

//         const videoWidth = await player.getVideoWidth();
//         const videoHeight = await player.getVideoHeight();

//         if (videoWidth && videoHeight) {
//             const containerWidth = videoContainer.offsetWidth;
//             let newHeight;
//             let aspectRatio = videoWidth / videoHeight;

//             if (videoHeight > videoWidth) {
//                 isVerticalVideo = true;
//                 newHeight = containerWidth * (videoHeight / videoWidth);
//             } else {
//                 isVerticalVideo = false;
//                 newHeight = containerWidth * (videoHeight / videoWidth);
//             }

//             iframe.style.height = `${newHeight}px`;
//             console.log(`Video loaded. Ratio: ${aspectRatio.toFixed(2)}. Height set to ${newHeight.toFixed(0)}px.`);
//         } else {
//             const containerWidth = videoContainer.offsetWidth;
//             iframe.style.height = `${containerWidth * 0.5625}px`;
//         }
//         } catch (error) {
//             console.error("Vimeo video size fetch failed:", error);
//         }
//     }
//     player.on('loaded', setContainerAspectRatio);
//     window.addEventListener('resize', setContainerAspectRatio);


    // playPauseBtn.addEventListener('click', async () => {
    //     const paused = await player.getPaused();

    //     if (paused) {
    //         player.play();
    //         playPauseBtn.innerHTML = '&#40;pause&#41;';
    //     } else {
    //         player.pause();
    //         playPauseBtn.innerHTML = '&#40;play&#41;';
    //     }
    // });

    // player.on('timeupdate', function(data) {
    //     const percentage = data.percent * 100;
    //     progressFill.style.width = `${percentage}%`;
    // });

    // player.on('ended', function() {
    //     playPauseBtn.innerHTML = '&#40;play&#41;';
    // });

    // progressTrack.addEventListener('click', async (e) => {
    //     const trackRect = progressTrack.getBoundingClientRect();
    //     const clickX = e.clientX - trackRect.left;
    //     const clickRatio = clickX / trackRect.width;

    //     const duration = await player.getDuration();
    //     player.setCurrentTime(duration * clickRatio);
    // });

    // fullscreenBtn.addEventListener('click', () => {
    //     player.requestFullscreen();
    // });

//     document.addEventListener('fullscreenchange', () => {
//         videoContainer.classList.toggle('fullscreen', !!document.fullscreenElement);
//     });

//     if (document.fullscreenElement) {
//         document.body.style.backgroundColor = '#b2b2b2';
//     } else {
//         document.body.style.backgroundColor = '';
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');
    const tocContainer = document.getElementById('toc');
    const aboutContentElement = document.querySelector('.about-content');
    const menuSpans = document.querySelectorAll('menu span');

    const aboutSpan = menuSpans.length > 1 ? menuSpans[1] : null;
    const tocCanvas = document.querySelector('#toc canvas');
    let isAboutVisible = false;


    function toggleAboutPage() {
        isAboutVisible = !isAboutVisible;

        if (isAboutVisible) {
            if (mainElement) mainElement.style.display = 'none';
            if (tocContainer) tocContainer.style.display = 'none';
            if (aboutContentElement) aboutContentElement.style.display = 'block';
            if (tocCanvas) tocCanvas.style.display = 'none';
            if (aboutSpan) aboutSpan.textContent = '←';
        } else {
            if (mainElement) mainElement.style.display = '';
            if (tocContainer) tocContainer.style.display = '';
            if (aboutContentElement) aboutContentElement.style.display = 'none';
            if (tocCanvas) tocCanvas.style.display = '';
            if (aboutSpan) aboutSpan.textContent = 'About';
        }
    }

    if (aboutSpan) {
        aboutSpan.addEventListener('click', toggleAboutPage);
    }
});


const PRIMARY_CONTAINER = document.querySelector('.primary');
const SECONDARY_CONTAINER = document.querySelector('.secondary');
const HEADER_ELEMENT = document.querySelector('header');
const BREAKPOINT = 768;

function moveSecondaryOnMobile() {
    const viewportWidth = window.innerWidth;
    
    if (viewportWidth <= BREAKPOINT) {
        if (PRIMARY_CONTAINER && SECONDARY_CONTAINER && HEADER_ELEMENT) {
            if (SECONDARY_CONTAINER.parentElement !== PRIMARY_CONTAINER || SECONDARY_CONTAINER.previousElementSibling !== HEADER_ELEMENT) {
                HEADER_ELEMENT.after(SECONDARY_CONTAINER);
                SECONDARY_CONTAINER.classList.add('is-mobile-moved');
            }
        }
    } else {
        if (SECONDARY_CONTAINER && SECONDARY_CONTAINER.classList.contains('is-mobile-moved')) {
            document.body.appendChild(SECONDARY_CONTAINER);
            SECONDARY_CONTAINER.classList.remove('is-mobile-moved');
        }
    }
}

// 초기 로드 시 실행
moveSecondaryOnMobile();
// 창 크기 변경 시 실행
window.addEventListener('resize', moveSecondaryOnMobile);

