﻿var myWords = [],
  lektionenArr = [],
  lekSelectArr = [],
  checkLekCountandLekNum = !1,
  wordsFromXlsx = [],
  WordsToWrite = [],
  fileName = "",
  lekCount = -1,
  fileType = "";
function setArrays(e) {
  for (let r = 1; r <= e; r++) {
    let t = "Lek" + r;
    lektionenArr.push(t);
    let o = !1;
    lekSelectArr.push(o);
    let l = [];
    wordsFromXlsx.push(l);
  }
}
async function readMyXlsxFile(e) {
  let r = await XLSX.read(await (await fetch(e)).arrayBuffer());
  if ("localFile" == fileType) {
    var t = Number(r.Sheets.Sheet1.A1.w) + 1;
    setWordsArray(t, r),
      !1 == checkLekCountandLekNum
        ? (fillEmptyLekArr(), convertWordObjToArrOfArr(wordsFromXlsx))
        : !0 == checkLekCountandLekNum && redirectToChangeLekNum();
  } else if ("googleSheet" == fileType) {
    var t = Number(r.Sheets.Sheet1.B2.v) + 2;
    setWordsArray(t, r),
      !1 == checkLekCountandLekNum
        ? (fillEmptyLekArr(), convertWordObjToArrOfArr(wordsFromXlsx))
        : !0 == checkLekCountandLekNum && redirectToChangeLekNum();
  }
}
function setWordsArray(numOfWords, workbook) {
  if ("localFile" == fileType)
    for (var i = 2; i <= numOfWords; i++) {
      var obj = {
          Lek: 0,
          Du_word: "",
          Du_example: "",
          Ar_word: "",
          Ar_example: "",
        },
        leknum = eval(`workbook.Sheets.Sheet1.A${i}.h.slice(3)`),
        DuWord = eval(`workbook.Sheets.Sheet1.B${i}.h`),
        DuExample = eval(`workbook.Sheets.Sheet1.C${i}.h`),
        ArWord = eval(`workbook.Sheets.Sheet1.D${i}.h`),
        ArExample = eval(`workbook.Sheets.Sheet1.E${i}.h`);
      if (leknum > lekCount) {
        console.log("yes"), (checkLekCountandLekNum = !0);
        return;
      }
      (obj.Lek = leknum),
        (obj.Du_word = DuWord),
        (obj.Du_example = DuExample),
        (obj.Ar_word = ArWord),
        (obj.Ar_example = ArExample);
      var lekArrIndex = leknum - 1;
      wordsFromXlsx[lekArrIndex].push(obj);
    }
  else if ("googleSheet" == fileType)
    for (var i = 3; i <= numOfWords; i++) {
      var obj = {
          Lek: 0,
          Du_word: "",
          Du_example: "",
          Ar_word: "",
          Ar_example: "",
        },
        leknum = eval(`workbook.Sheets.Sheet1.B${i}.v.slice(3)`),
        DuWord = eval(`workbook.Sheets.Sheet1.C${i}.v`),
        DuExample = eval(`workbook.Sheets.Sheet1.D${i}.v`),
        ArWord = eval(`workbook.Sheets.Sheet1.E${i}.v`),
        ArExample = eval(`workbook.Sheets.Sheet1.F${i}.v`);
      if (leknum > lekCount) {
        console.log(leknum),
          console.log(lekCount),
          console.log("yes"),
          (checkLekCountandLekNum = !0);
        return;
      }
      (obj.Lek = leknum),
        (obj.Du_word = DuWord),
        (obj.Du_example = DuExample),
        (obj.Ar_word = ArWord),
        (obj.Ar_example = ArExample);
      var lekArrIndex = leknum - 1;
      wordsFromXlsx[lekArrIndex].push(obj);
    }
}
function fillEmptyLekArr() {
  for (var e = 0; e < wordsFromXlsx.length; e++) {
    var r = {
        Lek: 0,
        Du_word: "Empty",
        Du_example: "Empty",
        Ar_word: "Empty",
        Ar_example: "Empty",
      },
      t = e + 1;
    0 == wordsFromXlsx[e].length && ((r.Lek = t), wordsFromXlsx[e].push(r));
  }
}
function convertWordObjToArrOfArr(e) {
  for (var r = 0; r < e.length; r++)
    for (var t = 0; t < e[r].length; t++) {
      var o = [];
      (lekname = "lek" + e[r][t].Lek),
        (DuWord = e[r][t].Du_word),
        (DuExample = e[r][t].Du_example),
        (ArWord = e[r][t].Ar_word),
        (ArExample = e[r][t].Ar_example),
        ("" != DuWord || "" != ArWord) &&
          (o.push(lekname),
          o.push(DuWord),
          o.push(DuExample),
          o.push(ArWord),
          o.push(ArExample),
          WordsToWrite.push(o));
    }
}
function redirectToChangeLekNum() {
  var e = document.getElementById("redirect1"),
    r = document.getElementById("redirectContainer"),
    t = document.getElementById("downloadPageContainer");
  e.classList.remove("d-none"),
    r.classList.remove("d-none"),
    t.classList.add("d-none"),
    setTimeout(() => {
      window.location.href = "setFile.html";
    }, 8e3);
}
function defineFileStatus() {
  var e = document.getElementById("redirect"),
    r = document.getElementById("redirectContainer"),
    t = document.getElementById("downloadPageContainer");
  null == localStorage.getItem("fileSource") &&
  null == localStorage.getItem("lekCount") &&
  null == localStorage.getItem("sourceType")
    ? (e.classList.remove("d-none"),
      r.classList.remove("d-none"),
      t.classList.add("d-none"),
      setTimeout(() => {
        window.location.href = "setFile.html";
      }, 5e3))
    : ((fileName = localStorage.getItem("fileSource")),
      (lekCount = Number(localStorage.getItem("lekCount"))),
      (fileType = localStorage.getItem("sourceType")));
}
function writeMyXlsxFile(e) {
  var r = XLSX.utils.book_new();
  (r.Props = {
    Title: "Deutsch W\xf6rter",
    Subject: "Deutsch Kurs",
    Author: "Moataz Nasser",
    CreatedDate: new Date(2020, 11, 11),
  }),
    r.SheetNames.push("Sheet1");
  var t = [`${e.length}`];
  e.unshift(t);
  var o = XLSX.utils.aoa_to_sheet(e);
  r.Sheets.Sheet1 = o;
  var l = XLSX.write(r, { bookType: "xlsx", type: "binary" });
  function s(e) {
    for (
      var r = new ArrayBuffer(e.length), t = new Uint8Array(r), o = 0;
      o < e.length;
      o++
    )
      t[o] = 255 & e.charCodeAt(o);
    return r;
  }
  $("#button-a").click(function () {
    saveAs(
      new Blob([s(l)], { type: "application/octet-stream" }),
      "Deutsch_Wort.xlsx"
    );
  });
}
async function startFromHere() {
  await defineFileStatus(),
    await setArrays(lekCount),
    await readMyXlsxFile(fileName),
    (words = await wordsFromXlsx),
    writeMyXlsxFile(WordsToWrite);
}
startFromHere();
