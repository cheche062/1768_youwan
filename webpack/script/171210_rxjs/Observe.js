var user = {
    id: 0,
    name: 'Brendan Eich',
    title: 'Mr.'
};

// 创建用户的greeting
function updateGreeting() {
    user.greeting = 'Hello, ' + user.title + ' ' + user.name + '!';
    console.log(user.greeting);
}

Object.observe = function(obj, callback) {
    Object.keys(obj).forEach((key) => {
        let value = obj[key];
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: () => {
                // console.log(`获取：${key}, ${value}`);
                return value;

            },
            set: (val) => {
                // console.log(`设置：${key}, ${val}`);
                value = val;

                callback([{ name: key }])
            }
        })
    })
}

Object.observe(user, function(changes) {
    changes.forEach(function(change) {
        // 当name或title属性改变时, 更新greeting
        if (change.name === 'name' || change.name === 'title') {
            updateGreeting();
        }
    });
});

user.name = "meihao";
user.title = "Mrs.";
user.id = 1;