


function Loading(){

    this.digitalDatabase = [];
    this.physicalLibrary = [];

    /* - - - load digital library - - - */
    this.digitalLib = function() {
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
    }

    /* - - load physical library - - */
    this.physLib = function(){
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
    }


}



function BrowserStorage(){

    let storage = [];

    let generateDOMEntry = function(bookEntry){
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
            generateDOMEntry(bookstack[i]);
        }
    }


    Object.defineProperty(this, "storage", {
        get: function(){
            return storage;
        }
    })
}



let i = new BrowserStorage;
let load = new Loading;
i.init();

i.createResult(i.storage);
load.digitalLib();
load.physLib();
console.log(i.storage);