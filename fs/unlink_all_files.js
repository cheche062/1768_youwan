const fs = require('fs');

/*
删除文件夹下的所有文件
 */
function unlinkAllFiles(path) {
    var files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index)=>{
            var curPath = `${path}/${file}`;
            if(fs.statSync(curPath).isDirectory()){
                unlinkAllFiles(curPath);
            }else{
                fs.unlinkSync(curPath);
            }

        })

        fs.rmdirSync(path);
    }
}


module.exports = unlinkAllFiles;
