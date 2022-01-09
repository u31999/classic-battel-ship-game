import { makeElement } from "./methods.js";
import { ChangeBody } from "./game-structure.js";
import { soundStatus, soundItem } from "./sounds.js";

const mediaQueriy = window.matchMedia("(max-width: 420px)");

const showMessage = (status) => {
    const message = makeElement('div', body, 'message');

    switch (status) {
        case 'start':
            message.innerText = 'Battle Begin';
            break;
        case 'player-turn':
            message.innerText = 'Your Turn';
            break;
        case 'com-turn':
            message.innerText = 'Com Turn';
            break;
        default:
            break;
    }

    setTimeout(() => message.style.display = 'none', 1200);


};


const battelMenu = () => {
    const headerSoundPlace = document.querySelector('#header .sound-icon');

    const menu = makeElement('i', headerSoundPlace, 'fas');
    menu.className += ' fa-bars';

    headerSoundPlace.classList.toggle('battle-state');

    menu.addEventListener('click', runMenu);

    function runMenu() {
        const window = headerSoundPlace.parentElement.parentElement;
        const menuOpen = makeElement('div', window, 'battle-menu');
        const homeBtn = makeElement('button', menuOpen, 'home-btn');
        const resumeBtn = makeElement('button', menuOpen, 'resume-btn');
        const rematchBtn = makeElement('button', menuOpen, 'rematch-btn');

        homeBtn.innerText = 'Home';
        resumeBtn.innerText = 'Resume';
        rematchBtn.innerText = 'Rematch';

        resumeBtn.addEventListener('click', () => menuOpen.remove());
        homeBtn.addEventListener('click', () => returnHome(menuOpen));
        rematchBtn.addEventListener('click', () => rematchGame(menuOpen));
    }

    function returnHome(menu) {
        const body = document.querySelector('#body');

        body.querySelector('.left-body').remove();
        body.querySelector('.right-body').remove();
        body.querySelectorAll('.message').forEach(m => m.remove());
        document.querySelector('#header .fa-bars').remove();

        menu.remove();

        document.querySelector('.title').lastElementChild.style.display = 'block';

        [...body.children].forEach(child => child.style.display = 'block');
        body.classList.toggle('positiont-ships');

        headerSoundPlace.classList.toggle('battle-state');
        body.classList.toggle('battel-status');



    }

    function rematchGame(menu) {
        const body = document.querySelector('#body');
        body.querySelector('.left-body').remove();
        body.querySelector('.right-body').remove();
        body.querySelectorAll('.message').forEach(m => m.remove());
        document.querySelector('#header .fa-bars').remove();

        headerSoundPlace.classList.toggle('battle-state');
        body.classList.toggle('positiont-ships');
        body.classList.toggle('battle-status');


        menu.remove();
        ChangeBody.runNewGame(body);
        body.classList.toggle('battel-status');
    }



};


