var myWords = [],
  words = [],
  finalWordArr = [],
  lektionenArr = [],
  lekSelectArr = [],
  selectedLektionen = [],
  userLek = document.getElementById("userLektion"),
  lekData = document.getElementsByClassName("lek"),
  BtnIndex = -1,
  checkLekCountandLekNum = !1,
  wordsFromXlsx = [],
  WordsToWrite = [],
  fileName = "",
  lekCount = -1,
  fileType = "";
function setArrays(e) {
  for (let t = 1; t <= e; t++) {
    let r = "Lek" + t;
    lektionenArr.push(r);
    let n = !1;
    lekSelectArr.push(n);
    let o = [];
    wordsFromXlsx.push(o);
  }
}
async function readMyXlsxFile(e) {
  let t = await XLSX.read(await (await fetch(e)).arrayBuffer());
  if ("localFile" == fileType) {
    var r = Number(t.Sheets.Sheet1.A1.w) + 1;
    setWordsArray(r, t),
      !1 == checkLekCountandLekNum
        ? (fillEmptyLekArr(), convertWordObjToArrOfArr(wordsFromXlsx))
        : !0 == checkLekCountandLekNum && redirectToChangeLekNum();
  } else if ("googleSheet" == fileType) {
    var r = Number(t.Sheets.Sheet1.B2.v) + 2;
    setWordsArray(r, t),
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
    var t = {
        Lek: 0,
        Du_word: "Empty",
        Du_example: "Empty",
        Ar_word: "Empty",
        Ar_example: "Empty",
      },
      r = e + 1;
    0 == wordsFromXlsx[e].length && ((t.Lek = r), wordsFromXlsx[e].push(t));
  }
}
function convertWordObjToArrOfArr(e) {
  for (var t = 0; t < e.length; t++)
    for (var r = 0; r < e[t].length; r++) {
      var n = [];
      (lekname = "lek" + e[t][r].Lek),
        (DuWord = e[t][r].Du_word),
        (DuExample = e[t][r].Du_example),
        (ArWord = e[t][r].Ar_word),
        (ArExample = e[t][r].Ar_example),
        ("" != DuWord || "" != ArWord) &&
          (n.push(lekname),
          n.push(DuWord),
          n.push(DuExample),
          n.push(ArWord),
          n.push(ArExample),
          WordsToWrite.push(n));
    }
}
function redirectToChangeLekNum() {
  var e = document.getElementById("redirect1"),
    t = document.getElementById("redirectContainer"),
    r = document.getElementById("SearchPageContainer");
  e.classList.remove("d-none"),
    t.classList.remove("d-none"),
    r.classList.add("d-none"),
    setTimeout(() => {
      window.location.href = "setFile.html";
    }, 8e3);
}
function defineFileStatus() {
  var e = document.getElementById("redirect"),
    t = document.getElementById("redirectContainer"),
    r = document.getElementById("SearchPageContainer");
  null == localStorage.getItem("fileSource") &&
  null == localStorage.getItem("lekCount") &&
  null == localStorage.getItem("sourceType")
    ? (e.classList.remove("d-none"),
      t.classList.remove("d-none"),
      r.classList.add("d-none"),
      setTimeout(() => {
        window.location.href = "setFile.html";
      }, 5e3))
    : ((fileName = localStorage.getItem("fileSource")),
      (lekCount = Number(localStorage.getItem("lekCount"))),
      (fileType = localStorage.getItem("sourceType")));
}
async function startFromHere() {
  defineFileStatus(),
    setArrays(lekCount),
    await readMyXlsxFile(fileName),
    (words = wordsFromXlsx),
    showLektionBtns(),
    applyClickToLektion(),
    showColorGuide();
}
function showLektionBtns() {
  for (var e = "", t = 0; t < lektionenArr.length; t++)
    e += `
      <div class="lek position-relative col-md-2 col-3 myBtn bg-L${
        t + 1
      } rounded-3 fw-semibold fs-5 d-flex justify-content-center align-items-center my-2 py-2 me-2 ">
          <div onclick="selectedBtnLek(${t})" class="w-100 h-100  rounded-3 position-absolute top-0 start-0"></div>
          <span class='px-2 textShadow text-light'>${lektionenArr[t]}</span>
          <i class="d-none pe-2 w-25 fa-regular fa-circle-xmark"></i>
      </div>
      `;
  userLek.innerHTML = e;
}
function applyClickToLektion() {
  for (var e = 0; e < lekData.length; e++)
    lekData[e].addEventListener("click", function (e) {
      var t = e.target.nextElementSibling.nextElementSibling,
        r = e.target.nextElementSibling.innerHTML,
        n = e.target.parentElement;
      if (!0 == lekSelectArr[BtnIndex]) {
        (lekSelectArr[BtnIndex] = !1),
          n.classList.add("myBtn"),
          n.classList.remove("myBtnClicked"),
          t.classList.add("d-none");
        var o = selectedLektionen.indexOf(r);
        selectedLektionen.splice(o, 1), updateWordsArr();
      } else !1 == lekSelectArr[BtnIndex] && ((lekSelectArr[BtnIndex] = !0), t.classList.remove("d-none"), n.classList.remove("myBtn"), n.classList.add("myBtnClicked"), selectedLektionen.push(r), updateWordsArr());
    });
}
function selectedBtnLek(e) {
  BtnIndex = e;
}
function showColorGuide() {
  for (var e = "", t = 1; t <= lektionenArr.length; t++)
    e += `
  <div class="col d-flex justify-content-center mt-2">
      <div class="p-1 bg-L${t} textShadow text-light fix-s d-flex justify-content-center align-items-center">
        L${t}
      </div>
  </div>
  `;
  lekColorDiv.innerHTML = e;
}
function combineNewArrofWords(e) {
  finalWordArr = [];
  for (var t = 0; t < e.length; t++) {
    var r = e[t];
    finalWordArr.push(words[r]);
  }
}
function getFinalIndexOfLek() {
  for (var e = [], t = 0; t < selectedLektionen.length; t++)
    e[t] = selectedLektionen[t];
  for (var t = 0; t < e.length; t++) e[t] = e[t].slice(3) - 1;
  return e.sort(function (e, t) {
    return e - t;
  });
}
null != JSON.parse(localStorage.getItem("myWords")) &&
  (myWords = JSON.parse(localStorage.getItem("myWords"))),
  startFromHere(),
  $("#filter").click(function () {
    userLek.classList.toggle("d-none");
  });
