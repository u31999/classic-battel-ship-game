import { runMusic, toggleSound } from "./sounds.js";
import { ChangeBody } from "./game-structure.js";
const main = (() => {
    const soundItem = document.querySelector('.sound-icon i');
    const githubIcon = document.querySelector('#copyright i');
    const body = document.querySelector('#body');
    const newGameBtn = body.querySelector('.new-game');
    const titleSlogan = document.querySelector('#header .title').lastElementChild;

    toggleSound(soundItem);
    runMusic(true);

    //run the game options div
    newGameBtn.addEventListener('click', () => {
        //button hide
        [...body.children].forEach(child => child.style.display = 'none');
        ChangeBody.runNewGame(body);
        titleSlogan.style.display = 'none';
    });


    //open the githup on click
    githubIcon.addEventListener('click', () => window.open('https://github.com/u31999/classic-battel-ship-game', '_blank'));


})();