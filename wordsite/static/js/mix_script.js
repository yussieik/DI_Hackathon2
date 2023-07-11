//initial word for tets
let word = "NO";
let wordId = 0;
let definition = "Word = NO. It is only for tets."




//vars and consts
//requests to DB
let wordsIdArr = [];
let linkApiAllId = `http://localhost:8000/api/word-ids/`;
let prevID = -1;

//request about word
let wordInfoApi = `http://localhost:8000/api/words/`

// word
let userWordArr = []
let mixLetterUse = false;
let markedMixElement;



function shuffWord(inputWord) {
  // Fisher-Yates
  let shuffle = [...inputWord];
  // Defining function returning random value from i to N
  const getRandomValue = (i, n) => Math.floor(Math.random() * (n - i) + i);
  // Shuffle a pair of two elements at random position j (Fisher-Yates)
  shuffle.forEach( (elem, i, arr, j = getRandomValue(i, arr.length)) => [arr[i], arr[j]] = [arr[j], arr[i]] );
  // Transforming array to string
  shuffle = shuffle.join('');
  return shuffle
}

function addTextOnResultScreen(definition) {
  document.getElementById("text").textContent = definition;
};


function addWordOnScreen(word) {
  //convert word to arr
  const wordArr = [...word.toUpperCase()];

  //clear all old divs
  [...document.getElementById("word").children].forEach((element) => element.remove());

  //for each letter make div, add id, add listeners, style is closed
  wordArr.forEach((element, index) => {
    const divLetterClone = template.content.cloneNode(true);
    divLetterClone.firstElementChild.setAttribute("id", `word-letter-${index}`);
    //add style close
    divLetterClone.firstElementChild.classList.add('close');
    // add word's letter to p in Div
    divLetterClone.firstElementChild.firstElementChild.textContent = element;
    //add class to letter
    divLetterClone.firstElementChild.firstElementChild.classList.add('hideme')
    // add listeners
    divLetterClone.firstElementChild.addEventListener('click', insertMixLetterAndCheck);
    divLetterClone.firstElementChild.firstElementChild.addEventListener('click', insertMixLetterAndCheck);
    document.getElementById("word").appendChild(divLetterClone);
    
  });
  console.log(word)
}

function addMixWordOnScreen(inputMixWord) {
  //convert word to arr
  const MixWordArr = [...inputMixWord.toUpperCase()];

  //clear all old divs
  [...document.getElementById("mix-word").children].forEach((element) => element.remove());

  //for each letter make div, add id, add listeners, style is closed
  MixWordArr.forEach((element, index) => {
    const divLetterClone = template.content.cloneNode(true);
    divLetterClone.firstElementChild.setAttribute("id", `mix-word-letter-${index}`);
    //add style close
    divLetterClone.firstElementChild.classList.add('unused');
    // add word's letter to p in Div
    divLetterClone.firstElementChild.firstElementChild.textContent = element;
    //add class to letter
    // divLetterClone.firstElementChild.firstElementChild.classList.add('hideme')
    // add listeners
    divLetterClone.firstElementChild.addEventListener('mousedown', takeMixLetter);
    
    document.getElementById("mix-word").appendChild(divLetterClone);
    
  });
  console.log(inputMixWord)
 
}

//take letter
function takeMixLetter(event) {
  if (event.button === 0) {
    // no prev choses
    if (!mixLetterUse && ![...this.classList].includes('used')) {
    // show this letter
    this.classList.add('marked');
    //copy it's value to the var
    console.log(this.textContent);
    markedMixElement = this;
    mixLetterUse = true;

    // prev mix letter was chosen
    } else if (mixLetterUse && ![...this.classList].includes('used') && this != markedMixElement) { 
      //prev element
      markedMixElement.classList.remove('marked');
      markedMixElement = this;
      this.classList.add('marked');
    } else if (mixLetterUse && ![...this.classList].includes('used') && this == markedMixElement) {
      
      this.classList.remove('marked');
      markedMixElement = "";
      mixLetterUse = false;
    }

  }

} 

//insert Mix Letter to Word Letter after Check
function  insertMixLetterAndCheck(event) {
  if (event.button === 0) {
    console.log(event.target.textContent)
// mix letter was chosen
    if (mixLetterUse) {
      // good place
      if (event.target.textContent === markedMixElement.textContent) {
        console.log("letters the same");
        //correct word letter change style
        event.target.classList.remove('close');
        event.target.classList.add('open');
        event.target.firstElementChild.classList.remove('hideme');
        //mix word letter mark as used
        markedMixElement.classList.remove('unused', 'marked');
        markedMixElement.classList.add('used');
        //clear check flag
        mixLetterUse = false;
        // add letter to user answer -> id consist index in word
        userWordArr[Number(event.target.id.split("-").slice(-1))] = event.target.textContent;
        
        checkWin();

        // wrong place
      } else if (event.target.textContent != markedMixElement.textContent) {
        console.log("Wrong place");
        event.target.classList.add('jump-1');
        // show that it is wrong
        
        setTimeout(() => event.target.classList.remove('jump-1'), 500)

        //remove 
        markedMixElement.classList.remove('marked');
        markedMixElement = "";
        mixLetterUse = false;
      }
    }

  }
}

