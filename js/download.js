var myWords = []; // array of localStorage
var lektionenArr = []; // restore leks names ex: lek1:lek12
var lekSelectArr = []; // falses values = lek count // array helps on selecting leks by user

////////////////////REtrive Data From Xlsx File//////////////////////////
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
  // we need number 1
  for (let i = 1; i <= lekCount; i++) {
    // set lektionenArr
    let tempname = "Lek" + i;
    lektionenArr.push(tempname);
    // set lekSelectArr
    let tempBool = false;
    lekSelectArr.push(tempBool);
    // set wordsFromXlsx
    let tempArr = [];
    wordsFromXlsx.push(tempArr);
  }
  //   console.log(lektionenArr);
  //   console.log(lekSelectArr);
  //   console.log(wordsFromXlsx);
}
async function readMyXlsxFile(fileName) {
  let workbook = await XLSX.read(await (await fetch(fileName)).arrayBuffer());
  // console.log(workbook);
  if (fileType == "localFile") {
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
    if (checkLekCountandLekNum == false) {
      fillEmptyLekArr();
      convertWordObjToArrOfArr(wordsFromXlsx);
    } else if (checkLekCountandLekNum == true) {
      redirectToChangeLekNum();
    }
  } else if (fileType == "googleSheet") {
    var num = Number(workbook.Sheets.Sheet1.B2.v) + 2; // row count
    // num = Number(num) + 1;
    // console.log("Row Count:", num); // row count
    // console.log(workbook.Sheets.Sheet1); //
    // console.log(workbook.Sheets.Sheet1.B3.v.slice(3)); //Lek number
    // console.log(workbook.Sheets.Sheet1.C3.v); //Du word
    // console.log(workbook.Sheets.Sheet1.D3.v); //Du example
    // console.log(workbook.Sheets.Sheet1.E3.v); //Ar word
    // console.log(workbook.Sheets.Sheet1.F3.v); //Ar example
    setWordsArray(num, workbook);
    if (checkLekCountandLekNum == false) {
      fillEmptyLekArr();
      convertWordObjToArrOfArr(wordsFromXlsx);
    } else if (checkLekCountandLekNum == true) {
      redirectToChangeLekNum();
    }
  }
}

function setWordsArray(numOfWords, workbook) {
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
      var leknum = eval(`workbook.Sheets.Sheet1.A${i}.h.slice(3)`);
      var DuWord = eval(`workbook.Sheets.Sheet1.B${i}.h`);
      var DuExample = eval(`workbook.Sheets.Sheet1.C${i}.h`);
      var ArWord = eval(`workbook.Sheets.Sheet1.D${i}.h`);
      var ArExample = eval(`workbook.Sheets.Sheet1.E${i}.h`);
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
      var leknum = eval(`workbook.Sheets.Sheet1.B${i}.v.slice(3)`);
      var DuWord = eval(`workbook.Sheets.Sheet1.C${i}.v`);
      var DuExample = eval(`workbook.Sheets.Sheet1.D${i}.v`);
      var ArWord = eval(`workbook.Sheets.Sheet1.E${i}.v`);
      var ArExample = eval(`workbook.Sheets.Sheet1.F${i}.v`);
      if (leknum > lekCount) {
        console.log(leknum);
        console.log(lekCount);
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
  var downloadPageContainer = document.getElementById("downloadPageContainer");
  redirect1.classList.remove("d-none");
  redirectContainer.classList.remove("d-none");
  downloadPageContainer.classList.add("d-none");
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
  var downloadPageContainer = document.getElementById("downloadPageContainer");
  if (
    localStorage.getItem("fileSource") == null &&
    localStorage.getItem("lekCount") == null &&
    localStorage.getItem("sourceType") == null
  ) {
    redirect.classList.remove("d-none");
    redirectContainer.classList.remove("d-none");
    downloadPageContainer.classList.add("d-none");
    setTimeout(() => {
      window.location.href = "setFile.html";
    }, 5000);
  } else {
    fileName = localStorage.getItem("fileSource");
    lekCount = Number(localStorage.getItem("lekCount"));
    fileType = localStorage.getItem("sourceType");
  }
}

function writeMyXlsxFile(ws_data) {
  var wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "Deutsch Wörter",
    Subject: "Deutsch Kurs",
    Author: "Moataz Nasser",
    CreatedDate: new Date(2020, 11, 11),
  };

  wb.SheetNames.push("Sheet1");

  // add num of words(arraies) to the file on first cell A1
  // reading the file depending on this num
  var arrLength = [`${ws_data.length}`];
  ws_data.unshift(arrLength);
  // console.log(ws_data.length)
  // console.log(ws_data)
  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Sheet1"] = ws;

  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  // catch Button to fire function
  $("#button-a").click(function () {
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "Deutsch_Wort.xlsx"
    );
  });
}

///////////////////////////////////////

startFromHere();

async function startFromHere() {
  await defineFileStatus();
  await setArrays(lekCount);
  await readMyXlsxFile(fileName);
  words = await wordsFromXlsx;
  writeMyXlsxFile(WordsToWrite);
}
