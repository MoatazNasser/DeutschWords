// extended local storage line // https://github.com/DVLP/localStorageDB#readme
!function(){var s,c,e="undefined"!=typeof window?window:{},t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB;"undefined"==typeof window||t?((t=t.open("ldb",1)).onsuccess=function(e){s=this.result},t.onerror=function(e){console.error("indexedDB request error"),console.log(e)},t={get:(c={ready:!(t.onupgradeneeded=function(e){s=null,e.target.result.createObjectStore("s",{keyPath:"k"}).transaction.oncomplete=function(e){s=e.target.db}}),get:function(e,t){s?s.transaction("s").objectStore("s").get(e).onsuccess=function(e){e=e.target.result&&e.target.result.v||null;t(e)}:setTimeout(function(){c.get(e,t)},50)},set:function(t,n,o){if(s){let e=s.transaction("s","readwrite");e.oncomplete=function(e){"Function"==={}.toString.call(o).slice(8,-1)&&o()},e.objectStore("s").put({k:t,v:n}),e.commit()}else setTimeout(function(){c.set(t,n,o)},50)},delete:function(e,t){s?s.transaction("s","readwrite").objectStore("s").delete(e).onsuccess=function(e){t&&t()}:setTimeout(function(){c.delete(e,t)},50)},list:function(t){s?s.transaction("s").objectStore("s").getAllKeys().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.list(t)},50)},getAll:function(t){s?s.transaction("s").objectStore("s").getAll().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.getAll(t)},50)},clear:function(t){s?s.transaction("s","readwrite").objectStore("s").clear().onsuccess=function(e){t&&t()}:setTimeout(function(){c.clear(t)},50)}}).get,set:c.set,delete:c.delete,list:c.list,getAll:c.getAll,clear:c.clear},e.ldb=t,"undefined"!=typeof module&&(module.exports=t)):console.error("indexDB not supported")}();

var workbook =[]; // will recive Data from exel or indexedDB
////////////////////////////////////////////////////////////

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
          var num =  workbook.length ; // row count
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

//function to convert lek obj to array of array
function convertWordObjToArrOfArr(words) {
  // console.log(words);
  var tempArr = ["lek Name","Wort auf Deutsch","Beispiel","معنى الكلمة","المثال"];
  WordsToWrite.push(tempArr);
  for (var i = 0; i < words.length; i++) {
    for (var j = 0; j < words[i].length; j++) {
      var tempArr = [];
      lekname = "lek" + words[i][j].Lek;
      DuWord = words[i][j].Du_word;
      DuExample = words[i][j].Du_example;
      ArWord = words[i][j].Ar_word;
      ArExample = words[i][j].Ar_example;

      //to prevent adding empty words to xlsx file
      if (DuWord != "" || DuExample != "" ||ArExample != "" || ArWord != "") {
        if(DuWord != "Empty" && DuExample != "Empty" && ArExample != "Empty" && ArWord != "Empty"){
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
  }
  console.log(WordsToWrite);
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
  // ws_data.unshift(arrLength);
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
   defineFileStatus();
  await setArrays(lekCount);
  await readMyXlsxFile(fileName);
  words =  wordsFromXlsx;
  writeMyXlsxFile(WordsToWrite);
}
