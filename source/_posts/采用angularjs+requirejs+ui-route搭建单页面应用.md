---
title: 采用angularjs+requirejs+ui-route搭建单页面应用
categories: 
- angularjs
---

使用angularjs+requirejs+ui-route+angularAMD搭出路由机制，按需进行js的加载

### 1、需要导入的js文件有

- angular.js：angularjs框架的核心

- require.js：非常小巧的JavaScript模块载入框架，是AMD规范最好的实现者之一，它在浏览器中可以作为js文件的模块加载器，也可以用在Node和Rhino环境等等其它的环境，可以协同其它框架进行工作。[参考文章](https://www.runoob.com/w3cnote/requirejs-tutorial-1.html)

  - requirejs可以防止加载阻止页面渲染

  正常的html中加载外部脚本写法（当然也可以放到后面）

  ```html
  <!DOCTYPE html>
  <html>
      <head>
          <script type="text/javascript" src="a.js"></script>
      </head>
      <body>
        <span>body</span>
      </body>
  </html>
  ```

  a.js文件内容

  ```js
  //通过自执行函数，形成闭包，防止污染全局变量
  (function(){
      function fun1(){
        alert("it works");
      }
      fun1();
  })()
  ```

  上面的页面在加载过程中，会阻止页面的加载，因为加载完js后，js引擎会阻止渲染引擎的渲染，而去执行脚本文件，所以会在`alert(“it works”)`停住，页面得不到渲染。而通过requirejs的写法为如下：

  ```html
  <!DOCTYPE html>
  <html>
      <head>
          <script type="text/javascript" src="require.js"></script>
          <script type="text/javascript">
              require(["a"]);
          </script>
      </head>
      <body>
        <span>body</span>
      </body>
  </html>
  ```

  a.js文件如下

  ```js
  define(function(){
      function fun1(){
        alert("it works");
      }
  
      fun1();
  })
  ```

  浏览器提示了"it works"，说明运行正确，但是有一点不一样，这次浏览器并不是一片空白，body已经出现在页面中。

  - 使用程序调用的方式加载js，防出现如下丑陋的场景

  ```js
  <script type="text/javascript" src="a.js"></script>
  <script type="text/javascript" src="b.js"></script>
  <script type="text/javascript" src="c.js"></script>
  <script type="text/javascript" src="d.js"></script>
  <script type="text/javascript" src="e.js"></script>
  ...
  ```

- angular-ui-router.js：ui-router路由文件

- angularAMD.js //用于app.js中配置路由

### 2、main.js的编写

requirejs主要的文件包括一个主要的js（main.js）main.js里面是项目开始就需要引入的js，它是项目js的入口，就相当于java语言或者C语言中的main()函数，并且采用AMD规范来写。学习require.js建议参考（require.js用法详解）参考代码如下

```js
define(function(){
	//config配置模块
	require.config({
        //baseUrl:用来指定加载模块的目录
        //baseUrl:"js/injs",
        //paths，是指定模块的加载路径。
        paths:{
            "angular":"/questionnairePrj/js/angular/angular",
            "jquery":"/questionnairePrj/js/jquery-2.1.1/jquery",
            "angularAMD":"/questionnairePrj/js/angular/angularAMD",
            "angular-ui-router":"/questionnairePrj/js/angular/angular-ui-router",
            "angularResource":"/questionnairePrj/js/angular/angular-resource"
        },
        //shim:是配置不兼容的模块。
        shim : {
            "angular" : {
                exports : "angular"
            },
            "angular-ui-router":["angular"],
            "angularAMD":["angular"],
            "ngload":["angularAMD"],
            "ngResource":["angular"],
            'angularResource': ['angular'],
        },
        //deps:用来指定依赖模块，requireJS会加载这个文件并执行。
        deps : ['app']
	});
});

```

### 3、app.js的编写

一个用于路由的js(app.js)，app.js里面配置的是自己的路由。具体参考代码如下

```js
//采用angularAMD规范写
define(["angular","angularAMD","angular-ui-						router","angularResource"],function(angular,angularAMD){
	//实例化angularJS
	var app = angular.module("app",['ui.router','ngResource']);
	//配置
	app.config(function(stateProvider, urlRouterProvider,$rootScopeProvider){
		$urlRouterProvider.otherwise("/login");
		$stateProvider
         .state("login",angularAMD.route({
			url:"/login",
			templateUrl:"../html/login.html",
			controller:"login",
			controllerUrl:["../js/injs/js/login.js"]//切记，这里一定是一个数组
		}))
         .state("index",angularAMD.route({
             url:"/index",
             templateUrl:"../html/file.html",
             controller:"my"
		}))
		.state("home",angularAMD.route({
             url:"/home",
             templateUrl:"../html/home.html",
             controller:"homeController",
             controllerUrl:["../js/injs/js/home.js"]
		}))
		.state("questionnireCenter",angularAMD.route({
			url:"/questionnireCenter",
			templateUrl:"../html/questionnire/QuestionnaireCenter.html",
			controllerUrl:["../js/injs/js/questionnire/questionnireCenter.js",
						  "../js/injs/js/questionnire/questionnireService.js"]
		}))
	});
	return angularAMD.bootstrap(app);
});

```

**当这两个文件写好后，在主界面里面引入main.js和一些依赖的js就行了。示例如下：**

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="UTF-8">
  <title>问卷制作(桥)</title>
  <link href="../css/incss/index.css" rel="stylesheet" type="text/css">
  <link href="../css/incss/common.css" rel="stylesheet" type="text/css">
  <link href="../css/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css">
  <script src="../js/jquery-2.1.1/jquery.js" type="text/javascript"></script>
  <!-- 这里就是引入的require.js，用来加载js,data-main=""指明入口js -->
  <script src="../js/require/require.js" data-main="/questionnairePrj/js/injs/main.js"></script>
 </head>
 <body>
	<div ui-view class="container-fluid"></div>
 </body>
</html>
```