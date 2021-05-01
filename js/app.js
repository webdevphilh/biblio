

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


/* - - load digital library - - */
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

/* To - Do:
 * - 100% treffer werden ganz unten angezeigt.
 * - refresh bei neuer suche
 */


/* - - prepare searchlist - - */
let searchbox = document.getElementById("physical-library");
// get physical book names and formating
let searchArray = []
for( let i=0; i < physicalLibrary.length; i++){
    searchArray.push(physicalLibrary[i][0].split(";")); // [ bookname, block, keyname]
}
// generate search options
for (let i=0; i < physicalLibrary.length; i++){
    let option = document.createElement("option");
    option.append(document.createTextNode(searchArray[i][0]));
    searchbox.appendChild(option);
}


/**
 * 
 *  ------ alte version ------
 * -> abgehakt button
 * titel eingabe, block und keyname in variable speichern
 * (letzte) abgehakt datei einlesen
 * neue datei erstellen "abgahakt-ss-mm-hh-dd-MM-yyyy"
 * variable-array + voerherige abgekakt liste in aktuelle datei speichern
 * 
 * aktuelle datei in array speichern
 * abgehakt-liste erzeugen <div><p><p><p></div>
 * 
 * neue datei für suchliste von physischer lib erstellen "suche-ss-mm-hh-dd-MM-yyyy"
 * aktuelle abgehakte suche nicht drin speichern (letzter eintrag oben)
 * 
 * 
 * -> rückgängig button
 * aktuellste datei löschen
 * neu laden
 */

/*  - - search function and show matches - - */
let fileList = [];
document.addEventListener("DOMContentLoaded", function () {
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

        // create <div><p><p><p></div> with results
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