const makeComBoard = (board, elToAbbend) => {
    const body = document.querySelector('#body');
    elToAbbend.append(board);

    body.classList.toggle('battel-status');
    board.classList.toggle('enemy-board');

    elToAbbend.classList.toggle('right-body-battle');
    const enemyFleet = [];

    const setShipsInPosition = (enemyFleet, shipPositions) => {
        const rightBody = document.querySelector('#body .right-body');
        let pNode;
        shipPositions.forEach((p, i) => {
            pNode = rightBody.querySelector(`div [data-axis='${p}']`);
            let shipName = enemyFleet[i].className.slice(0, enemyFleet[i].className.indexOf('-'));
            let pNum = p.slice(0, p.indexOf('-'));
            let pChar = p.slice(p.indexOf('-') + 1);

            if (pNode.firstChild === null) {
                pNode.append(enemyFleet[i]);

            }
            pNum = Number(pNum);
            if (shipName === 'carrier') {
                if (pNum === 8) pNum -= 1;
                if (pNum === 9) pNum -= 2;
                if (pNum === 10) pNum -= 3;

                rightBody.querySelector(`div [data-axis='${pNum}-${pChar}']`).
                    append(enemyFleet[i]);
            }
            if (shipName === 'battleship') {
                if (pNum === 9) pNum -= 1;
                if (pNum === 10) pNum -= 2;

                rightBody.querySelector(`div [data-axis='${pNum.toString()}-${pChar}']`).
                    append(enemyFleet[i]);
            }
            if (shipName === 'cruiser') {
                if (pNum === 10) pNum -= 1;

                rightBody.querySelector(`div [data-axis='${pNum.toString()}-${pChar}']`).
                    append(enemyFleet[i]);
            }


        });

    };

    const getRandomPositiont = () => {
        let result = [];
        let charArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        let allPosittion = [];
        let slice = [];

        charArr.forEach(char => {
            for (let i = 1; i <= 10; i++) {
                allPosittion.push(document.querySelector(`.right-body .sea-board [data-axis='${i}-${char}']`));
            }
        });


        slice[0] = allPosittion.slice(0, 10);
        slice[1] = allPosittion.slice(10, 20);
        slice[2] = allPosittion.slice(20, 30);
        slice[3] = allPosittion.slice(30, 40);
        slice[4] = allPosittion.slice(40, 50);
        slice[5] = allPosittion.slice(50, 60);
        slice[6] = allPosittion.slice(60, 70);
        slice[7] = allPosittion.slice(70, 80);
        slice[8] = allPosittion.slice(80, 90);
        slice[9] = allPosittion.slice(90, 100);

        slice.forEach(s => {
            let randomNum = Math.floor(Math.random() * 10);
            if (randomNum === 0) randomNum = Math.ceil(Math.random() * 9);
            result.push(s[randomNum].dataset.axis);

        });

        return result;
    };

    const setEnemyShips = () => {
        const seaBoardNode = board.querySelectorAll('div [data-axis]');

        const allPosittion = [];
        const filledPosition = [];


        seaBoardNode.forEach(node => {
            allPosittion.push(node.dataset.axis);

            if (node.firstElementChild) {
                filledPosition.push(node.dataset.axis);
                let firstChild = node.firstElementChild;
                let shipName = [...firstChild.className].slice(0, firstChild.className.indexOf('-')).join('');
                let nodeNum = [...node.dataset.axis].slice(0, node.dataset.axis.indexOf('-'));
                let nodeChar = [...node.dataset.axis].slice(node.dataset.axis.indexOf('-') + 1);
                let extraSpace;
                enemyFleet.push(firstChild);

                nodeNum = Number(nodeNum);

                if (shipName === 'carrier') {
                    for (let i = 0; i < 3; i++) {
                        extraSpace = board.querySelector(`div [data-axis='${nodeNum + 1}-${nodeChar}']`);
                        filledPosition.push(extraSpace.dataset.axis);
                        nodeNum += 1;
                    }

                } else if (shipName === 'battleship') {
                    for (let i = 0; i < 2; i++) {
                        extraSpace = board.querySelector(`div [data-axis='${nodeNum + 1}-${nodeChar}']`);
                        filledPosition.push(extraSpace.dataset.axis);
                        nodeNum += 1;
                    }
                } else if (shipName === 'cruiser') {
                    for (let i = 0; i < 1; i++) {
                        extraSpace = board.querySelector(`div [data-axis='${nodeNum + 1}-${nodeChar}']`);
                        filledPosition.push(extraSpace.dataset.axis);
                    }
                }

            }


        });
    };

    const makeCover = () => {
        const seaBoard = [...document.querySelectorAll('.right-body .sea-board [data-axis]')];
        let allPosition = [];

        seaBoard.forEach(child => {
            if (child.firstElementChild !== null) allPosition.push(child.firstElementChild);

        });
        allPosition.forEach(ship => {
            let name = ship.className.slice(0, ship.className.indexOf('-'));
            if (name === 'carrier') {
                ship.classList.toggle('hide');
            }
            if (name === 'battleship') {
                ship.classList.toggle('hide');

            }
            if (name === 'cruiser') {
                ship.classList.toggle('hide');
            }
            if (name === 'submarine') {
                ship.classList.toggle('hide');

            }
        });

    };

    const shipPositions = getRandomPositiont();

    setEnemyShips();

    setShipsInPosition(enemyFleet, shipPositions);

    makeCover();


};

