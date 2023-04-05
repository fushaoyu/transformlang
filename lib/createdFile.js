// fs.readdir 读取目录
// fs.readFile 读取指定文件的内容
// fs.stat 检测是文件还是目录
// fs.writeFile 写入文件
// fs.rmdir：删除目录
// fs.mkdir：创建目录
// fs.unlink：删除文件
// xxx.isDirectory();//检查目录是否存在的方法
const { toPath } = require('./isOS');
const fs = require('fs');
// 加载 path 模块
const path = require('path');

// 给导出的对象key做转化
const { encrypt } = require('./cryptolalia');

// 默认读取整个业务层文件的位置
const filename = toPath('./src');

// 默认需要编译的文件类型
const fileType = ['vue', 'js'];
// 存放查找到的所有文件路径
const fileList = [];
// 存放所有文案的集合
const texts = [];

/**
 *
 * 执行脚本
 *
 */
// createCatalogue();
/**
 *
 * 创建i18n目录
 *
 */
function createCatalogue() {
  const i18nPath = toPath('./src/i18n');
  try {
    //检查某个文件是否存在-不能拿到外面  因为开始没有这层目录statSync方法会抛异常
    const stat = fs.statSync(i18nPath);
    if (stat.isDirectory()) {
      const zhPath = toPath('./src/i18n/zh.js');
      const enPath = toPath('./src/i18n/en.js');
      
      //如果可以执行到这里那么就表示存在了
      // 存在此文件夹就删除
      fs.unlink(zhPath, (error) => {
        if (error) {
          // console.log('删除文件失败');
        }
        // console.log('删除文件成功');
        // 写入的位置
        createFile(zhPath);
      });
      fs.unlink(enPath, (error) => {
        if (error) {
          // console.log('删除文件失败');
        }
        // console.log('删除文件成功');
        // 写入的位置
        fs.writeFile(enPath, '替换zh翻译后的内容', function (err) {
          if (err) throw err;
        });
      });
    }
  } catch (e) {
    //捕获异常
    // console.log('检查i18n文件夹不存在,创建新的文件夹');
    fs.mkdir(
      i18nPath,
      (err) => {
        if (err) {
          // console.log('创建文件夹时出错', err);
        } else {
          // console.log('创建文件成功');
          // 写入的位置
          const zhPath = toPath('./src/i18n/zh.js');
          const enPath = toPath('./src/i18n/en.js');
          fs.writeFile(enPath, '替换zh翻译后的内容', function (err) {
            if (err) throw err;
          });
          createFile(zhPath);
        }
      },
      { recursive: true }
    );
  }
}
/**
 *
 * @param {输出位置} outputPath
 * 执行生成文件
 *
 */

function createFile(outputPath) {
  readDirRecur(filename, function () {
    const LENGTH = fileList.length;
    fileList.forEach((file) => {
      // 读取指定文件夹下的VUE和JS文件
      fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
          throw err;
        }
        // 匹配$t() 包裹的内容
        const rge = /\$t\(.*?\)/g;
        const array = data.match(rge);
        // 需要把每个文件内扫描出符合规则的数组在合并到一个新数组中
        getText(LENGTH, array, function () {
          const obj = {};
          texts.forEach((item) => {
            const firstIndex = item.indexOf('(');
            const lastIndex = item.lastIndexOf(')');
            let text = item.substring(firstIndex + 2, lastIndex - 1);
            // 这里需要使用加密算法包裹，这里没有使用的时候自己加
            const h = encrypt(text);
            obj[h] = text;
          });
          // 写入文件
          fs.writeFile(outputPath, JSON.stringify(obj), function (err) {
            if (err) {
              return console.log('文件写入失败!' + err.message);
            }
            // console.log('生成文件成功！');
          });
        });
      });
    });
  });
}
/**
 *
 * @param {*} fileList
 * @param {*} array
 * @param {*} callback
 * 获取所有文案
 */
let count = 0;
function getText(LENGTH, array, callback) {
  count++;
  if (array) {
    array.forEach((txt) => {
      texts.push(txt);
    });
  }
  if (LENGTH === count) {
    callback();
  }
}
/**
 *
 * @param {目录位置} folder
 * @param {所有文件查找成功的回调} callback
 * 读取指定文件 路径，回调函数
 *
 */
function readDirRecur(folder, callback) {
  // 读取目录
  fs.readdir(folder, function (err, files) {
    let count = 0;
    // 为了最后能执行回调函数成功获取到所有.*结尾的文件
    let checkEnd = function () {
      ++count == files.length && callback();
    };
    files.forEach(function (file) {
      const fullPath = toPath(folder + '/' + file);
      // 检测是文件还是目录
      fs.stat(fullPath, function (err, stats) {
        if (stats.isDirectory()) {
          return readDirRecur(fullPath, checkEnd);
        } else {
          const suffix = file.split('.')[1];
          if (fileType.includes(suffix)) {
            fileList.push(fullPath);
          }
          checkEnd();
        }
      });
    });
    //为空时直接回调
    files.length === 0 && callback();
  });
}

//暴露执行脚本
module.exports = {
  createCatalogue,
};
