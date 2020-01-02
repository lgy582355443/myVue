## 功能展示

![](https://raw.githubusercontent.com/lgy582355443/myVue/master/wd-img/wd1.png)

![](https://raw.githubusercontent.com/lgy582355443/myVue/master/wd-img/GIF2.gif)

## vue双向绑定原理

vue.js采用的数据劫持结合发布订阅模式的方式，通过Object.defineProperty()来劫持各个属性的setter,getter,在数据变动时发布消息给订阅者，触发相应的回调。

## 思路分析

实现mvvm主要包含两个方面，数据变化更新视图，视图变化更新数据：

![](https://raw.githubusercontent.com/lgy582355443/myVue/master/wd-img/1.jpg)

关键点在于data如何更新view，因为view更新data其实可以通过事件监听即可，比如input标签监听 'input' 事件就可以实现了。所以我们着重来分析下，当数据改变，如何更新视图的。

数据更新视图的重点是如何知道数据变了，只要知道数据变了，那么接下去的事都好处理。如何知道数据变了，就是通过Object.defineProperty( )对属性设置一个set函数，当数据改变了就会来触发这个函数，所以我们只要将一些需要更新的方法放在这里面就可以实现data更新view了。

![](https://raw.githubusercontent.com/lgy582355443/myVue/master/wd-img/2.jpg)

## 实现过程

我们已经知道实现数据的双向绑定，首先要对数据进行劫持监听，所以我们需要设置一个监听器Observer，用来监听所有属性。如果属性发上变化了，就需要告诉订阅者Watcher看是否需要更新。因为订阅者是有很多个，所以我们需要有一个消息订阅器Dep来专门收集这些订阅者，然后在监听器Observer和订阅者Watcher之间进行统一管理的。接着，我们还需要有一个指令解析器Compile，对每个节点元素进行扫描和解析，将相关指令对应初始化成一个订阅者Watcher，并替换模板数据或者绑定相应的函数，此时当订阅者Watcher接收到相应属性的变化，就会执行对应的更新函数，从而更新视图。因此接下去我们执行以下3个步骤，实现数据的双向绑定：

1.实现一个监听器Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。

2.实现一个订阅者Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。

3.实现一个解析器Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。

流程图如下：

![](https://raw.githubusercontent.com/lgy582355443/myVue/master/wd-img/3.png)

