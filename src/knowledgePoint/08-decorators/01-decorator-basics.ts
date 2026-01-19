/**
 * 装饰器基础 (Decorator Basics)
 *
 * 装饰器是一种元编程技术，允许在不修改原始代码的情况下扩展类的功能
 * 注意: 需要在 tsconfig.json 中启用 experimentalDecorators
 */

// ============================================
// 1. 装饰器简介
// ============================================

// 装饰器是一个函数，接收目标作为参数
// 装饰器在类定义时执行，而不是实例化时

// 最简单的类装饰器
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
    console.log(`类 ${constructor.name} 已被密封`);
}

@sealed
class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greet() {
        return `Hello, ${this.greeting}`;
    }
}

const greeter = new Greeter("World");
console.log(greeter.greet());

// ============================================
// 2. 装饰器工厂 (Decorator Factory)
// ============================================

// 装饰器工厂是返回装饰器的函数，允许传递参数

function Logger(prefix: string) {
    return function<T extends { new (...args: unknown[]): object }>(constructor: T) {
        return class extends constructor {
            constructor(...args: unknown[]) {
                super(...args);
                console.log(`${prefix} 实例已创建`);
            }
        };
    };
}

@Logger("[User]")
class User {
    constructor(public name: string) {
        console.log(`用户名: ${name}`);
    }
}

const user = new User("张三");

// ============================================
// 3. 装饰器组合 (Decorator Composition)
// ============================================

// 多个装饰器可以应用到同一个声明
// 执行顺序: 从下到上（先靠近声明的先执行）

function first() {
    console.log("first(): 工厂求值");
    return function(target: Function) {
        console.log("first(): 装饰器执行");
    };
}

function second() {
    console.log("second(): 工厂求值");
    return function(target: Function) {
        console.log("second(): 装饰器执行");
    };
}

@first()
@second()
class ExampleClass {
    constructor() {
        console.log("ExampleClass 构造函数");
    }
}

// 输出顺序:
// first(): 工厂求值
// second(): 工厂求值
// second(): 装饰器执行
// first(): 装饰器执行

// ============================================
// 4. 类装饰器 (Class Decorators)
// ============================================

// 类装饰器接收构造函数作为参数
// 可以用于修改类的定义

// 添加属性的装饰器
function addTimestamp<T extends { new (...args: unknown[]): object }>(constructor: T) {
    return class extends constructor {
        timestamp = new Date();
    };
}

@addTimestamp
class Document {
    constructor(public title: string) {}
}

const doc = new Document("TypeScript 入门") as Document & { timestamp: Date };
console.log("文档:", doc.title);
console.log("时间戳:", doc.timestamp);

// 替换构造函数的装饰器
function reportableClassDecorator<T extends { new (...args: unknown[]): object }>(constructor: T) {
    return class extends constructor {
        reportingURL = "https://example.com/report";

        report() {
            console.log(`报告已发送到 ${this.reportingURL}`);
        }
    };
}

@reportableClassDecorator
class BugReport {
    type = "report";
    title: string;

    constructor(t: string) {
        this.title = t;
    }
}

const bug = new BugReport("需要深色模式") as BugReport & { reportingURL: string; report(): void };
console.log(bug.title);
bug.report();

// ============================================
// 5. 方法装饰器 (Method Decorators)
// ============================================

// 方法装饰器接收三个参数:
// - target: 类的原型对象（实例方法）或构造函数（静态方法）
// - propertyKey: 方法名
// - descriptor: 属性描述符

