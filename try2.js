

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


function LoadLib(){

    let digitalDatabase = [];
    let physicalLibrary = [];

    /* - - - load digital library from file and format it into this.digitalDatabase [title:, number:] - - - */
    this.digitalLib = function() {
        let tempDigitalDB = [];
        $.ajax({
            url: "./databases/lib1.csv",
            async: false,
            success: function (csvd) {
                data = $.csv.toArrays(csvd);
            },
            dataType: "text",
            complete: function () {
                tempDigitalDB = data;
            }
        });

        for (let i=0; i < tempDigitalDB.length; i++){
            let tempArray = tempDigitalDB[i][0].split(";");
            let title = tempArray[1];

            // the titles of the books has "_dl" and "_sw" in the name, they re doubles
            if ( title != "Name" && title && ! title.includes("_SW_")){
                title = title.split("_DL_");
                this.digitalDatabase.push(new Object({
                    title: title[0],
                    number: tempArray[0],
                }));
            }
        }
    }

    /* - - load physical library from file into this.physicalLibrary [title:, block:, keyname:, progress:] - - */
    this.physLib = function(){
        let tempPhysLib = [];
        $.ajax({
            url: "./databases/base1.csv",
            async: false,
            success: function (csvd) {
                data = $.csv.toArrays(csvd);
            },
            dataType: "text",
            complete: function () {
                tempPhysLib = data;
            }
        });

        for (let i=0; i < tempPhysLib.length; i++){
            let tempArr = tempPhysLib[i][0].split(";");
            if (tempArr[0] != "titel"){
                physicalLibrary.push(new Object({
                    title: tempArr[0],
                    block: tempArr[1],
                    keyname: tempArr[2],
                    progress: ""
                }));
            }
        }
    }

    Object.defineProperty(this, "digitalDatabase", {
        get: function(){
            return digitalDatabase;
        }
    });
    Object.defineProperty(this, "physicalLibrary", {
        get: function(){
            return physicalLibrary
        }
    });
}

function BrowserStorage(){

    let storage = [];
    let storageLocaly = localStorage;

    // function to generate work-in-progress entry in DOM
    this.generateWIPEntry = function(bookEntry){
        let formElement = document.createElement("form");
        formElement.setAttribute("action", "#");
    
        let labelElement = document.createElement("label");
        formElement.append(labelElement);
    
        let blockSpan = document.createElement("span");
        let keynameSpan = document.createElement("span");
        let titleSpan =document.createElement("span");
        titleSpan.innerText = bookEntry.title;
        blockSpan.innerText = bookEntry.block;
        keynameSpan.innerText = bookEntry.keyname;
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
    
        selectElement.value = bookEntry.progress;
    
        let changeButton = document.createElement("button");
        formElement.append(changeButton);
        changeButton.className = "save-change";
        changeButton.innerText = "speichern";
    
        let delButton = document.createElement("button");
        formElement.append(delButton);
        delButton.className = "del-button";
        delButton.innerText = "Löschen";
    
        document.getElementById("bearbeitet-box").appendChild(formElement);
    }

    // Load local storage into array on startup
    this.init = function (){
        for (let i = 1; i <= storageLocaly.length; i++){
            storage.push(new Object({
                title: storageLocaly.getItem(i).split(",")[0],
                block: storageLocaly.getItem(i).split(",")[1],
                keyname: storageLocaly.getItem(i).split(",")[2],
                progress: storageLocaly.getItem(i).split(",")[3]
            }));
        }
    }

    /* - - - load up List of books into DOM - - - */
    this.createResult = function(bookstack){
        // preformat variables if they´re empty
        if (bookstack){
            for (let i=0; i < bookstack.length; i++){
                if ( ! bookstack[i].block){ bookstack[i].block = "NA"; }
                if ( ! bookstack[i].keyname){ bookstack[i].keyname = "NA"; }
            }
        }
        else{
            throw new Error("Bookstack is empty.");
        }

        for (let i=0; i < bookstack.length; i++){
            this.generateWIPEntry(bookstack[i]);
        }
    }

    /* - - - clears the localStorage of the Browser - - - */
    this.delStorage = function() {
        if (window.confirm("- - ACHTUNG! - -\n Lokale Liste endgültig löschen?")){
            storageLocaly.clear();
        }
    }

    this.add = function(book){
        storageLocaly.setItem((storageLocaly.length + 1), [book.title, book.block, book.keyname, book.progress] );
    }

    this.set = function(number, book){
        this.storage.setItem(number, [book.title, book.block, book.keyname, book.progress]);
    }

    Object.defineProperty(this, "storage", {
        get: function(){
            return storage;
        }
    });
    Object.defineProperty(this, "storageLocaly", function(){
        return storageLocaly;
    });
}


let strge = new BrowserStorage;
let load = new LoadLib;

strge.init();
strge.createResult(strge.storage);
load.digitalLib();
load.physLib();


/* - - - initalize dropdown for searchbar - - - */
let searchbox = document.getElementById("physical-library");
for (let i=0; i < load.physicalLibrary.length; i++){
    let option = document.createElement("option");
    option.append(document.createTextNode(load.physicalLibrary[i].title));
    searchbox.appendChild(option);
}


document.addEventListener("DOMContentLoaded", function () {


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

        for (let pos=0; pos < strge.storage.length; pos++){
            if (strge.storage[pos].title == bookInfos.title){
                strge.set(pos, bookInfos);
            }
        }
    });
    }


    /* - - - deleting the localStorage - - - */
    document.getElementById("delete-all").addEventListener("click", function() {
        strge.delStorage();
    });

    /*  - - search function and show matches - - */
    document.getElementById("suche-btn").addEventListener("click", function () {

        /* - - - search for match with input in digital library - - - */
        let search = document.getElementById("eingabe").value;
        let searchArray = [];
        for (let i=0; i < load.digitalDatabase.length; i++){
            let simi = similarity(search, load.digitalDatabase[i].title);
            if ( simi >= 0.2 ){
                // [percentage of match, title]
                searchArray.push([(simi*100).toFixed(2), load.digitalDatabase[i].number, load.digitalDatabase[i].title]);
            }
        }
        searchArray.sort().reverse();

        // save the block and keyname of the physical books in the spans (for later use)
        for (let i=0; i < load.physicalLibrary.length; i++){
            if (search == load.physicalLibrary[i].title){
                document.getElementById("block").innerText = load.physicalLibrary[i].block;
                document.getElementById("keyname").innerText = load.physicalLibrary[i].keyname;
            }
        }

        // delete content from last search
        document.getElementById("uebereinstimmungen-box").innerHTML = "";

        // create <div><p><p><p></div> with results in the match list
        for (let i=0; i < searchArray.length; i++) {
            let divElement = document.createElement("div");
            let p1 = document.createElement("p");
            p1.append(document.createTextNode(searchArray[i][0] + "%"));    // match percentage
            divElement.appendChild(p1);

            let p2 = document.createElement("p");
            p2.append(document.createTextNode(searchArray[i][1]));    // number
            divElement.appendChild(p2);

            let p3 = document.createElement("p");
            p3.append(document.createTextNode(searchArray[i][2]));    // title
            divElement.appendChild(p3);

            document.getElementById("uebereinstimmungen-box").appendChild(divElement);
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

            strge.generateWIPEntry(bookInfos);
            strge.add(bookInfos);
        }
    });

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

            strge.generateWIPEntry(bookInfos);
            strge.add(bookInfos);
        }
    });

});
