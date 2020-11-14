/*
 * @Descripttion: vue文件
 * @version: 1.0
 * @Author: wenchao.chai
 * @Date: 2020-11-11 21:00:06
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-11-14 20:40:00
 */
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    
  }
}
