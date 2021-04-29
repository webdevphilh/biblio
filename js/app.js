

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
        console.log(data);
    }
});