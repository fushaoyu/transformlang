// fs.readdir 读取目录
// fs.readFile 读取指定文件的内容
// fs.stat 检测是文件还是目录
// fs.writeFile 写入文件
// fs.rmdir：删除目录
// fs.mkdir：创建目录
// fs.unlink：删除文件
// xxx.isDirectory();//检查目录是否存在的方法
const fs = require('fs');
// 加载 path 模块
const path = require('path');
const { toPath } = require('./isOS');

// 给导出的对象key做转化
const { decrypt } = require('./cryptolalia');
const { trace } = require('console');

/**
 *
 * 执行读取脚本
 *
 */
// restoreFile();
/**
 *
 * 读取文件内容并转化
 *
 */
function restoreFile() {
  const filePath = toPath('./src/i18n');
  // 读取目录
  fs.readdir(filePath, (err, files) => {
    if (err) {
      // console.log('读取目录出现错误,请先执行npm run translate');
    } else {
      // console.log('读取目录成功');
      files.forEach((file) => {
        const fullPath = toPath(filePath + '/' + file);
        fs.readFile(fullPath, 'utf-8', (err, data) => {
          if (err) {
            // console.log('读取内容出现错误');
          }
          // console.log('读取内容成功', data);
          if (!isJson(data)) {
            console.log(fullPath, '文件读取内容出现错误');
            return
          }
          const object = JSON.parse(data);
          const newObject = {};
          for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
              const element = object[key];
              const newKey = decrypt(key);
              newObject[newKey] = element;
            }
          }
          // 写入文件
          fs.writeFile(
            fullPath,
            'export default' + JSON.stringify(newObject),
            function (err) {
              if (err) {
                return console.log('文件写入失败!' + err.message);
              }
              // console.log('更新文件成功！');
            }
          );
        });
      });
    }
  });
}
function isJson(data) {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
}

//暴露执行脚本
module.exports = {
  restoreFile,
};
