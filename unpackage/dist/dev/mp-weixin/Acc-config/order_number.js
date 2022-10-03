"use strict";
let outTradeNo = function() {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZAabcdefghijklmn1234567890";
  let maxPos = chars.length;
  let res = [];
  for (let i = 0; i < 32; i++) {
    res.push(chars.charAt(Math.floor(Math.random() * maxPos)));
  }
  return res.join("");
};
let codes = function() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  code = Date.now() + code;
  return code;
};
exports.codes = codes;
exports.outTradeNo = outTradeNo;
