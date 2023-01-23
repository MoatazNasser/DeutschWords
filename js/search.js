// extended local storage line // https://github.com/DVLP/localStorageDB#readme
!function(){var s,c,e="undefined"!=typeof window?window:{},t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB;"undefined"==typeof window||t?((t=t.open("ldb",1)).onsuccess=function(e){s=this.result},t.onerror=function(e){console.error("indexedDB request error"),console.log(e)},t={get:(c={ready:!(t.onupgradeneeded=function(e){s=null,e.target.result.createObjectStore("s",{keyPath:"k"}).transaction.oncomplete=function(e){s=e.target.db}}),get:function(e,t){s?s.transaction("s").objectStore("s").get(e).onsuccess=function(e){e=e.target.result&&e.target.result.v||null;t(e)}:setTimeout(function(){c.get(e,t)},50)},set:function(t,n,o){if(s){let e=s.transaction("s","readwrite");e.oncomplete=function(e){"Function"==={}.toString.call(o).slice(8,-1)&&o()},e.objectStore("s").put({k:t,v:n}),e.commit()}else setTimeout(function(){c.set(t,n,o)},50)},delete:function(e,t){s?s.transaction("s","readwrite").objectStore("s").delete(e).onsuccess=function(e){t&&t()}:setTimeout(function(){c.delete(e,t)},50)},list:function(t){s?s.transaction("s").objectStore("s").getAllKeys().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.list(t)},50)},getAll:function(t){s?s.transaction("s").objectStore("s").getAll().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.getAll(t)},50)},clear:function(t){s?s.transaction("s","readwrite").objectStore("s").clear().onsuccess=function(e){t&&t()}:setTimeout(function(){c.clear(t)},50)}}).get,set:c.set,delete:c.delete,list:c.list,getAll:c.getAll,clear:c.clear},e.ldb=t,"undefined"!=typeof module&&(module.exports=t)):console.error("indexDB not supported")}();

var workbook =[]; // will recive Data from exel or indexedDB
////////////////////////////////////////////////////////////

var myWords = []; // array of localStorage
// var mainContainer = document.getElementById("mainContainer"); // main words container(main Div)
var words = [];
// console.log(words);
var finalWordArr = []; // final array after merging lek. selected by user

var lektionenArr = []; // restore leks names ex: lek1:lek12
var lekSelectArr = []; // falses values = lek count // array helps on selecting leks by user

var selectedLektionen = []; // ex: 1 ,2 ex: 0 = Lek1 & 1 = Lek2
var userLek = document.getElementById("userLektion"); // lek Btns div
var lekData = document.getElementsByClassName("lek"); // catch all lektionen elements Btns for addevent lis
// Btn Index to know which Btn user clicked (lektionen)
var BtnIndex = -1;

/////////////////////REtrive Data From Xlsx File//////////////////////////
var checkLekCountandLekNum = false;
//empty array will recive word objects
var wordsFromXlsx = [];

// will pass this array to function to write xlsx file
// every word have 5 prop. as array not obj
var WordsToWrite = [];
// to ckeck previous files history
var fileName = ""; // file name or Google sheet link
var lekCount = -1; // count of Lek set by user
var fileType = ""; // is it local file or google link

//important function will set lek names ,array of falses values
// array of empty arrays equal to count of leks
// depends on lekCount seted by user

