const src_folder = './src/';
const dist_folder = './dist/';
const fs = require('fs');
const writeFile = require('./writeFile');

fs.readdir(`${__dirname}/${src_folder}`, (err, files) => {
  files.forEach(file => {
    fs.readFile(`${__dirname}/${src_folder}/${file}`, 'utf8', (err, content) => {
      let result = formatAtlasContet(content);
      writeFile(`${__dirname}/${dist_folder}/${file}`, result);
    });
  });
})

function formatAtlasContet(content) {
  let altas_obj = JSON.parse(content);
  let origin_frames = altas_obj.frames;
  let result_frames = {};
  let frame_arr = [];
  for (frame in origin_frames) {
    let name = frame;
    let content = origin_frames[frame];
    frame_arr.push({
      name: name,
      content: content
    })
  }
  frame_arr.sort((a, b) => {
    let a_num = Number(a.name.match(/_(\d+)/)[1]);
    let b_num = Number(b.name.match(/_(\d+)/)[1]);
    return a_num - b_num;
  });

  for (let i = 0; i < frame_arr.length; i++) {
    let name = frame_arr[i].name;
    let content = frame_arr[i].content;
    result_frames[name] = content;
  }

  altas_obj.frames = result_frames;
  return altas_obj;
}