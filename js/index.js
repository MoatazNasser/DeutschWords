

// extended local storage line // https://github.com/DVLP/localStorageDB#readme   // https://www.npmjs.com/package/localdata
!function(){var s,c,e="undefined"!=typeof window?window:{},t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB;"undefined"==typeof window||t?((t=t.open("ldb",1)).onsuccess=function(e){s=this.result},t.onerror=function(e){console.error("indexedDB request error"),console.log(e)},t={get:(c={ready:!(t.onupgradeneeded=function(e){s=null,e.target.result.createObjectStore("s",{keyPath:"k"}).transaction.oncomplete=function(e){s=e.target.db}}),get:function(e,t){s?s.transaction("s").objectStore("s").get(e).onsuccess=function(e){e=e.target.result&&e.target.result.v||null;t(e)}:setTimeout(function(){c.get(e,t)},50)},set:function(t,n,o){if(s){let e=s.transaction("s","readwrite");e.oncomplete=function(e){"Function"==={}.toString.call(o).slice(8,-1)&&o()},e.objectStore("s").put({k:t,v:n}),e.commit()}else setTimeout(function(){c.set(t,n,o)},50)},delete:function(e,t){s?s.transaction("s","readwrite").objectStore("s").delete(e).onsuccess=function(e){t&&t()}:setTimeout(function(){c.delete(e,t)},50)},list:function(t){s?s.transaction("s").objectStore("s").getAllKeys().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.list(t)},50)},getAll:function(t){s?s.transaction("s").objectStore("s").getAll().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.getAll(t)},50)},clear:function(t){s?s.transaction("s","readwrite").objectStore("s").clear().onsuccess=function(e){t&&t()}:setTimeout(function(){c.clear(t)},50)}}).get,set:c.set,delete:c.delete,list:c.list,getAll:c.getAll,clear:c.clear},e.ldb=t,"undefined"!=typeof module&&(module.exports=t)):console.error("indexDB not supported")}();

var workbook =[]; // will recive Data from exel or indexedDB
////////////////////////////////////////////////////////////

var optionsArr = ["Arabisch", "Deutsch", "Meine Wörter!!"];
// prototype
// var lektionenArr = ["Lek1","Lek2","Lek3","Lek4","Lek5","Lek6","Lek7","Lek8","Lek9","Lek10","Lek11","Lek12",];
// var lekSelectArr = [false,false,false,false,false,false,false,false,false,false,false,false,];
var lektionenArr = []; // restore leks names ex: lek1:lek12
var lekSelectArr = []; // falses values = lek count // array helps on selecting leks by user
var selectedLang = "";
var selectedLektionen = []; // ex: 1 ,2 ex: 0 = Lek1 & 1 = Lek2
var myWords = []; // array of localStorage
var mainContainer = document.getElementById("mainContainer"); // main words container(main Div)
var words = [];
// console.log(words);
var finalWordArr = []; // final array after merging lek. selected by user
var cardsData = document.getElementById("cardsData"); // main container of cards

var userOptions = document.getElementById("userOptions"); // lang Btns div
var userLek = document.getElementById("userLektion"); // lek Btns div
var backSubmit = document.getElementById("backSubmit"); // backSubmit Btns div
var finalselect = document.getElementById("finalselect"); // final lek names results div

var lekColorDiv = document.getElementById("lekColorDiv"); // Div of colors Guide

var langChoose = document.getElementsByClassName("opt"); // catch all languages elements Btns for addevent lis
var lekData = document.getElementsByClassName("lek"); // catch all lektionen elements Btns for addevent lis
// Btn Index to know which Btn user clicked (lektionen)
var BtnIndex = -1;
//back Btn + submit Btn + choos Btn
var back = document.getElementById("back");
var submit = document.getElementById("submit");
var rechoose = document.getElementById("rechoose");

// array will recive data when random clicked
var newRandomArr =[];
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
  redirect1.classList.remove("d-none");
  userOptions.classList.add("d-none");
  setTimeout(() => {
    window.location.href = "setFile.html";
  }, 8000);
}
///////////////////////////////////////

