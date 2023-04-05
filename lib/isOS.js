const path = require('path');
function detectPlatform() {
  var osvar = process.platform;
  if (osvar == 'darwin') {
    // console.log('你使用的是MAC操作系统');
    return 'mac';
  } else if (osvar == 'win32') {
    // console.log('您使用的是Windows操作系统');
    return 'win';
  } else {
    console.log('未知的操作系统');
    return '';
  }
}

function toPath(param) {
  const is_os = detectPlatform();
  const sep = path.sep;
  const url = param.replace(new RegExp('/', 'g'), sep);
  if (is_os === 'mac') {
    return path.resolve(url);
  } else {
    return path.resolve(url);
  }
}
module.exports = {
  toPath,
};
