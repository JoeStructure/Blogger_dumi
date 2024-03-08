---
# 同时设置分组名称和顺序，order 越小越靠前，默认为 0
group:
  title: Javascript
  order: 1
title: Evenloop
---

# [JS] 事件循环&任务队列

**首先明确 JS 是单线程**<br />**执行步骤总结**：先同步任务，再异步任务，异步任务又分微任务和宏任务，先微任务再宏任务。<br />**宏任务**：<br />setTimeout 定时器、事件绑定、ajax、回调函数、Node 中 fs 可以进行异步的 I/O 操作。<br />**微任务**：<br />Promise(async/await)=>Promise，在 Promise 中是同步任务，执行 resolve 或者 reject 回调时，此时是异步操作，先将 then/catch 等放到微任务队列，当主栈完成后，才会再去调用 resolve/reject 方法执行。

**任务队列分为任务队列（管理宏观任务）&微任务队列（老概念）**<br />最近看 w3c 文档时，发现宏任务和微任务的概念已经被移除。取而代之的任务队列的概念。任务队列是分类别的，不同类别是有不同的优先级。<br />在目前 chrome 的实现中，至少包含了下面队列：

- 微任务队列（最高）：Promise.then/catch、async/await
- 交互事件（高）：点击事件、网络请求、DOM 渲染、文件操作....
- 延时队列（中）：setTimeout、setInterval

例题

```javascript
setTimeout(()=>{
  console.log(1)
},0)
new Promise((resolve, reject)=> {
  console.log(2)
  resolve('p1')
  new Promise((resolve, reject)=>{
    console.log(3)
    setTimeout(()=> {
      resolve('setTimeout2')
      console.log(4)
    },0)
    resolve('p2')
  }).then(data => {
    console.log(data)
    setTimeout(()=>{
      resolve('setTimeout1')
      console.log(5)
    },0)
}).then(data => {
  console.log(data)
)}
console.log(6)
// 2 3 6 p2 p1 1 4 5
```
