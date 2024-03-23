---
# 同时设置分组名称和顺序，order 越小越靠前，默认为 0
group:
  title: Javascript
  order: 3
title: 创建对象的设计模式（1-3）
---

# [JS] 创建对象的若干种设计模式（1-3）

<a name="L2GYX"></a>

## 1、工厂模式

工厂模式根据抽象程度不同，分为简单工厂、工厂方法、抽象工厂。
<a name="wyevi"></a>

### 简单工厂

```javascript
//User类
class User {
  //构造器
  constructor(opt) {
    this.name = opt.name;
    this.viewPage = opt.viewPage;
  }

  //静态方法
  static getInstance(role) {
    switch (role) {
      case 'superAdmin':
        return new User({
          name: '超级管理员',
          viewPage: ['首页', '通讯录', '发现页', '应用数据', '权限管理'],
        });
        break;
      case 'admin':
        return new User({
          name: '管理员',
          viewPage: ['首页', '通讯录', '发现页', '应用数据'],
        });
        break;
      case 'user':
        return new User({
          name: '普通用户',
          viewPage: ['首页', '通讯录', '发现页'],
        });
        break;
      default:
        throw new Error('参数错误, 可选参数:superAdmin、admin、user');
    }
  }
}

//调用
let superAdmin = User.getInstance('superAdmin');
let admin = User.getInstance('admin');
let normalUser = User.getInstance('user');
```

User 类就是一个简单工厂，只需要传入三个参数即可获得其对应的正确实例对象。由于其封装好了实例对象的逻辑，因此，每当你需要新增构造函数的参数实例时，就需要同时对内部逻辑进行修改。假如 30 个或 300 个属性，修改的工作量巨大，所以简单工厂只适合创建对象数量较少，对象创建逻辑不复杂时使用。
<a name="K9YNe"></a>

### 工厂方法模式

工厂方法模式是通过将实际创建对象的工作推迟到子类中，虽然 ES6 上还未实现 abstract 关键词，但是我们可以通过使用 new.target 来模拟出抽象类。

```javascript
function Foo() {
  if (!new.target) throw 'Foo() must be called with new';
  console.log('Foo instantiated with new');
}

Foo(); // throws "Foo() must be called with new"
new Foo(); // logs "Foo instantiated with new"
```

在工厂方法模式中，我们不在工厂中实现对实例化对象的判断逻辑，而是**只进行实例化对象这一件事**。

```javascript
class User {
  constructor(name = '', viewPage = []) {
    if(new.target === User) {
      throw new Error("抽象类不能实例化！")
    }
  }
  this.name = name
  this.Page = viewPage
}

class　UserFactory extends User {
  constructor(name, viewPage) {
    super(name, viewPage)
  }
  create(role) {
    switch(role) {
      case 'superAdmin':
        return new UserFactory( '超级管理员', ['首页', '通讯录', '发现页', '应用数据', '权限管理'] );
        break;
      case 'admin':
        return new UserFactory( '普通用户', ['首页', '通讯录', '发现页'] );
        break;
      case 'user':
        return new UserFactory( '普通用户', ['首页', '通讯录', '发现页'] );
        break;
      default:
        throw new Error('参数错误, 可选参数:superAdmin、admin、user')
    }
  }
}

let userFactory = new UserFactory();
let superAdmin = userFactory.create('superAdmin');
let admin = userFactory.create('admin');
let user = userFactory.create('user');
```

<a name="QdWdt"></a>

### 抽象工厂模式

上面介绍了简单工厂模式和工厂方法模式都是直接生成实例，但是抽象工厂模式不同，抽象工厂模式并不直接生成实例， 而是用于对产品类簇的创建。<br />上面例子中的 superAdmin，admin，user 三种用户角色，其中 user 可能是使用不同的社交媒体账户进行注册的，例如：wechat，qq，weibo。那么这三类社交媒体账户就是对应的类簇。在抽象工厂中，类簇一般用父类定义，并在父类中定义一些抽象方法，再通过抽象工厂让子类继承父类。所以，**抽象工厂其实是实现子类继承父类的方法**。<br />上面提到的抽象方法是指声明但不能使用的方法。在其他传统面向对象的语言中常用 abstract 进行声明，但是在 JavaScript 中，abstract 是属于保留字，但是我们可以通过在类的方法中抛出错误来模拟抽象类。

```javascript
function getAbstractUserFactory(type) {
  switch (type) {
    case 'wechat':
      return UserOfWechat;
      break;
    case 'qq':
      return UserOfQq;
      break;
    case 'weibo':
      return UserOfWeibo;
      break;
    default:
      throw new Error('参数错误, 可选参数:superAdmin、admin、user');
  }
}

let WechatUserClass = getAbstractUserFactory('wechat');
let QqUserClass = getAbstractUserFactory('qq');
let WeiboUserClass = getAbstractUserFactory('weibo');

let wechatUser = new WechatUserClass('微信小李');
let qqUser = new QqUserClass('QQ小李');
let weiboUser = new WeiboUserClass('微博小李');
```

<a name="jtQft"></a>

### 实际应用

在 router/index.js 文件中，我们只提供/login 这一个路由页面。

```javascript
//index.js

import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login.vue';

Vue.use(Router);

export default new Router({
  routes: [
    //重定向到登录页
    {
      path: '/',
      redirect: '/login',
    },
    //登陆页
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});
```

我们在 router/文件夹下新建一个 routerFactory.js 文件，导出 routerFactory 简单工厂函数，用于根据用户权限提供路由权限，代码如下