// start From Here
// to retrieve data from local storage
if (JSON.parse(localStorage.getItem("myWords")) != null) {
  myWords = JSON.parse(localStorage.getItem("myWords"));
}
// to ckeck previous files history
function defineFileStatus() {
  return new Promise(function (resolve, reject) {
    var redirect = document.getElementById("redirect");
    if (
      localStorage.getItem("fileSource") == null &&
      localStorage.getItem("lekCount") == null &&
      localStorage.getItem("sourceType") == null
    ) {
      redirect.classList.remove("d-none");
      userOptions.classList.add("d-none");
      setTimeout(() => {
        window.location.href = "setFile.html";
      }, 5000);
    } else {
      fileName = localStorage.getItem("fileSource");
      lekCount = Number(localStorage.getItem("lekCount"));
      fileType = localStorage.getItem("sourceType");
      resolve();
    }
  });
}



startFromHere();
async function startFromHere() {
  await defineFileStatus();
  await setArrays(lekCount);
  await readMyXlsxFile(fileName);
  words = wordsFromXlsx;
  showOptions();
  applyClickToOptions();
  showLektionBtns();
  applyClickToLektion();
  showColorGuide();
}
// // End Here

// // show options Btns
function showOptions() {
  var userOpt = "";
  for (var i = 0; i < optionsArr.length; i++) {
    userOpt += `
        <div
        class="opt position-relative col-md-3 col-6 myBtn1 rounded-3 fw-semibold fs-5 d-flex justify-content-center align-items-center py-2 mx-2 mb-4 myshadow">
        <div onclick="selectedBtnOption(${i})" class=" w-100 h-100 rounded-3 position-absolute top-0 start-0"></div>
        <span class='textShadow text-light'>${optionsArr[i]}</span>
    </div>
      `;
  }
  userOptions.innerHTML = `
    <h2 class="text-center fw-bold col-12 py-3 textShadow text-light">Select cards language</h2>
  ${userOpt}
  `;
}

// // on click set language + go to choose lektionen
// // or go to my words

function applyClickToOptions() {
  for (var i = 0; i < langChoose.length; i++) {
    langChoose[i].addEventListener("click", function (e) {
      var langName = e.target.nextElementSibling.innerHTML;
      selectedLang = langName;
      if (selectedLang == "Arabisch" || selectedLang == "Deutsch") {
        // go to next options(lektionen)
        userOptions.classList.toggle("d-none");
        userLek.classList.toggle("d-none");
        backSubmit.classList.toggle("d-none");
      } else if (langName == "Meine Wörter!!") {
        userOptions.classList.toggle("d-none");
        myWordsLang.classList.toggle("d-none");
        backToStartFirst.classList.remove("d-none"); // show Btn to back
      }
    });
  }
}
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
  userLek.innerHTML = `
<h2 class="text-center fw-bold col-12 py-3 textShadow text-light">Select Lek numbers</h2>
${userLekData}
`;
}

// // changing Btn style + add lek name to array
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
      } else if (lekSelectArr[BtnIndex] == false) {
        // Clicked
        // console.log("iam here2");
        lekSelectArr[BtnIndex] = true;
        closeIconItem.classList.remove("d-none");
        parent.classList.remove("myBtn");
        parent.classList.add("myBtnClicked");
        // add Lektion name to array
        selectedLektionen.push(lekName);
        // console.log(selectedLektionen);
      }
    });
  }
}
// // function to show colors of lektionen above final results
function showColorGuide() {
  var temp = "";
  for (var i = 1; i <= lektionenArr.length; i++) {
    temp += `
  <div class="col d-flex justify-content-center mt-2">
      <div class="p-2 bg-L${i} textShadow text-light fix-s d-flex justify-content-center align-items-center">
        L${i}
      </div>
  </div>
  `;
  }
  lekColorDiv.innerHTML = temp;
}
// // get index of Btn and assign it to global variable (Lektion)
function selectedBtnLek(btnNum) {
  BtnIndex = btnNum;
  //   console.log(btnNum);
}
// // get index of Btn and assign it to global variable (Sprache)
function selectedBtnOption(btnNum) {
  BtnIndex = btnNum;
  //   console.log(btnNum);
}
// // back Btn function
back.addEventListener("click", function () {
  selectedLektionen = [];
  selectedLang = "";
  userOptions.classList.toggle("d-none");
  userLek.classList.toggle("d-none");
  backSubmit.classList.toggle("d-none");

  // reset all Lek Btns to default
  for (var i = 0; i < lekData.length; i++) {
    lekSelectArr[i] = false;
    lekData[i].classList.remove("myBtn");
    lekData[i].classList.add("myBtn");
    lekData[i].classList.remove("myBtnClicked");
    lekData[i].children[2].classList.add("d-none");
  }
});

