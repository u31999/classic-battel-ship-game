//make a new element and append it and return the elemnt
const makeElement = (el, elToAppend, cOrId) => {
    const element = document.createElement(`${el}`);
    if (elToAppend === undefined) {
        document.body.append(element);
    } else {
        elToAppend.append(element);
    }

    if (cOrId === undefined) return element;

    if (cOrId[0] === '#') {
        element.setAttribute('id', `${cOrId}`);
    } else {
        element.classList.toggle(`${cOrId}`);
    }

    return element;
};

//remove all element children
const removeChildren = (parent) => {
    parent.childNodes.forEach(child => child.remove());
};

export { makeElement, removeChildren };