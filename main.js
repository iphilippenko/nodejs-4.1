const BtnClickDelay = 500, // in ms
    BtnPressDelay = 750;
let lastButton,
    typedResElem;

const print = (type, tempChar = '') => {
    let str = typedResElem.innerHTML;
    switch (type) {
        case 'newChar':
            str += tempChar;
            break;
        case 'backspace':
            str = str.substring(0, str.length - 1);
            break;
        default:
            str = '';
            break;
    }
    typedResElem.innerHTML = str;
};

const ButtonEl = function (el) {
    this.key = el[0];
    this.dictionary = el[1];
    this.clickCount = 0;
    this.lastClickTime = new Date();
    this.pressTimeout = null;
    this.isLongPressed = false;
    this.onClickFn = () => {
        if (!this.isLongPressed) {
            clearTimeout(this.clickTimeout);
            if (typeof lastButton !== 'undefined' && lastButton.key !== this.key) {
                clearTimeout(lastButton.clickTimeout);
                print('newChar', lastButton.tempChar);
                lastButton.tempChar = '';
            }
            lastButton = this;
            this.clickCount = (new Date().getTime() - this.lastClickTime <= BtnClickDelay) || !this.clickCount
                ? this.clickCount + 1 : 1;
            this.lastClickTime = new Date();
            this.clickCount - 1 >= this.dictionary.length ? this.clickCount = 1 : null;
            this.tempChar = this.dictionary[this.clickCount - 1];
            this.clickTimeout = setTimeout(() => {
                print('newChar', this.tempChar);
                this.tempChar = '';
            }, BtnClickDelay);
        }
    };
    this.longPressFn = () => {
        this.isLongPressed = true;
        print('newChar', this.key);
    }
};
let btnsArr = [[1, '.,!'], [2, 'abc'], [3, 'def'], [4, 'ghi'],
    [5, 'jkl'], [6, 'mno'], [7, 'pqrs'], [8, 'tuv'],
    [9, 'wxyz'], ['*', '*'], [0, ' '], ['#', '#']]
    .map(el => new ButtonEl(el));

document.addEventListener('DOMContentLoaded', function (ev) {
    typedResElem = document.createElement('p');
    typedResElem.setAttribute('id', 'typedResElem');
    typedResElem.innerHTML = ``;
    document.querySelector('.screen').appendChild(typedResElem);
    btnsArr.forEach((btn) => {
        btn.htmlEl = document.createElement('button');
        btn.htmlEl.innerHTML = `<b>${btn.key}</b><p>${btn.dictionary}</p>`;
        btn.htmlEl.setAttribute('class', 'phone-btn');

        btn.htmlEl.addEventListener('mouseup', () => {
            btn.onClickFn();
            btn.isLongPressed = false;
            clearTimeout(btn.pressTimeout);
        });
        btn.htmlEl.addEventListener('mousedown', () => {
            btn.pressTimeout = setTimeout(btn.longPressFn, BtnPressDelay);
        });

        document.querySelector('.btns-wrapper').appendChild(btn.htmlEl);
    });
    document.querySelector('#clear').addEventListener('click', () => print('clear'));
    document.querySelector('#backspace').addEventListener('click', () => print('backspace'));
});