// // Edit final list of lek to equal index inside Arr of words
function getFinalIndexOfLek() {
  for (var i = 0; i < selectedLektionen.length; i++) {
    selectedLektionen[i] = selectedLektionen[i].slice(3) - 1;
  }
  selectedLektionen = selectedLektionen.sort(function (a, b) {
    return a - b;
  });

  // console.log("keyyyy");
  // console.log(selectedLektionen);
}

// // click submit function /showing selected Lek then call fun to show words
var listLek = document.getElementById("listLek");
var lekColo = document.getElementById("lekColo");
var random = document.getElementById("random");

submit.addEventListener("click", async function () {
  // first step calling final index
  getFinalIndexOfLek();
  // prepare options div
  if(selectedLektionen.length != 0)
  {
    newRandomArr =[];
    random.classList.remove("d-none");
  }
  
  finalselect.classList.toggle("d-none");
  userLek.classList.toggle("d-none");
  backSubmit.classList.toggle("d-none");
  lekColo.classList.toggle("d-none");

  // show selected lek to user
  var temp = "";
  if (selectedLektionen.length == 0) {
    listLek.innerHTML = `<h3 class='text-center tsxtShadow text-light'>Please back and select min. 1 lektion</h3>`;
  } else {
    for (var i = 0; i < selectedLektionen.length; i++) {
      selectedLektionen[i] = selectedLektionen[i] + 1;
      temp += `
      <div class="col-md-2 col-4 bg-L${selectedLektionen[i]} innerShadow rounded-3 fw-semibold fs-5 d-flex justify-content-center align-items-center my-2 py-2 me-2">
          <span class='px-2 text-light text-center textShadow'>Lek ${selectedLektionen[i]}</span>
      </div>
      `;
    }
    for (var i = 0; i < selectedLektionen.length; i++) {
      selectedLektionen[i] = selectedLektionen[i] - 1;
    } // to minus 1 and get right index again
    listLek.innerHTML = temp;
  }

  // start of logic
  mainContainer.classList.toggle("d-none"); // show cards container
  combineNewArrofWords(); // prepare list of words
  setDatatoCards(); /////////// show data
});

// // choose Btn fun
rechoose.addEventListener("click", function () {
  newRandomArr =[];
  selectedLektionen = [];
  finalWordArr = [];
  cardsData.innerHTML = ""; // empty cards container
  random.classList.add("d-none");// hide random
  finalselect.classList.toggle("d-none");
  userLek.classList.toggle("d-none");
  backSubmit.classList.toggle("d-none");
  lekColo.classList.toggle("d-none");

  // reset all Lek Btns to default
  for (var i = 0; i < lekData.length; i++) {
    lekSelectArr[i] = false;
    lekData[i].classList.remove("myBtn");
    lekData[i].classList.add("myBtn");
    lekData[i].classList.remove("myBtnClicked");
    lekData[i].children[2].classList.add("d-none");
  }
  // start of logic
  mainContainer.classList.toggle("d-none");
});

// // card flip 
var backface = document.getElementsByClassName("backFace");
var frontface = document.getElementsByClassName("frontFace");
function setCardsize() {
  for (var i = 0; i < backface.length; i++) {
    var backfaceHeight = backface[i].offsetHeight + 100;
    var frontfaceHeight = frontface[i].offsetHeight + 100;
    if(backfaceHeight >= frontfaceHeight){
      backface[
        i
      ].parentElement.parentElement.style.height = `${backfaceHeight}px`;
      // console.log("set card size called");
    }
    else if(frontfaceHeight>backfaceHeight){
      frontface[
        i
      ].parentElement.parentElement.style.height = `${frontfaceHeight}px`;
      // console.log("set card size called");
    }
    
  }
}

