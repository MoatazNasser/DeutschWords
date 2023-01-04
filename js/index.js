var optionsArr = ["Arabisch", "Deutsch", "Meine W\xf6rter!!"],
  lektionenArr = [],
  lekSelectArr = [],
  selectedLang = "",
  selectedLektionen = [],
  myWords = [],
  mainContainer = document.getElementById("mainContainer"),
  words = [],
  finalWordArr = [],
  cardsData = document.getElementById("cardsData"),
  userOptions = document.getElementById("userOptions"),
  userLek = document.getElementById("userLektion"),
  backSubmit = document.getElementById("backSubmit"),
  finalselect = document.getElementById("finalselect"),
  lekColorDiv = document.getElementById("lekColorDiv"),
  langChoose = document.getElementsByClassName("opt"),
  lekData = document.getElementsByClassName("lek"),
  BtnIndex = -1,
  back = document.getElementById("back"),
  submit = document.getElementById("submit"),
  rechoose = document.getElementById("rechoose"),
  checkLekCountandLekNum = !1,
  wordsFromXlsx = [],
  WordsToWrite = [],
  fileName = "",
  lekCount = -1,
  fileType = "";
function setArrays(e) {
  return new Promise(function (t, o) {
    for (let s = 1; s <= e; s++) {
      let n = "Lek" + s;
      lektionenArr.push(n);
      let r = !1;
      lekSelectArr.push(r);
      let l = [];
      wordsFromXlsx.push(l);
    }
    t();
  });
}
async function readMyXlsxFile(e) {
  let t = await XLSX.read(await (await fetch(e)).arrayBuffer());
  if ("localFile" == fileType) {
    var o = Number(t.Sheets.Sheet1.A1.w) + 1;
    setWordsArray(o, t),
      !1 == checkLekCountandLekNum
        ? (fillEmptyLekArr(), convertWordObjToArrOfArr(wordsFromXlsx))
        : !0 == checkLekCountandLekNum && redirectToChangeLekNum();
  } else if ("googleSheet" == fileType) {
    var o = Number(t.Sheets.Sheet1.B2.v) + 2;
    setWordsArray(o, t),
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
      o = e + 1;
    0 == wordsFromXlsx[e].length && ((t.Lek = o), wordsFromXlsx[e].push(t));
  }
}
function convertWordObjToArrOfArr(e) {
  for (var t = 0; t < e.length; t++)
    for (var o = 0; o < e[t].length; o++) {
      var s = [];
      (lekname = "lek" + e[t][o].Lek),
        (DuWord = e[t][o].Du_word),
        (DuExample = e[t][o].Du_example),
        (ArWord = e[t][o].Ar_word),
        (ArExample = e[t][o].Ar_example),
        ("" != DuWord || "" != ArWord) &&
          (s.push(lekname),
          s.push(DuWord),
          s.push(DuExample),
          s.push(ArWord),
          s.push(ArExample),
          WordsToWrite.push(s));
    }
}
function redirectToChangeLekNum() {
  document.getElementById("redirect1").classList.remove("d-none"),
    userOptions.classList.add("d-none"),
    setTimeout(() => {
      window.location.href = "setFile.html";
    }, 8e3);
}
function defineFileStatus() {
  return new Promise(function (e, t) {
    var o = document.getElementById("redirect");
    null == localStorage.getItem("fileSource") &&
    null == localStorage.getItem("lekCount") &&
    null == localStorage.getItem("sourceType")
      ? (o.classList.remove("d-none"),
        userOptions.classList.add("d-none"),
        setTimeout(() => {
          window.location.href = "setFile.html";
        }, 5e3))
      : ((fileName = localStorage.getItem("fileSource")),
        (lekCount = Number(localStorage.getItem("lekCount"))),
        (fileType = localStorage.getItem("sourceType")),
        e());
  });
}
async function startFromHere() {
  await defineFileStatus(),
    await setArrays(lekCount),
    await readMyXlsxFile(fileName),
    (words = wordsFromXlsx),
    showOptions(),
    applyClickToOptions(),
    showLektionBtns(),
    applyClickToLektion(),
    showColorGuide();
}
function showOptions() {
  for (var e = "", t = 0; t < optionsArr.length; t++)
    e += `
        <div
        class="opt position-relative col-md-3 col-6 myBtn1 rounded-3 fw-semibold fs-5 d-flex justify-content-center align-items-center py-2 mx-2 mb-4 myshadow">
        <div onclick="selectedBtnOption(${t})" class=" w-100 h-100 rounded-3 position-absolute top-0 start-0"></div>
        <span class='textShadow text-light'>${optionsArr[t]}</span>
    </div>
      `;
  userOptions.innerHTML = `
    <h2 class="text-center fw-bold col-12 py-3 textShadow text-light">W\xe4hlen Sie die Sprache</h2>
  ${e}
  `;
}
function applyClickToOptions() {
  for (var e = 0; e < langChoose.length; e++)
    langChoose[e].addEventListener("click", function (e) {
      var t = e.target.nextElementSibling.innerHTML;
      "Arabisch" == (selectedLang = t) || "Deutsch" == selectedLang
        ? (userOptions.classList.toggle("d-none"),
          userLek.classList.toggle("d-none"),
          backSubmit.classList.toggle("d-none"))
        : "Meine W\xf6rter!!" == t &&
          (userOptions.classList.toggle("d-none"),
          myWordsLang.classList.toggle("d-none"),
          backToStartFirst.classList.remove("d-none"));
    });
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
  userLek.innerHTML = `
<h2 class="text-center fw-bold col-12 py-3 textShadow text-light">W\xe4hlen Sie Lektionen</h2>
${e}
`;
}
function applyClickToLektion() {
  for (var e = 0; e < lekData.length; e++)
    lekData[e].addEventListener("click", function (e) {
      var t = e.target.nextElementSibling.nextElementSibling,
        o = e.target.nextElementSibling.innerHTML,
        s = e.target.parentElement;
      if (!0 == lekSelectArr[BtnIndex]) {
        (lekSelectArr[BtnIndex] = !1),
          s.classList.add("myBtn"),
          s.classList.remove("myBtnClicked"),
          t.classList.add("d-none");
        var n = selectedLektionen.indexOf(o);
        selectedLektionen.splice(n, 1);
      } else !1 == lekSelectArr[BtnIndex] && ((lekSelectArr[BtnIndex] = !0), t.classList.remove("d-none"), s.classList.remove("myBtn"), s.classList.add("myBtnClicked"), selectedLektionen.push(o));
    });
}
function showColorGuide() {
  for (var e = "", t = 1; t <= lektionenArr.length; t++)
    e += `
  <div class="col d-flex justify-content-center mt-2">
      <div class="p-2 bg-L${t} textShadow text-light fix-s d-flex justify-content-center align-items-center">
        L${t}
      </div>
  </div>
  `;
  lekColorDiv.innerHTML = e;
}
function selectedBtnLek(e) {
  BtnIndex = e;
}
function selectedBtnOption(e) {
  BtnIndex = e;
}
function getFinalIndexOfLek() {
  for (var e = 0; e < selectedLektionen.length; e++)
    selectedLektionen[e] = selectedLektionen[e].slice(3) - 1;
  selectedLektionen = selectedLektionen.sort(function (e, t) {
    return e - t;
  });
}
null != JSON.parse(localStorage.getItem("myWords")) &&
  (myWords = JSON.parse(localStorage.getItem("myWords"))),
  startFromHere(),
  back.addEventListener("click", function () {
    (selectedLektionen = []),
      (selectedLang = ""),
      userOptions.classList.toggle("d-none"),
      userLek.classList.toggle("d-none"),
      backSubmit.classList.toggle("d-none");
    for (var e = 0; e < lekData.length; e++)
      (lekSelectArr[e] = !1),
        lekData[e].classList.remove("myBtn"),
        lekData[e].classList.add("myBtn"),
        lekData[e].classList.remove("myBtnClicked"),
        lekData[e].children[2].classList.add("d-none");
  });
