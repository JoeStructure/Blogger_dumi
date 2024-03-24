---
# 同时设置分组名称和顺序，order 越小越靠前，默认为 0
group:
  title: Javascript
  order: 4
title: 创建对象的设计模式（1-3）
---

# [JS] 创建对象的若干种设计模式（4-6）

<a name="BT2Wt"></a>

## 4、组合使用：构造函数模式+原型模式

<a name="KwcFY"></a>

### 创建对象

```javascript
// 组合使用构造函数模式和原型模式
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.friend = ['Jenny', 'Court'];
}

Person.prototype = {
  constructor: Person, //constructor指向Object构造函数，这里要将其constructor恢复为指向Person构造函数。
  Country: 'China',
  showName: function () {
    console.log('name = ' + this.name);
  },
};

var p1 = new Person('Mike', 20, 'student');
var p2 = new Person('Tom', 23, 'Teacher');

console.log(p1);
console.log(p2);
```

构造函数和原型混成的模式是 ECMAScript 中使用最广泛。认同度最高的一种创建自定义类型的方法。<br />在该模式中，构造函数模式用于定义实例属性，原型模式用于定义方法和共享的属性，使得每个实例都会有自己的一份实例属性的副本，同时又共享对方法的引用，最大限度地节省了内存，这种模式还支持构造函数的传递参数。<br />注意：上面重写 Person.prototype，使用到的字面量对象，如果不重新将 constructor 指向 Person，那么会被指向 Object 的构造函数。
<a name="US515"></a>

## 5、动态原型模式

首先，类比面向对象的语言开发创建一个 Person 类。

```java
public class Person {
    private String name;
    private int age;
    private String job;

    public Person(String name, int age, String job) {
        this.name = name;
        this.age = age;
        this.job = job;
    }

    public void sayName(){
        System.out.println(this.name);
    }

}
```

这是非常简单的一个类，它有三个属性，一个构造函数和一个方法。如果比较 JavaScript，function Person 就相当于类，但是我们发现，Java 中的类是一个整体，而 JavaScript 除了 function Person，还有一个 Person.prototype，被定义成了两部分。所以，JavaScript 对于对象的封装性还是不够完美，而动态原型模式正是致力于要解决这个问题，它把所有的信息都封装在了构造函数中，通过在构造函数中初始化原型，既很好地体现了封装性，又保持了组合使用构造函数和原型模式的特点，可以说一举两得，非常完美。下面我们来看一个例子：

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;

  if (typeof this.sayName != 'function') {
    Person.prototype.sayName = function () {
      console.log(this.name);
    };

    Person.prototype.sayJob = function () {
      console.log(this.job);
    };
  }
  // 字面量对象重写prototype，存在第一个new对象时，在创建实例后会切断原来的原型
  // if(typeof this.sayName != 'function'){
  //     Person.prototype = {
  //         constructor: Person,
  //         sayName: function(){
  //             console.log(this.name);
  //         }
  //     }
  // }
}

var p1 = new Person('张三', 18, 'JavaScript'); //sayName不存在，添加到原型
var p2 = new Person('李四', 20, 'Java'); //sayName已经存在，不会再向原型添加

p1.sayName(); //张三
p2.sayName(); //李四
```

提出一个问题，为什么动态原型模式不能用对象字面量的方式重写？<br />第一次创建实例对象时，先 new，然后执行构造函数，重写原型，那么此时实例的**proto**指向的还是原来的原型，不是重写后的原型。第二次创建实例，因为新原型对象已经创建好，所以实例的**proto**指向的就是重写的这个原型。使用给原型添加属性的方式操作的一直是同一个原型，所以也就不存在先后的问题。<br />这就是动态原型模式，相比组合使用构造函数和原型模式而言，封装性更优秀，但是一个小缺点就是不能使用对象字面量的形式初始化原型，这是需要留意的。
<a name="XPpHl"></a>

## 6、寄生构造函数模式

```javascript
function Person(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    alert(this.name);
  };
  return o;
}

var person1 = new Person('Nicholas', 29, 'Software Engineer');
var person2 = new Person('Greg', 27, 'Doctor');
```

这里不得不提到之前学到的工厂模式，工厂模式也是通过函数封装对象实例创建的过程，但是两者是有区别的，区别在于：

- 寄生构造函数模式将工厂模式中的那个通用函数看作为对象的构造函数。
- 创建对象实例时，寄生构造函数模式采用 new 操作符

在 JS 高级程序设计这本书中，作者如此说道：<br />除了使用 new 操作符并把使用的包装函数叫做构造函数之外，这个模式跟工厂模式其实是一模一样的。构造函数在不返回值的情况下，默认会返回新对象实例。而通过在构造函数的末尾添加一个 return 语句，可以重写调用构造函数时返回的值。<br />根据作者的意思，构造函数和普通函数的区别在于：当使用 new+构造函数创建对象时，如果构造函数内部没有 return 语句，那么默认情况下构造函数将返回一个该类型的实例（如果以上面的例子为参考，person1 和 person2 为 Person 类型的对象实例，可以使用 person1 instanceof Person 检验），但如果构造函数内部通过 return 语句返回了一个其它类型的对象实例，那么这种默认的设置将被打破，构造函数最终返回的实例类型将以 return 语句中对象实例的类型为准。<br />如果非要说两者的不同，并且要从其中选择一个作为创建对象的方法的话，我个人更偏向于寄生构造函数模式一些。这是因为 new Person()（寄生构造函数模式）更能让我感觉到自己正在创建一个对象，而不是在调用一个函数（工厂模式）。
