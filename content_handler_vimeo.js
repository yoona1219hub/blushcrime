const PROJECTS_DATA = [
    {
        title: "Yueminjun exhibition naver teaser",
        description: "2022",
        type: "video",
        media: [
            {type: "video", src: 'https://player.vimeo.com/video/1141312794?h=78eee0dfbc'}
        ]
    },
    {
        title: "Snowfield",
        description: "2022",
        type: "video",
        media: [
            {type: "video", src: 'https://player.vimeo.com/video/1082596436?h=435c43f1e0'}
        ]
    },
    {
        title: "D'heygere X Gentlemonster Cupid teaser",
        description: "2023",
        type: "video",
        media: [
            {type: "video", src: 'https://player.vimeo.com/video/1094385929?h=4e3c3b1484'}
        ]
    },
    {
        title: "D'heygere X Gentlemonster Wedding cake website",
        description: "2023",
        type: "video",
        media: [
            {type: "video", src: 'https://player.vimeo.com/video/1113169405?h=fea30bf579'}
        ]
    },
    {
        title: "Gentlemonster Bold popup teaser ",
        description: "2023",
        type: "video",
        media: [
            {type: "video", src: "https://player.vimeo.com/video/1082580174?h=72a03c14c5"}
        ]
    },
    {
        title: "Gentlemonster Bold popup digital fire",
        description: "2023",
        type: "image",
        media: [
            {type: "image", src: "./asset/content/Bold_popup.png"},
            {type: "image", src: "./asset/content/Bold_popup2.png"},
            {type: "image", src: "./asset/content/Bold_fire_1.JPG"},
            {type: "image", src: "./asset/content/Bold_fire_2.JPG"}
        ]
    },
    {
        title: "Overwatch X Gentlemonster teaser video",
        description: "2023",
        type: "video",
        media: [
            {type: "video", src: "https://player.vimeo.com/video/1082621862?h=3646bd00c1"}
        ]
    },
    {
        title: "Gentlemonster Jelly collection teaser",
        description: "2024",
        type: "video",
        media: [
            {type: "video", src: "https://player.vimeo.com/video/1082618534?h=63012eb71d"}
        ]
    },
    {
        title: "Gentlemonster Optical collection video",
        description: "2024",
        type: "video",
        media: [
            {type: "video", src: "https://player.vimeo.com/video/1082618534?h=63012eb71d"}
        ]
    },
    {
        title: "Jennie x Gentlemonster collab teaser",
        description: "2024",
        type: "video",
        media: [
            {type: "video", src: "https://player.vimeo.com/video/1082591931?h=eeb3d7e602"}
        ]
    },
    {
        title: "Jennie x Gentlemonster 3D video",
        description: "2025",
        type: "video",
        media: [
            {type: "video", src: "https://player.vimeo.com/video/1082593010?h=8b04c39b64"}
        ]
    },
    {
        title: "Maison Margiela X Gentlemonster 3D video",
        description: "2025",
        type: "video",
        media: [
            {type: "video", src: "https://player.vimeo.com/video/1141311441?h=eb26f5c790"}
        ]
    },
    {
        title: "Piano 17",
        description: "2025",
        type: "image",
        media: [
            {type: "image", src: "./asset/content/01_2.jpg"}
        ]
    },
    {
        title: "Suited underwear (wool experiment)",
        description: "2025",
        type: "image",
        media: [
            {type: "image", src: "./asset/content/reality psd_1.jpg"},
            {type: "image", src: "./asset/content/reality psd_2.jpg"},
            {type: "image", src: "./asset/content/final .png"}
        ]
    }
];


