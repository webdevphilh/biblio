


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

    // function to generate work-in-progress entry in DOM
    let generateWIPEntry = function(bookEntry){
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
        let tempStorage = localStorage;
        for (let i = 1; i <= tempStorage.length; i++){

            storage.push(new Object({
                title: tempStorage.getItem(i).split(",")[0],
                block: tempStorage.getItem(i).split(",")[1],
                keyname: tempStorage.getItem(i).split(",")[2],
                progress: tempStorage.getItem(i).split(",")[3]
            }));
        }
    }

    /* - - - load up List of books into DOM - - - */
    this.createResult = function(bookstack){
        // preformat variables if they´re empty
        if (bookstack){
            for (i=0; i < bookstack.length; i++){
                if ( ! bookstack[i].block){ bookstack[i].block = "NA"; }
                if ( ! bookstack[i].keyname){ bookstack[i].keyname = "NA"; }
            }
        }
        else{
            throw new Error("Bookstack is empty.");
        }

        for (let i=0; i < bookstack.length; i++){
            generateWIPEntry(bookstack[i]);
        }
    }

    Object.defineProperty(this, "storage", {
        get: function(){
            return storage;
        }
    })
}

function Search(){

}


let i = new BrowserStorage;
let load = new LoadLib;
i.init();

i.createResult(i.storage);
load.digitalLib();
load.physLib();


/* - - - initalize dropdown for searchbar - - - */
let searchbox = document.getElementById("physical-library");
for (let i=0; i < load.physicalLibrary.length; i++){
    let option = document.createElement("option");
    option.append(document.createTextNode(load.physicalLibrary[i].title));
    searchbox.appendChild(option);
}