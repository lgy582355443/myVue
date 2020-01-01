//监听器（发布者）
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function (data) {
        var then = this;
        //递归对每个属性进行监听
        Object.keys(data).forEach(function (key) {
            then.defineReactive(data, key, data[key]);
        });
    },
    defineReactive: function (data, key, val) {
        var dep = new Dep();
        var childObj = observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter() {
                if (target) {
                    dep.addSub(target);
                    console.log(target);
                }
                return val;
            },
            set: function setter(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();
            }
        });
    }
};

//判断是否为object，是就继续对其属性进行监听
function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};

//订阅器
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    //加入订阅器
    addSub: function (sub) {
        this.subs.push(sub);
    },
    //通知订阅者调用更新数据方法
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
};
// Dep.target = null;
var target = null;