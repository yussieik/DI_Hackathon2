//initial word for tets
let word = "NO";
let wordId = 0;
let definition = "Word = NO. It is only for tets."
let text = "";



//vars and consts
//requests to DB
let wordsIdArr = [];
//for test link for words with story - spec API
let linkApiAllId = `http://localhost:8000/api/words-story-ids/`
let prevID = -1;

//request about word
let wordInfoApi = `http://localhost:8000/api/words/`

// chat GPT API
const chatGptApiUrl = ' https://api.openai.com/v1/engines/davinci/completions';
let ApiKey = `limit is empty`;
let AuthString = `Bearer ${ApiKey}`;
// word
let userWordArr = []
let mixLetterUse = false;
let markedMixElement;

//test story API
let ApiStoryLink = `http://localhost:8000/api/word/`

// wiki link
// let wikiLink = `http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&origin=*&titles=`
// let wikiLink = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&search=bee`
let wikiLink = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=2&srsearch=`
function addTextOnResultScreen(definition) {
  document.getElementById("text").textContent = definition;
};




function hideElementById(id) {
  document.getElementById(id).classList.add('hideme');
}

function showElementById(id) {
  document.getElementById(id).classList.remove('hideme');
}

function hideChildElementById(id) {
  Array.from(document.getElementById(id).children).forEach((element) => {
    element.classList.add('hideme');
    })
}



function addListeners() {
 document.getElementById("btn-2").addEventListener("click", start);
 document.getElementsByTagName("input")[0].addEventListener('input', search);
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
      return false;
    }
}
// requests
async function getAllIds() {
    try  {
        let link = linkApiAllId;
        const response = await fetch(link) // promise
        // console.log(response.json())
        if (response.ok) {
          const dataWordsIdApi = await response.json();
          
          if (dataWordsIdApi.length > 0) {
            wordsIdArr = dataWordsIdApi;
            console.log(wordsIdArr);
            getWordInfo(getNewlink(wordsIdArr));
            
          } else {
            addTextOnResultScreen("No words found. Update information in Database.");
          }
        } else {
          throw new Error ("Some issues with fetch.");
        }
    } catch (err) {
      console.log("IN THE CATCH: ", err.message);
      addTextOnResultScreen(err.message);
    }
  }

async function getWordInfo(wordIdLink) {
  console.log(wordIdLink);
  if (wordIdLink.includes(wordInfoApi)) {
    console.log("connecting...");
    addTextOnResultScreen("Connecting...");
    try  {
      const response = await fetch(wordIdLink) // promise
      if (response.ok) {
        const dataWord = await response.json();
        word = dataWord["word"]
        definition = dataWord["definition"]
        console.log(word, definition);
        addTextOnResultScreen("Connection OK.")
        //start Game(word, definition);
        startGame(word, definition);
        

      } else {
        throw new Error ("Some issues with fetch for word info.");
      } 
    } catch (error) {
        console.log("IN THE CATCH: ", error.message);
        addTextOnResultScreen(error.message);
    }
  }
}

// request to chat GPT
 async function generateTextWithWord(word) {
  try {
    const prompt = `Write a text that includes the word "${word}" in three sentences and not more 500 symbols:`;

    const response = await fetch(chatGptApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AuthString,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 50, // Adjust as per your desired completion length
        temperature: 0.7, // Adjust to control the randomness of the output
        n: 3, // Number of completions (sentences) to generate
        stop: '.', // Stop generation after a period (to ensure three sentences)
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const completions = data.choices.map(choice => choice.text.trim());
      console.log(completions.join(' ')); // modify
    } else {
      console.error('Failed to generate text:', response.status);
      addTextOnResultScreen('Failed to generate text:', response.status);
    }
  } catch (error) {
    console.error('An error occurred:', error);
    addTextOnResultScreen('An error occurred:', error);
  }
};


//request to wiki
async function getWikiWordInfo(word) {
  
  const link = wikiLink+word;
  if (word.length > 0) {
    console.log("connecting...");
    addTextOnResultScreen("Connecting...");
    try  {
      const response = await fetch(link) // promise
      if (response.ok) {
        const dataInfo = await response.json();
        console.log(dataInfo["query"]["search"][0]["snippet"]);
      
        // console.log(word, definition);
        addTextOnResultScreen("Connection OK.")
     
        

      } else {
        throw new Error ("Some issues with fetch for word info.");
      } 
    } catch (error) {
        console.log("IN THE CATCH: ", error.message);
        addTextOnResultScreen(error.message);
    }
  }
}

//request for tets AO story in DB with word ID
async function getAIStoryForWordId(id) {
  console.log('get story from tets DB')
  const link = ApiStoryLink + id + `/story/`;
  console.log(link)
  if (!isNaN(id) > 0) {
    console.log("connecting...");
    addTextOnResultScreen("Connecting...");
    try  {
      const response = await fetch(link) // promise
      if (response.ok) {
        const dataInfo = await response.json();
        // console.log(dataInfo["story"]);
        // addTextOnResultScreen("Connection OK.")
        return dataInfo["story"];
      

      } else {
        throw new Error ("Some issues with fetch for story info.");
      } 
    } catch (error) {
        console.log("IN THE CATCH: ", error.message);
        addTextOnResultScreen(error.message);
        //make fake story
        fakeText(word);
    }
  }
}


// fake text generator
function fakeText(word) {
  const newText = `Short story about ${word}s. It is very important word and you should remember it. ${word} use a lot of people.`
  return newText
}


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

    
    document.getElementById("word").appendChild(divLetterClone);
    
  });
  console.log(word)
}

function start() {
  //  add function to make request on server and get id list (if len = 0 ) - > ask to add words
  getAllIds(); // and start game
  
  //change button start to next
  document.getElementById("btn-2").removeEventListener("click", start);
  hideElementById("btn-2");
  showElementById("btn-1");
  showElementById("input-form");
  document.getElementById("btn-1").addEventListener("click",  next);

  //add word boxes on screen
 
}

function startGame(word, definition) {
  // add difinition to res screen
 
 
  // clear story screen
  const storyElement = document.getElementById("story");
  storyElement.textContent = "";
  // create " " and "..."
  const blankElement = document.createElement("span");
  blankElement.textContent = " ";
  // 
  const triplePointsElement = document.createElement("span");
  triplePointsElement.textContent = "...";
  
  getAIStoryForWordId(wordId).then((data) => {
    text = data;
  
    console.log("text", text);
    const textArr = text.split(" ");
    textArr.forEach((item, index) => {
  
      if ((item.toLocaleLowerCase()).includes(word.toLowerCase())) {
        let hideWord = "";
        for (let i = 0; i < item.length; i++) {
          hideWord += "X";
        }
        textArr[index] = hideWord;
        // create span with spec class and add on screen
        const newWordElement = document.createElement("span");
        newWordElement.textContent = `${textArr[index]}${(index === textArr.length -1)?"...":" "}`;
        newWordElement.classList.add("balck-word")
        newWordElement.setAttribute("id", index);
        storyElement.appendChild(newWordElement);
        // storyElement.appendChild(blankElement);
      

      } else {
        // create span with standard class and add on screen
        const newWordElement = document.createElement("span");
        newWordElement.textContent = `${textArr[index]}${(index === textArr.length -1)?"...":" "}`;
      // newWordElement.classList.add("")
        newWordElement.setAttribute("id", index);
        storyElement.appendChild(newWordElement);
        // storyElement.appendChild(blankElement);
      }
    });
  });
 
  addTextOnResultScreen(definition.slice(0,100)+ "...");
  // add new word on screen
  addWordOnScreen(word);
}


function search(event) {
   
  let checkMe = true;
  const search = this.value.toLowerCase();
  console.log(word.toLowerCase());
  console.log(search);
  //add info to text div
  [...search].forEach((letter, index) => {       
  
    if (search.length <= word.length) {
      const letterElement = document.getElementById(`word-letter-${index}`)
      letterElement.textContent = letter.toUpperCase();
      console.log(word[Number(letterElement.id.split("-").slice(-1))])
      console.log(letter.toLowerCase())
      if (word[Number(letterElement.id.split("-").slice(-1))].toLowerCase() == letter.toLowerCase()) {
        console.log("Ok")
        letterElement.classList.remove('close');
        letterElement.classList.add('open');
      } else {
        letterElement.classList.remove('open');
        letterElement.classList.add('close');
      }
    }    
  });
  //clear empty boxes
  if (search.length <= word.length) {
    for (let i = search.length; i < word.length; i++) {
      document.getElementById(`word-letter-${i}`).textContent = "";
      document.getElementById(`word-letter-${i}`).classList.add('close');
    }
  } 
  //check win
  checkWin(search);
  

  }

  function checkWin(search) {
    if (search.toLowerCase() === word.toLowerCase()) {
      //stop
      //clear mix letters
      hideElementById("input-form");
      //show good job
      addTextOnResultScreen("Good job! Remember this word.")
      // clear info
      document.getElementsByTagName("input")[0].value = "";
      //show new text
      
      // clear story screen
      const storyElement = document.getElementById("story");
      storyElement.textContent = "";
      // create " " and "..."
      const blankElement = document.createElement("span");
      blankElement.textContent = " ";
  // 
      const triplePointsElement = document.createElement("span");
      triplePointsElement.textContent = "...";
  
  
      console.log("text", text);
      const textArr = text.split(" ");
      textArr.forEach((item, index) => {
        if ((item.toLocaleLowerCase()).includes(word.toLowerCase())) {
          // create span with spec class and add on screen
          const newWordElement = document.createElement("span");
          newWordElement.textContent = `${textArr[index]}${(index === textArr.length -1)?"...":" "}`;
          newWordElement.classList.add("yellow-word")
          newWordElement.setAttribute("id", index);
          storyElement.appendChild(newWordElement);
        // storyElement.appendChild(blankElement);
        } else {
          // create span with standard class and add on screen
          const newWordElement = document.createElement("span");
          newWordElement.textContent = `${textArr[index]}${(index === textArr.length -1)?"...":" "}`;
      // newWordElement.classList.add("")
          newWordElement.setAttribute("id", index);
          storyElement.appendChild(newWordElement);
          // storyElement.appendChild(blankElement);
        }
    });
  }
}
  


function next() {
  //  add function to make request on server and get id list (if len = 0 ) - > ask to add words
  getAllIds();
  showElementById("input-form");
  //getNewlink(arrOfIds)
 

}

// Driver
addListeners();
addTextOnResultScreen("Press start button to show new word.")

//Tests
// Usage example
// const keyword = 'technology'; 
// generateTextWithWord(keyword);
// getWikiWordInfo("cat")
// getAIStoryForWordId(20)