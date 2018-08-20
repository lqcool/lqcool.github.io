---
title: Promise的resolve方法和reject方法
categories: 
- HTTP
top: 7
---

Promise.resolve方法返回一个promise的实例

```js
Promise.resolve('foo');//等价于如下
new Promise((resolve)=>{
    resolve('foo');
})
```

根据参数不同，分为一下几种情况

（1）参数是一个Promise的实例

如果参数是一个Promise的实例，那么Promise.resolve将不作任何修改，原封不动的返回这个实例

（2）参数是一个thenable对象

Promise.resolve方法会将这个对象转为Promise对象，然后立即执行thenable对象的then方法

```js
//thenable对象
let thenable = {
    then:function(resolve,reject){
        resolve(42);
    }
}
//下面会将thenable对象转换为Promise对象
let p = Promise.resolve(thenable);
p.then((value)=>{
    console.log(value);//42
});
```

（3）参数不是具有then方法的对象或者不是对象

如果参数是一个原始值，或者是一个不具有then方法的对象，那么Promise.resolve方法返回一个新的Promise对象，状态为Resolved。

```js
var p = Promise.resolve("hello 1024");//字符串不属于异步操作，判断方法是不具有then方法，返回的Promise的实例从生成起就是Resolved，所以回调函数会立即执行。Promise.resolve参数就会同时传给回调函数
p.then((value)=>{
    console.log(value);//hello 1024
});
```

（4）不带任何参数

Promise.resolve方法允许在调用的时候不带任何参数，直接返回一个状态为resolved的Promise对象，所以如果希望得到一个Promise对象，最直接的方法就是直接调用Promise.resolve方法

```js
var p = Promise.resolve();
p.then((resolve)=>{
}).catch((reject)=>{
});
```

需要注意得是，立即resolve的Promise对象是在本轮“事件循环”event loop结束时，不是在下一轮“事件循环”开始时，通过代码说明

```js
setTimeout(function(){
    console.log("three");//下一轮事件循环执行
},0);
Promise.resolve().then(function(){
    console.log("two");
});
console.log("one");
//输出是one,two,three不是one,three,two
```



而Promise.reject方法会原封不动的将reject的理由变成后续方法的参数，这一点和Promise.resolve方法不一致

