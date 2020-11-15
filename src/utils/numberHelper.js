/*
 * @Descripttion: 数字格式化处理帮助工具
 * @version: 
 * @Author: wenchao.chai
 * @Date: 2019-06-11 10:31:27
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-09-01 10:04:13
 */

/**
 * @name: 浮点数格式化方法
 * @return: 
 * @other: 
 */ 
const floatFun = {
    /**
     * 格式化浮点数
     * @param  {string}  sValue        [description]
     * @param  {int}  iPrecision    小数点保留位数
     * @param  {Boolean} hasThousandth 是否支持千分位
     * @param  {boolean} sNaN 非数字替换字符
     * @param  {boolean} isDelfh 是否去掉末尾的0
     * @param  {boolean} isEndZero 是否保留末尾的0
     * @param  {int} validDigit 有效的非小数点位数，比如validDigit=5， 数字1234556.23 -> 12345.23
     * @return {string}
     */
    floatFormat: function (sValue, iPrecision, hasThousandth, sNaN, isDelfh, isEndZero=true, validDigit=0) {
        
        if (!sValue){
            if (sValue == "0"){
                if(iPrecision > 0){
                    sValue = "0.";
                    for(let i=0; i<iPrecision; ++i){
                        sValue += "0";
                    }
                    return sValue;
                }else{
                    return sValue; 
                }
            
            }
            else if (sNaN || sNaN == "") {
                return sNaN;
            } else {
                return sValue;
            }
        }
        sValue = sValue.toString().replace(/\$|\,/g, '');
        //如果是非数字信息
        if (isNaN(sValue)) {
            //对于特殊应用场景，需要把非数字转换成0，避免异常出现
            if (sNaN || sNaN == "") {
                return sNaN;
            } else {
                return sValue;
            }
        }
        //处理带有大写E的清空
        if(sValue.toString().indexOf("E")>=0){
            sValue = Number(sValue);
        }
        //处理科学计算法
        if(sValue.toString().indexOf("e")>=0){
            sValue =  floatFun.toNonExponential(sValue, iPrecision);
        }
        //处理小数点位数
        let newValue = sValue;
        if (iPrecision || iPrecision == 0) {
            //let fValue = Number.parseFloat(newValue);
            newValue =   floatFun.floatFixed(newValue, iPrecision, isEndZero);
        }
        
        //如果validDigit大于0，则截取有效位数
        if(validDigit > 0){
            if(newValue.toString().indexOf(".") >= 0){
                let tempValueArr = newValue.toString().split(".");
                newValue = tempValueArr[0].substr(0, validDigit) + "." + tempValueArr[1];
            }else{
                newValue = newValue.toString().substr(0, validDigit);
            }
        }
        //处理千分位
        if (hasThousandth == true) {
            let reg = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
            newValue = newValue.toString().replace(reg, "$1,");
            //处理小数点后被替换成千分位的样式
            let vList = newValue.split(".");
            if (vList.length == 2) {
                newValue = vList[0] + "." + vList[1].replace(/\,/g, "");
            }
        }

        //去掉末尾的0
        if (isDelfh) {
            newValue = newValue.toString();
            if (newValue.indexOf(".") >= 0) {
                newValue = newValue.replace(/^\s+|0+$/, '');
                newValue = newValue.replace(/^\s+|\.+$/, '');
            }
        }

        //。带头时补0
        if (newValue.toString().indexOf(".") == 0) {
            newValue = "0" + newValue;
        }

        //去掉末尾的。
        newValue = newValue.replace(/^\s+|\.+$/, '');

        return newValue;
    },
    /**
     * 验证并截取浮点数(适用于精度要求非常大的情况)
     * @param  {string}  sValue        值字符串
     * @param  {int}     iPrecision    小数点保留位数
     * @param  {boolean} isEndZero     是否保留末尾0
     * @param  {boolean} change2zero   非数字信息是否转换成0
     * @return {string}
     */
    floatFixed: function (sValue, iPrecision, isEndZero=false, change2zero=false) {
        if (!sValue && sValue != 0) return sValue;

        let tmpVal = sValue;

        //判断是否为浮点数
        let reg = /[-+]?0(\.\d+)?|[-+]?[1-9](\d+)?(\.\d+)?/;
        if (!reg.test(sValue)) {
            if (change2zero)
                tmpVal = "0";
            else
                return "";
        }

        //处理-0
        if (sValue == "-0")
            tmpVal = "0";

        //处理.带头的
        if (sValue.toString().indexOf('.') == 0) {
            tmpVal = "0" + sValue;
        }

        //处理小数点位数
        let val = "";
        if (iPrecision == 0) {
            //返回整数部分
            val = tmpVal.toString().split('.')[0];
        } else if (iPrecision > 0) {
            let valAry = tmpVal.toString().split('.');

            //拆分数字
            let intPart = valAry[0]; //整数部分
            let dcmPart = ""; //小数部分
            if (valAry.length == 2) {
                dcmPart = valAry[1];
            }

            //处理小数位数
            if (dcmPart.length < iPrecision) {
                if (isEndZero != false) {
                    for (let i = dcmPart.length; i < iPrecision; i++)
                        dcmPart += "0";
                }
            } else if (dcmPart.length > iPrecision) {
                //获取截断的第一个数字
                let cutNum = dcmPart.substr(iPrecision, 1);
                let add = 0;
                if (cutNum >= 5) //如果大于5，则有1进位
                    add = 1;

                //处理保留的小数
                let dcmTmp = "";
                cutNum = dcmPart.substr(iPrecision, 1);
                for (let i = iPrecision - 1; i >= 0; i--) {
                    let num = dcmPart.substr(i, 1);
                    if (add == 1 && num == "9") {
                        dcmTmp = "0" + dcmTmp;
                    } else {
                        dcmTmp = (Number.parseFloat(num) + add).toString() + dcmTmp;
                        add = 0;
                    }
                }

                //处理末尾0
                if (isEndZero == false) {
                    dcmTmp = dcmTmp.replace(/^\s+|0+$/, '');
                }

                dcmPart = dcmTmp;

                //如果还需进位，则处理整数
                if (add == 1) {
                    let intTmp = "";
                    for (let i = intPart.length - 1; i >= 0; i--) {
                        let num = intPart.substr(i, 1);
                        if (add == 1 && num == "9") {
                            intTmp = "0" + intTmp;
                        } else {
                            intTmp = (Number.parseFloat(num) + add).toString() + intTmp;
                            add = 0;
                        }
                    }

                    //如果还需进位，则前面添加1
                    if (add == 1)
                        intTmp = "1" + intTmp;

                    intPart = intTmp;
                }
            }

            //拼接
            val = (intPart + "." + dcmPart).replace(/^\s+|\.+$/, '');
        }

        return val;
    },
    /**
     * 科学计算法转换位正常数字
     * @param {}} num 
     */
    toNonExponential(num) {
       // 正则匹配小数科学记数法
       var m = num.match(/\d(?:\.(\d*))?e([+-]\d+)/);
       let eCount = 20;
       let nCount = 0;
       if(m[2]){
           //e的次数超过20会丢失精度的
           nCount = Number.parseInt(m[2].replace("+", ""));
           if(eCount > nCount){
                eCount = nCount;
           }
       }
       if(num.indexOf("+") >= 0){
            num = num.replace("e+"+nCount, "e+"+eCount);
       }else{
            num = num.replace("e-"+nCount, "e-"+eCount);
       }
       return  Number.parseFloat(num).toFixed(Math.max(0, (m[1] || '').length - m[2]));
    }
};

