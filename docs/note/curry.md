---
# 同时设置分组名称和顺序，order 越小越靠前，默认为 0
group:
  title: Javascript
  order: 5
title: currying
---

# [JS] 函数柯里化

函数柯里化是一种技术，一种将多入参函数变成单入参函数。

```javascript
//正常函数
function sum(a, b) {
  console.log(a + b);
}

sum(1, 2); //输出3
sum(1, 3); //输出4

//柯里化函数
function curry(a) {
  return (b) => {
    console.log(a + b);
  };
}

const sum = curry(1);

sum(2); //输出3
sum(3); //输出4
```

多层柯里化函数会造成代码可读性非常差。因此，需要封装一个函数来帮助我们完成函数向柯里化转换。

```javascript
//函数柯里化封装（这个封装可以直接复制走使用）
function curry(fn, args) {
  var length = fn.length;
  var args = args || [];
  return function () {
    newArgs = args.concat(Array.prototype.slice.call(arguments));
    if (newArgs.length < length) {
      return curry.call(this, fn, newArgs);
    } else {
      return fn.apply(this, newArgs);
    }
  };
}

//需要被柯里化的函数
function multiFn(a, b, c) {
  return a * b * c;
}

//multi是柯里化之后的函数
var multi = curry(multiFn);
console.log(multi(2)(3)(4));
console.log(multi(2, 3, 4));
console.log(multi(2)(3, 4));
console.log(multi(2, 3)(4));
```

应用场景（手机号正则校验）

```javascript
//校验手机号
function validatePhone(regExp,warn,phone){
  const reg = regExp;
  if (phone && reg.test(phone) === false) {
    return Promise.reject(warn);
  }
  return Promise.resolve();
}

//调用校验
validatePhone(/^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/,"手机号格式不符",187****3311)
```

```javascript
//完成柯里化
const curryValid = curry(validatePhone);
const validatePhoneCurry  =curryValid(/^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/,"手机号格式不符");

//调用柯里化之后的函数
validatePhoneCurry(159****6204);
validatePhoneCurry(137****1234);
validatePhoneCurry(137****2125);
validatePhoneCurry(191****5236);
```

如上，我们可以省略很多不必要的参数。

此外，新增一个学习柯里化过程中遇到的一个知识点<br />为什么需要用 apply 改变 this 指向？

```javascript
function Parent(name, age) {
  this.name = name;
  this.age = age;
  console.log(this);
  console.log(this.name, this.age);
}
function Children(name, age, height) {
  // console.log(this,arguments)
  // Parent.apply(this,[name,age,height])
  Parent(name, age);
  this.height = height;
}
let lisi = new Children('李四', 12, 170);
console.log(lisi.name, lisi.age, lisi.height);
// 输出结果
// 李四 12
// undefined undefined 170
```

Children 调用 Parent 只是在 Parent 中赋值了 name 和 age，因此，需要 apply 改变 this

```javascript
function Parent(name, age) {
  this.name = name;
  this.age = age;
  console.log(this);
  console.log(this.name, this.age);
}
function Children(name, age, height) {
  // console.log(this,arguments)
  Parent.apply(this, [name, age, height]);
  // Parent(name,age)
  this.height = height;
}
let lisi = new Children('李四', 12, 170);
console.log(lisi.name, lisi.age, lisi.height);
// 输出结果
// 李四 12
// 李四 12 170
```
