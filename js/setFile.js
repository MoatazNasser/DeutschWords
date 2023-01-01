let lektionenArr = [];

let lekSelectArr = [];

let words = [];

let wordsFromXlsx = [];
let WordsToWrite = [];
//-------------------------------------------------
let selectLekCount = document.getElementById("selectLekCount");
let selectLekCountSubmit = document.getElementById("selectLekCountSubmit");

//----------------------------------------------

let setFileSourceOptions = document.getElementById("setFileSourceOptions");
let setFileSourceOptionsBack = document.getElementById(
  "setFileSourceOptionsBack"
);

let uploadLocalFile = document.getElementById("uploadLocalFile");
let uploadLocalFileSubmit = document.getElementById("uploadLocalFileSubmit");
let uploadLocalFileBack = document.getElementById("uploadLocalFileBack");

let selectGoogleFile = document.getElementById("selectGoogleFile");
let selectGoogleFileSubmit = document.getElementById("selectGoogleFileSubmit");
let selectGoogleFileBack = document.getElementById("selectGoogleFileBack");

let setMyLocalFile = document.getElementById("setMyLocalFile");
let setMyLocalFileSubmit = document.getElementById("setMyLocalFileSubmit");
let setMyLocalFileBack = document.getElementById("setMyLocalFileBack");

let inputLekCount = document.getElementById("inputLekCount");
let alert1 = document.getElementById("alert1");
//----------------------------------------------------
//important variables we need
let lekCount = -1;
let fileSource = "";

//---------- set Lek count-------------
let regNum = /^(?:[1-2][2-9]|12|20|21|30)$/;
inputLekCount.addEventListener("keyup", () => {
  if (!regNum.test(inputLekCount.value)) {
    // console.log("invalid");
    alert1.classList.remove("d-none");
  } else if (regNum.test(inputLekCount.value)) {
    alert1.classList.add("d-none");
  }
});

selectLekCountSubmit.addEventListener("click", () => {
  if (regNum.test(inputLekCount.value)) {
    selectLekCount.classList.toggle("d-none");
    setFileSourceOptions.classList.toggle("d-none");
    lekCount = inputLekCount.value;
    // console.log("submit");
  } else {
    alert1.classList.remove("d-none");
  }
});

//------select file source ------

//----click 1st back Btn-----
setFileSourceOptionsBack.addEventListener("click", () => {
  selectLekCount.classList.toggle("d-none");
  setFileSourceOptions.classList.toggle("d-none");
  lektionenArr = [];
  lekSelectArr = [];
  wordsFromXlsx = [];
});

// Read file from Btns
// let uploadFile = document.getElementById("uploadFile");
let googleSheet = document.getElementById("googleSheet");
let localFile = document.getElementById("localFile");

// uploadFile.addEventListener("click", () => {
//   uploadLocalFile.classList.toggle("d-none");
//   setFileSourceOptions.classList.toggle("d-none");
// });

googleSheet.addEventListener("click", () => {
  selectGoogleFile.classList.toggle("d-none");
  setFileSourceOptions.classList.toggle("d-none");
});

localFile.addEventListener("click", () => {
  setMyLocalFile.classList.toggle("d-none");
  setFileSourceOptions.classList.toggle("d-none");
});

// //------- upload local .xlsx file:......
// let inputFile = document.getElementById("inputFile");
// let alert2 = document.getElementById("alert2");

// //Upload File back Btn
// uploadLocalFileBack.addEventListener("click", () => {
//   setFileSourceOptions.classList.toggle("d-none");
//   uploadLocalFile.classList.toggle("d-none");
//   lektionenArr = [];
//   lekSelectArr = [];
//   wordsFromXlsx = [];
// });

// //Upload File  Submit Btn
// uploadLocalFileSubmit.addEventListener("click", () => {
//   //   console.log(inputFile.value);
//   let filename = getFileNameFromPath(inputFile.value);
//   if (filename == "") {
//     alert2.classList.toggle("d-none");
//   } else {
//     fileSource = filename;
//     // console.log(fileSource);
//   }
// });

// function getFileNameFromPath(input) {
//   let patharr = input.split(/[\\]/);
//   return patharr[patharr.length - 1];
// }

//---------------------------------------------------

//------- Insert Complete Google Sheet Link:......
let inputLink = document.getElementById("inputLink");
let alert3 = document.getElementById("alert3");

//Google Sheet back Btn
selectGoogleFileBack.addEventListener("click", () => {
  setFileSourceOptions.classList.toggle("d-none");
  selectGoogleFile.classList.toggle("d-none");
  lektionenArr = [];
  lekSelectArr = [];
  wordsFromXlsx = [];
});

//Google Sheet Submit Btn
selectGoogleFileSubmit.addEventListener("click", async () => {
  let tempLink = `https://docs.google.com/spreadsheets/d/12FLuvucbOE7TVS5lo_IeVGa5MvOKK1Vr/edit?usp=share_link&ouid=108192674101708503775&rtpof=true&sd=true`;
  let gsheetLink = inputLink.value;
  let responce = await fetch(gsheetLink);
  let status = await responce.status;
  //   console.log(status);

  //   console.log(inputLink.value);
  if (gsheetLink == "" || status != 200) {
    alert3.classList.remove("d-none");
  } else if (gsheetLink != "" || status == 200) {
    localStorage.setItem("lekCount", lekCount);
    localStorage.setItem("fileSource", gsheetLink);
    localStorage.setItem("sourceType", "googleSheet");
    selectGoogleFile.classList.toggle("d-none");
    redirect.classList.remove("d-none");
    //   console.log("submit success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
    console.log("submit success");
  }
});

//------Use Excel file (words.xlsx) located in the same Folder--

//My Local File back Btn
setMyLocalFileBack.addEventListener("click", () => {
  setFileSourceOptions.classList.toggle("d-none");
  setMyLocalFile.classList.toggle("d-none");
  lektionenArr = [];
  lekSelectArr = [];
  wordsFromXlsx = [];
});

//My Local File Submit Btn
setMyLocalFileSubmit.addEventListener("click", async () => {
  fileSource = "words.xlsx";
  localStorage.setItem("lekCount", lekCount);
  localStorage.setItem("fileSource", fileSource);
  localStorage.setItem("sourceType", "localFile");
  setMyLocalFile.classList.toggle("d-none");
  redirect.classList.remove("d-none");
  //   console.log("submit success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
});

//------------------------------------------------------

function setArrays(lekCount) {
  // we need number 1
  for (let i = 1; i <= lekCount; i++) {
    let tempname = "Lek" + i;
    lektionenArr.push(tempname);

    let tempBool = false;
    lekSelectArr.push(tempBool);

    let tempArr = [];
    wordsFromXlsx.push(tempArr);
  }
  //   console.log(lektionenArr);
  //   console.log(lekSelectArr);
  //   console.log(wordsFromXlsx);
}

//-------------------------------------------

// window.onbeforeunload = function () {
//   localStorage.removeItem("lekCount");
//   localStorage.removeItem("fileSource");
//   return "";
// };

var redirect = document.getElementById("redirect");
