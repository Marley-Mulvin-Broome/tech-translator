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
    const API_KEY = '9212ce1d-b4d5-80f0-ac2d-d9f04cfff1b4:fx';
    const API_URL = 'https://api-free.deepl.com/v2/translate';
    const urlParams = new URLSearchParams(window.location.search);
    const english = urlParams.get("english").replace(/^\s+|\s+$/g, "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase();
    let content = encodeURI('auth_key=' + API_KEY + '&text=' + english + '&source_lang=EN&target_lang=JA');
    let url = API_URL + '?' + content;
    const path = '../ejdict.json';

    document.getElementById("url").value = urlParams.get("url");
    try {
        const data = await getJSON(path);
        const jsonData = JSON.parse(data);
        let foundValue;

        document.getElementById("english").value = english;
        foundValue = jsonData[english];
        if (foundValue) {
            const meanings = foundValue.split('/');
            if(meanings.length >= 2)
            {
                document.getElementById("japanese").value = meanings[0].replace(/\s/g,"") + "\n" + meanings[1].replace(/\s/g,"");
            }
            else
            {
                document.getElementById("japanese").value = meanings[0].replace(/\s/g,"");
            }
        }
        else
        {
            fetch(url)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Could not reach the API: " + response.statusText);
                }
            }).then(function(data) {
                document.getElementById("japanese").value = data["translations"][0]["text"];
            }).catch(function(error) {
                console.log(error);
            });
        }
    } catch (error) {
        console.error('Failed to load JSON data', error);
    }
});