var listLek = document.getElementById("listLek"),
  lekColo = document.getElementById("lekColo");
submit.addEventListener("click", async function () {
  getFinalIndexOfLek(),
    finalselect.classList.toggle("d-none"),
    userLek.classList.toggle("d-none"),
    backSubmit.classList.toggle("d-none"),
    lekColo.classList.toggle("d-none");
  var e = "";
  if (0 == selectedLektionen.length)
    listLek.innerHTML =
      "<h3 class='text-center tsxtShadow text-light'>Please back and choose min. 1 lektion</h3>";
  else {
    for (var t = 0; t < selectedLektionen.length; t++)
      (selectedLektionen[t] = selectedLektionen[t] + 1),
        (e += `
      <div class="col-md-2 col-4 bg-L${selectedLektionen[t]} innerShadow rounded-3 fw-semibold fs-5 d-flex justify-content-center align-items-center my-2 py-2 me-2">
          <span class='px-2 text-light text-center textShadow'>Lek ${selectedLektionen[t]}</span>
      </div>
      `);
    for (var t = 0; t < selectedLektionen.length; t++)
      selectedLektionen[t] = selectedLektionen[t] - 1;
    listLek.innerHTML = e;
  }
  mainContainer.classList.toggle("d-none"),
    combineNewArrofWords(),
    setDatatoCards();
}),
  rechoose.addEventListener("click", function () {
    (selectedLektionen = []),
      (finalWordArr = []),
      (cardsData.innerHTML = ""),
      finalselect.classList.toggle("d-none"),
      userLek.classList.toggle("d-none"),
      backSubmit.classList.toggle("d-none"),
      lekColo.classList.toggle("d-none");
    for (var e = 0; e < lekData.length; e++)
      (lekSelectArr[e] = !1),
        lekData[e].classList.remove("myBtn"),
        lekData[e].classList.add("myBtn"),
        lekData[e].classList.remove("myBtnClicked"),
        lekData[e].children[2].classList.add("d-none");
    mainContainer.classList.toggle("d-none");
  });
