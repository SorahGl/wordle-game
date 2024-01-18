let numberOfGuess = 0;
let done = false;
const ANSWER_LENGTH = 5;
const ROUNDS = 6;
const letters = document.querySelectorAll('.letters');
const keyboard = document.querySelectorAll('.keyboard');
const button = document.getElementById('directionButton');
const instructions = document.getElementById('instructions');
const back = document.getElementById('back');
const enter = document.getElementById('enter');
const trophy = document.getElementById('trophy');
const simpleTrophy = document.getElementById('simpleTrophy');
let currentRow = 0;
let direction = false;

const revealDirections = () => {

    button.addEventListener('click', () => {
        if (button.innerText === 'Game Directions') {
            instructions.style.display = 'flex';
            button.innerText = 'Hide Directions';
            direction = true;
        } else if (button.innerText === 'Hide Directions'){
            instructions.style.display = 'none';
            button.innerText = 'Game Directions';
            direction = false;
        }
    });
};

async function wordle () {
    let currentGuess = "";

    //get the word of the day
    const wordUrl = 'https://words.dev-apis.com/word-of-the-day';
    const response = await fetch(wordUrl);
    const {word: wordResponse} = await response.json();
    const word = wordResponse.toUpperCase();
    const wordParts = word.split("");

    //mark an invalid word
    const markInvalidWord = () => {
        alert("invalid word");
    }

    //add a letter to users currentGuess
    const addLetter = (letter) => {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, ANSWER_LENGTH - 1) + letter;
        }
        letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText = letter;
    }

    //backspace a letter from a users currentGuess
    const backspace = () => {
        if (currentGuess.length === 0) {
            //do nothing
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1);
            letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = '';
        
        }
    }

    //enter a users currentGuess
    const commit = async () => {
        
        
        const guessParts = currentGuess.split("");
        let allRight = true;
        const map = makeMap(wordParts);

        if (currentGuess.length !== ANSWER_LENGTH) {
            // do nothing
            return;
          }

        //validate users word
        const res = await fetch('https://words.dev-apis.com/validate-word', {method: 'POST', body: JSON.stringify({word: currentGuess})})
        const {validWord} = await res.json();
        if (!validWord) {
            markInvalidWord()
            return;
        }
          
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            
            //check for green letter
            if (guessParts[i] === wordParts[i]) {
                //turn green
                letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
                document.getElementById(guessParts[i]).classList.add("correctkeyboard");
                map[guessParts[i]]--;
            }}
            //check for doubles
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                //do nothing
            } else if (map[guessParts[i]] && map[guessParts[i]] > 0){
                 //turn yellow
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
                document.getElementById(guessParts[i]).classList.add("closekeyboard");
                allRight = false;
                map[guessParts[i]]--;
            } else {
                //turn gray
                letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
                document.getElementById(guessParts[i]).classList.add("wrong");
                allRight = false;
            }}
            
        currentRow++;
        currentGuess = '';
        if (allRight) {
            trophy.removeAttribute('hidden');
            done = true
            setTimeout(() => {
                trophy.setAttribute('hidden', true);
                simpleTrophy.removeAttribute('hidden');
            }, 3000);
        } else if (currentRow === ROUNDS) {
            alert(`You lost!The word was ${word}.`);
            done = true;
        }
    
        
    }
    

    
    document.addEventListener("keydown", function handleKeyPress (e) {
        const action = e.key;

        if (done || direction) {
            return;
        }
        
        if (action === "Enter") {
            commit();
        } else if (action === "Backspace") {
            backspace();
        } else if (isLetter(action)){
            addLetter(action.toUpperCase());
        } else {
            //do nothing
        }
    });

    //Adds a letter from the on screen keyboard
    keyboard.forEach((key) => {
        key.addEventListener('click', (e) => {
            const action = e.target.id;
            if (done || direction) {
                return;
            }
            addLetter(action);
        })
    })

    //backspaces a letter from the on screen keyboard
    back.addEventListener('click', () => {
        if (done || direction) {
            return;
        }
        backspace();
    })

    //commits a word from the on screen keyboard
    enter.addEventListener('click', () => {
        if (done || direction) {
            return;
        }
        commit();
    })
    }

    //checks if a key is a letter
    function isLetter(letter) {
        return /^[a-zA-Z]$/.test(letter);
    }

    //maps the word to keep track of its letters
    function makeMap(array) {
        const obj = {};
        for (let i = 0; i < array.length; i++) {
        if (obj[array[i]]) {
            obj[array[i]]++;
        } else {
            obj[array[i]] = 1;
        }
        }
        return obj;
    }


wordle();
revealDirections();