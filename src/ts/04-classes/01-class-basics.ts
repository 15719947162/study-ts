/**
 * 类的基础 (Class Basics)
 *
 * TypeScript 类是 ES6 类的超集，添加了类型注解和额外特性
 */

// ============================================
// 1. 基本类定义
// ============================================

class Person {
    // 属性声明
    name: string;
    age: number;

    // 构造函数
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    // 方法
    greet(): string {
        return `你好，我是 ${this.name}，今年 ${this.age} 岁`;
    }
}

const person = new Person("张三", 25);
console.log(person.greet());

// ============================================
// 2. 参数属性 (Parameter Properties)
// ============================================

// 使用参数属性简化属性声明
class User {
    // 在构造函数参数前添加修饰符，自动创建并初始化属性
    constructor(
        public username: string,
        public email: string,
        private password: string,
        readonly id: number = Date.now()
    ) {}

    validatePassword(input: string): boolean {
        return this.password === input;
    }

    getInfo(): string {
        return `${this.username} (${this.email})`;
    }
}

const user = new User("zhangsan", "zhangsan@example.com", "secret123");
console.log(user.getInfo());
console.log("密码验证:", user.validatePassword("secret123"));
// console.log(user.password);  // Error: 私有属性
console.log("用户 ID:", user.id);
// user.id = 456;  // Error: 只读属性

// ============================================
// 3. 属性初始化
// ============================================

class Settings {
    // 直接初始化
    theme: string = "light";
    language: string = "zh-CN";
    notifications: boolean = true;

    // 可选属性
    customCss?: string;

    // 只读属性必须在声明时或构造函数中初始化
    readonly version: string = "1.0.0";

    // 使用 ! 断言属性一定会被初始化
    config!: object;

    constructor() {
        this.initConfig();
    }

    private initConfig(): void {
        this.config = { initialized: true };
    }
}

const settings = new Settings();
console.log("设置:", settings.theme, settings.language);

// ============================================
// 4. 方法定义
// ============================================

class Calculator {
    private result: number = 0;

    // 普通方法
    add(value: number): this {
        this.result += value;
        return this;  // 返回 this 支持链式调用
    }

    subtract(value: number): this {
        this.result -= value;
        return this;
    }

    multiply(value: number): this {
        this.result *= value;
        return this;
    }

    divide(value: number): this {
        if (value === 0) {
            throw new Error("除数不能为零");
        }
        this.result /= value;
        return this;
    }

    // 获取结果
    getResult(): number {
        return this.result;
    }

    // 重置
    reset(): this {
        this.result = 0;
        return this;
    }
}

const calc = new Calculator();
const result = calc.add(10).multiply(2).subtract(5).getResult();
console.log("计算结果:", result);  // (10 * 2) - 5 = 15

// ============================================
// 5. 类实现接口
// ============================================

interface Printable {
    print(): void;
}

interface Saveable {
    save(): boolean;
    load(): boolean;
}

// 实现多个接口
class Document implements Printable, Saveable {
    constructor(
        public title: string,
        public content: string
    ) {}

    print(): void {
        console.log(`=== ${this.title} ===`);
        console.log(this.content);
    }

    save(): boolean {
        console.log(`保存文档: ${this.title}`);
        return true;
    }

    load(): boolean {
        console.log(`加载文档: ${this.title}`);
        return true;
    }
}

const doc = new Document("TypeScript 学习笔记", "内容...");
doc.print();
doc.save();

// ============================================
// 6. 类的类型
// ============================================

// 类本身就是一个类型
function printPerson(p: Person): void {
    console.log(`姓名: ${p.name}, 年龄: ${p.age}`);
}

printPerson(new Person("李四", 30));

// 类也有两种类型: 实例类型和构造函数类型
type PersonInstance = Person;  // 实例类型
type PersonConstructor = typeof Person;  // 构造函数类型

function createPerson(ctor: PersonConstructor, name: string, age: number): Person {
    return new ctor(name, age);
}

const newPerson = createPerson(Person, "王五", 28);
console.log(newPerson.greet());

// ============================================
// 7. 类表达式
// ============================================

// 匿名类
const Rectangle = class {
    constructor(
        public width: number,
        public height: number
    ) {}

    getArea(): number {
        return this.width * this.height;
    }
};

const rect = new Rectangle(10, 5);
console.log("矩形面积:", rect.getArea());

// 命名类表达式
const NamedCircle = class Circle {
    constructor(public radius: number) {}

    getArea(): number {
        return Math.PI * this.radius ** 2;
    }

    // 可以在类内部使用名称
    clone(): Circle {
        return new Circle(this.radius);
    }
};

const circle = new NamedCircle(5);
console.log("圆形面积:", circle.getArea());

// ============================================
// 8. this 类型
// ============================================

class FluentBuilder {
    private data: Record<string, unknown> = {};

    // 返回 this 类型，支持子类链式调用
    set(key: string, value: unknown): this {
        this.data[key] = value;
        return this;
    }

    build(): Record<string, unknown> {
        return { ...this.data };
    }
}

class UserBuilder extends FluentBuilder {
    setName(name: string): this {
        return this.set("name", name);
    }

    setAge(age: number): this {
        return this.set("age", age);
    }
}

// 链式调用返回正确的子类类型
const userData = new UserBuilder()
    .setName("张三")
    .setAge(25)
    .set("custom", "value")
    .build();

console.log("构建的用户:", userData);

