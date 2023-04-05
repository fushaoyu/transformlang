// 加密
const encrypt = (content) => {
  const nameBuffer = Buffer.from(content); // 等同于 Buffer.from(name, "utf-8")
  const enecodedName = nameBuffer.toString('base64');
  return enecodedName;
};
// 解密
const decrypt = (content) => {
  const decodeBuffer = Buffer.from(content, 'base64'); // 第二个参数就不能省略了
  const decodedName = decodeBuffer.toString('utf-8');
  return decodedName;
};

//暴露出去
module.exports = {
  encrypt,
  decrypt,
};