const mediaQueriyStyleBattle = () => {
    const headerTitle = document.querySelector('#header .title').firstElementChild;
    const rightBodyBattle = document.querySelector('.right-body-battle');
    const copyRight = document.querySelector('#copyright');
    const header = document.querySelector('#header');


    headerTitle.style.display = 'none';
    rightBodyBattle.style.marginTop = '0px';
    copyRight.style.display = 'none';
    header.style.paddingBottom = '5px';

};

const showBattelBoards = (board, body, playerFleet) => {

    showMessage('start');

    const playerBoard = makeElement('div', body, 'left-body');
    const enemyBoard = makeElement('div', body, 'right-body');

    playerBoard.classList.toggle('left-battle');

    playerBoard.append(board);


    playerFleet.forEach(ship => {
        ship.removeAttribute('draggable');
        ship.replaceWith(ship.cloneNode(true));
        board.replaceWith(board.cloneNode(true));
    });

    const playerBoardTittle = makeElement('div', playerBoard, 'fleet-tittle');
    playerBoardTittle.innerText = 'Yuor Fleet';

    const comBoardTittle = makeElement('div', enemyBoard, 'fleet-tittle');
    comBoardTittle.innerText = 'Enemey Fleet';


    // make battel menu
    battelMenu();

    //make com board
    const allCover = makeComBoard(board, enemyBoard);

    //battel Logic
    battelLogic(allCover);

    if (mediaQueriy.matches) {
        mediaQueriyStyleBattle();
    }

};