document.addEventListener('DOMContentLoaded', () => {
    
    // const initialIframe = document.querySelector('.video-container iframe');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const videoContainer = document.querySelector('.video-container');
    const customControls = document.getElementById('custom-controls');
    const progressTrack = document.getElementById('progress-track');
    const progressFill = document.getElementById('progress-fill');
    const contentTitle = document.querySelector('.content-title');
    const contentDescription = document.querySelector('.content-description');
    const TOC_CONTAINER = document.getElementById('toc');
    const spans = TOC_CONTAINER.querySelectorAll('span');

    const mainElement = document.querySelector('main');
    const aboutContentElement = document.querySelector('.about-content'); 
    const menuSpans = document.querySelectorAll('menu span');
    const aboutSpan = menuSpans.length > 1 ? menuSpans[1] : null; 
    const tocCanvas = document.querySelector('#toc canvas');
    let isAboutVisible = false;

    let player;

    let currentMediaIndex = 0;
    let currentProjectIndex = 0;

    const mediaNavLeft = document.createElement('div');
    mediaNavLeft.id = 'media-nav-left';
    mediaNavLeft.innerHTML = '⟨';
    mediaNavLeft.className = 'media-nav';

    const mediaNavRight = document.createElement('div');
    mediaNavRight.id = 'media-nav-right';
    mediaNavRight.innerHTML = '⟩';
    mediaNavRight.className = 'media-nav';

    
    async function setContainerAspectRatio() {
        try {
            const videoWidth = await player.getVideoWidth();
            const videoHeight = await player.getVideoHeight();
            
            if (videoWidth && videoHeight) {
                const containerWidth = videoContainer.offsetWidth;
                let newHeight;
                let heightUnit = 'px';

                if (videoHeight > videoWidth) {
                    newHeight = '50vh';
                    heightUnit = '';
                } else {
                    newHeight = containerWidth * (videoHeight / videoWidth);
                    heightUnit = 'px'; 
                }
                
                const activeIframe = videoContainer.querySelector('iframe');
                if (activeIframe) {
                    activeIframe.style.height = `${newHeight}${heightUnit}`; 
                }

            } else {
                const containerWidth = videoContainer.offsetWidth;
                const activeIframe = videoContainer.querySelector('iframe');
               if (activeIframe) {
                    activeIframe.style.height = `${containerWidth * 0.5625}px`; 
                } 
            }

        } catch (error) {
            console.error("Vimeo video size fetch failed:", error);
        }
    }
    
    function registerVimeoEvents(newPlayer) {

        player = newPlayer;

        playPauseBtn.onclick = async () => {
            const paused = await player.getPaused();
            if (paused) {
                player.play();
                playPauseBtn.innerHTML = '&#40;pause&#41;';
            } else {
                player.pause();
                playPauseBtn.innerHTML = '&#40;play&#41;';
            }
        }

        player.on('timeupdate', function(data) {
            const percentage = data.percent * 100;
            progressFill.style.width = `${percentage}%`;
        });

        player.on('ended', function() {
            playPauseBtn.innerHTML = '&#40;play&#41;';
        });

        progressTrack.onclick = async (e) => {
            const trackRect = progressTrack.getBoundingClientRect();
            const clickX = e.clientX - trackRect.left;
            const clickRatio = clickX / trackRect.width;

            const duration = await player.getDuration();
            player.setCurrentTime(duration * clickRatio);
        };

        fullscreenBtn.onclick = () => {
            player.requestFullscreen();
        };

        player.on('loaded', setContainerAspectRatio);
    }


    function updateContentAndVimeo(index) {
        if (index < 0 || index >= PROJECTS_DATA.length) return;

        const project = PROJECTS_DATA[index];

        currentProjectIndex = index;
        currentMediaIndex = 0;

        contentTitle.textContent = project.title;
        contentDescription.textContent = project.description;

        renderMediaContent(project.media[0], 0, project.media.length);
    }

    function renderMediaContent(mediaItem, mediaIndex, totalMediaCount) {
        
        const oldMediaElement = videoContainer.querySelector('iframe, img');
        if (oldMediaElement) {
            // 기존 미디어 요소(iframe 또는 img)를 찾아서 제거
            videoContainer.removeChild(oldMediaElement); 
        }

        currentMediaIndex = mediaIndex;

        if (mediaItem.type === "video") {
            
            const iframeElement = document.createElement('iframe');
            const newSrc = `${mediaItem.src}&controls=0&loop=0&transparent=true`;

            iframeElement.src = newSrc;
            iframeElement.frameborder = "0";
            iframeElement.allowtransparency = "true";
            iframeElement.allow = "autoplay; fullscreen; picture-in-picture;";
            iframeElement.allowFullscreen = true;
            iframeElement.style.border = 'none'; // 경사 문제 해결을 위한 CSS 추가

            videoContainer.insertBefore(iframeElement, customControls); // 제일 앞에 삽입
            
            const newPlayer = new Vimeo.Player(iframeElement);
            registerVimeoEvents(newPlayer);
            
            if (customControls) customControls.style.display = 'flex';

        }else if (mediaItem.type === "image") {
            const imgElement = document.createElement('img');
            imgElement.src = mediaItem.src;
            imgElement.style.width = '100%';
            imgElement.style.height = '100%';
            imgElement.style.objectFit = 'contain';
            
            imgElement.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    videoContainer.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            });
            
            videoContainer.insertBefore(imgElement, customControls);
            if (customControls) customControls.style.display = 'none';
        }

        if (totalMediaCount > 1) {
            mediaNavLeft.style.display = (mediaIndex > 0) ? 'flex' : 'none';
            mediaNavRight.style.display = (mediaIndex < totalMediaCount - 1) ? 'flex' : 'none';
        } else {
            mediaNavLeft.style.display = 'none';
            mediaNavRight.style.display = 'none';
        }

        
    }

    function handleMediaNavigation(direction) {
        const project = PROJECTS_DATA[currentProjectIndex];
        const totalMedia = project.media.length;
        let newIndex = currentMediaIndex + direction;

        if (newIndex >= 0 && newIndex < totalMedia) {
            renderMediaContent(project.media[newIndex], newIndex, totalMedia);
        }
    }


    spans.forEach((span, index) => {

        if (index < PROJECTS_DATA.length) { 
            const project = PROJECTS_DATA[index];
            const descriptionDiv = span.querySelector('.number-description');
            if (project && descriptionDiv) {
                const newText = `${project.title} (${project.description})`;
                descriptionDiv.textContent = newText;
            }
        }

        if (index === spans.length - 1) return;

        const handleClick = () => {
            
            if (typeof tocInstance !== 'undefined') {
                const isIndexMode = tocInstance.getIsIndexMode();

                if (!isIndexMode) {
                    tocInstance.setTargetIndex(index);
                }
            }
            
            updateContentAndVimeo(index);
        };

        span.addEventListener('click', handleClick);

        const descElement = span.querySelector('.number-description');
        if (descElement) {
            descElement.addEventListener('click', handleClick);
        }
    });


    window.addEventListener('resize', setContainerAspectRatio);
    

    document.addEventListener('fullscreenchange', () => {
        videoContainer.classList.toggle('fullscreen', !!document.fullscreenElement);
        if (document.fullscreenElement) {
            document.body.style.backgroundColor = '#b2b2b2';
        } else {
            document.body.style.backgroundColor = '';
        }
    });
    
    updateContentAndVimeo(0);


    function toggleAboutPage() {
        isAboutVisible = !isAboutVisible;

        if (isAboutVisible) {
            if (mainElement) mainElement.style.display = 'none';
            if (TOC_CONTAINER) TOC_CONTAINER.style.display = 'none';
            if (aboutContentElement) aboutContentElement.style.display = 'block';
            if (tocCanvas) tocCanvas.style.display = 'none';

            if (aboutSpan) aboutSpan.textContent = '←';

        } else {
            if (mainElement) mainElement.style.display = '';
            if (TOC_CONTAINER) TOC_CONTAINER.style.display = '';
            if (aboutContentElement) aboutContentElement.style.display = 'none';
            if (tocCanvas) tocCanvas.style.display = ''; 

            if (aboutSpan) aboutSpan.textContent = 'About';
        }
    }

    if (aboutSpan) {
        aboutSpan.addEventListener('click', toggleAboutPage);
    }

    videoContainer.appendChild(mediaNavLeft);
    videoContainer.appendChild(mediaNavRight);

    mediaNavLeft.addEventListener('click', (e) => {
        e.stopPropagation(); // TOC 클릭 이벤트 중복 방지
        handleMediaNavigation(-1);
    });

    mediaNavRight.addEventListener('click', (e) => {
        e.stopPropagation();
        handleMediaNavigation(1);
    });
});