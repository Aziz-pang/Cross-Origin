---
title: "跨域"
date: 2020-10-08
draft: false
tags: ["cross-origin", "Promise", "跨域", "CORS"]
categories: ["JavaScript"]
author: "Aziz 庞之明"
---

## 跨域关键知识
1. 同源策略
2. CORS
3. JSONP

### 什么是同源

```js
//获取源
window.origin
location.origin
```

本地可使用host来模拟偷数据，案例使用以下两个域名
```
127.0.0.1 qq.com
127.0.0.1 hacker.com
```

### CORS 同源策略
Cross-Origin Resource Sharing (CORS)

[MDN英文原文](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

浏览器规定，JS 运行在A源，就只能获取A源数据，即不允许跨域。**可以用来保护用户隐私**

> 假设 baidu.com 引用 cdn.com/jquery.js，也即是「jquery 运行在源 baidu.com 中」与 cdn 没有任何的关系，jquery.js 也只能获取 baidu.com 的数据而不是其他源的数据

通过`referrer`去判断允许的域名访问，也可以在控制台XHR查看Referrer。 

<br />

**从安全角度去分析**
1. a.qq.com 与 qq.com 也算是跨域
2. 不同端口（port）也算跨域
3. 即便IP地址一样，域名不一样也算是跨域

==特殊情况==

> 同源策略限制数据的访问，引用CSS、JS与图片，只是单纯的引用，不会读取其内容不被，如果JS 文件不设置请求头，在AJAX里同样无法访问

<br />

---

## 如何进行跨域

### 方法一：CORS

1. 需要共享数据，必须在响应头提前声明，浏览器认为两者私下有协议
2. 添加`Access-Control-Allow-Origin:http://example.com`即可

```js
//在后台添加一个响应头，允许该域名访问该数据
response.setHeader('Access-Control-Allow-Origin', 'http://hacker.com:9999')
```
将数据设置为公开访问，url替换为'*'即可

[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)

<br />

### 方法二：JSONP

背景：当前浏览器不支持CORS或者某些原因必须通过其他的方式进行跨域。
解决：将数据封装成JS里作为回调函数，请求一个JS文件进行回调，里面就包含数据。

> 如：将JSON数据赋值或作为函数写入JS文件里，其他域名通过调用JS文件获取数据
细节：函数名可以随机生成，通过约定俗成的参数名`callback`传给后台

**优点：** 兼容IE，可以跨域   
**缺点：** 由于是script标签，无法像AJAX识别状态码，查看响应头，只有get不能post只有成功或失败


详细查看hacker.js与hacker.com下的server.js
```js
//数据获取源：通过创建一个 script 标签来获取一个数据对象
//数据源：window.qqData = {{data}}
const script = document.createElement('script')
script.src = 'http://qq.com:8888/dataJSONP.js'
script.onload = () => {
    console.log(window.qqData)
}
document.body.appendChild(script)

//数据获取源：通过创建一个window 函数来获取数据
//数据源：window.qqData( {{data}} )
window.qqData = (data)=>{
    console.log(data)
}
const script2 = document.createElement('script')
script2.src = 'http://qq.com:8888/dataJSONP.js'
document.body.appendChild(script2)
```

服务器端可以通过对Referrer请求头作判断
```js
if (path === '/dataJSONP.js') {
        if (request.headers['referer'].indexOf('http://example.com') === 0) {
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            const string = fs.readFileSync('public/dataJSONP.js').toString()
            const data = fs.readFileSync('public/data.json').toString()
            const stringRe = string.replace('{{data}}', data)
            response.write(stringRe)
            response.end()
        } else {
            response.statusCode = 404
            response.end()
        }
    }
```

使用随机数命名不占用全局命名
1. url 可以添加查询参数
2. 利用`Math.random()`产生随机数
3. 服务端通过`query.name`获取对应的参数名替换成函数名
```js
const random = Math.random()
window[random] = (data) => {
    console.log(data)
}
const script = document.createElement('script')
script.src = `http://qq.com:8888/dataJSONP.js?callback=${random}`
script.onload = () => script.remove()
document.body.appendChild(script)
```

最终步骤，封装 JSONP
```js
function jsonp(url) {
    return new Promise((resovle, reject) => {
        const random = 'JSONPcallbackName' + Math.random() 
        window[random] = data => {
            resovle(data)
        }
        const script = document.createElement('script')
        script.src = `${url}?callback=${random}`
        script.onload = () => script.remove()
        script.onerror = ()=>{
            reject()
        }
        document.body.appendChild(script)
    })
}

jsonp('http://qq.com:8888/dataJSONP.js')
    .then((data)=>{
        console.log(data)
    })
```

<br />

---

end.

