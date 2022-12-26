var myWords = []; // array of localStorage

////////////////////REtrive Data From Xlsx File//////////////////////////
//empty array will recive word objects
var wordsFromXlsx = [[], [], [], [], [], [], [], [], [], [], [], []];

// will pass this array to function to write xlsx file
// every word have 5 prop. as array not obj
var WordsToWrite = [];

async function readMyXlsxFile() {
  let workbook = await XLSX.read(
    await (await fetch("words.xlsx")).arrayBuffer()
  );

  var num = Number(workbook.Sheets.Sheet1.A1.w) + 1; // row count

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
  await readMyXlsxFile();
  writeMyXlsxFile(WordsToWrite);
}
