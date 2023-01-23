// extended local storage line // https://github.com/DVLP/localStorageDB#readme
!function(){var s,c,e="undefined"!=typeof window?window:{},t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB;"undefined"==typeof window||t?((t=t.open("ldb",1)).onsuccess=function(e){s=this.result},t.onerror=function(e){console.error("indexedDB request error"),console.log(e)},t={get:(c={ready:!(t.onupgradeneeded=function(e){s=null,e.target.result.createObjectStore("s",{keyPath:"k"}).transaction.oncomplete=function(e){s=e.target.db}}),get:function(e,t){s?s.transaction("s").objectStore("s").get(e).onsuccess=function(e){e=e.target.result&&e.target.result.v||null;t(e)}:setTimeout(function(){c.get(e,t)},50)},set:function(t,n,o){if(s){let e=s.transaction("s","readwrite");e.oncomplete=function(e){"Function"==={}.toString.call(o).slice(8,-1)&&o()},e.objectStore("s").put({k:t,v:n}),e.commit()}else setTimeout(function(){c.set(t,n,o)},50)},delete:function(e,t){s?s.transaction("s","readwrite").objectStore("s").delete(e).onsuccess=function(e){t&&t()}:setTimeout(function(){c.delete(e,t)},50)},list:function(t){s?s.transaction("s").objectStore("s").getAllKeys().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.list(t)},50)},getAll:function(t){s?s.transaction("s").objectStore("s").getAll().onsuccess=function(e){e=e.target.result||null;t(e)}:setTimeout(function(){c.getAll(t)},50)},clear:function(t){s?s.transaction("s","readwrite").objectStore("s").clear().onsuccess=function(e){t&&t()}:setTimeout(function(){c.clear(t)},50)}}).get,set:c.set,delete:c.delete,list:c.list,getAll:c.getAll,clear:c.clear},e.ldb=t,"undefined"!=typeof module&&(module.exports=t)):console.error("indexDB not supported")}();



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

// let selectGoogleFile = document.getElementById("selectGoogleFile");
// let selectGoogleFileSubmit = document.getElementById("selectGoogleFileSubmit");
// let selectGoogleFileBack = document.getElementById("selectGoogleFileBack");

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
let uploadFile = document.getElementById("uploadFile");
// let googleSheet = document.getElementById("googleSheet");
let localFile = document.getElementById("localFile");

uploadFile.addEventListener("click", () => {
  uploadLocalFile.classList.toggle("d-none");
  setFileSourceOptions.classList.toggle("d-none");
});

// googleSheet.addEventListener("click", () => {
//   selectGoogleFile.classList.toggle("d-none");
//   setFileSourceOptions.classList.toggle("d-none");
// });

localFile.addEventListener("click", () => {
  setMyLocalFile.classList.toggle("d-none");
  setFileSourceOptions.classList.toggle("d-none");
});

//------- upload local .xlsx file:......
let inputFile = document.getElementById("inputFile");
let alert2 = document.getElementById("alert2");

//Upload File back Btn
uploadLocalFileBack.addEventListener("click", () => {
  setFileSourceOptions.classList.toggle("d-none");
  uploadLocalFile.classList.toggle("d-none");
  lektionenArr = [];
  lekSelectArr = [];
  wordsFromXlsx = [];
});

//Upload File  Submit Btn
uploadLocalFileSubmit.addEventListener("click",async () => {
  //   console.log(inputFile.value);
  let filename =await getFileNameFromPath(inputFile.value);
  let filextension = getFileExtension(filename);
  // console.log(filextension);
  if (filename == "" || filextension !="xlsx") {
    alert2.classList.remove("d-none");
  } else {
    fileSource = filename;
    alert2.classList.add("d-none");
    readXlsxFile(inputFile.files[0]).then(function(data) {
        console.log(data);

        //clear previous Data from indexedDB
        ldb.clear(function() {
          console.log('Storage cleared')
        });

        ldb.set('FileData', data, function(){
          console.log("Data is successfully written to the disk.")
        });
    });
    console.log(fileSource);
//---------------------------------------------------
  localStorage.setItem("lekCount", lekCount);
      localStorage.setItem("fileSource", fileSource);
      localStorage.setItem("sourceType", "uploadFile");
      uploadLocalFile.classList.toggle("d-none");
      redirect.classList.remove("d-none");
      //   console.log("submit success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
      console.log("submit success");
//---------------------------------------------------



  }
});

function getFileNameFromPath(input) {
  let patharr = input.split(/[\\]/);
  return patharr[patharr.length - 1];
}
function getFileExtension(filename){
  return filename.slice(-4);
  // console.log(tremEx);
}
//---------------------------------------------------

//------- Insert Complete Google Sheet Link:......
// let inputLink = document.getElementById("inputLink");
// let alert3 = document.getElementById("alert3");

// //Google Sheet back Btn
// selectGoogleFileBack.addEventListener("click", () => {
//   setFileSourceOptions.classList.toggle("d-none");
//   selectGoogleFile.classList.toggle("d-none");
//   lektionenArr = [];
//   lekSelectArr = [];
//   wordsFromXlsx = [];
// });

// // Google Sheet Submit Btn
// selectGoogleFileSubmit.addEventListener("click", async () => {
//   // let tempLink = `https://docs.google.com/spreadsheets/d/12FLuvucbOE7TVS5lo_IeVGa5MvOKK1Vr/edit?usp=share_link&ouid=108192674101708503775&rtpof=true&sd=true`;

//   try {
//     let gsheetLink = inputLink.value;
//     let responce = await fetch(gsheetLink);
//     let status = responce.status;
//     // console.log(status);

//     // console.log(inputLink.value);
//     if (gsheetLink == "" || status != 200) {
//       alert3.classList.remove("d-none");
//     } else if (gsheetLink != "" || status == 200) {
//       localStorage.setItem("lekCount", lekCount);
//       localStorage.setItem("fileSource", gsheetLink);
//       localStorage.setItem("sourceType", "googleSheet");
//       selectGoogleFile.classList.toggle("d-none");
//       redirect.classList.remove("d-none");
//       //   console.log("submit success");
//       setTimeout(() => {
//         window.location.href = "index.html";
//       }, 2000);
//       console.log("submit success");
//     }
//   } catch (error) {
//     alert3.classList.remove("d-none");
//     console.log(error);
//   }
// });

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
setMyLocalFileSubmit.addEventListener("click", () => {
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

// var redirect = document.getElementById("redirect");
