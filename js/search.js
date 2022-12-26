var myWords = []; // array of localStorage
// var mainContainer = document.getElementById("mainContainer"); // main words container(main Div)
var words = [];
// console.log(words);
var finalWordArr = []; // final array after merging lek. selected by user

var lektionenArr = [
  "Lek1",
  "Lek2",
  "Lek3",
  "Lek4",
  "Lek5",
  "Lek6",
  "Lek7",
  "Lek8",
  "Lek9",
  "Lek10",
  "Lek11",
  "Lek12",
];
var lekSelectArr = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

var selectedLektionen = []; // ex: 1 ,2 ex: 0 = Lek1 & 1 = Lek2
var userLek = document.getElementById("userLektion"); // lek Btns div
var lekData = document.getElementsByClassName("lek"); // catch all lektionen elements Btns for addevent lis
// Btn Index to know which Btn user clicked (lektionen)
var BtnIndex = -1;

/////////////////////REtrive Data From Xlsx File//////////////////////////
//empty array will recive word objects
var wordsFromXlsx = [[], [], [], [], [], [], [], [], [], [], [], []];

// will pass this array to function to write xlsx file
// every word have 5 prop. as array not obj
var WordsToWrite = [];

async function readMyXlsxFile() {
  let workbook = await XLSX.read(
    await (await fetch("words.xlsx")).arrayBuffer()
  );
  // console.log(workbook);

  var num = Number(workbook.Sheets.Sheet1.A1.w) + 1; // row count
  // num = Number(num) + 1;
  // console.log("Row Count:", num); // row count
  // console.log(workbook.Sheets.Sheet1); //
  // console.log(workbook.Sheets.Sheet1.A2.h.slice(3)); //Lek number
  // console.log(workbook.Sheets.Sheet1.B2.h); //Du word
  // console.log(workbook.Sheets.Sheet1.C2.h); //Du example
  // console.log(workbook.Sheets.Sheet1.D2.h); //Ar word
  // console.log(workbook.Sheets.Sheet1.E2.h); //Ar example
  setWordsArray(num, workbook);
  fillEmptyLekArr();
  convertWordObjToArrOfArr(wordsFromXlsx);
}

function setWordsArray(numOfWords, workbook) {
  for (var i = 2; i <= numOfWords; i++) {
    var obj = {
      Lek: 0,
      Du_word: "",
      Du_example: "",
      Ar_word: "",
      Ar_example: "",
    };

    // get values from xlsx sheet
    // eval fun to convert string to variable name
    // in Js we can't add ${i} ina variable name directly to loop
    var leknum = eval(`workbook.Sheets.Sheet1.A${i}.h.slice(3)`);
    var DuWord = eval(`workbook.Sheets.Sheet1.B${i}.h`);
    var DuExample = eval(`workbook.Sheets.Sheet1.C${i}.h`);
    var ArWord = eval(`workbook.Sheets.Sheet1.D${i}.h`);
    var ArExample = eval(`workbook.Sheets.Sheet1.E${i}.h`);

    // set values to object
    obj.Lek = leknum;
    obj.Du_word = DuWord;
    obj.Du_example = DuExample;
    obj.Ar_word = ArWord;
    obj.Ar_example = ArExample;

    // to push obj in right lek array
    var lekArrIndex = leknum - 1; //lek array start from 0 not 1
    wordsFromXlsx[lekArrIndex].push(obj);
  }
}
// important fun to fill empty lek array to prevent undifined field
function fillEmptyLekArr() {
  for (var i = 0; i < wordsFromXlsx.length; i++) {
    var obj = {
      Lek: 0,
      Du_word: "",
      Du_example: "",
      Ar_word: "",
      Ar_example: "",
    };
    var leknum = i + 1;
    if (wordsFromXlsx[i].length == 0) {
      obj.Lek = leknum;
      wordsFromXlsx[i].push(obj);
    }
  }
  // console.log(wordsFromXlsx);
}

//function to convert lek obg to array of array
function convertWordObjToArrOfArr(words) {
  for (var i = 0; i < words.length; i++) {
    for (var j = 0; j < words[i].length; j++) {
      var tempArr = [];
      lekname = "lek" + words[i][j].Lek;
      DuWord = words[i][j].Du_word;
      DuExample = words[i][j].Du_example;
      ArWord = words[i][j].Ar_word;
      ArExample = words[i][j].Ar_example;

      //to prevent adding empty words to xlsx file
      if (DuWord != "" || ArWord != "") {
        // add 5 prop of word inside one arr first
        tempArr.push(lekname);
        tempArr.push(DuWord);
        tempArr.push(DuExample);
        tempArr.push(ArWord);
        tempArr.push(ArExample);
        // push this array to main final file array
        WordsToWrite.push(tempArr);
      }
    }
  }
  // console.log(WordsToWrite);
}
///////////////////////////////////////

