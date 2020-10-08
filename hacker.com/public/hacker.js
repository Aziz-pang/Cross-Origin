const request = new XMLHttpRequest()
request.open('GET', 'http://qq.com:8888/data.json')
request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status < 400) {
        console.log(request.response)
    }
}
request.send()

//数据获取源：通过创建一个 script 标签来获取一个数据对象
//数据源：window.qqData = {{data}}
// const script = document.createElement('script')
// script.src = 'http://qq.com:8888/dataJSONP.js'
// script.onload = () => {
//     console.log(window.qqData)
// }
// document.body.appendChild(script)

//数据获取源：通过创建一个window 函数来获取数据
//数据源：window.qqData( {{data}} )
// window.qqData = (data)=>{
//     console.log(data)
// }
// const script = document.createElement('script')
// script.src = 'http://qq.com:8888/dataJSONP.js'
// document.body.appendChild(script)


//函数使用随机数命名不占用全局命名
// const random = Math.random()
// window[random] = (data) => {
//     console.log(data)
// }
// const script = document.createElement('script')
// script.src = `http://qq.com:8888/dataJSONP.js?callback=${random}`
// script.onload = () => script.remove()
// document.body.appendChild(script)


//封装JSONP
// function jsonp(url) {
//     return new Promise((resovle, reject) => {
//         const random = 'JSONPcallbackName' + Math.random() 
//         window[random] = data => {
//             resovle(data)
//         }
//         const script = document.createElement('script')
//         script.src = `${url}?callback=${random}`
//         script.onload = () => script.remove()
//         script.onerror = ()=>{
//             reject()
//         }
//         document.body.appendChild(script)
//     })
// }

// jsonp('http://qq.com:8888/dataJSONP.js')
//     .then((data)=>{
//         console.log(data)
//     })