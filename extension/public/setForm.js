async function getJSON(filename) {
    return new Promise(function(resolve) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.runtime.getURL(filename), true); // chrome.runtime.getURLを使用
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                resolve(xhr.responseText);
            }
        };
        xhr.send();
    });
}

document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const english = urlParams.get("english");
    let url = "https://ejje.weblio.jp/content/" + encodeURIComponent(english);
    let text = "";
    const path = '../ejdict.json';

    try {
        const data = await getJSON(path);
        const jsonData = JSON.parse(data);

        if (jsonData[english]) {
            const meanings = jsonData[english].split('/');
            if(meanings.length >= 2)
            {
                text = meanings[0].replace(/\s/g,"") + "\n" + meanings[1].replace(/\s/g,"");
            }
            else
            {
                text = meanings[0].replace(/\s/g,"");
            }
        }
    } catch (error) {
        console.error('Failed to load JSON data', error);
    }

    console.log(text);
    document.getElementById("english").value = english;
    document.getElementById("japanese").value = text;
});