// start From Here
// to retrieve data from local storage
if (JSON.parse(localStorage.getItem("myWords")) != null) {
  myWords = JSON.parse(localStorage.getItem("myWords"));
}

startFromHere();
async function startFromHere() {
  await readMyXlsxFile();
  words = await wordsFromXlsx;
  await showLektionBtns();
  applyClickToLektion();
  showColorGuide();
}
// End Here

//onclick inside this function to get the index of Btn
function showLektionBtns() {
  var userLekData = "";
  for (var i = 0; i < lektionenArr.length; i++) {
    userLekData += `
      <div class="lek position-relative col-md-2 col-3 myBtn bg-L${
        i + 1
      } rounded-3 fw-semibold fs-5 d-flex justify-content-center align-items-center my-2 py-2 me-2 ">
          <div onclick="selectedBtnLek(${i})" class="w-100 h-100  rounded-3 position-absolute top-0 start-0"></div>
          <span class='px-2 textShadow text-light'>${lektionenArr[i]}</span>
          <i class="d-none w-25 fa-regular fa-circle-xmark"></i>
      </div>
      `;
  }
  userLek.innerHTML = userLekData;
}

// changing Btn style + add lek name to array
function applyClickToLektion() {
  for (var i = 0; i < lekData.length; i++) {
    lekData[i].addEventListener("click", function (e) {
      var closeIconItem = e.target.nextElementSibling.nextElementSibling;
      var lekName = e.target.nextElementSibling.innerHTML;
      var parent = e.target.parentElement;
      //   console.log(parent);
      if (lekSelectArr[BtnIndex] == true) {
        // Not Clicked
        // console.log("iam here1");
        lekSelectArr[BtnIndex] = false;
        parent.classList.add("myBtn");
        parent.classList.remove("myBtnClicked");
        closeIconItem.classList.add("d-none");
        // get index of lektion then remove it with splice
        var temp = selectedLektionen.indexOf(lekName);
        selectedLektionen.splice(temp, 1);
        // console.log(selectedLektionen);
        updateWordsArr();
      } else if (lekSelectArr[BtnIndex] == false) {
        // Clicked
        // console.log("iam here2");
        lekSelectArr[BtnIndex] = true;
        closeIconItem.classList.remove("d-none");
        parent.classList.remove("myBtn");
        parent.classList.add("myBtnClicked");
        // add Lektion name to array
        selectedLektionen.push(lekName);
        updateWordsArr();
        // console.log(selectedLektionen);
      }
    });
  }
}

// get index of Btn and assign it to global variable (Lektion)
function selectedBtnLek(btnNum) {
  BtnIndex = btnNum;
  //   console.log(btnNum);
}

// function to show colors of lektionen above final results
function showColorGuide() {
  var temp = "";
  for (var i = 1; i <= lektionenArr.length; i++) {
    temp += `
  <div class="col d-flex justify-content-center mt-2">
      <div class="p-1 bg-L${i} textShadow text-light fix-s d-flex justify-content-center align-items-center">
        L${i}
      </div>
  </div>
  `;
  }
  lekColorDiv.innerHTML = temp;
}

$("#filter").click(function () {
  userLek.classList.toggle("d-none");
});

// function to combine words in user's final lekArr
function combineNewArrofWords(arrayOfIndex) {
  // without this step it will add same lek several times every onkeyup
  finalWordArr = [];
  // console.log(selectedLektionen);///////////////////////
  for (var i = 0; i < arrayOfIndex.length; i++) {
    var index = arrayOfIndex[i];
    finalWordArr.push(words[index]);
  }
  // console.log(finalWordArr); /////////////////////////
}
// Edit final list of lek to equal index inside Arr of words
function getFinalIndexOfLek() {
  // copy array selectedLektionen then slice and sort
  // without this step it will edit selectedlek array every onkeyup
  var temp = [];
  for (var i = 0; i < selectedLektionen.length; i++) {
    temp[i] = selectedLektionen[i];
  }
  for (var i = 0; i < temp.length; i++) {
    temp[i] = temp[i].slice(3) - 1;
  }
  temp = temp.sort(function (a, b) {
    return a - b;
  });
  // console.log(selectedLektionen);

  return temp;
  // console.log("keyyyy");
}

///////////search  functions////////////

var searchInput = document.getElementById("searchInput");
var tablebody = document.getElementById("tablebody");
var showAll = document.getElementById("showAll");
var storedWords = document.getElementById("storedWords");

