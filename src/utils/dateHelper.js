/*
 * @Descripttion: 日期相关操作
 * @version:1.0
 * @Author: wenchao.chai
 * @Date: 2019-06-24 18:15:59
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-04-22 13:25:28
 */
import { parseTime } from '@/utils'

export function getDate() {
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d;
}
/**
 * 获取当前日期前n年的日期
 */
export function getRecentNDate(offset) {
  var now = new Date();
  var y = now.getFullYear();
  if (offset && !isNaN(offset)) {
    y = y - parseInt(offset);
  }

  var m = now.getMonth() + 1;
  var d = now.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d;
}

export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

export const pickerOptions = [
  {
    text: "今天",
    onClick(picker) {
      const end = new Date();
      const start = new Date(new Date().toDateString());
      end.setTime(start.getTime());
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "最近一周",
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "最近一个月",
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "最近三个月",
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit("pick", [start, end]);
    }
  }
];

export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @name: 日期转字符串
 * @param {type}
 * @return:
 * @other:
 * dateToString(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==>
 */
export function dateToString(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
}

/**
 * 获取季末时间
 * @param  {[type]}     sDate yyyy-mm-dd
 */
export function getQuarterEndDate(sDate) {
  var dList = sDate.split("-"),
    sYear = dList[0],
    sMonth = dList[1],
    nowMonth = "";
  if (sMonth >= "01" && sMonth < "04") {
    nowMonth = "03";
  } else if (sMonth >= "04" && sMonth < "07") {
    nowMonth = "06";
  } else if (sMonth >= "07" && sMonth < "10") {
    nowMonth = "09";
  } else {
    nowMonth = "12";
  }

  var monthEndDate = new Date(
    sYear,
    parseInt(nowMonth) - 1,
    getMonthDays(sYear, nowMonth)
  );

  return dateToString(monthEndDate,"yyyy-MM-dd");
}

/**
 * 获得某月的天数
 * @param  {[type]}     sYear
 * @param  {[type]}     sMonth
 */
export function getMonthDays(sYear, sMonth) {
  var monthStartDate = new Date(sYear, parseInt(sMonth) - 1, 1);
  var monthEndDate = new Date(sYear, parseInt(sMonth), 1);

  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}