// // to change card size to fit in any new window size
window.addEventListener("resize", function () {
  for (var i = 0; i < backface.length; i++) {
    var backfaceHeight = backface[i].offsetHeight + 100;
    var frontfaceHeight = frontface[i].offsetHeight + 100;
    if(backfaceHeight>=frontfaceHeight){
      backface[
        i
      ].parentElement.parentElement.style.height = `${backfaceHeight}px`;
      // console.log("set card size called");
    }
    else if(frontfaceHeight>backfaceHeight){
      backface[
        i
      ].parentElement.parentElement.style.height = `${frontfaceHeight}px`;
      // console.log("set card size called");
    }
    
  }
});

function setFlipFuncToCard() {
  var box = document.getElementsByClassName("box");
  for (var i = 0; i < box.length; i++) {
    box[i].addEventListener("click", function (e) {
      var parent = e.target.parentElement;
      parent.style.cssText = "transform: rotateY(-180deg)";
      // parent.disabled;
      // console.log(parent);
      // console.log(parent);
    });
    box[i].addEventListener("mouseleave", function (e) {
      var parent = e.target;
      parent.style.cssText = "transform: rotateY(0deg)";
      // console.log(parent);
    });
  }
}

// // function to combine words in user's final lekArr
function combineNewArrofWords() {
  // console.log(selectedLektionen);///////////////////////
  for (var i = 0; i < selectedLektionen.length; i++) {
    var index = selectedLektionen[i];
    finalWordArr.push(words[index]);
  }
  // console.log(finalWordArr); /////////////////////////
}

// // show final results on cards
function setDatatoCards() {
  if (selectedLang == "Deutsch") {
    // console.log("Deutsch"); ////////////////////////////
    deutschSequence(finalWordArr);
  } else if (selectedLang == "Arabisch") {
    // console.log("Arabisch"); /////////////////////////////
    arabicSequence(finalWordArr);
  } else if (selectedLang == "Meine Wörter!!") {
    // myWordsSequence();
    // console.log("Meine Wörter!!"); /////////////////////////
  }
}
// // operations and functions to show myWords in correct lang.
var myWordsCardlang = "";
var myWordsLang = document.getElementById("myWordsLang");
var backToStartFirst = document.getElementById("backToStartFirst");
var backToStartSecond = document.getElementById("backToStartSecond");
async function setMyWordsCardsLang(e) {
  if(myWords.length != 0)
  {
    random.classList.remove("d-none");
  }
  myWordsCardlang = await e.nextElementSibling.innerHTML;
  // console.log(myWordsCardlang);
  lekColo.classList.toggle("d-none");
  showColorGuide();
  mainContainer.classList.toggle("d-none"); // show cards container
  myWordsLang.classList.toggle("d-none"); // cards lang options
  backToStartSecond.classList.toggle("d-none"); // show Btn to back
  showMyWordsCard(myWordsCardlang , myWords);
  setCardsize();
  setFlipFuncToCard();
}

backToStartFirst.addEventListener("click", function () {
  // mainContainer.classList.toggle("d-none"); // show cards container
  userOptions.classList.toggle("d-none"); // main options
  myWordsLang.classList.toggle("d-none"); // hide Btn to back
  backToStartFirst.classList.toggle("d-none"); // hide Btn to back
});

backToStartSecond.addEventListener("click", function () {
  newRandomArr =[];//empty random array
  random.classList.add("d-none");//hide rondom
  mainContainer.classList.toggle("d-none"); // hide cards container
  lekColo.classList.toggle("d-none"); // hide cards container
  userOptions.classList.toggle("d-none"); // show main options
  backToStartSecond.classList.toggle("d-none"); // hide Btn to back
  cardsData.innerHTML = ``;
});


