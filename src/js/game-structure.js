import { makeElement } from "./methods.js";
import { board, positionItem, ships } from "./game-tools.js";
import { showBattelBoards } from "./battel.js";

const ChangeBody = (() => {
    const runNewGame = (container) => {


        container.classList.toggle('positiont-ships');

        const leftContainer = makeElement('div', container, 'left-body');
        const rightContainer = makeElement('div', container, 'right-body');

        const topRight = makeElement('div', rightContainer, 'top-right-body');
        const cancelBtn = makeElement('button', topRight, 'cancel-btn');
        cancelBtn.innerText = 'X';

        const bottomLeft = makeElement('div', rightContainer, 'bottom-right-body');
        const playBtn = makeElement('button', bottomLeft, 'play-battel-btn');
        playBtn.innerText = 'Play';

        const hint = makeElement('div', rightContainer, 'position-hint');
        hint.innerText = "Position Your Ships";

        const gameBoard = board.makeGameBoard(leftContainer);

        const fleet = positionItem.makeFleet(ships, gameBoard);

        cancelBtn.addEventListener('click', () => {
            leftContainer.remove();
            rightContainer.remove();
            document.querySelector('.title').lastElementChild.style.display = 'block';
            [...container.children].forEach(child => child.style.display = 'block');
            container.classList.toggle('positiont-ships');
        });

        playBtn.addEventListener('click', (e) => {
            leftContainer.remove();
            rightContainer.remove();

            showBattelBoards(gameBoard, container, fleet.fleet);
        });

    };

    return {
        runNewGame,
    };

})();

export { ChangeBody };