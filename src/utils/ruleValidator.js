/*
 * @Descripttion: 公用的一些表单校验 及配置化的自定义校验
 * @version: 1.0
 * @Author: wenchao.chai
 * @LastEditors: wenchao.chai
 * @Date: 2019-04-24 10:06:32
 * @LastEditTime: 2020-11-04 16:07:55
 */
import { validEmail } from "@/utils/validate";

/**
 * @name: 公共的表单校验
 * @param {type} 
 * @return: 
 * @other: 
 */
const commonValidator = {
  validatePass:(rule,value,callback) => {
      if(!value) {
        callback(new Error("请输入密码"));
      } else {
        if(value.length<8) {
          callback(new Error("密码长度至少8位"));
        }
        callback();
      }
    },
    validateEmail:(rule,value,callback) => {
      if(!value) {
        callback();
      } else {
        if(!validEmail(value)) {
          callback(new Error("邮箱格式错误"));
        }
        callback();
      }
    },
    /**
     * @name: 是否合法IP地址 
     */
    validateIP:(rule,value,callback) => {
      if(value==''||value==undefined||value==null){
        callback();
      }else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if ((!reg.test(value)) && value != '') {
          callback(new Error('请输入正确的IP地址'));
        } else {
          callback();
        }
      }
    },
    /**
     * @name: 是否手机号码或者固话 
     */
    validatePhoneTwo:(rule,value,callback) => {
     const reg = /^((\d{2,6}-\d{5,10})|(\d{5,10})|(1[34578]\d{9}))$/;
      if (value == '' || value == undefined || value == null) {
        callback();
      } else {
        if ((!reg.test(value)) && value != '') {
          callback(new Error('请输入正确的电话号码'));
        } else {
          callback();
        }
      }
    },
    /**
     * @name: 是否固话 
     */
    validateTelphone:(rule,value,callback) => {
     const reg =/0\d{2,3}-\d{7,8}/;
      if(value==''||value==undefined||value==null){
        callback();
      }else {
        if ((!reg.test(value)) && value != '') {
          callback(new Error('请输入正确的固定电话）'));
        } else {
          callback();
        }
      }
    },
     /**
     * @name: 是否手机号码 
     */
    validatePhone:(rule,value,callback) => {
      const reg =/^[1][3-9][0-9]{9}$/;
      if(value==''||value==undefined||value==null){
        callback();
      }else {
        if ((!reg.test(value)) && value != '') {
          callback(new Error('请输入正确的电话号码'));
        } else {
          callback();
        }
      }
    },
    /**
     * @name: 是否身份证号码 
     */
    validateIdNo:(rule,value,callback) => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(value==''||value==undefined||value==null){
        callback();
      }else {
        if ((!reg.test(value)) && value != '') {
          callback(new Error('请输入正确的身份证号码'));
        } else {
          callback();
        }
      }
    },
    /**
     * @name: 合法url 
     */
    validateURL:(rule,value,callback) => {
      if(value==''||value==undefined||value==null){
          callback();
      }else{
       
        const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        if ((!reg.test(value))) {
          callback(new Error('请输入正确的网址'));
        } else {
          callback();
        }
        return reg.test(value);  
      }
      
    }
};


export const ruleCommonValidator = {
     ...commonValidator,
}