function log(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: unknown[]) {
        console.log(`调用 ${propertyKey}，参数:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`${propertyKey} 返回:`, result);
        return result;
    };

    return descriptor;
}

class Calculator {
    @log
    add(a: number, b: number): number {
        return a + b;
    }

    @log
    multiply(a: number, b: number): number {
        return a * b;
    }
}

const calc = new Calculator();
calc.add(2, 3);
calc.multiply(4, 5);

// ============================================
// 6. 属性装饰器 (Property Decorators)
// ============================================

// 属性装饰器接收两个参数:
// - target: 类的原型对象或构造函数
// - propertyKey: 属性名

function format(formatString: string) {
    return function(target: object, propertyKey: string) {
        let value: string;

        const getter = function() {
            return value;
        };

        const setter = function(newVal: string) {
            value = formatString.replace("%s", newVal);
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}

class Greeting {
    @format("Hello, %s!")
    message: string;

    constructor(name: string) {
        this.message = name;
    }
}

const greet2 = new Greeting("TypeScript");
console.log(greet2.message);  // Hello, TypeScript!

// ============================================
// 7. 参数装饰器 (Parameter Decorators)
// ============================================

// 参数装饰器接收三个参数:
// - target: 类的原型对象或构造函数
// - propertyKey: 方法名
// - parameterIndex: 参数索引

const requiredParams: Map<string, number[]> = new Map();

function required(
    target: object,
    propertyKey: string,
    parameterIndex: number
) {
    const existingParams = requiredParams.get(propertyKey) || [];
    existingParams.push(parameterIndex);
    requiredParams.set(propertyKey, existingParams);
}

function validate(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: unknown[]) {
        const params = requiredParams.get(propertyKey);
        if (params) {
            for (const index of params) {
                if (args[index] === undefined || args[index] === null) {
                    throw new Error(`参数 ${index} 是必需的`);
                }
            }
        }
        return originalMethod.apply(this, args);
    };
}

class UserService {
    @validate
    createUser(@required name: string, @required email: string) {
        console.log(`创建用户: ${name}, ${email}`);
        return { name, email };
    }
}

const userService = new UserService();
userService.createUser("张三", "zhangsan@example.com");
// userService.createUser("李四", undefined as any);  // 会抛出错误

// ============================================
// 8. 访问器装饰器 (Accessor Decorators)
// ============================================

function configurable(value: boolean) {
    return function(
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        descriptor.configurable = value;
    };
}

class Point {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() {
        return this._x;
    }

    @configurable(false)
    get y() {
        return this._y;
    }
}

// ============================================
// 9. 装饰器执行顺序
// ============================================

function classDecorator(target: Function) {
    console.log("类装饰器");
}

function methodDecorator(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    console.log("方法装饰器:", propertyKey);
}

function propertyDecorator(target: object, propertyKey: string) {
    console.log("属性装饰器:", propertyKey);
}

function parameterDecorator(
    target: object,
    propertyKey: string,
    parameterIndex: number
) {
    console.log("参数装饰器:", propertyKey, "参数索引:", parameterIndex);
}

@classDecorator
class DecoratorOrder {
    @propertyDecorator
    name: string = "";

    @methodDecorator
    method(@parameterDecorator param: string) {
        console.log(param);
    }
}

// 执行顺序:
// 属性装饰器: name
// 参数装饰器: method 参数索引: 0
// 方法装饰器: method
// 类装饰器

// ============================================
// 10. 实际应用示例
// ============================================

// 示例 1: 自动绑定 this
function autobind(
    _target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        }
    };

    return adjDescriptor;
}

class Printer {
    message = "This works!";

    @autobind
    showMessage() {
        console.log(this.message);
    }
}

const printer = new Printer();
const func = printer.showMessage;
func();  // 即使解绑也能正确工作

// 示例 2: 性能计时装饰器
function measure(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: unknown[]) {
        const start = performance.now();
        const result = await originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`${propertyKey} 执行时间: ${(end - start).toFixed(2)}ms`);
        return result;
    };

    return descriptor;
}

class DataService {
    @measure
    async fetchData() {
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 100));
        return { data: "some data" };
    }
}

// 示例 3: 缓存装饰器
function memoize(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, unknown>();

    descriptor.value = function(...args: unknown[]) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log(`从缓存获取 ${propertyKey}(${key})`);
            return cache.get(key);
        }
        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };

    return descriptor;
}

class MathOperations {
    @memoize
    fibonacci(n: number): number {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
}

const math = new MathOperations();
console.log("Fibonacci(10):", math.fibonacci(10));
console.log("Fibonacci(10) 再次:", math.fibonacci(10));  // 从缓存获取

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个验证装饰器
 */
function min(minValue: number) {
    return function(
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: unknown[]) {
            for (let i = 0; i < args.length; i++) {
                if (typeof args[i] === "number" && (args[i] as number) < minValue) {
                    throw new Error(`参数 ${i} 的值必须大于等于 ${minValue}`);
                }
            }
            return originalMethod.apply(this, args);
        };
    };
}

function max(maxValue: number) {
    return function(
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: unknown[]) {
            for (let i = 0; i < args.length; i++) {
                if (typeof args[i] === "number" && (args[i] as number) > maxValue) {
                    throw new Error(`参数 ${i} 的值必须小于等于 ${maxValue}`);
                }
            }
            return originalMethod.apply(this, args);
        };
    };
}

class AgeService {
    @min(0)
    @max(150)
    setAge(age: number) {
        console.log(`设置年龄: ${age}`);
        return age;
    }
}

const ageService = new AgeService();
ageService.setAge(25);  // OK
// ageService.setAge(-5);  // Error
// ageService.setAge(200);  // Error

/**
 * 练习 2: 创建一个只读属性装饰器
 */
function readonly(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    descriptor.writable = false;
    return descriptor;
}

class Config {
    @readonly
    getVersion() {
        return "1.0.0";
    }
}

const config = new Config();
console.log("版本:", config.getVersion());
// config.getVersion = () => "2.0.0";  // Error: 只读方法

/**
 * 练习 3: 创建一个弃用警告装饰器
 */
function deprecated(message: string = "此方法已弃用") {
    return function(
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: unknown[]) {
            console.warn(`⚠️ ${propertyKey}: ${message}`);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

class OldAPI {
    @deprecated("请使用 newMethod() 替代")
    oldMethod() {
        return "old result";
    }

    newMethod() {
        return "new result";
    }
}

const api = new OldAPI();
api.oldMethod();  // 会显示弃用警告

// 导出
export {
    sealed,
    Logger,
    addTimestamp,
    log,
    autobind,
    measure,
    memoize,
    min,
    max,
    readonly,
    deprecated
};
