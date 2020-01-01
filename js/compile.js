function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function () {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log('Dom元素不存在');
        }
    },
    //获取要解析的页面文档，就是id为app的里的文档
    nodeToFragment: function (el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            // 递归将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    },


    compileElement: function (el) {
        var childNodes = el.childNodes;
        var then = this;
        childNodes.forEach(function (node) {
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent;

            if (then.isElementNode(node)) {
                //如果是元素节点
                then.compile(node);
            } else if (then.isTextNode(node) && reg.test(text)) {
                //如果是 {{}} 的文字节点
                then.compileText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                //如果还有子节点，继续编译
                then.compileElement(node);
            }
        });
    },

    compile: function (node) {
        //获取属性集合
        var nodeAttrs = node.attributes;
        var then = this;
        Array.prototype.forEach.call(nodeAttrs, function (attr) {
            var attrName = attr.name;
            if (then.isDirective(attrName)) {  //v- 指令判断
                var exp = attr.value;
                //获取 v- 后面的字符串
                var dir = attrName.substring(2);
                if (then.isEventDirective(dir)) {  // v-on指令
                    //绑定事件
                    then.compileEvent(node, then.vm, exp, dir);
                } else {  // v-model 指令
                    then.compileModel(node, then.vm, exp, dir);
                }
                //编译完成后去掉指令属性
                node.removeAttribute(attrName);
            }
        });
    },

    //编译{{}}
    compileText: function (node, exp) {
        var then = this;
        var initText = this.vm[exp];
        this.updateText(node, initText);
        new Watcher(this.vm, exp, function (value) {
            then.updateText(node, value);
        });
    },

    //编译v-on：事件
    compileEvent: function (node, vm, exp, dir) {
        //获取事件类型
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];
        //绑定事件
        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    },

    //编译input的v-model
    compileModel: function (node, vm, exp, dir) {
        var then = this;
        var val = this.vm[exp];
        //设置默认值
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, function (value) {
            then.modelUpdater(node, value);
        });
        //绑定input事件
        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            then.vm[exp] = newValue;
            val = newValue;
        });
    },

    //innerText
    updateText: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    //input输入框里的值
    modelUpdater: function (node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    },

    //判断属性名是否是 v- 开头的
    isDirective: function (attr) {
        return attr.indexOf('v-') == 0;
    },

    //判断属性是否是 on: 开头的
    isEventDirective: function (dir) {
        return dir.indexOf('on:') === 0;
    },

    // 如果节点是一个元素节点，nodeType 属性返回 1。
    // 如果节点是属性节点, nodeType 属性返回 2。
    // 如果节点是一个文本节点，nodeType 属性返回 3。
    // 如果节点是一个注释节点，nodeType 属性返回 8。
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    isTextNode: function (node) {
        return node.nodeType == 3;
    }
}