var searchInput = document.getElementById("searchInput"),
  tablebody = document.getElementById("tablebody"),
  showAll = document.getElementById("showAll"),
  storedWords = document.getElementById("storedWords");
function updateWordsArr() {
  var e = getFinalIndexOfLek();
  if (0 == e.length) for (var t = 0; t < lektionenArr.length; t++) e.push(t);
  combineNewArrofWords(e), displayTable(finalWordArr);
}
function removeRow(e) {
  myWords.splice(e, 1),
    localStorage.setItem("myWords", JSON.stringify(myWords)),
    displayTableForSortedWords();
  var t = document.getElementById("liveToast2");
  t.classList.add("toastE"),
    setTimeout(() => {
      t.classList.remove("toastE");
    }, 2e3);
}
function displayTableForSortedWords() {
  for (var e = "", t = 0; t < myWords.length; t++)
    e += `
        <tr ondblclick='removeRow(${t})' class="bg-L${myWords[t].Lek}">
        <th class="text-center">${myWords[t].Lek}</th>
        <td class="">${myWords[t].Du_word}</td>
        <td class="">${myWords[t].Du_example}</td>
        <td class="text-end">${myWords[t].Ar_word}</td>
        <td class="text-end">${myWords[t].Ar_example}</td>
    </tr>
        `;
  tablebody.innerHTML = e;
}
function setAllLekIndex() {
  for (var e = [], t = 0; t < lektionenArr.length; t++) e.push(t);
  return e;
}
function displayTable(e) {
  for (var t = "", r = 0; r < e.length; r++)
    for (var n = 0; n < e[r].length; n++)
      (e[r][n].Du_word.toLowerCase().includes(
        searchInput.value.toLowerCase()
      ) ||
        e[r][n].Ar_word.includes(searchInput.value)) &&
        (t += `
        <tr class="bg-L${e[r][n].Lek}">
        <th class="text-center">${e[r][n].Lek}</th>
        <td class="">${e[r][n].Du_word}</td>
        <td class="">${e[r][n].Du_example}</td>
        <td class="text-end">${e[r][n].Ar_word}</td>
        <td class="text-end">${e[r][n].Ar_example}</td>
    </tr>
        `);
  tablebody.innerHTML = t;
}
searchInput.addEventListener("keyup", function () {
  updateWordsArr();
}),
  showAll.addEventListener("click", function () {
    combineNewArrofWords(setAllLekIndex()), displayTable(finalWordArr);
  }),
  storedWords.addEventListener("click", function () {
    displayTableForSortedWords();
  });
var printBtn = document.getElementById("printBtn"),
  showAllOptions = document.getElementById("showAllOptions"),
  fullScreenBtn = document.getElementById("fullScreenBtn"),
  theContent = document.getElementById("theContent"),
  optionsBox1 = document.getElementById("optionsBox1"),
  optionsBox2 = document.getElementById("optionsBox2"),
  navbar = document.getElementById("navbar");
function areaPrint() {
  optionsBox1.classList.add("d-none"),
    optionsBox2.classList.add("d-none"),
    navbar.classList.add("d-none"),
    showAllOptions.classList.remove("d-none"),
    fullScreenBtn.classList.add("d-none"),
    theContent.classList.replace("container", "container-fluid"),
    window.print();
}
function reshowOptions() {
  optionsBox1.classList.remove("d-none"),
    optionsBox2.classList.remove("d-none"),
    navbar.classList.remove("d-none"),
    showAllOptions.classList.add("d-none"),
    fullScreenBtn.classList.remove("d-none"),
    theContent.classList.replace("container-fluid", "container");
}
function setfullScreenMode() {
  optionsBox1.classList.toggle("d-none"),
    optionsBox2.classList.toggle("d-none"),
    navbar.classList.toggle("d-none"),
    "Full Screen" == fullScreenBtn.innerText
      ? (fullScreenBtn.innerText = "Exit Full Screen")
      : "Exit Full Screen" == fullScreenBtn.innerText &&
        (fullScreenBtn.innerText = "Full Screen");
}
printBtn.addEventListener("click", areaPrint),
  showAllOptions.addEventListener("click", reshowOptions),
  fullScreenBtn.addEventListener("click", setfullScreenMode);
