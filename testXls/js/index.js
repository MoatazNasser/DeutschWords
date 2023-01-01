//empty array will recive word objects
var wordsFromXlsx = [[], [], [], [], [], [], [], [], [], [], [], []];

// will pass this array to function to write xlsx file
// every word have 5 prop. as array not obj
var WordsToWrite = [];
readMyXlsxFile();
async function readMyXlsxFile() {
  let workbook = await XLSX.read(
    await (
      await fetch(
        "https://docs.google.com/spreadsheets/d/12FLuvucbOE7TVS5lo_IeVGa5MvOKK1Vr/edit?usp=share_link&ouid=108192674101708503775&rtpof=true&sd=true"
      )
    ).arrayBuffer()
  );
  console.log(workbook);

  var num = Number(workbook.Sheets.Sheet1.B2.v) + 2; // row count
  // num = Number(num) + 1;
  console.log("Row Count:", num); // row count
  // console.log(workbook.Sheets.Sheet1); //
  // console.log(workbook.Sheets.Sheet1.B3.v.slice(3)); //Lek number
  // console.log(workbook.Sheets.Sheet1.C3.v); //Du word
  // console.log(workbook.Sheets.Sheet1.D3.v); //Du example
  // console.log(workbook.Sheets.Sheet1.E3.v); //Ar word
  // console.log(workbook.Sheets.Sheet1.F3.v); //Ar example
  setWordsArray(num, workbook);
  fillEmptyLekArr();
  convertWordObjToArrOfArr(wordsFromXlsx);
}

function setWordsArray(numOfWords, workbook) {
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
  console.log(wordsFromXlsx);
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
  console.log(WordsToWrite);
}