/*暴露对外的格式化函数*/

/**
 * @name: 格式化为数字
 * @param {value} 目标值
 * @param {percision} 精度
 * @param {hasThousandth} 是否千分位
 * @param {sNaN} 非数字替换值
 * @param {isDelfh} 是否去掉末尾的0
 * @return: 
 * @other: 
 */
export function decimalFormat(value, percision=null, hasThousandth=true, sNaN='', isDelfh=false, isEndZero=true, validDigit=0){
    let val = floatFun.floatFormat(value, percision, hasThousandth, sNaN, isDelfh, isEndZero, validDigit);
    return val.toString();
}

/**
 * @name: 格式化百分位
 * @param {value} 目标值
 * @param {point} 保留位数
 * @return: 
 * @other: 
 */
export function percentFormat(value, point=2){
    
    if (isNaN(value))
        return "";
    if(value === "" || Number.parseFloat(value) <= 0){
        return 0;
    }
    let val = floatFun.floatFormat(Number.parseFloat(value) * 100, point);
    return val.toString();
}


/**
 * @name: 格式化万元
 * @param {value} 目标值
 * @param {point} 保留位数
 * @return: 
 * @other: 
 */
export function tenthousandFormat(value, point=2){
    
    if (isNaN(value))
        return "";

    let val = floatFun.floatFormat(parseFloat(value) / 10000, point, true, '', true);
    return val.toString();
}

/**
 * @name: 生成统一的guid
 * @return: 
 * @other: 
 */
export function guidGenerator(){
    let S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
    };
    return (S4() + S4()  + S4()  + S4() +  S4() +  S4() + S4() + S4());
}

/**
 * @name: 特殊字符替换
 * @return: 
 * @other: 
 */
export function replaceSpecChar(param) {
    param = param.replace(/</g, '&lt;');
    param = param.replace(/>/g, '&gt;');
    return param;
}

/**
 * 科学计算法转换
 * @param {需要转换的数字} num 
 */
export function toNonExponential(num){
    return floatFun.toNonExponential(num);
}


/**
 * 获取随机字符串
 */
export function randomString(size) {
    let seed = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '2', '3', '4', '5', '6', '7', '8', '9'
    );//数组
    let seedlength = seed.length;//数组长度
    let createPassword = '';
    for (let i = 0; i < size; i++) {
        let j = Math.floor(Math.random() * seedlength);
        createPassword += seed[j];
    }
    return createPassword.toLowerCase();
}

/**
 * @name: 判断字符串是否为浮点数
 * @param {type} 
 * @return: 
 * @other: 
 */
export function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}