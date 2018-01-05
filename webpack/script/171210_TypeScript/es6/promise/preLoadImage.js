var preLoadImage = function(path) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = path;
    })
}


var path = '';
preLoadImage(path).then(  
    // 成功
    () => { console.log('图片加载成功') },  
    // 失败
    () => { console.log('图片加载失败') })
    