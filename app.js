
'use strict'

// const axios = require('axios');

const imageBlock = document.querySelector('.img')
const lettersBlock = document.querySelector('.letters')
const wordBlock = document.querySelector('.word')
const button = document.querySelector('button')


// console.log(button);

// Your API is available at api.mocki.io/v1/5b2b9099
let data
const getResource = async (url) => {

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`could not fetch url ${url}, status ${res.status}`)
    }

    return await res.json();
};
getResource('https://api.mocki.io/v1/5b2b9099')
    .then(dat => {
        data = dat.data
        init()

    })
    .then(() => timer());


// console.log(data);




class GlobalCount {
    constructor(count) {
        this.count = count || 0

    }
    setCount(setedCount) {
        this.count = setedCount
    }
    reternCount() {
        return this.count
    }



}
const globalCount = new GlobalCount();

let changeWordTimer

function init(showIndex = 0, counter = 0) {

    let WordTimer = 30;
    const initialWord = data[showIndex].word
    const image = data[showIndex].image
    const word = initialWord.split('')
    let shuffledArr;
    generateRandomWord()  // генерит перемешенное слово с добавочными буквами
    const noChangeableShuffledArr = shuffledArr.concat() // массив исходник слова
    let guessWord = word.map(i => '')  //поле угадываемого слова
    button.addEventListener('click', help)
    renderImage(image, imageBlock)
    reRenderWords()
    renderCount()

    changeWordTimer = setInterval(function () {
        WordTimer = WordTimer - 1;
        // console.log(WordTimer);
        if (WordTimer == 0) {
            changeWord(true)
            clearInterval(changeWordTimer)
        }

    }, 1000)


    function reRenderWords() {
        const arr1 = word.join();
        const arr2 = guessWord.join();

        if (arr1 == arr2) {

            changeWord()
            clearInterval(changeWordTimer)

        }
        showLLetters(guessWord, wordBlock)
        showLLetters(shuffledArr, lettersBlock)

    }

    function changeWord(skip) {
        setTimeout(() => {
            showIndex = showIndex + 1
            imageBlock.innerHTML = ''
            clearWordsContent()
            button.disabled = false;
            skip ? counter : counter += 1
            globalCount.setCount(counter)
            init(showIndex, counter)

        }, 200)
    }
    function renderCount() {
        const counterBlock = document.querySelector('.counter')
        counterBlock.innerHTML = `Counter: ${counter}`
    }

    function renderImage(image, block) {
        const element = document.createElement('img');
        element.setAttribute("src", image);
        block.append(element);
    }

    function showLLetters(arr, block) {
        arr.map((i, index) => {

            const element = document.createElement('div');
            element.classList.add('letter');
            if (arr === shuffledArr && arr[index] == '') {
                element.setAttribute("style", "border: 2px solid white")
            }
            if (arr === guessWord && arr[index] !== '') {
                element.setAttribute("style", "background: green")
            }
            element.innerHTML = `${i}`;
            block.append(element);
            element.addEventListener('click', function () {
                clearWordsContent()
                if (arr === shuffledArr) {
                    const pushIndex = guessWord.findIndex(i => i == '');
                    guessWord[pushIndex] = arr[index]
                    shuffledArr[index] = ''
                    reRenderWords()
                }
                if (arr === guessWord) {
                    const letter = guessWord[index]
                    guessWord[index] = ''
                    const pushIndex = noChangeableShuffledArr.findIndex((i, index) => {
                        if (shuffledArr[index] == '' && i == letter) {
                            return i
                        }
                    });
                    shuffledArr[pushIndex] = letter
                    reRenderWords()

                }

            })
        })

    }

    function help() {
        button.disabled = true;
        const helpLetters = Math.ceil(word.length * 0.5)
        const emptyLetters = word.length - helpLetters
        let emptyArr = []
        for (let i = 0; i < emptyLetters; i++) { emptyArr.push('') }
        let helpArr = word.slice(0, helpLetters)
        const newArr = [...helpArr, ...emptyArr]
        guessWord = newArr;

        const noChangeableShuffledArrCoppy = noChangeableShuffledArr.concat()
        shuffledArrWithoutHelpLetters()
        shuffledArr = noChangeableShuffledArrCoppy
        function shuffledArrWithoutHelpLetters() {
            for (let i = 0; i < helpArr.length; i++) {
                const ind = noChangeableShuffledArrCoppy.indexOf(helpArr[i])
                noChangeableShuffledArrCoppy[ind] = ''
            }
        }

        clearWordsContent()
        reRenderWords()
    }





    function clearWordsContent() {
        lettersBlock.innerHTML = ``
        wordBlock.innerHTML = ``
    }




    function generateRandomAlphabet(charA, charZ) {
        var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
        for (; i <= j; ++i) {
            a.push(String.fromCharCode(i));
        }
        return a;
    }
    function generateRandomWord() {
        const howManyLettersToAdd = Math.ceil(word.length * 0.33)
        const LettersToAdd = shuffle(generateRandomAlphabet('a', 'z')).slice(0, howManyLettersToAdd)
        const shuffledWord = shuffle(word.slice(0, word.length))
        shuffledArr = shuffle([...shuffledWord, ...LettersToAdd])
    }
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

}


function timer() {

    const mins = 1.5

    var initialTime = Date.now();
    var dateFinish = initialTime + mins * 60000;

    function checkTime() {
        var timeDifference = dateFinish - Date.now();
        var formatted = convertTime(timeDifference);

        if (formatted == '0:0') {
            document.querySelector('.modal-bg').classList.add('active')
            document.querySelector('.modal-bg span').innerHTML = `${globalCount.reternCount()} `
            clearInterval(timerInterval);
            clearInterval(changeWordTimer)
        }

        document.querySelector('.timer').innerHTML = '' + formatted;
    }

    function convertTime(miliseconds) {
        var totalSeconds = Math.floor(miliseconds / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds - minutes * 60;
        return minutes + ':' + seconds;
    }
    const timerInterval = setInterval(checkTime, 100)


}



// const data = [
//     {
//         "image": "https://www.meme-arsenal.com/memes/af794f2e784ec9117c471abb397d05b1.jpg",
//         "word": "parrot"
//     },
//     {
//         "image": "https://static.dw.com/image/48396304_101.jpg",
//         "word": "mountain"
//     },
//     {

//         "image": "https://cdn.pixabay.com/photo/2020/07/13/17/11/drone-5401402_960_720.jpg",
//         "word": "quadrocopter"
//     },
//     {

//         "image": "https://s3.tradingview.com/m/MEKxYFt0_mid.png",
//         "word": "indicator"
//     },
//     {

//         "image": "https://ic.pics.livejournal.com/varlamov.ru/10761149/876467/876467_original.jpg",
//         "word": "cat"
//     },
//     {

//         "image": "https://img.corsocomo.com/image/cache/data/w/77-102-5/77-102-5-1000x1000.jpg",
//         "word": "scarf"
//     },
//     {

//         "image": "https://media.timeout.com/images/105658195/image.jpg",
//         "word": "camping"
//     },

//     {

//         "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/CrosswordUSA.svg/1200px-CrosswordUSA.svg.png",
//         "word": "crossword"
//     },


// ]