```javascript
//routerFactory.js

import SuperAdmin from '../components/SuperAdmin.vue';
import NormalAdmin from '../components/Admin.vue';
import User from '../components/User.vue';
import NotFound404 from '../components/404.vue';

let AllRoute = [
  //超级管理员页面
  {
    path: '/super-admin',
    name: 'SuperAdmin',
    component: SuperAdmin,
  },
  //普通管理员页面
  {
    path: '/normal-admin',
    name: 'NormalAdmin',
    component: NormalAdmin,
  },
  //普通用户页面
  {
    path: '/user',
    name: 'User',
    component: User,
  },
  //404页面
  {
    path: '*',
    name: 'NotFound404',
    component: NotFound404,
  },
];

let routerFactory = (role) => {
  switch (role) {
    case 'superAdmin':
      return {
        name: 'SuperAdmin',
        route: AllRoute,
      };
      break;
    case 'normalAdmin':
      return {
        name: 'NormalAdmin',
        route: AllRoute.splice(1),
      };
      break;
    case 'user':
      return {
        name: 'User',
        route: AllRoute.splice(2),
      };
      break;
    default:
      throw new Error('参数错误! 可选参数: superAdmin, normalAdmin, user');
  }
};

export { routerFactory };
```

在登陆页导入该方法，请求登陆接口后根据权限添加路由:

```javascript
//Login.vue

import { routerFactory } from '../router/routerFactory.js';
export default {
  //...
  methods: {
    userLogin() {
      //请求登陆接口, 获取用户权限, 根据权限调用this.getRoute方法
      //..
    },

    getRoute(role) {
      //根据权限调用routerFactory方法
      let routerObj = routerFactory(role);

      //给vue-router添加该权限所拥有的路由页面
      this.$router.addRoutes(routerObj.route);

      //跳转到相应页面
      this.$router.push({ name: routerObj.name });
    },
  },
};
```

在实际项目中，因为使用 this.$router.addRoutes 方法添加的路由刷新后不能保存，所以会导致路由无法访问。通常的做法是本地加密保存用户信息，在刷新后获取本地权限并解密，根据权限重新添加路由。这里因为和工厂模式没有太大的关系就不再赘述。
<a name="kyGXI"></a>

## 2、构造函数模式

在 JavaScript 中，构造函数创建对象的方式更接近于 JavaScript 的原生对象创建方式。JavaScript 是一种基于原型的编程语言，它允许我们使用 new 关键词创建对象。
<a name="oFwJA"></a>

### 构造函数简介

构造函数是**一种特殊类型的函数，它用于创建和初始化对象**。在 JavaScript 中，构造函数通过使用 new 关键字来创建对象实例。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const person1 = new Person('Alice', 25);
const person2 = new Person('Bob', 30);
```

在上面的示例中，Person 是一个构造函数，它接受 name 和 age 两个参数。当我们使用 new Person('Alice', 25)创建一个新的 Person 实例时，JavaScript 引擎会创建一个新对象，并调用 Person 构造函数来初始化这个对象。
<a name="mn6El"></a>

### 构造函数与原型

构造函数模式中，每个构造函数都有一个原型对象，原型对象包含了一系列的属性和方法。当我们创建新的对象实例时，这些属性和方法会被自动添加到实例中。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function () {
  console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
};
const person1 = new Person('Alice', 25);
person1.greet(); // Hello, my name is Alice and I am 25 years old.
```

在上面的示例中，Person.prototype.greet 是一个原型方法，它被所有 Person 实例共享。当我们调用 person1.greet()时，实际上是调用了 Person.prototype.greet 方法。
<a name="YMm95"></a>

### 优缺点

优点：**初始化对象**：可以自动为对象属性设置初始值，代码更加简洁利于维护；**封装性**：构造函数可以使用对象属性和方法封装在一起，更加灵活；**复用性**：构造函数可以被多次调用，创建多个具有相同方法属性的对象，提高代码复用性；**灵活性**：构造函数可以被重写，从而实现继承和拓展。<br />缺点：构造函数中的方法只能通过实例来调用，造成代码冗余和难以维护。此外，构造函数模式不适合用于创建多个相似的对象，因为它没有提供一种灵活的方式来拓展对象。
<a name="sNxID"></a>

## 3、原型模式（原型编程范型）

原型模式创建对象是通过，Object.create 方法来克隆对象的，因此，在该设计模式下，JavaScript 创建的对象应当遵循原型编程范型，其**基本规则**有：<br />所有数据都是对象；<br />要得到一个对象，不是通过实例化操作，而且一个对象作为原型去克隆它；<br />对象会记住它的原型；<br />如果对象无法响应某个请求，它会把这个请求委托给它自己的原型。

```javascript
function CreateObject() {
  var obj = new Object(), //从Object.prototype克隆一个新对象
    Constructor = [].shift.call(arguments); //取出传入的第一个参数
  obj.__proto__ = Constructor.prototype; //将新对象原型指向外部传入的构造器原型

  var result = Constructor.apply(obj, arguments); //给新对象设置属性

  return typeof result === 'object' ? result : obj; //确保返回的是一个对象
}

function Person(name) {
  this.name = name;
}

Person.prototype.getName = function () {
  return this.name;
};

var x = CreateObject(Person, 'shirley');

console.log(x.name); // shirley
console.log(x.getName()); // shirley
console.log(Object.getPrototypeOf(x) === Person.prototype); // true
```