// ============================================
// 9. 实际应用示例
// ============================================

// 示例: 状态机实现
type State = "idle" | "loading" | "success" | "error";

interface StateTransition {
    from: State;
    to: State;
    action: string;
}

class StateMachine {
    private currentState: State = "idle";
    private transitions: StateTransition[] = [
        { from: "idle", to: "loading", action: "fetch" },
        { from: "loading", to: "success", action: "resolve" },
        { from: "loading", to: "error", action: "reject" },
        { from: "success", to: "idle", action: "reset" },
        { from: "error", to: "idle", action: "reset" },
        { from: "error", to: "loading", action: "retry" }
    ];
    private listeners: Array<(state: State) => void> = [];

    getState(): State {
        return this.currentState;
    }

    canTransition(action: string): boolean {
        return this.transitions.some(
            t => t.from === this.currentState && t.action === action
        );
    }

    transition(action: string): boolean {
        const transition = this.transitions.find(
            t => t.from === this.currentState && t.action === action
        );

        if (transition) {
            this.currentState = transition.to;
            this.notifyListeners();
            return true;
        }

        console.log(`无法从 ${this.currentState} 执行 ${action}`);
        return false;
    }

    onStateChange(listener: (state: State) => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.currentState));
    }
}

const machine = new StateMachine();
machine.onStateChange(state => console.log(`状态变化: ${state}`));

console.log("当前状态:", machine.getState());
machine.transition("fetch");
machine.transition("resolve");
machine.transition("reset");

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个银行账户类
 */
class BankAccount {
    private balance: number = 0;
    private transactions: Array<{
        type: "deposit" | "withdraw";
        amount: number;
        date: Date;
    }> = [];

    constructor(
        public readonly accountNumber: string,
        public readonly owner: string,
        initialDeposit: number = 0
    ) {
        if (initialDeposit > 0) {
            this.deposit(initialDeposit);
        }
    }

    deposit(amount: number): boolean {
        if (amount <= 0) {
            console.log("存款金额必须大于零");
            return false;
        }
        this.balance += amount;
        this.transactions.push({
            type: "deposit",
            amount,
            date: new Date()
        });
        return true;
    }

    withdraw(amount: number): boolean {
        if (amount <= 0) {
            console.log("取款金额必须大于零");
            return false;
        }
        if (amount > this.balance) {
            console.log("余额不足");
            return false;
        }
        this.balance -= amount;
        this.transactions.push({
            type: "withdraw",
            amount,
            date: new Date()
        });
        return true;
    }

    getBalance(): number {
        return this.balance;
    }

    getTransactionHistory(): typeof this.transactions {
        return [...this.transactions];
    }
}

const account = new BankAccount("1234567890", "张三", 1000);
account.deposit(500);
account.withdraw(200);
console.log("练习 1 - 余额:", account.getBalance());
console.log("练习 1 - 交易记录:", account.getTransactionHistory().length, "条");

/**
 * 练习 2: 创建一个任务队列类
 */
class TaskQueue<T> {
    private queue: Array<{
        task: T;
        priority: number;
    }> = [];

    enqueue(task: T, priority: number = 0): void {
        this.queue.push({ task, priority });
        // 按优先级排序 (高优先级在前)
        this.queue.sort((a, b) => b.priority - a.priority);
    }

    dequeue(): T | undefined {
        const item = this.queue.shift();
        return item?.task;
    }

    peek(): T | undefined {
        return this.queue[0]?.task;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    size(): number {
        return this.queue.length;
    }

    clear(): void {
        this.queue = [];
    }
}

const taskQueue = new TaskQueue<string>();
taskQueue.enqueue("低优先级任务", 1);
taskQueue.enqueue("高优先级任务", 10);
taskQueue.enqueue("中优先级任务", 5);

console.log("练习 2 - 下一个任务:", taskQueue.dequeue());  // 高优先级任务
console.log("练习 2 - 队列大小:", taskQueue.size());

/**
 * 练习 3: 创建一个简单的依赖注入容器
 */
class Container {
    private services: Map<string, unknown> = new Map();
    private factories: Map<string, () => unknown> = new Map();

    register<T>(name: string, instance: T): void {
        this.services.set(name, instance);
    }

    registerFactory<T>(name: string, factory: () => T): void {
        this.factories.set(name, factory);
    }

    resolve<T>(name: string): T {
        // 先检查实例
        if (this.services.has(name)) {
            return this.services.get(name) as T;
        }

        // 再检查工厂
        if (this.factories.has(name)) {
            const factory = this.factories.get(name)!;
            const instance = factory() as T;
            this.services.set(name, instance);  // 缓存实例
            return instance;
        }

        throw new Error(`Service "${name}" not found`);
    }
}

// 使用示例
class Logger {
    log(message: string): void {
        console.log(`[LOG] ${message}`);
    }
}

class UserService {
    constructor(private logger: Logger) {}

    createUser(name: string): void {
        this.logger.log(`Creating user: ${name}`);
    }
}

const container = new Container();
container.register("logger", new Logger());
container.registerFactory("userService", () => {
    const logger = container.resolve<Logger>("logger");
    return new UserService(logger);
});

const userService = container.resolve<UserService>("userService");
userService.createUser("测试用户");

// 导出
export {
    Person,
    User,
    Calculator,
    Document,
    FluentBuilder,
    UserBuilder,
    StateMachine,
    BankAccount,
    TaskQueue,
    Container
};
