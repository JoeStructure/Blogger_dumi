---
# 同时设置分组名称和顺序，order 越小越靠前，默认为 0
group:
  title: Javascript
  order: 6
title: 创建对象的设计模式（7-9）
---

# [JS] 创建对象的若干种设计模式（7-9）

<a name="BT2Wt"></a>

## 7、单例模式

单例模式：一个类只有一个实例，并提供一个访问他的全局访问点。

```javascript
class Singleton { //特定类，通过静态方法访问获取实例
    let _instance = null; //单例，特定类的实例
    static getInstance() { //获取单例的方法
        if (!Singleton._instance) {
          Singleton.instance = new Singleton()
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return Singleton._instance
    }
}

const s1 = Singleton.getInstance()
const s2 = Singleton.getInstance()

console.log(s1 === s2)  // true
```

Vuex 中涉及使用单例模式<br />Vuex：实现了一个全局的 store 用来存储应用的所有状态。这个 store 的实现就是单例模式的典型应用。

```javascript
// 安装vuex插件
Vue.use(Vuex);

// store注入Vue实例
new Vue({
  el: '$app',
  store,
});
```

```javascript
let Vue; // instance 实例

export function install(_Vue) {
  // 判断传入的Vue实例对象是否已经被install过（是否有了唯一的state）
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.',
      );
    }
    return;
  }
  // 若没有，则为这个Vue实例对象install一个唯一的Vuex
  Vue = _Vue;
  // 将Vuex的初始化逻辑写进Vue的钩子函数里
  applyMixin(Vue);
}
```

通过这种方式，可以保证一个 Vue 实例只会被 install 一次 Vuex 插件，所以每个 Vue 实例只会拥有一个全局的 Store。<br />优缺点：<br />优点是节约资源，保证访问的一致性；缺点是扩展性不好，因为单例模式一般自动实例化，没有接口。
<a name="Ba36I"></a>

## 8、适配器模式

适配器模式：用于解决兼容问题，接口/方法/数据不兼容，将其转换成访问者期望的格式进行使用。<br />场景特点：<br />同时存在多种格式，旧有接口格式不满足现在需要。<br />增加适配器可以更好使用旧接口。

```javascript
// 格式 1
{
    book_id: 1001
    status: 0,
    create: '2021-12-12 08:10:20',
    update: '2022-01-15 09:00:00',
},

// 格式 2
{
    id: 1002
    status: 0,
    createTime: 16782738393022,
    updateAt: '2022-01-15 09:00:00',
},

// 格式 3
{
    book_id: 1003
    status: 0,
    createTime: 16782738393022,
    updateAt: 16782738393022,
}
```

```typescript
interface bookDataType1 {
  book_id: number;
  status: number;
  create: string;
  update: string;
}

interface bookDataType2 {
  id: number;
  status: number;
  createTime: number;
  updateAt: string;
}

interface bookDataType3 {
  book_id: number;
  status: number;
  createTime: number;
  updateAt: number;
}

const getTimeStamp = function (str: string): number {
  //.....转化成时间戳
  return timeStamp;
};

//适配器
export const bookDataAdapter = {
  adapterType1(list: bookDataType1[]) {
    const bookDataList: bookData[] = list.map((item) => {
      return {
        book_id: item.book_id,
        status: item.status,
        createAt: getTimeStamp(item.create),
        updateAt: getTimeStamp(item.update),
      };
    });
    return bookDataList;
  },

  adapterType2(list: bookDataType2[]) {
    const bookDataList: bookData[] = list.map((item) => {
      return {
        book_id: item.id,
        status: item.status,
        createAt: item.createTime,
        updateAt: getTimeStamp(item.updateAt),
      };
    });
    return bookDataList;
  },

  adapterType3(list: bookDataType3[]) {
    const bookDataList: bookData[] = list.map((item) => {
      return {
        book_id: item.book_id,
        status: item.status,
        createAt: item.createTime,
        updateAt: item.updateAt,
      };
    });
    return bookDataList;
  },
};
```

<a name="PKkFp"></a>

## 9、装饰器模式

装饰器模式：在不改变原对象的基础上，增加新属性/方法/功能。<br />一个对象被另一个对象包装，形成一条包装链，在原对象上增加功能。
