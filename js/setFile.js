let lektionenArr = [],
  lekSelectArr = [],
  words = [],
  wordsFromXlsx = [],
  WordsToWrite = [],
  selectLekCount = document.getElementById("selectLekCount"),
  selectLekCountSubmit = document.getElementById("selectLekCountSubmit"),
  setFileSourceOptions = document.getElementById("setFileSourceOptions"),
  setFileSourceOptionsBack = document.getElementById(
    "setFileSourceOptionsBack"
  ),
  uploadLocalFile = document.getElementById("uploadLocalFile"),
  uploadLocalFileSubmit = document.getElementById("uploadLocalFileSubmit"),
  uploadLocalFileBack = document.getElementById("uploadLocalFileBack"),
  selectGoogleFile = document.getElementById("selectGoogleFile"),
  selectGoogleFileSubmit = document.getElementById("selectGoogleFileSubmit"),
  selectGoogleFileBack = document.getElementById("selectGoogleFileBack"),
  setMyLocalFile = document.getElementById("setMyLocalFile"),
  setMyLocalFileSubmit = document.getElementById("setMyLocalFileSubmit"),
  setMyLocalFileBack = document.getElementById("setMyLocalFileBack"),
  inputLekCount = document.getElementById("inputLekCount"),
  alert1 = document.getElementById("alert1"),
  lekCount = -1,
  fileSource = "",
  regNum = /^(?:[1-2][2-9]|12|20|21|30)$/;
inputLekCount.addEventListener("keyup", () => {
  regNum.test(inputLekCount.value)
    ? regNum.test(inputLekCount.value) && alert1.classList.add("d-none")
    : alert1.classList.remove("d-none");
}),
  selectLekCountSubmit.addEventListener("click", () => {
    regNum.test(inputLekCount.value)
      ? (selectLekCount.classList.toggle("d-none"),
        setFileSourceOptions.classList.toggle("d-none"),
        (lekCount = inputLekCount.value))
      : alert1.classList.remove("d-none");
  }),
  setFileSourceOptionsBack.addEventListener("click", () => {
    selectLekCount.classList.toggle("d-none"),
      setFileSourceOptions.classList.toggle("d-none"),
      (lektionenArr = []),
      (lekSelectArr = []),
      (wordsFromXlsx = []);
  });
let googleSheet = document.getElementById("googleSheet"),
  localFile = document.getElementById("localFile");
googleSheet.addEventListener("click", () => {
  selectGoogleFile.classList.toggle("d-none"),
    setFileSourceOptions.classList.toggle("d-none");
}),
  localFile.addEventListener("click", () => {
    setMyLocalFile.classList.toggle("d-none"),
      setFileSourceOptions.classList.toggle("d-none");
  });
let inputLink = document.getElementById("inputLink"),
  alert3 = document.getElementById("alert3");
function setArrays(e) {
  for (let t = 1; t <= e; t++) {
    let l = "Lek" + t;
    lektionenArr.push(l), lekSelectArr.push(!1);
    let o = [];
    wordsFromXlsx.push(o);
  }
}
selectGoogleFileBack.addEventListener("click", () => {
  setFileSourceOptions.classList.toggle("d-none"),
    selectGoogleFile.classList.toggle("d-none"),
    (lektionenArr = []),
    (lekSelectArr = []),
    (wordsFromXlsx = []);
}),
  selectGoogleFileSubmit.addEventListener("click", async () => {
    try {
      let e = inputLink.value,
        t = (await fetch(e)).status;
      "" == e || 200 != t
        ? alert3.classList.remove("d-none")
        : ("" != e || 200 == t) &&
          (localStorage.setItem("lekCount", lekCount),
          localStorage.setItem("fileSource", e),
          localStorage.setItem("sourceType", "googleSheet"),
          selectGoogleFile.classList.toggle("d-none"),
          redirect.classList.remove("d-none"),
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2e3),
          console.log("submit success"));
    } catch (l) {
      alert3.classList.remove("d-none"), console.log(l);
    }
  }),
  setMyLocalFileBack.addEventListener("click", () => {
    setFileSourceOptions.classList.toggle("d-none"),
      setMyLocalFile.classList.toggle("d-none"),
      (lektionenArr = []),
      (lekSelectArr = []),
      (wordsFromXlsx = []);
  }),
  setMyLocalFileSubmit.addEventListener("click", () => {
    (fileSource = "words.xlsx"),
      localStorage.setItem("lekCount", lekCount),
      localStorage.setItem("fileSource", fileSource),
      localStorage.setItem("sourceType", "localFile"),
      setMyLocalFile.classList.toggle("d-none"),
      redirect.classList.remove("d-none"),
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2e3);
  });
