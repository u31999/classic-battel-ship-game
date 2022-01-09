import { makeElement } from "./methods.js";
const ships = {
    carrier: {
        lives: 4,
        size: 4,
        pieces: 1,
        url: './src/img/carrier.png',
        position: { 1: '2-I' }
    },
    battleship: {
        lives: 3,
        size: 3,
        pieces: 2,
        url: 'src/img/battleship.png',
        position: {
            1: '3-C',
            2: '8-A'
        }
    },
    cruiser: {
        lives: 2,
        size: 2,
        pieces: 3,
        url: 'src/img/cruiser.png',
        position: {
            1: '5-E',
            2: '9-C',
            3: '9-H'
        }
    },
    submarine: {
        lives: 1,
        size: 1,
        pieces: 4,
        url: 'src/img/submarine.png',
        position: {
            1: '2-G',
            2: '3-E',
            3: '6-G',
            4: '8-J'
        }

    }
};

const positionItem = (() => {
    const getWidthXhight = (w, h, sizeWidth, sizeHeight) => {
        if (sizeHeight === undefined) sizeHeight = 1;
        if (sizeWidth === undefined) sizeWidth = 1;
        const width = w * sizeWidth;
        const height = h * sizeHeight;
        return {
            width,
            height
        };
    };

    const makePieceStyle = (element, w, h) => {
        element.style.width = `${w - 2}px`;
        element.style.height = `${h - 2}px`;
        element.style.position = 'absolute';
        element.style.backgroundImage = `url(${ships[`${element.classList}`].url})`;
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundSize = 'contain';
        element.style.backgroundColor = 'rgb(0 105 147)';
        element.style.display = 'flex';
        element.style.flexDirection = 'column';
        element.style.justifyContent = 'space-evenly';
        element.style.backgroundPosition = 'center';


        [...element.children].forEach(child => {
            child.style.border = 'none';
            child.style.flex = '1';
            child.style.backgroundColor = 'rgb(255 255 255 / 0.1)';
            /*
            child.style.border = 'solid 0.5px var(--body-border-color)';
            child.style.backgroundColor = '#006993';
            child.style.borderCollapse = 'collapse';
            */

        });

    };


    const positionShip = (ship, position, board) => {
        const targetBox = board.querySelector(`div [data-axis='${position}']`);
        targetBox.append(ship);

        let signP = ship.className.indexOf('-');
        let shipName = [...ship.className].slice(0, signP).join('');
        let fillEl = [];

        ships[`${shipName}`].fillElement = fillEl;

    };

    const makePieces = (el, elToAppend, c, n) => {
        for (let i = 1; i <= n; i++) {
            makeElement(`${el}`, elToAppend, `${c}`);
        }
    };


    const makeFleet = (ships, board) => {
        const seaBoard = board.lastElementChild.lastElementChild;

        const boxHeight = seaBoard.offsetHeight / 10;
        const boxWidth = seaBoard.offsetWidth / 10;

        const shipsKey = [...Object.keys(ships)];

        let fleet = [];
        for (const item of shipsKey) {
            let widthXheight = getWidthXhight(boxWidth, boxHeight, 1, ships[`${item}`].lives);
            let numPieces = ships[`${item}`].pieces;
            for (let i = 0; i <= ships[`${item}`].pieces - 1; i++) {
                let element = makeElement('div', seaBoard, [`${item}`]);
                let itemPosition = ships[`${item}`].position[`${numPieces}`];
                makePieceStyle(element, widthXheight.width, widthXheight.height);
                element.className += `-${numPieces}`;
                positionShip(element, itemPosition, seaBoard);
                element.draggable = 'true';
                fleet.push(element);
                element.className += ' fill';
                if (item === 'carrier') {
                    element.setAttribute('data-live', '4');
                    makePieces('div', element, 'cover', 4);
                }
                if (item === 'battleship') {
                    element.setAttribute('data-live', '3');
                    makePieces('div', element, 'cover', 3);
                }
                if (item === 'cruiser') {
                    element.setAttribute('data-live', '2');
                    makePieces('div', element, 'cover', 2);
                }
                if (item === 'submarine') {
                    element.setAttribute('data-live', '1');
                    makePieces('div', element, 'cover', 1);
                }
                numPieces--;
            }


        }
        moveShip(seaBoard);


        return { fleet, seaBoard };


    };

    const moveShip = (gameBoard) => {

        const boxes = document.querySelectorAll('div [data-axis]');

        boxes.forEach(zone => { if (!zone.className.includes('fill')) zone.className += ' empty'; });

        const fill = gameBoard.querySelectorAll('.fill');
        const emptys = gameBoard.querySelectorAll('.empty');
        let screenSize = window.matchMedia('(max-device-width : 480px)');


        let dragged;
        let theElementPoint;


        //if it is not a mobile 
        if (!screenSize.matches) {
            // fill listeners
            fill.forEach(item => {
                item.addEventListener('dragstart', (e) => dragStart(e));
                item.addEventListener('dragend', dragEnd);
                //loop through empty 
                for (const empty of emptys) {
                    empty.addEventListener('dragover', dragOver);
                    empty.addEventListener('dragenter', dragEnter);
                    empty.addEventListener('dragleave', dragLeave);
                    empty.addEventListener('drop', dragDrop);
                }

            });
        } else if (screenSize.matches) {
            //if its mobile 
            fill.forEach(item => {
                item.addEventListener('touchstart', (e) => dragStartTouch(e));
                item.addEventListener('touchmove', moveTouch);

                item.addEventListener('touchend', dragDropTouch);



            });



        }

        function dragStartTouch(e) {
            dragged = e.currentTarget;
        }
        function moveTouch() {
            if (dragged) {
                theElementPoint = document.elementFromPoint(event.targetTouches[0].clientX, event.targetTouches[0].clientY);

            }
        }
        function dragDropTouch() {
            if (dragged) {

                // reset our element
                for (let box of boxes) {
                    if (theElementPoint === box) {
                        let name = dragged.className.slice(0, dragged.className.indexOf('-'));
                        let axisNum = box.dataset.axis.slice(0, box.dataset.axis.indexOf('-'));
                        let axischar = box.dataset.axis.slice(box.dataset.axis.indexOf('-') + 1);
                        if (name === 'carrier') {
                            if (axisNum != 10 && axisNum != 9 && axisNum != 8) {
                                for (let i = 0; i <= 3; i++) {
                                    axisNum = Number(axisNum);
                                    if (document.querySelector(`.grid [data-axis='${axisNum}-${axischar}']`).firstElementChild !== null) {
                                        return;
                                    }
                                    axisNum += 1;
                                }
                                box.append(dragged);
                            }
                        } else if (name === 'battleship') {
                            if (axisNum != 9 && axisNum != 10) {
                                for (let i = 0; i <= 2; i++) {
                                    axisNum = Number(axisNum);
                                    if (document.querySelector(`.grid [data-axis='${axisNum}-${axischar}']`).firstElementChild !== null) {
                                        return;
                                    }
                                    axisNum += 1;
                                }
                                box.append(dragged);
                            }
                        } else if (name === 'cruiser') {
                            if (axisNum != 10) {
                                for (let i = 0; i <= 1; i++) {
                                    axisNum = Number(axisNum);
                                    if (document.querySelector(`.grid [data-axis='${axisNum}-${axischar}']`).firstElementChild !== null) {
                                        return;
                                    }
                                    axisNum += 1;
                                }
                                box.append(dragged);
                            }
                        } else if (name === 'submarine') {
                            axisNum = Number(axisNum);
                            if (document.querySelector(`.grid [data-axis='${axisNum}-${axischar}']`).firstElementChild !== null) {
                                return;
                            }
                            box.append(dragged);
                        }


                    }
                }
            }
        }

        // drag functions
        function dragStart(e) {
            dragged = e.target;
        }

        function dragEnd() {
        }

        function dragOver(e) {
            e.preventDefault();
        }
        function dragEnter(e) {
            e.preventDefault();
        }
        function dragLeave() {
            this.className = 'grid empty';
        }
        function dragDrop(event) {
            event.preventDefault();
            this.className = 'grid empty';
            let name = dragged.className.slice(0, dragged.className.indexOf('-'));
            let axisNum = this.dataset.axis.slice(0, this.dataset.axis.indexOf('-'));
            let axischar = this.dataset.axis.slice(this.dataset.axis.indexOf('-') + 1);

            if (name === 'carrier') {
                if (axisNum != 8 && axisNum != 9 && axisNum != 10) {
                    for (let i = 0; i <= 3; i++) {
                        axisNum = Number(axisNum);
                        if (document.querySelector(`.grid [data-axis='${axisNum}-${axischar}']`).firstElementChild !== null) {
                            return;
                        }
                        axisNum += 1;
                    }
                    if (this.firstElementChild === null) this.append(dragged);
                }
            }
            if (name === 'battleship') {
                if (axisNum != 9 && axisNum != 10) {
                    for (let i = 0; i <= 2; i++) {
                        axisNum = Number(axisNum);
                        if (document.querySelector(`.grid [data-axis='${axisNum}-${axischar}']`).firstElementChild !== null) {
                            return;
                        }
                        axisNum += 1;
                    }
                    if (this.firstElementChild === null) this.append(dragged);
                }
            }
            if (name === 'cruiser') {
                if (axisNum != 10) {
                    for (let i = 0; i <= 1; i++) {
                        axisNum = Number(axisNum);
                        if (document.querySelector(`.grid [data-axis='${axisNum}-${axischar}']`).firstElementChild !== null) {
                            return;
                        }
                        axisNum += 1;
                    }
                    if (this.firstElementChild === null) this.append(dragged);
                }
            }
            if (name === 'submarine') {
                axisNum = Number(axisNum);
                if (document.querySelector(`.grid [data-axis='${axisNum}-${axischar}']`).firstElementChild !== null) {
                    return;
                }

                if (this.firstElementChild === null) this.append(dragged);
            }



        }

        return gameBoard;

    };




    return {
        makeFleet,
        moveShip
    };
})();