function clickToOtherElements(event) {
  if (event.button === 0) {
    if (mixLetterUse && ![...event.target.classList].includes('letter') && ![...event.target.classList].includes('internal-letter')) {
      // console.log(event.target);
      markedMixElement.classList.remove('marked');
      markedMixElement = "";
      mixLetterUse = false;
    }
      
  }

}

function checkWin() {
  if (userWordArr.join("").toLowerCase() === word.toLowerCase()) {
    //stop
    //clear mix letters
    hideChildElementById("mix-word");
    //show good job
    addTextOnResultScreen("Good job! Remember this word.")
    // clear info
    wordsIdArr = [];
    userWordArr = []
    mixLetterUse = false;
  }
  
}


function hideElementById(id) {
  document.getElementById(id).classList.add('hideme');
}

function showElementById(id) {
  document.getElementById(id).classList.remove('hideme');
}



function addListeners() {
  // add ckick to non letetr's divs
  Array.from(document.getElementsByTagName("*")).forEach((element) => {
    // if(![...element.classList].includes('letter')) {
      element.addEventListener("click", clickToOtherElements);
      // }
    });

  // to button start
 document.getElementById("btn-2").addEventListener("click", start);
//to input
// events
// document.getElementsByTagName("input")[0].addEventListener('input', search);

}

function hideChildElementById(id) {
  Array.from(document.getElementById(id).children).forEach((element) => {
    element.classList.add('hideme');
    })
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


            
function getNewlink(arrOfIds) {
  if (arrOfIds.length > 0) {
    let id = 0;
    // console.log(arrOfIds.length)
    do { 
      id = getRandomIntInclusive(0, arrOfIds.length - 1); //17
      // console.log(id)
    }
    while (id == prevID);
    prevID = id;
    // console.log(id)
    wordId = arrOfIds[id]
    let link = `${wordInfoApi}${wordId}`
      
  return link
  }

  else {
    addTextOnResultScreen("No words ID info found. Update information in Database.");
  }
}
// requests
async function getInfoAndStartGame() {
    
  //  at the end - word + description  or mistake
  // button get new word -> request and receive words. 
  //if it is OK -> show template for word
  //show shuffle letters from Word

    try  {
        let link = linkApiAllId;
        const response = await fetch(link) // promise
        // console.log(response.json())
        if (response.ok) {
          const dataWordsIdApi = await response.json();
          // const dataWordsId = dataWordsIdApi[0]
          // console.log(dataWordsIdApi.length);
          if (dataWordsIdApi.length > 0) {
            let lintToRandomWord = getNewlink(dataWordsIdApi);
            
            let result ="unknown";
                if (lintToRandomWord.includes(wordInfoApi)) {
                    //fetch info
                    try  {
                        const response2 = await fetch(lintToRandomWord) // promise
                        if (response2.ok) {
                            const dataWord = await response2.json();
                            // console.log(dataWord);
                            word = dataWord["word"]
                            definition = dataWord["definition"]
                            NewGame();
                            //add
                            

                        }
                        else {
                            throw new Error ("Some issues with fetch for word info.");
                        } 
                    } catch (error) {
                        console.log("IN THE CATCH: ", error.message);
                        addTextOnResultScreen(error.message);
                    }
                } 
            
          } else {
            addTextOnResultScreen("No words found. Update information in Database.");

          }

                   
          // conversionResult = dataConvertationResults["conversion_result"];
          // showResult(conversionResult);
        } else {
          
       
          throw new Error ("Some issues with fetch.");
        //   }
        }
    } catch (err) {
      console.log("IN THE CATCH: ", err.message);
      addTextOnResultScreen(err.message);
     
    }
  }

function NewGame() {
  addWordOnScreen(word);
  addMixWordOnScreen(shuffWord(word));
  addTextOnResultScreen(definition);

  document.getElementById("btn-2").removeEventListener("click", start);
  hideElementById("btn-2");
  showElementById("btn-1");
  document.getElementById("btn-1").addEventListener("click",  getInfoAndStartGame);
  

}

function start() {
  //  add function to make request on server and get id list (if len = 0 ) - > ask to add words
  
  getInfoAndStartGame();
  // console.log(getNewlink(wordsIdArr));
  // console.log(getNewlink([1,2,3]));
  //  add function to chose random ID, compare with previous one and make request.
  
  //  at the end - word + description  or mistake


  // button get new word -> request and receive words. 

  //if it is OK -> show template for word
  //show shuffle letters from Word


  
 
}

// Driver
addTextOnResultScreen("Press start button to show new word.")
addListeners();

