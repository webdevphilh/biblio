

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


let digitalDatabase = [];

$.ajax({
    url: "./databases/Scanner_nur_PDF.csv",
    async: false,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
    },
    dataType: "text",
    complete: function () {
        digitalDatabase = data;
    }
});


/*
title filter:
"_0921" = unterstrich + zahl
*/


let fileList = [];

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("suche-btn").addEventListener("click", function () {

        // get and format the title-string of the digital library
        for (let i=0; i< digitalDatabase.length; i++){
            // [Nummer, Titel, Dateiform, Datum der Aufnahme, Dateigroesse]
            suchArray = digitalDatabase[i][0].split(";");
            let title = suchArray[1];

            // the titles of the books has "_dl" and "_sw" in the name, they re doubles
            if ( title && ! title.includes("_SW_")){
                title = title.split("_DL_"); // formating the book string
                fileList.push([delSpecialLetters(title[0]), suchArray]); // [formated for search, raw title]
            }
        }

        // compare seach-string with digital library and create <div><p><p><p></div>
        let suche = document.getElementById("eingabe").value;
        for (let i=0; i < fileList.length; i++){
            let simi = similarity(suche, fileList[i][0]);
            if ( simi >= 0.1 ){
                // [percentage of match, formated for search, raw title]
                let finalSearchArray = [(simi*100).toFixed(2), fileList[i][0], fileList[i][1]];

                //console.log(finalSearchArray);
                let divElement = document.createElement("div");
                let p1 = document.createElement("p");
                p1.append(document.createTextNode(finalSearchArray[0] + "%"));
                divElement.appendChild(p1);

                let p2 = document.createElement("p");
                p2.append(document.createTextNode(finalSearchArray[2][0]));
                divElement.appendChild(p2);

                let p3 = document.createElement("p");
                p3.append(document.createTextNode(finalSearchArray[1]));
                divElement.appendChild(p3);

                document.getElementById("uebereinstimmungen-box").appendChild(divElement);
            }
        }



    });
});
