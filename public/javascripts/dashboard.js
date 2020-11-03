function createCSV(data, users) {
    var csvList= [["User", "SpeechData","updated"]];
    for(user in users) {
        for(d in data){
            if (data[d]['user'] === users[user]){
                rowText = data[d]['user'] + ',' +  data[d]['speechData'] + ',' +  data[d]['updated'] 
                csvList.push(rowText)
                csvList.push(",");
            }
        }
    }
    csvRows=csvList.join('\n');
    downloadCSV('speechData.csv', csvRows);

}

function downloadCSV(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:attachment/csv,' + encodeURI(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


$(document).ready(function(){
    $('#speechTable').dataTable();
});