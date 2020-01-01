function MyVue(options) {
    var then = this;
    this.data = options.data;
    this.methods = options.methods;

    Object.keys(this.data).forEach(function (key) {
        then.proxyKeys(key);
    });

    observe(this.data);
    new Compile(options.el, this); //编译
    options.mounted.call(this); // 编译完成后，执行mounted函数
}

MyVue.prototype = {
    proxyKeys: function (key) {
        var then = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function getter() {
                return then.data[key];
            },
            set: function setter(newVal) {
                then.data[key] = newVal;
            }
        });
    }
}
