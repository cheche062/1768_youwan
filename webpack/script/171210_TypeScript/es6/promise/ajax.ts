function search(term, onload, onerror) {
    var url = 'http://example.com/search?q=' + term;
    var xhr = new XMLHttpRequest();
    var results;

    var p:any = new Promise(function (resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function (e) {
            xhr.open('GET', url, true);
            xhr.onload = function (e) {
                if (this.status === 200) {
                    results = JSON.parse(this.responseText);
                    resolve(results);
                };
            }
            xhr.onerror = function (e) {
                reject(e);
            };
            xhr.send();
    };
    return p;
})
search("Hello World", console.log, console.error)