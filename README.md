# calendar
jQuery日历插件

[查看calendar介绍页](http://haifengpeng.github.io/calendar/)

##用法
* 在头部引入css文件
```javascript
<link rel="stylesheet" href="your path/calendar.css" />
```
* 引入jquery和calendar js文件
```javascript
<script type="text/javascript" src="your path/jquery.js" ></script>
<script type="text/javascript" src="your path/calendar.js" ></script>
```
* 调用
```javascript
$("#calendar").Calendar({
	lang: 'en'
});
```
##参数
* `year`: 日历年份（1970~9000）
* `month`: 日历月份（1~12）
* `day`: 第几天
* `lang`: 语言(默认显示中文)

插件会按照以上参数绘制日历，year不合法将会转换成当前年份，month和day同理
lang除非设置为`'en'`,语言设为英文，否则语言为中文

##函数
* `$.Calendar.getCurDate()`: 获取当前日期，yyyy-mm-dd
* `$.Calendar.getCurUnixTimestamp()`: 获取当前日期的Unix时间戳
