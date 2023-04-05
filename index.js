#!/usr/bin/env node
// console.log('transformLang-运行妥妥的！！！');
const { createCatalogue } = require('./lib/createdFile');
const { restoreFile } = require('./lib/restore');
//process.argv 属性返回一个数组，这个数组包含了启动Node.js进程时的命令行参数，通过截取获取到不用指令
var arguments = process.argv.splice(2)[0];
// console.log('arguments:', arguments);
switch (arguments) {
  case '-c':
    createCatalogue();
    break;
  case '-r':
    restoreFile();
    break;
  default:
    console.log('识别不到的指令');
    console.log('ransformlang -c 创建文件');
    console.log('ransformlang -r 转换文件');
    break;
}