const board = (() => {
    const gameAxis = {
        rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    };

    const makeGameBoard = (elToAppend) => {
        let rows = gameAxis.rows;
        let columns = gameAxis.columns;
        const boardContiner = makeElement('div', elToAppend, 'game-board');

        const topBoard = makeElement('div', boardContiner, 'top-board');
        const voidSpaceTop = makeElement('div', topBoard, 'void');
        const columnAxis = makeElement('div', topBoard, 'column-axis');

        const bottomBoard = makeElement('div', boardContiner, 'bottom-board');
        const rowAxis = makeElement('div', bottomBoard, 'row-axis');
        const seaBoard = makeElement('div', bottomBoard, 'sea-board');

        rows.forEach(row => {
            makeElement('div', rowAxis, 'row').innerText = row;
        });

        columns.forEach(col => {
            makeElement('div', columnAxis, 'column').innerText = col;
        });

        rows.forEach(row => {
            makeElement('div', seaBoard, 'grid').setAttribute('data-row', `${row}`);
        });

        const rowDom = document.querySelectorAll('.sea-board [data-row]');
        rowDom.forEach(row => {
            for (const col of columns) {
                makeElement('div', row, 'grid').
                    setAttribute('data-axis', `${row.dataset.row}-${col}`);
            }

        });

        return boardContiner;
    };

    return {
        makeGameBoard,
        positionItem
    };
})();

export { board, positionItem, ships };