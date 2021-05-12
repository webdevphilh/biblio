


// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
        costs[j] = j;
        else {
        if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
        }
        }
    }
    if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}
function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
    return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
// https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

/* - - - format title strings from files - - - */
function delSpecialLetters(string){
    string = string.toLowerCase();
    string = string.replace("ÃŸ", "ß");
    string = string.replace("Ã¤", "ä");
    string = string.replace("Ã„", "Ä");
    string = string.replace("Ã¶", "ö");
    string = string.replace("Ã–", "Ö");
    string = string.replace("Ã¼", "ü");
    string = string.replace("Ãœ", "Ü");
    string = string.replace(".", "");
    string = string.replace("-", " ");
    string = string.replace("_", " ");
    string = string.replace("\"", "");
    string = string.replace("!", "");
    string = string.replace("%", "");
    string = string.replace("+", "");
    string = string.replace("#", "");
    string = string.replace(",", "");
    string = string.replace("%", "");
    string = string.replace("\r", "");
    string = string.replace(":", "");
    string = string.replace("/", "");
    string = string.replace(")", "");
    string = string.replace("(", "");
    return string;
}
let bookInfoStack = [];
/* - - - load local-storage of work-in-progress books into bookInfoStack - - - */
function loadLocalStorage(){
    for (i=1; i<= saveLocalStorage.length; i++){
        bookInfoStack.push( new Object({
            title: saveLocalStorage.getItem(i).split(",")[0],
            block: saveLocalStorage.getItem(i).split(",")[1],
            keyname: saveLocalStorage.getItem(i).split(",")[2],
            progress: saveLocalStorage.getItem(i).split(",")[3]
        }));
    }
}
/* - - - load digital library - - - */
let digitalDatabase = [];
$.ajax({
    url: "./databases/lib1.csv",
    async: false,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
    },
    dataType: "text",
    complete: function () {
        digitalDatabase = data;
    }
});
/* - - load physical library - - */
let physicalLibrary = [];
$.ajax({
    url: "./databases/base1.csv",
    async: false,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
    },
    dataType: "text",
    complete: function () {
        physicalLibrary = data;
    }
});
/* - - - create form element in work-in-progress list - - - */
function createWIPBook(bookInfos){

    let formElement = document.createElement("form");
    formElement.setAttribute("action", "#");

    let labelElement = document.createElement("label");
    formElement.append(labelElement);

    let blockSpan = document.createElement("span");
    let keynameSpan = document.createElement("span");
    let titleSpan =document.createElement("span");
    titleSpan.innerText = bookInfos.title;
    blockSpan.innerText = bookInfos.block;
    keynameSpan.innerText = bookInfos.keyname;
    labelElement.append(titleSpan, blockSpan, keynameSpan);

    let selectElement = document.createElement("select");
    formElement.append(selectElement);

    let doppeltOpt = document.createElement("option");
    selectElement.append(doppeltOpt);
    doppeltOpt.value = "doppelt";
    doppeltOpt.innerText = "doppelt";

    let zuScannenOpt = document.createElement("option");
    selectElement.append(zuScannenOpt);
    zuScannenOpt.value = "zu-scannen";
    zuScannenOpt.innerText = "zu scannen";

    let gescanntOpt = document.createElement("option");
    selectElement.append(gescanntOpt);
    gescanntOpt.value = "gescannt";
    gescanntOpt.innerText = "gescannt";


    selectElement.value = bookInfos.progress;


    let changeButton = document.createElement("button");
    formElement.append(changeButton);
    changeButton.className = "save-change";
    changeButton.innerText = "speichern";

    document.getElementById("bearbeitet-box").appendChild(formElement);
}


/* To - Do:
 * - 100% treffer werden ganz unten angezeigt.
 * - refresh bei neuer suche
 * - savebutton -> localStorage in array speichern und mit downlaod button lokal speichern können "hh.mm.ss-dd.mm.yyyy.txt"
 * - funktion zum checken ob ein buch das abgehakt wird bereits im storage auftaucht, mit alert anzeigen
 */


/* - - prepare searchlist - - */
let searchbox = document.getElementById("physical-library");
// get physical book names and formating
let searchArray = []
for( let i=0; i < physicalLibrary.length; i++){
    searchArray.push(physicalLibrary[i][0].split(";")); // [ bookname, block, keyname]
}
// generate search options in searchbar
for (let i=0; i < physicalLibrary.length; i++){
    let option = document.createElement("option");
    option.append(document.createTextNode(searchArray[i][0]));
    searchbox.appendChild(option);
}

let fileList = [];
let ongoingWorkList = [];   // save of the list of books who has market as to scan, double or scanned, for the savefile
let saveLocalStorage = localStorage;