function setArrays(lekCount) {
  return new Promise(function (resolve, reject) {
    // we need number 1
    for (let i = 1; i <= lekCount; i++) {
      // set lektionenArr
      let tempname = "Lek" + i;
      lektionenArr.push(tempname);
      // set lekSelectArr
      let tempBool = false;
      lekSelectArr.push(tempBool);
      // set wordsFromXlsx
      let tempArr = []; // will push empty arrays to wordsFromXlsx = num of leks
      wordsFromXlsx.push(tempArr);
    }
    resolve();
    //   console.log(lektionenArr);
    //   console.log(lekSelectArr);
    //   console.log(wordsFromXlsx);
  });
}
async function readMyXlsxFile(fileName) {
  
  if (fileType == "localFile") {
    workbook = await XLSX.read(await (await fetch(fileName)).arrayBuffer());
  // console.log(workbook);
    var num  // row count
    for(var i = 1;;i++)
    {
      // console.log(eval(`workbook.Sheets.Sheet1.A${i}`));
      if(typeof eval(`workbook.Sheets.Sheet1.A${i}`) === "undefined"){
        num = (i-1);
       console.log("Row Count:", num); // row count
       break;
      }
    }
    // console.log(workbook.Sheets.Sheet1); //
    // console.log(workbook.Sheets.Sheet1.A2.h.slice(3)); //Lek number
    // console.log(workbook.Sheets.Sheet1.B2.h); //Du word
    // console.log(workbook.Sheets.Sheet1.C2.h); //Du example
    // console.log(workbook.Sheets.Sheet1.D2.h); //Ar word
    // console.log(workbook.Sheets.Sheet1.E2.h); //Ar example
    await setWordsArray(num, workbook);
    if (checkLekCountandLekNum == false) {
      fillEmptyLekArr();
      convertWordObjToArrOfArr(wordsFromXlsx);
    } else if (checkLekCountandLekNum == true) {
      redirectToChangeLekNum();
    }
  } else if (fileType == "googleSheet") {
    workbook = await XLSX.read(await (await fetch(fileName)).arrayBuffer());
  // console.log(workbook);
    var num = Number(workbook.Sheets.Sheet1.B2.v)+2 ; // row count
    // num = Number(num) + 1;
    console.log("Row Count:", num); // row count
    // console.log(workbook.Sheets.Sheet1); //
    // console.log(workbook.Sheets.Sheet1.B3.v.slice(3)); //Lek number
    // console.log(workbook.Sheets.Sheet1.C3.v); //Du word
    // console.log(workbook.Sheets.Sheet1.D3.v); //Du example
    // console.log(workbook.Sheets.Sheet1.E3.v); //Ar word
    // console.log(workbook.Sheets.Sheet1.F3.v); //Ar example
    await setWordsArray(num, workbook);
    if (checkLekCountandLekNum == false) {
      fillEmptyLekArr();
      convertWordObjToArrOfArr(wordsFromXlsx);
    } else if (checkLekCountandLekNum == true) {
      redirectToChangeLekNum();
    }
  }
  else if (fileType == "uploadFile") {
    
      
        ldb.get('FileData', function (value) {
          // console.log( value.length);
          for(var i = 0 ; i<value.length ; i++)
          {
            workbook[i]= value[i];
          }
          // console.log('And the value is', workbook);
          var num =  workbook.length ; // row count
          // console.log("Row Count:", num); // row count
          // console.log(workbook); //
          // console.log(workbook[27][0].slice(3)); //Lek number
          // console.log(workbook[27][1]); //Du word
          // // console.log( workbook[27][2] !== null); //Du example
          // if(workbook[27][2] !== null){
          //   console.log( workbook[27][2] ); //Du example
          // }
          // console.log(workbook[27][3]); //Ar word
          // console.log(workbook[27][4]); //Ar example
          setWordsArray(num, workbook);
          if (checkLekCountandLekNum == false) {
            fillEmptyLekArr();
            convertWordObjToArrOfArr(wordsFromXlsx);
          } else if (checkLekCountandLekNum == true) {
            redirectToChangeLekNum();
          }
        });
    }
  }

