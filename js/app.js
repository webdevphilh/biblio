

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
    string = string.replace("-", "");
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


$.ajax({
    url: "./databases/base1.csv",
    async: false,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
    },
    dataType: "text",
    complete: function () {
        digitalDatabase = data;
    }
});


let digitalDatabase = [];
let tempList = [];

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("suche-btn").addEventListener("click", function () {
        let suche = document.getElementById("eingabe").value;

        for (let i=0; i< digitalDatabase.length; i++){
            // [Nummer, Titel, Dateiform, Datum der Aufnahme]
            suchArray = digitalDatabase[i][0].split("\t");
            let title = suchArray[1];

            // the titles of the books has "_dl" and "_sw" in the name, they re doubles
            if ( title && ! title.includes("_sw_")){
                tempList.push(title);
            }
            console.log(delSpecialLetters(tempList), suche);
        }
    })
})