document.addEventListener("DOMContentLoaded", function () {

    // think twice before using it, dude
    //saveLocalStorage.clear();

    try{
        loadLocalStorage(); // load local Storage on startup
    }
    catch(e){
        console.log(e);
    }


    /* - - - create divs for the work in progress list on new start of the page - - - */
    if (bookInfoStack){
        for (i=0; i < bookInfoStack.length; i++){

            let bookInfoStackEntity = {
                title: bookInfoStack[i].title,
                keyname: bookInfoStack[i].keyname,
                block: bookInfoStack[i].block,
                progress: bookInfoStack[i].progress
            }

            if ( ! bookInfoStack[i].block){
                bookInfoStackEntity.block = "NA";
            }

            if ( ! bookInfoStack[i].keyname){
                bookInfoStackEntity.keyname = "NA";
            }

            createWIPBook(bookInfoStackEntity);
        }
    }

    /* - - change progress state of a book in the working list - - */
    let saveButton = document.getElementsByClassName("save-change");
    for (let i=0; i < saveButton.length; i++){

        /* - - - search for the book in the localStorage and change the workstage - - - */
        saveButton[i].addEventListener("click", function() {

            let bookInfos = {
                title: saveButton[i].previousElementSibling.previousElementSibling.childNodes[0].textContent,
                block: saveButton[i].previousElementSibling.previousElementSibling.childNodes[1].textContent,
                keyname: saveButton[i].previousElementSibling.previousElementSibling.childNodes[2].textContent,
                progress: saveButton[i].previousElementSibling.value // state of work-process (doppelt, zu scannen, gescannt)
            }

            for (storagePos=1; storagePos <= saveLocalStorage.length; storagePos++){                    
                let temp = saveLocalStorage[storagePos].split(",");
                let localStorageEntry = {
                    title: temp[0],
                    block: temp[1],
                    keyname: temp[2],
                    progress: bookInfos.progress
                }
                if (localStorageEntry.title == bookInfos.title){
                    saveLocalStorage.setItem((storagePos), [localStorageEntry.title, localStorageEntry.block, localStorageEntry.keyname, localStorageEntry.progress, "\n"]);
                }
            }
        });
    }

    /* - - mark the searched title as to scan */
    document.getElementById("markForScan").addEventListener("click", function() {

        let bookInfos = {
            title: document.getElementById("eingabe").value,
            block: document.getElementById("block").innerText,
            keyname: document.getElementById("keyname").innerText,
            progress: "zu-scannen"
        }

        // check if input is not empty then create DOM elements and add bookInfos to localStrorage
        if (bookInfos.title){
            if ( ! bookInfos.block){
                bookInfos.block = "NA";
            }
            if ( ! bookInfos.keyname){
                bookInfos.keyname = "NA";
            }
            createWIPBook(bookInfos);
            saveLocalStorage.setItem((saveLocalStorage.length + 1), [bookInfos.title, bookInfos.block, bookInfos.keyname, bookInfos.progress, "\n"]);
        }
    });

    /* - - mark the searched title as already digitalized */
    document.getElementById("abhaken-btn").addEventListener("click", function() {

        let bookInfos = {
            title: document.getElementById("eingabe").value,
            block: document.getElementById("block").innerText,
            keyname: document.getElementById("keyname").innerText,
            progress: "doppelt"
        }

        // check if input is not empty then create DOM elements and add bookInfos to localStrorage
        if (bookInfos.title){
            if ( ! bookInfos.block){
                bookInfos.block = "NA";
            }
            if ( ! bookInfos.keyname){
                bookInfos.keyname = "NA";
            }
            createWIPBook(bookInfos);
            saveLocalStorage.setItem((saveLocalStorage.length + 1), [bookInfos.title, bookInfos.block, bookInfos.keyname, bookInfos.progress, "\n"]);
        }
    });

    /*  - - search function and show matches - - */
    document.getElementById("suche-btn").addEventListener("click", function () {

        // get and format the title-string of the digital library
        for (let i=0; i < digitalDatabase.length; i++){
            // [Nummer, Titel, Dateiform, Datum der Aufnahme, Dateigroesse]
            let suchArray = digitalDatabase[i][0].split(";");
            let title = suchArray[1];

            // the titles of the books has "_dl" and "_sw" in the name, they re doubles
            if ( title && ! title.includes("_SW_")){
                title = title.split("_DL_"); // formating the book string
                fileList.push([delSpecialLetters(title[0]), suchArray]); // [formated for search, raw title]
            }
        }

        let suche = document.getElementById("eingabe").value;
        // compare seach-string with digital library and sort array
        let finalSearchArray = [];
        for (let i=0; i < fileList.length; i++){
            let simi = similarity(suche, fileList[i][0]);
            if ( simi >= 0.2 ){
                // [percentage of match, formated for search, raw title]
                finalSearchArray.push([(simi*100).toFixed(2), fileList[i][0], fileList[i][1]]);
            }
        }
        finalSearchArray.sort().reverse();

        // save the block and keyname of the physical books in the spans (for later use)
        for (let i=0; i < searchArray.length; i++){
            if (suche == searchArray[i][0]){
                document.getElementById("block").innerText = searchArray[i][1];
                document.getElementById("keyname").innerText = searchArray[i][2];
            }
        }

        // create <div><p><p><p></div> with results in the match list
        for (let i=0; i < finalSearchArray.length; i++) {
            let divElement = document.createElement("div");
            let p1 = document.createElement("p");
            p1.append(document.createTextNode(finalSearchArray[i][0] + "%"));
            divElement.appendChild(p1);

            let p2 = document.createElement("p");
            p2.append(document.createTextNode(finalSearchArray[i][2][0]));
            divElement.appendChild(p2);

            let p3 = document.createElement("p");
            p3.append(document.createTextNode(finalSearchArray[i][1]));
            divElement.appendChild(p3);

            document.getElementById("uebereinstimmungen-box").appendChild(divElement);
        }
    });
});