var backface = document.getElementsByClassName("backface");
function setCardsize() {
  for (
    var e = document.getElementsByClassName("backFace"), t = 0;
    t < e.length;
    t++
  ) {
    var o = e[t].offsetHeight + 20;
    e[t].parentElement.parentElement.style.height = `${o}px`;
  }
}
function setFlipFuncToCard() {
  for (var e = document.getElementsByClassName("box"), t = 0; t < e.length; t++)
    e[t].addEventListener("click", function (e) {
      e.target.parentElement.style.cssText = "transform: rotateY(-180deg)";
    }),
      e[t].addEventListener("mouseleave", function (e) {
        e.target.style.cssText = "transform: rotateY(0deg)";
      });
}
function combineNewArrofWords() {
  for (var e = 0; e < selectedLektionen.length; e++) {
    var t = selectedLektionen[e];
    finalWordArr.push(words[t]);
  }
}
function setDatatoCards() {
  "Deutsch" == selectedLang
    ? deutschSequence()
    : "Arabisch" == selectedLang && arabicSequence();
}
window.addEventListener("resize", function () {
  for (var e = 0; e < backface.length; e++) {
    var t = backface[e].offsetHeight + 20;
    backface[e].parentElement.parentElement.style.height = `${t}px`;
  }
});
var myWordsCardlang = "",
  myWordsLang = document.getElementById("myWordsLang"),
  backToStartFirst = document.getElementById("backToStartFirst"),
  backToStartSecond = document.getElementById("backToStartSecond");