async function setWordsArray(numOfWords, workbook) {
  if (fileType == "localFile") {
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
      var leknum =Number( eval(`workbook.Sheets.Sheet1.A${i}.v.slice(3)`));
      var DuWord = "---";
      if(typeof eval(`workbook.Sheets.Sheet1.B${i}`) !== "undefined" )
      {
         DuWord = eval(`workbook.Sheets.Sheet1.B${i}.v`);
      }
      // console.log(DuWord);

      var DuExample = "---";
      if(typeof eval(`workbook.Sheets.Sheet1.C${i}`) !== "undefined" )
      {
         DuExample = eval(`workbook.Sheets.Sheet1.C${i}.v`);
      }
      // console.log(DuExample);

      var ArWord = '---';
      if(typeof eval(`workbook.Sheets.Sheet1.D${i}`) !== "undefined" )
      {
         ArWord = eval(`workbook.Sheets.Sheet1.D${i}.v`);
      }
    
      var ArExample = "---";
      if(typeof eval(`workbook.Sheets.Sheet1.E${i}`) !== "undefined" )
      {
        ArExample = eval(`workbook.Sheets.Sheet1.E${i}.v`);
      }
      // console.log(ArExample);

      if (leknum > lekCount) {
        console.log("yes");
        checkLekCountandLekNum = true;
        return;
      }
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
  } else if (fileType == "googleSheet") {
    for (var i = 3; i <= numOfWords; i++) {
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
      var leknum =Number(eval(`workbook.Sheets.Sheet1.B${i}.v.slice(3)`));
      // console.log(leknum);
      var DuWord = "---";
      if(typeof eval(`workbook.Sheets.Sheet1.C${i}`) !== "undefined" )
      {
         DuWord = eval(`workbook.Sheets.Sheet1.C${i}.v`);
      }
      // console.log(DuWord);

      var DuExample = "---";
      if(typeof eval(`workbook.Sheets.Sheet1.D${i}`) !== "undefined" )
      {
         DuExample = eval(`workbook.Sheets.Sheet1.D${i}.v`);
      }
      // console.log(DuExample);

      var ArWord = '---';
      if(typeof eval(`workbook.Sheets.Sheet1.E${i}`) !== "undefined" )
      {
         ArWord = eval(`workbook.Sheets.Sheet1.E${i}.v`);
      }
    
      var ArExample = "---";
      if(typeof eval(`workbook.Sheets.Sheet1.F${i}`) !== "undefined" )
      {
        ArExample = eval(`workbook.Sheets.Sheet1.F${i}.v`);
      }
      // console.log(ArExample);
      if (leknum > lekCount) {
        // console.log(leknum);
        // console.log(lekCount);
        // console.log("yes");

        checkLekCountandLekNum = true;
        return;
      }
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
  else if (fileType == "uploadFile") {
    for (var i = 1; i < numOfWords; i++) {
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
      var leknum =Number(eval(`workbook[${i}][0].slice(3)`));
      // console.log(leknum);
      var DuWord = "---";
      if( eval(`workbook[${i}][1]`) !== null )
      {
         DuWord = eval(`workbook[${i}][1]`);
      }
      // console.log(DuWord);

      var DuExample = "---";
      if( eval(`workbook[${i}][2]`) !== null )
      {
         DuExample = eval(`workbook[${i}][2]`);
      }
      // console.log(DuExample);

      var ArWord = '---';
      if( eval(`workbook[${i}][3]`) !== null )
      {
         ArWord = eval(`workbook[${i}][3]`);
      }
    
      var ArExample = "---";
      if( eval(`workbook[${i}][4]`) !== null )
      {
        ArExample = eval(`workbook[${i}][4]`);
      }
      // console.log(ArExample);
      if (leknum > lekCount) {
        checkLekCountandLekNum = true;
        return;
      }
      
      
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
}

// important fun to fill empty lek array to prevent undifined field
function fillEmptyLekArr() {
  for (var i = 0; i < wordsFromXlsx.length; i++) {
    var obj = {
      Lek: 0,
      Du_word: "Empty",
      Du_example: "Empty",
      Ar_word: "Empty",
      Ar_example: "Empty",
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

function redirectToChangeLekNum() {
  var redirect1 = document.getElementById("redirect1");
  var redirectContainer = document.getElementById("redirectContainer");
  var SearchPageContainer = document.getElementById("SearchPageContainer");
  redirect1.classList.remove("d-none");
  redirectContainer.classList.remove("d-none");
  SearchPageContainer.classList.add("d-none");
  setTimeout(() => {
    window.location.href = "setFile.html";
  }, 8000);
}
///////////////////////////////////////

// start From Here
// to ckeck previous files history

function defineFileStatus() {
  var redirect = document.getElementById("redirect");
  var redirectContainer = document.getElementById("redirectContainer");
  var SearchPageContainer = document.getElementById("SearchPageContainer");
  if (
    localStorage.getItem("fileSource") == null &&
    localStorage.getItem("lekCount") == null &&
    localStorage.getItem("sourceType") == null
  ) {
    redirect.classList.remove("d-none");
    redirectContainer.classList.remove("d-none");
    SearchPageContainer.classList.add("d-none");
    setTimeout(() => {
      window.location.href = "setFile.html";
    }, 5000);
  } else {
    fileName = localStorage.getItem("fileSource");
    lekCount = Number(localStorage.getItem("lekCount"));
    fileType = localStorage.getItem("sourceType");
  }
}

// to retrieve data from local storage
if (JSON.parse(localStorage.getItem("myWords")) != null) {
  myWords = JSON.parse(localStorage.getItem("myWords"));
}

startFromHere();
async function startFromHere() {
  defineFileStatus();
  setArrays(lekCount);
  await readMyXlsxFile(fileName);
  words = wordsFromXlsx;
  showLektionBtns();
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
          <i class="d-none pe-2 w-25 fa-regular fa-circle-xmark"></i>
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
function updateWordsArr() {
  // console.log(searchInput.value);
  var FinalIndexOfLek = getFinalIndexOfLek();
  // this condition : if user didn't use filter it sets all lek. index in array
  // to search inside it
  if (FinalIndexOfLek.length == 0) {
    for (var i = 0; i < lektionenArr.length; i++) {
      FinalIndexOfLek.push(i);
    }
    // console.log(FinalIndexOfLek);
  }
  combineNewArrofWords(FinalIndexOfLek);
  // from here will work with finalWordArr

  displayTable(finalWordArr);
}

// show all function button
showAll.addEventListener("click", function () {
  // set all lek index to array

  var FinalIndexOfLek = setAllLekIndex();

  combineNewArrofWords(FinalIndexOfLek);
  // from here will work with finalWordArr

  displayTable(finalWordArr);
});

// show stored words function button
storedWords.addEventListener("click", function () {
  displayTableForSortedWords();
});

function removeRow(i) {
  myWords.splice(i, 1);
  //save new myWord to localstorage
  localStorage.setItem("myWords", JSON.stringify(myWords));

  // reshow the table
  displayTableForSortedWords();

  // to make the user know the word has been added
  var toast2 = document.getElementById("liveToast2");
  toast2.classList.add("toastE");

  setTimeout(() => {
    toast2.classList.remove("toastE");
  }, 2000);
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
