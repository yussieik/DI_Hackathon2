//initial word
let linkApiAdd = `http://localhost:8000/create/`;


// check if definition exist
async function getWordInfoDictionaryapi(wordForDescription) {
  
  //get definition list
  function getDefinitionsFromResponse(obj) {
    console.log("getDefinition:",obj);
    // remove old one
    const definitionSelector = document.getElementById("definitions");
    const definitionItemsOld = [...definitionSelector.children];
    definitionItemsOld.forEach((element) => {element.remove()})
    // add to Options
    obj.forEach((element, index) => {
        // add definition info to text are
        if (index === 0) {
           // add definition info to text are
           addInfoToTextArea(element["definition"]);
        }
        const definitionItemNew = document.createElement("option");
        definitionItemNew.setAttribute("id", index);
        definitionItemNew.textContent = element["definition"];
        definitionSelector.appendChild(definitionItemNew);
        console.log(element["definition"])
    });
    
    
  }  
  
  try  {
      let link = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordForDescription}`
      const response = await fetch(link) // promise
      // console.log(response.json())
      if (response.ok) {
        const dataWordsApi = await response.json();
        const dataDefinitions = dataWordsApi[0]["meanings"][0]["definitions"]
        console.log(dataDefinitions);
        getDefinitionsFromResponse(dataDefinitions);
        //add first info to text Area
        
        // conversionResult = dataConvertationResults["conversion_result"];
        // showResult(conversionResult);
        addTextOnResultScreen("Check new definitions");
      } else {
        const dataWordsApi = await response.json();
        
        if (dataWordsApi["message"] === "Sorry pal, we couldn't find definitions for the word you were looking for.") {
          console.log("API couldn't find definitions for this word.");
          throw new Error ("API couldn't find definitions for this word.");
        }
        else {     
        throw new Error ("Some issues with fetch.");
        }
      }
  } catch (err) {
    console.log("IN THE CATCH: ", err.message);
    addTextOnResultScreen(err.message);
  } 
}

function checkDefinitions(event) {
  if (event.button === 0) {
    event.preventDefault();
    console.log("start");
    word = getWord();
    if (word) {
      addInfoToTextArea("Input definition of the word or press Check definition button.");
      getWordInfoDictionaryapi(word);
    }
  }
}


// get word from Input
function getWord() {
  const inputWordElement = document.getElementById("new-word");
  let newWordFromInput = inputWordElement.value;
  console.log(newWordFromInput)
  //check if it letters and numbers
  if (isNaN(newWordFromInput) && newWordFromInput.length > 1 && /^[A-Za-z0-9\s]*$/.test(newWordFromInput)) {
    newWordFromInput = newWordFromInput.toLowerCase().replace(' ','').trim();
    console.log("New word: ", newWordFromInput)
    return newWordFromInput
  } else {
    console.log("check your word");
    addTextOnResultScreen("check your word");
    return false
  }
  
}

// add Info from Selected Definition to the TextArea
function addInfoToTextArea(newText) {
  console.log("test: ", newText);
  // document.getElementById("definition").innerHTML = "";
  document.getElementById("definition").value = newText.slice(0,210); //limit.
}

//add text to main info box
function addTextOnResultScreen(inform) {
  document.getElementById("info").textContent = inform;
};


// add info Fetch 
async function  addInfoToDB(event) {
  if (event.button === 0) {
// check if word isn't blank
  let newWord =  getWord();
    if (newWord) {
      // get difinition info
      const inputDifinitionElement = document.getElementById("definition");
      let newDifinition = inputDifinitionElement.value.trim(); // limit for length
      console.log(newWord, newDifinition);
      let isLearning = false;
      // show info for start connection
      addTextOnResultScreen("Connecting to server...");
      try  {
          const data = {
            word: newWord,
            definition: newDifinition,
            isLearning: true
          }

          console.log(JSON.stringify(data));

        const response = await fetch(linkApiAdd, {
          method: "POST",
          // mode: "same-origin",
          headers: {
            // "Accept": 'application/json',
            // "Authorization": '',
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        console.log(response);
        if (response.ok) {
          addTextOnResultScreen('Word added successfully!');
          console.log('Word added successfully!');
        } else {
          throw new Error ('Failed to add word: ', response.json().status);
          // console.error('Failed to add word:', response.status);
        }
      } catch (err) {
        console.log("IN THE CATCH: ", err.message);
        addTextOnResultScreen(err.message);
      }
      
      
      // end of main if 
    }
  }
}

// add events
function addListeners() {
  // check definition
  document.getElementById("btn").addEventListener('click', checkDefinitions);
// check in dictonary word from input
// document.getElementById("btn").addEventListener('click', checkWord);

//if difinition selected -> update texarea
  const definitionsList = document.getElementById("definitions")
  definitionsList.onchange = () => addInfoToTextArea(definitionsList.value);
  definitionsList.addEventListener("change", addInfoToTextArea(definitionsList.value));

// btn add new word - > connect and add 
  document.getElementById("btn-1").addEventListener('click', addInfoToDB);
}


function start() {
  addListeners();
}


//test
start()
addTextOnResultScreen("Add new word");