async function setMyWordsCardsLang(e) {
  (myWordsCardlang = await e.nextElementSibling.innerHTML),
    lekColo.classList.toggle("d-none"),
    showColorGuide(),
    mainContainer.classList.toggle("d-none"),
    myWordsLang.classList.toggle("d-none"),
    backToStartSecond.classList.toggle("d-none"),
    showMyWordsCard(myWordsCardlang),
    setCardsize(),
    setFlipFuncToCard();
}
function showDeutchCard() {
  for (var e = "", t = 0; t < finalWordArr.length; t++)
    for (var o = 0; o < finalWordArr[t].length; o++)
      e += `
        <div class="col-lg-3  p-2 contain">
        <div class="box position-relative my-height d-flex justify-content-center">
            <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
            <div
                class="frontFace position-absolute w-100 p-2 bg-L${finalWordArr[t][o].Lek} rounded-4 d-flex align-items-center flex-column">
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Das Wort - L${finalWordArr[t][o].Lek} </div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${finalWordArr[t][o].Du_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Zum Beispiel</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${finalWordArr[t][o].Du_example}</div>
            </div>

            <div
                class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
                <div class="position-absolute preventEvent top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>

                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">المعنى</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${finalWordArr[t][o].Ar_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">مثال</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${finalWordArr[t][o].Ar_example}</div>
                <button style="pointer-events: all;" onclick="setWordToMyWords(${t} ,${o})"  class="btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind30">نسيتها ضيفها
                    للقائمة!!</button>
            </div>
        </div>
    </div>
    `;
  cardsData.innerHTML = e;
}
function showArabicCard() {
  for (var e = "", t = 0; t < finalWordArr.length; t++)
    for (var o = 0; o < finalWordArr[t].length; o++)
      e += `
      <div class="col-lg-3  p-2 contain">
      <div class="box position-relative my-height d-flex justify-content-center">
          <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
          <div
              class="frontFace position-absolute w-100 p-2 bg-L${finalWordArr[t][o].Lek} rounded-4 d-flex align-items-center flex-column">
              <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">الكلمـة - L${finalWordArr[t][o].Lek} </div>
              <div
                  class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                  ${finalWordArr[t][o].Ar_word}</div>
              <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">مثـال</div>
              <div
                  class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                  ${finalWordArr[t][o].Ar_example}</div>
          </div>

          <div
              class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
              <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Das Wort</div>
              <div
                  class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                  ${finalWordArr[t][o].Du_word}</div>
              <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Zum Beispiel</div>
              <div
                  class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                  ${finalWordArr[t][o].Du_example}</div>
              <button style="pointer-events: all;" onclick="setWordToMyWords(${t} ,${o})" class="btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow">نسيتها ضيفها
                  للقائمة!!</button>
          </div>
      </div>
  </div>
    `;
  cardsData.innerHTML = e;
}
function showMyWordsCard(e) {
  var t = "";
  if ("Arabisch" == e)
    for (var o = 0; o < myWords.length; o++)
      t += `
          <div class="col-lg-3  p-2 contain">
          <div class="box position-relative my-height d-flex justify-content-center">
              <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
              <div
                  class="frontFace position-absolute w-100 p-2 bg-L${myWords[o].Lek} rounded-4 d-flex align-items-center flex-column">
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">الكلمة - L${myWords[o].Lek} </div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                      ${myWords[o].Ar_word}</div>
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">المثـال</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                      ${myWords[o].Ar_example}</div>
              </div>

              <div
                  class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
                  <div class="position-absolute preventEvent top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>

                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Das Wort</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                      ${myWords[o].Du_word}</div>
                  <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">Zum Beispiel</div>
                  <div
                      class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                      ${myWords[o].Du_example}</div>
                  <button style="pointer-events: all;" onclick="removeWordFromMyWords(${o})"  class=" btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind30">احذفها من القائمة</button>
              </div>
          </div>
      </div>
      `;
  else if ("Deutsch" == e)
    for (var o = 0; o < myWords.length; o++)
      t += `
        <div class="col-lg-3  p-2 contain">
        <div class="box position-relative my-height d-flex justify-content-center">
            <div class="position-absolute top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>
            <div
                class="frontFace position-absolute w-100 p-2 bg-L${myWords[o].Lek} rounded-4 d-flex align-items-center flex-column">
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Das Wort - L${myWords[o].Lek} </div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${myWords[o].Du_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite ">Zum Beispiel</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${myWords[o].Du_example}</div>
            </div>

            <div
                class="backFace preventEvent position-absolute w-100 p-2 bg-success bg-opacity-75 rounded-4 d-flex align-items-center flex-column">
                <div class="position-absolute preventEvent top-0 start-0 w-100 h-100 rounded-4 z-ind10"></div>

                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">المعنى</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold w-100 text-center border-bottom border-light text-break">
                    ${myWords[o].Ar_word}</div>
                <div class="fs-4 fw-bold text-center w-100 onlyShadowWhite">مثال</div>
                <div
                    class="fs-4 py-2 textShadow text-light fw-semibold text-center w-100 border-bottom border-light wrap">
                    ${myWords[o].Ar_example}</div>
                <button style="pointer-events: all;" onclick="removeWordFromMyWords(${o})"  class=" btn btn-danger my-2 text-light textShadow fw-bolder onlyShadow z-ind30">احذفها من القائمة</button>
            </div>
        </div>
    </div>
    `;
  cardsData.innerHTML = t;
}
function deutschSequence() {
  showDeutchCard(), setCardsize(), setFlipFuncToCard();
}
function arabicSequence() {
  showArabicCard(), setCardsize(), setFlipFuncToCard();
}
function setWordToMyWords(e, t) {
  if (
    "Empty" != finalWordArr[e][t].Du_word ||
    "Empty" != finalWordArr[e][t].Ar_word
  ) {
    for (var o = 0; o < myWords.length; o++)
      if (
        myWords[o].Du_word == finalWordArr[e][t].Du_word &&
        myWords[o].Ar_word == finalWordArr[e][t].Ar_word &&
        myWords[o].Lek == finalWordArr[e][t].Lek
      ) {
        var s = document.getElementById("liveToast3");
        s.classList.add("toastE"),
          setTimeout(() => {
            s.classList.remove("toastE");
          }, 2e3);
        return;
      }
    myWords.push(finalWordArr[e][t]),
      localStorage.setItem("myWords", JSON.stringify(myWords));
    var n = document.getElementById("liveToast1");
    n.classList.add("toastE"),
      setTimeout(() => {
        n.classList.remove("toastE");
      }, 2e3);
  }
}
function removeWordFromMyWords(e) {
  myWords.splice(e, 1),
    localStorage.setItem("myWords", JSON.stringify(myWords));
  var t = document.getElementById("liveToast2");
  t.classList.add("toastE"),
    setTimeout(() => {
      t.classList.remove("toastE");
    }, 2e3),
    showMyWordsCard(myWordsCardlang),
    setCardsize(),
    setFlipFuncToCard();
}
backToStartFirst.addEventListener("click", function () {
  userOptions.classList.toggle("d-none"),
    myWordsLang.classList.toggle("d-none"),
    backToStartFirst.classList.toggle("d-none");
}),
  backToStartSecond.addEventListener("click", function () {
    mainContainer.classList.toggle("d-none"),
      lekColo.classList.toggle("d-none"),
      userOptions.classList.toggle("d-none"),
      backToStartSecond.classList.toggle("d-none"),
      (cardsData.innerHTML = "");
  });