random.addEventListener("click",async()=>{
if(selectedLang=="Arabisch" || selectedLang=="Deutsch"){
  // console.log("Ar or Du");
      newRandomArr =[];
      if(selectedLang=="Arabisch"){
        
        for(var i= 0 ; i<finalWordArr.length ; i++)
        {
          for(var j = 0 ; j<finalWordArr[i].length ; j++)
          {
            newRandomArr.push(finalWordArr[i][j])
          }
        }
        await shuffle(newRandomArr);

          showRandomCard("Arabisch" , newRandomArr);
          setCardsize();
          setFlipFuncToCard();

      }
      else if(selectedLang=="Deutsch"){
          newRandomArr =[];
          for(var i= 0 ; i<finalWordArr.length ; i++)
          {
            for(var j = 0 ; j<finalWordArr[i].length ; j++)
            {
              // console.log(finalWordArr[i][j]);
              newRandomArr.push(finalWordArr[i][j]);
            }
          }
          // console.log(newRandomArr);
          await shuffle(newRandomArr);

          showRandomCard("Deutsch" , newRandomArr);
          setCardsize();
          setFlipFuncToCard();
        }
     
}
else if(selectedLang=="Meine Wörter!!"){
  // console.log("Meine Wörter!!");
           newRandomArr =[];
           newRandomArr =[...myWords];
          // console.log(myWords);
          // console.log(newRandomArr);
          // for(var i= 0 ; i<myWords.length ; i++)
          // {
          // //  newRandomArr= [...myWords];
          // }
          await shuffle(newRandomArr);

          showMyWordsCard(myWordsCardlang , newRandomArr);
          setCardsize();
          setFlipFuncToCard();
}
});

// function to random  https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// // write Deutsch cards
// //inline style pointer-event to cancel preventEvent class/ this code added because
// // i tried to click on backface and the click active then the text mirrored
// // so i prevent events on card backface but allow the button to add to storage
function showDeutchCard(finalWordArr) {
  var temp = "";
  for (var i = 0; i < finalWordArr.length; i++) {
    for (var j = 0; j < finalWordArr[i].length; j++) {
      temp += `
        <div class="col-lg-3  p-2 contain ">
        <div class="break rounded-3"></div>
        <div class="d-flex justify-content-center py-2"><button style="pointer-events:inherit;" onclick="setWordToMyWords(${i} ,${j})"  class="btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind50 ">نسيتها ضيفها
        للقائمة!!</button></div>
        <div class="box position-relative my-height d-flex justify-content-center">
            <div class="position-absolute  top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
            <div
                class="frontFace position-absolute w-100 p-2 bg-L${finalWordArr[i][j].Lek} rounded-4 d-flex align-items-center flex-column">
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Das Wort - L${finalWordArr[i][j].Lek} </div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${finalWordArr[i][j].Du_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Zum Beispiel</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${finalWordArr[i][j].Du_example}</div>
                    
            </div>

            <div
                class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
                <div class="position-absolute  preventEvent top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>

                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">المعنى</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${finalWordArr[i][j].Ar_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">مثال</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${finalWordArr[i][j].Ar_example}</div>
            </div>
            
        </div>
        
    </div>
    `;
    }
  }
  cardsData.innerHTML = temp;
}

// // write Arabisch cards

function showArabicCard(finalWordArr) {
  var temp = "";
  for (var i = 0; i < finalWordArr.length; i++) {
    for (var j = 0; j < finalWordArr[i].length; j++) {
      temp += `
      <div class="col-lg-3  p-2 contain">
      <div class="break rounded-3"></div>
      <div class="d-flex justify-content-center py-2"><button style="pointer-events:inherit;" onclick="setWordToMyWords(${i} ,${j})"  class="btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind50 ">نسيتها ضيفها
        للقائمة!!</button></div>
      <div class="box position-relative my-height d-flex justify-content-center">
          <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
          <div
              class="frontFace position-absolute w-100 p-2 bg-L${finalWordArr[i][j].Lek} rounded-4 d-flex align-items-center flex-column">
              <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">الكلمـة - L${finalWordArr[i][j].Lek} </div>
              <div
                  class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                  ${finalWordArr[i][j].Ar_word}</div>
              <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">مثـال</div>
              <div
                  class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                  ${finalWordArr[i][j].Ar_example}</div>
          </div>

          <div
              class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
              <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Das Wort</div>
              <div
                  class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                  ${finalWordArr[i][j].Du_word}</div>
              <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Zum Beispiel</div>
              <div
                  class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                  ${finalWordArr[i][j].Du_example}</div>
              
          </div>
      </div>
  </div>
    `;
    }
  }
  cardsData.innerHTML = temp;
}

