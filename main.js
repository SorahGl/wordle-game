let numberOfGuess = 0;
let done = false;
const ANSWER_LENGTH = 5;
const ROUNDS = 6;
const letters = document.querySelectorAll('.letters');
let currentRow = 0;


async function wordle () {
    let currentGuess = "";

    //get the word of the day
    const wordUrl = 'https://words.dev-apis.com/word-of-the-day';
    const response = await fetch(wordUrl);
    const {word: wordResponse} = await response.json();
    const word = wordResponse.toUpperCase();
    const wordParts = word.split("");
    console.log(word);
    console.log(wordParts);

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
                map[guessParts[i]]--;
                console.log(map[guessParts]);
            }}
            //check for doubles
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                //do nothing
            } else if (map[guessParts[i]] && map[guessParts[i]] > 0){
                 //turn yellow
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
                allRight = false;
                map[guessParts[i]]--;
                console.log(map[guessParts]);
            } else {
                //turn gray
                letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
                allRight = false;
            }}
            
        currentRow++;
        currentGuess = '';
        if (allRight) {
            done = true
        } else if (currentRow === ROUNDS) {
            alert(`You lost!The word was ${word}.`);
            done = true;
        }
    
        
    }
    

    document.addEventListener("keydown", function handleKeyPress (e) {
        const action = e.key;

        if (done) {
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
}

wordle();