const battelLogic = () => {
    const enemySeaBooard = document.querySelector('.right-body-battle .enemy-board .sea-board');
    const playerSeaBooard = document.querySelector('.left-battle .game-board .sea-board');
    const audioEffect = document.querySelector('.sound-icon [data-audio=effect]');
    let batleStatus = document.querySelector('.battel-status');
    let playerBoard;
    let enemyBoard;
    let playerPoint = 0;
    let comPoint = 0;
    let triger = true;

    const filledPosition = (enemyBoard, playerBoard) => {
        let enemyShip = [];
        let playerShip = [];
        let name, num, char;

        playerBoard.childNodes.forEach(child => {
            child.childNodes.forEach(c => {
                if (c.firstChild !== null) {
                    name = c.firstChild.className.slice(0, c.firstChild.className.indexOf('-'));
                    num = c.dataset.axis.slice(0, c.dataset.axis.indexOf('-'));
                    char = c.dataset.axis.slice(c.dataset.axis.indexOf('-') + 1);
                    num = Number(num);
                    if (name === 'carrier') {
                        for (let i = 0; i <= 3; i++) {
                            playerShip.push(playerBoard.querySelector(`div [data-axis='${num}-${char}']`).dataset.axis);
                            num++;
                        }
                    } else if (name === 'battleship') {
                        for (let i = 0; i <= 2; i++) {
                            playerShip.push(playerBoard.querySelector(`div [data-axis='${num}-${char}']`).dataset.axis);
                            num++;
                        }
                    } else if (name === 'cruiser') {
                        for (let i = 0; i <= 1; i++) {
                            playerShip.push(playerBoard.querySelector(`div [data-axis='${num}-${char}']`).dataset.axis);
                            num++;
                        }
                    } else if (name === 'submarine') {
                        playerShip.push(playerBoard.querySelector(`div [data-axis='${num}-${char}']`).dataset.axis);
                        num++;
                    }
                }
            });
        });

        enemyBoard.childNodes.forEach(child => {
            child.childNodes.forEach(c => {
                if (c.firstChild !== null) {
                    name = c.firstChild.className.slice(0, c.firstChild.className.indexOf('-'));
                    num = c.dataset.axis.slice(0, c.dataset.axis.indexOf('-'));
                    char = c.dataset.axis.slice(c.dataset.axis.indexOf('-') + 1);
                    num = Number(num);
                    if (name === 'carrier') {
                        for (let i = 0; i <= 3; i++) {
                            enemyShip.push(enemyBoard.querySelector(`div [data-axis='${num}-${char}']`).dataset.axis);
                            num += 1;
                        }
                    } else if (name === 'battleship') {
                        for (let i = 0; i <= 2; i++) {
                            enemyShip.push(enemyBoard.querySelector(`div [data-axis='${num}-${char}']`).dataset.axis);
                            num += 1;
                        }
                    } else if (name === 'cruiser') {
                        for (let i = 0; i <= 1; i++) {
                            enemyShip.push(enemyBoard.querySelector(`div [data-axis='${num}-${char}']`).dataset.axis);
                            num += 1;
                        }
                    } else if (name === 'submarine') {
                        enemyShip.push(enemyBoard.querySelector(`div [data-axis='${num}-${char}']`).dataset.axis);
                        num += 1;
                    }
                }
            });
        });

        return {
            playerShip,
            enemyShip
        };
    };

    const checkWin = () => {
        let status;
        if (playerPoint === 10) return (status = 'You Win');
        if (comPoint === 10) return (status = 'You Lose');
        return (status = 'continue');
    };

    const endGame = (status) => {
        const finishDiv = makeElement('div', document.body, 'finish-page');
        const txt = makeElement('div', finishDiv, 'txt');
        const btn = makeElement('button', finishDiv, 'btn');
        btn.innerText = 'menu';
        if (status === 'You Win') {
            txt.innerText = 'Congratulation You Win';
            txt.style.color = 'yellow';
        }
        if (status === 'You Lose') {
            txt.innerText = 'You Lose';
            txt.style.color = 'red';
        }

        btn.addEventListener('click', returnToHome);

        function returnToHome() {
            const headerSoundPlace = document.querySelector('#header .sound-icon');
            const body = document.querySelector('#body');
            const menu = document.querySelector('.finish-page');

            body.querySelector('.left-body').remove();
            body.querySelector('.right-body').remove();
            body.querySelectorAll('.message').forEach(m => m.remove());
            document.querySelector('#header .fa-bars').remove();

            menu.remove();

            document.querySelector('.title').lastElementChild.style.display = 'block';

            [...body.children].forEach(child => child.style.display = 'block');
            body.classList.toggle('positiont-ships');

            headerSoundPlace.classList.toggle('battle-state');
            body.classList.toggle('battel-status');


        }
    };

    const filled = filledPosition(enemySeaBooard, playerSeaBooard);

    playerTurn(enemySeaBooard);
    let allPositionEnemy = allPositionFunc(playerSeaBooard);

    function allPositionFunc(playerBoard) {
        let allPosition = [];
        playerBoard.childNodes.forEach(child => {
            child.childNodes.forEach(c => {
                if (c.firstElementChild !== null) {
                    c.firstElementChild.childNodes.forEach(cc => allPosition.push(cc));
                }
                allPosition.push(c);
            });
        });

        allPosition.forEach(p => {
            let el;
            for (let i = 0; i <= filled.playerShip.length - 1; i++) {
                el = playerBoard.querySelector(`div [data-axis='${filled.playerShip[i]}']`);
                if (p === el) {
                    allPosition.splice(allPosition.indexOf(p), 1);
                }
            }
        });
        return allPosition;
    }

    function playerTurn(board) {

        const interval = setInterval(() => {
            showMessage('player-turn');
            clearInterval(interval);

        }, 1050);


        const allPosition = [];
        board.childNodes.forEach(child => {
            child.childNodes.forEach(c => allPosition.push(c));
        });



        allPosition.forEach(p => p.addEventListener('click', (e) => fire(e), true));

        function fire(e) {
            if (triger === false) return;
            if (e.target.classList.contains('off')) return;

            triger = false;

            let live, ship;
            if (e.target.classList.contains('cover')) {
                live = e.target.parentElement.dataset.live;
                ship = e.target.parentElement;
                e.target.parentElement.dataset.live = Number(live) - 1;
                e.target.innerText = 'X';

                //check parent live
                if (ship.dataset.live === '0') {
                    playerPoint += 1;
                    ship.classList.toggle('hide');
                    ship.childNodes.forEach(child => child.style.opacity = '.4');
                    if (soundStatus === true) {
                        audioEffect.src = soundItem.destory;
                        audioEffect.play();
                    }
                } else {
                    if (soundStatus === true) {
                        audioEffect.src = soundItem.hit;
                        audioEffect.play();
                    }
                }


                //change style
                e.target.style.backgroundColor = 'red';
                e.target.style.color = 'black';
                e.target.style.display = 'flex';
                e.target.style.alignItems = 'center';
                e.target.style.justifyContent = 'center';
                e.target.style.fontWeight = '900';
                e.target.style.fontSize = '20px';


            } else {
                e.target.style.display = 'flex';
                e.target.style.alignItems = 'center';
                e.target.style.justifyContent = 'center';
                e.target.style.opacity = '0.5';
                if (soundStatus === true) {
                    audioEffect.src = soundItem.miss;
                    audioEffect.play();
                }
            }

            let winStatus = checkWin();
            //stop execute evene
            if (winStatus === 'You Win') return endGame(winStatus);
            else if (winStatus === 'You Lose') return endGame(winStatus);
            else {

                if (mediaQueriy.matches) {
                    /* add a replace methods */
                }

                e.target.classList.add('off');
                setTimeout(() => {
                    showMessage('com-turn');
                }, 500);
                setTimeout(() => {
                    comTurn(allPositionEnemy);
                    document.querySelector('#body .message').remove();
                    if (mediaQueriy.matches) {
                        playerBoard.replaceWith(enemyBoard);
                    }
                }, 1000);
            }
        }
    }

    function comTurn(allPosition) {

        let ranomMax = allPosition.length - 1;

        let random = Math.floor(Math.random() * ranomMax);

        let target = allPosition[random];
        let live;

        if (target.classList.contains('cover')) {
            live = target.parentElement.dataset.live;
            target.style.backgroundColor = 'red';
            target.style.opacity = '.5';
            target.parentElement.dataset.live = Number(live) - 1;
            target.classList.toggle('off');
            target.innerText = 'X';
            target.style.color = 'black';
            target.style.display = 'flex';
            target.style.alignItems = 'center';
            target.style.justifyContent = 'center';
            target.style.fontWeight = '900';
            target.style.fontSize = '20px';
            allPosition.splice(allPosition.indexOf(target), 1);
            if (Number(target.parentElement.dataset.live) === 0) {
                comPoint += 1;
                if (soundStatus === true) {
                    audioEffect.src = soundItem.destory;
                    audioEffect.play();
                }
            } else {

                if (soundStatus === true) {
                    audioEffect.src = soundItem.hit;
                    audioEffect.play();
                }
            }

        } else {
            target.style.opacity = '.5';
            target.classList.toggle('off');
            allPosition.splice(allPosition.indexOf(target), 1);
            if (soundStatus === true) {
                audioEffect.src = soundItem.miss;
                audioEffect.play();
            }
        }


        let winStatus = checkWin();
        if (winStatus === 'You Win') return endGame(winStatus);
        else if (winStatus === 'You Lose') return endGame(winStatus);
        else { triger = true; }

    }


};

export { showBattelBoards };