function showMyWordsCard(lang , myWords) {
  var temp = "";
  if (lang == "Arabisch") {
    for (var i = 0; i < myWords.length; i++) {
      temp += `
          <div class="col-lg-3  p-2 contain">
          <div class="break "></div>
          <div class="d-flex justify-content-center py-2"><button style="pointer-events: all;" onclick="removeWordFromMyWords(${i})"  class=" btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind30">احذفها من القائمة</button></div>
          <div class="box position-relative my-height d-flex justify-content-center">
              <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
              <div
                  class="frontFace position-absolute w-100 p-2 bg-L${myWords[i].Lek} rounded-4 d-flex align-items-center flex-column">
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">الكلمة - L${myWords[i].Lek} </div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                      ${myWords[i].Ar_word}</div>
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">المثـال</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                      ${myWords[i].Ar_example}</div>
              </div>

              <div
                  class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
                  <div class="position-absolute preventEvent top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>

                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Das Wort</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                      ${myWords[i].Du_word}</div>
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Zum Beispiel</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                      ${myWords[i].Du_example}</div>
                  
              </div>
          </div>
      </div>
      `;
    }
    cardsData.innerHTML = temp;
  } else if (lang == "Deutsch") {
    for (var i = 0; i < myWords.length; i++) {
      temp += `
        <div class="col-lg-3  p-2 contain">
        <div class="break "></div>
        <div class="d-flex justify-content-center py-2"><button style="pointer-events: all;" onclick="removeWordFromMyWords(${i})"  class=" btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind30">احذفها من القائمة</button></div>
        <div class="box position-relative my-height d-flex justify-content-center">
            <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
            <div
                class="frontFace position-absolute w-100 p-2 bg-L${myWords[i].Lek} rounded-4 d-flex align-items-center flex-column">
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Das Wort - L${myWords[i].Lek} </div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${myWords[i].Du_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Zum Beispiel</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${myWords[i].Du_example}</div>
            </div>

            <div
                class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
                <div class="position-absolute preventEvent top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>

                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">المعنى</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${myWords[i].Ar_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">مثال</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${myWords[i].Ar_example}</div>
                
            </div>
        </div>
    </div>
    `;
    }
    cardsData.innerHTML = temp;
  }
  
}

function showRandomCard(lang , myWords) {
  var temp = "";
  if (lang == "Arabisch") {
    for (var i = 0; i < myWords.length; i++) {
      temp += `
          <div class="col-lg-3  p-2 contain">
          <div class="break "></div>
          <div class="d-flex justify-content-center py-2"><button style="pointer-events:inherit;" onclick="setWordFromRandomMyWords(${i})"  class="btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind50 ">نسيتها ضيفها
        للقائمة!!</button></div>
          <div class="box position-relative my-height d-flex justify-content-center">
              <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
              <div
                  class="frontFace position-absolute w-100 p-2 bg-L${myWords[i].Lek} rounded-4 d-flex align-items-center flex-column">
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">الكلمة - L${myWords[i].Lek} </div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                      ${myWords[i].Ar_word}</div>
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">المثـال</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                      ${myWords[i].Ar_example}</div>
              </div>

              <div
                  class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
                  <div class="position-absolute preventEvent top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>

                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Das Wort</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                      ${myWords[i].Du_word}</div>
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Zum Beispiel</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                      ${myWords[i].Du_example}</div>
                  
              </div>
          </div>
      </div>
      `;
    }
    cardsData.innerHTML = temp;
  } else if (lang == "Deutsch") {
    for (var i = 0; i < myWords.length; i++) {
      temp += `
        <div class="col-lg-3  p-2 contain">
        <div class="break "></div>
        <div class="d-flex justify-content-center py-2"><button style="pointer-events:inherit;" onclick="setWordFromRandomMyWords(${i})"  class="btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind50 ">نسيتها ضيفها
        للقائمة!!</button></div>
        <div class="box position-relative my-height d-flex justify-content-center">
            <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
            <div
                class="frontFace position-absolute w-100 p-2 bg-L${myWords[i].Lek} rounded-4 d-flex align-items-center flex-column">
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Das Wort - L${myWords[i].Lek} </div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${myWords[i].Du_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Zum Beispiel</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${myWords[i].Du_example}</div>
            </div>

            <div
                class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
                <div class="position-absolute preventEvent top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>

                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">المعنى</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${myWords[i].Ar_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">مثال</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${myWords[i].Ar_example}</div>
                
            </div>
        </div>
    </div>
    `;
    }
    cardsData.innerHTML = temp;
  }
  
}