searchInput.addEventListener("keyup", function () {
  updateWordsArr();
});
// will use this fun after every click on button select.
async function updateWordsArr() {
  // console.log(searchInput.value);
  var FinalIndexOfLek = await getFinalIndexOfLek();
  // this condition : if user didn't use filter it sets all lek. index in array
  // to search inside it
  if (FinalIndexOfLek.length == 0) {
    for (var i = 0; i < lektionenArr.length; i++) {
      FinalIndexOfLek.push(i);
    }
    // console.log(FinalIndexOfLek);
  }
  await combineNewArrofWords(FinalIndexOfLek);
  // from here will work with finalWordArr

  displayTable(finalWordArr);
}

// show all function button
showAll.addEventListener("click", async function () {
  // set all lek index to array

  var FinalIndexOfLek = await setAllLekIndex();

  await combineNewArrofWords(FinalIndexOfLek);
  // from here will work with finalWordArr

  displayTable(finalWordArr);
});

// show stored words function button
storedWords.addEventListener("click", async function () {
  displayTableForSortedWords();
});

function removeRow(i) {
  myWords.splice(i, 1);
  //save new myWord to localstorage
  localStorage.setItem("myWords", JSON.stringify(myWords));

  // reshow the table
  displayTableForSortedWords();
}

function displayTableForSortedWords() {
  var temp = "";
  for (var i = 0; i < myWords.length; i++) {
    temp += `
        <tr ondblclick='removeRow(${i})' class="bg-L${myWords[i].Lek}">
        <th class="text-center">${myWords[i].Lek}</th>
        <td class="">${myWords[i].Du_word}</td>
        <td class="">${myWords[i].Du_example}</td>
        <td class="text-end">${myWords[i].Ar_word}</td>
        <td class="text-end">${myWords[i].Ar_example}</td>
    </tr>
        `;
  }
  tablebody.innerHTML = temp;
}

function setAllLekIndex() {
  var FinalIndexOfLek = [];
  for (var i = 0; i < lektionenArr.length; i++) {
    FinalIndexOfLek.push(i);
  }
  return FinalIndexOfLek;
}
// dispaly words in table par. is final array
function displayTable(finalWordArr) {
  var temp = "";
  for (var i = 0; i < finalWordArr.length; i++) {
    for (var j = 0; j < finalWordArr[i].length; j++) {
      if (
        finalWordArr[i][j].Du_word.toLowerCase().includes(
          searchInput.value.toLowerCase()
        ) ||
        finalWordArr[i][j].Ar_word.includes(searchInput.value)
      ) {
        temp += `
        <tr class="bg-L${finalWordArr[i][j].Lek}">
        <th class="text-center">${finalWordArr[i][j].Lek}</th>
        <td class="">${finalWordArr[i][j].Du_word}</td>
        <td class="">${finalWordArr[i][j].Du_example}</td>
        <td class="text-end">${finalWordArr[i][j].Ar_word}</td>
        <td class="text-end">${finalWordArr[i][j].Ar_example}</td>
    </tr>
        `;
      }
    }
  }
  tablebody.innerHTML = temp;
}

////////////printing process//////////////
// function to specifying Table Area for printing
var printBtn = document.getElementById("printBtn");
var showAllOptions = document.getElementById("showAllOptions");
var fullScreenBtn = document.getElementById("fullScreenBtn");
var theContent = document.getElementById("theContent");
var optionsBox1 = document.getElementById("optionsBox1");
var optionsBox2 = document.getElementById("optionsBox2");
var navbar = document.getElementById("navbar");

printBtn.addEventListener("click", areaPrint);

function areaPrint() {
  optionsBox1.classList.add("d-none");
  optionsBox2.classList.add("d-none");
  navbar.classList.add("d-none");
  showAllOptions.classList.remove("d-none");
  fullScreenBtn.classList.add("d-none");
  theContent.classList.replace("container", "container-fluid");
  window.print();
}

showAllOptions.addEventListener("click", reshowOptions);

function reshowOptions() {
  optionsBox1.classList.remove("d-none");
  optionsBox2.classList.remove("d-none");
  navbar.classList.remove("d-none");
  showAllOptions.classList.add("d-none");
  fullScreenBtn.classList.remove("d-none");
  theContent.classList.replace("container-fluid", "container");
}

fullScreenBtn.addEventListener("click", setfullScreenMode);

function setfullScreenMode() {
  optionsBox1.classList.toggle("d-none");
  optionsBox2.classList.toggle("d-none");
  navbar.classList.toggle("d-none");
  if (fullScreenBtn.innerText == "Full Screen") {
    fullScreenBtn.innerText = "Exit Full Screen";
  } else if (fullScreenBtn.innerText == "Exit Full Screen") {
    fullScreenBtn.innerText = "Full Screen";
  }
}
