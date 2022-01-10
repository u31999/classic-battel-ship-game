let soundStatus;
const toggleSound = (soundIcon) => {
    soundIcon.addEventListener('click', () => {
        if (soundIcon.classList.contains('fa-volume-mute')) {
            soundIcon.classList.toggle('fa-volume-mute');
            soundIcon.classList.toggle('fa-volume-up');
            runMusic(true);
            soundStatus = true;
        } else {
            soundIcon.classList.toggle('fa-volume-up');
            soundIcon.classList.toggle('fa-volume-mute');
            runMusic(false);
            soundStatus = false;
        }
    });
};

const soundItem = {
    mainMenu: './src/sounds/main-menu-music.mp3',
    hit: './src/sounds/hit.wav',
    miss: 'src/sounds/miss.wav',
    destory: 'src/sounds/ship-destory.wav',
};

const runMusic = (sound) => {
    const audioTag = document.querySelector('.sound-icon [data-audio=main]');
    let audioData = audioTag.dataset.audio;
    if (audioData === 'main') {
        audioTag.src = soundItem.mainMenu;
        audioTag.loop = true;
        if (sound === true) {
            audioTag.currentTime = 1;
            audioTag.play();
        }
        if (sound === false) {
            audioTag.pause();
            audioTag.currentTime = 1;
        }
    }

};

export { toggleSound, soundStatus, soundItem, runMusic };