function deutschSequence(finalWordArr) {
  showDeutchCard(finalWordArr);
  setCardsize();
  setFlipFuncToCard();
}

function arabicSequence(finalWordArr) {
  showArabicCard(finalWordArr);
  setCardsize();
  setFlipFuncToCard();
}

function setWordToMyWords(f, s) {
  if (
    finalWordArr[f][s].Du_word == "Empty" &&
    finalWordArr[f][s].Ar_word == "Empty"
  ) {
    // console.log("empty");
    return;
  }
  for (var i = 0; i < myWords.length; i++) {
    if (myWords[i].Du_word == finalWordArr[f][s].Du_word) {
      // console.log(myWords[i].Du_word);
      // console.log(finalWordArr[f][s].Du_word);
      if (myWords[i].Ar_word == finalWordArr[f][s].Ar_word) {
        // console.log(myWords[i].Ar_word);
        // console.log(finalWordArr[f][s].Ar_word);
        if (myWords[i].Lek == finalWordArr[f][s].Lek) {
          // console.log("Added before");
          // to make the user know the word has been added before
          var toast3 = document.getElementById("liveToast3");
          toast3.classList.add("toastE");

          setTimeout(() => {
            toast3.classList.remove("toastE");
          }, 2000);
          return;
        }
      }
    }
  }
  myWords.push(finalWordArr[f][s]);
  localStorage.setItem("myWords", JSON.stringify(myWords));
  // console.log("Added");

  // to make the user know the word has been added
  var toast1 = document.getElementById("liveToast1");
  toast1.classList.add("toastE");

  setTimeout(() => {
    toast1.classList.remove("toastE");
  }, 2000);
}
function setWordFromRandomMyWords(f) {
  if (
    newRandomArr[f].Du_word == "Empty" &&
    newRandomArr[f].Ar_word == "Empty"
  ) {
    // console.log("empty");
    return;
  }
  for (var i = 0; i < myWords.length; i++) {
    if (myWords[i].Du_word == newRandomArr[f].Du_word) {
      // console.log(myWords[i].Du_word);
      // console.log(finalWordArr[f][s].Du_word);
      if (myWords[i].Ar_word == newRandomArr[f].Ar_word) {
        // console.log(myWords[i].Ar_word);
        // console.log(finalWordArr[f][s].Ar_word);
        if (myWords[i].Lek == newRandomArr[f].Lek) {
          // console.log("Added before");
          // to make the user know the word has been added before
          var toast3 = document.getElementById("liveToast3");
          toast3.classList.add("toastE");

          setTimeout(() => {
            toast3.classList.remove("toastE");
          }, 2000);
          return;
        }
      }
    }
  }
  myWords.push(newRandomArr[f]);
  localStorage.setItem("myWords", JSON.stringify(myWords));
  // console.log("Added");

  // to make the user know the word has been added
  var toast1 = document.getElementById("liveToast1");
  toast1.classList.add("toastE");

  setTimeout(() => {
    toast1.classList.remove("toastE");
  }, 2000);
}


function removeWordFromMyWords(i) {
  myWords.splice(i, 1);
  localStorage.setItem("myWords", JSON.stringify(myWords));
  // to make the user know the word has been removed
  var toast2 = document.getElementById("liveToast2");
  toast2.classList.add("toastE");
  setTimeout(() => {
    toast2.classList.remove("toastE");
  }, 2000);


  if(myWords.length == 0)
  {
    random.classList.add("d-none");// if array empty remove rondom
  }

  // reshow cards
  showMyWordsCard(myWordsCardlang , myWords);
  setCardsize();
  setFlipFuncToCard();
}


