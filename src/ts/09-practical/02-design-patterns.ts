/**
 * 设计模式 (Design Patterns)
 *
 * 使用 TypeScript 实现常见的设计模式
 */

// ============================================
// 1. 单例模式 (Singleton)
// ============================================

class Singleton {
    private static instance: Singleton;
    private data: Map<string, unknown> = new Map();

    private constructor() {
        console.log("Singleton 实例创建");
    }

    static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    set(key: string, value: unknown): void {
        this.data.set(key, value);
    }

    get<T>(key: string): T | undefined {
        return this.data.get(key) as T | undefined;
    }
}

// 使用
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log("单例模式 - 是否相同实例:", s1 === s2);

s1.set("name", "TypeScript");
console.log("单例模式 - 获取数据:", s2.get("name"));

// ============================================
// 2. 工厂模式 (Factory)
// ============================================

interface Product {
    name: string;
    price: number;
    getDescription(): string;
}

class Book implements Product {
    constructor(
        public name: string,
        public price: number,
        public author: string
    ) {}

    getDescription(): string {
        return `书籍: ${this.name} by ${this.author} - ¥${this.price}`;
    }
}

class Electronic implements Product {
    constructor(
        public name: string,
        public price: number,
        public warranty: number
    ) {}

    getDescription(): string {
        return `电子产品: ${this.name} - ¥${this.price} (保修${this.warranty}年)`;
    }
}

class Clothing implements Product {
    constructor(
        public name: string,
        public price: number,
        public size: string
    ) {}

    getDescription(): string {
        return `服装: ${this.name} (${this.size}) - ¥${this.price}`;
    }
}

// 工厂类
class ProductFactory {
    static create(type: "book", name: string, price: number, extra: string): Book;
    static create(type: "electronic", name: string, price: number, extra: number): Electronic;
    static create(type: "clothing", name: string, price: number, extra: string): Clothing;
    static create(type: string, name: string, price: number, extra: unknown): Product {
        switch (type) {
            case "book":
                return new Book(name, price, extra as string);
            case "electronic":
                return new Electronic(name, price, extra as number);
            case "clothing":
                return new Clothing(name, price, extra as string);
            default:
                throw new Error(`未知产品类型: ${type}`);
        }
    }
}

// 使用
const book = ProductFactory.create("book", "TypeScript 入门", 99, "张三");
const phone = ProductFactory.create("electronic", "智能手机", 4999, 2);
console.log("工厂模式:", book.getDescription());
console.log("工厂模式:", phone.getDescription());

// ============================================
// 3. 观察者模式 (Observer)
// ============================================

interface Observer<T> {
    update(data: T): void;
}

interface Subject<T> {
    subscribe(observer: Observer<T>): void;
    unsubscribe(observer: Observer<T>): void;
    notify(data: T): void;
}

class EventEmitter<T> implements Subject<T> {
    private observers: Set<Observer<T>> = new Set();

    subscribe(observer: Observer<T>): void {
        this.observers.add(observer);
    }

    unsubscribe(observer: Observer<T>): void {
        this.observers.delete(observer);
    }

    notify(data: T): void {
        this.observers.forEach(observer => observer.update(data));
    }
}

// 具体观察者
class Logger implements Observer<string> {
    constructor(private name: string) {}

    update(data: string): void {
        console.log(`[${this.name}] 收到消息: ${data}`);
    }
}

// 使用
const emitter = new EventEmitter<string>();
const logger1 = new Logger("Logger1");
const logger2 = new Logger("Logger2");

emitter.subscribe(logger1);
emitter.subscribe(logger2);
emitter.notify("观察者模式测试消息");

emitter.unsubscribe(logger1);
emitter.notify("Logger1 已取消订阅");

// ============================================
// 4. 策略模式 (Strategy)
// ============================================

interface PaymentStrategy {
    pay(amount: number): void;
    getName(): string;
}

class CreditCardPayment implements PaymentStrategy {
    constructor(private cardNumber: string) {}

    pay(amount: number): void {
        console.log(`使用信用卡 ****${this.cardNumber.slice(-4)} 支付 ¥${amount}`);
    }

    getName(): string {
        return "信用卡";
    }
}

class AlipayPayment implements PaymentStrategy {
    constructor(private account: string) {}

    pay(amount: number): void {
        console.log(`使用支付宝 ${this.account} 支付 ¥${amount}`);
    }

    getName(): string {
        return "支付宝";
    }
}

class WechatPayment implements PaymentStrategy {
    pay(amount: number): void {
        console.log(`使用微信支付 ¥${amount}`);
    }

    getName(): string {
        return "微信支付";
    }
}

class PaymentContext {
    private strategy: PaymentStrategy;

    constructor(strategy: PaymentStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: PaymentStrategy): void {
        this.strategy = strategy;
    }

    executePayment(amount: number): void {
        console.log(`当前支付方式: ${this.strategy.getName()}`);
        this.strategy.pay(amount);
    }
}

// 使用
const payment = new PaymentContext(new CreditCardPayment("1234567890123456"));
payment.executePayment(100);

payment.setStrategy(new AlipayPayment("user@example.com"));
payment.executePayment(200);

// ============================================
// 5. 装饰器模式 (Decorator)
// ============================================

interface Coffee {
    getDescription(): string;
    getCost(): number;
}

class SimpleCoffee implements Coffee {
    getDescription(): string {
        return "简单咖啡";
    }

    getCost(): number {
        return 10;
    }
}

// 装饰器基类
abstract class CoffeeDecorator implements Coffee {
    constructor(protected coffee: Coffee) {}

    abstract getDescription(): string;
    abstract getCost(): number;
}

class MilkDecorator extends CoffeeDecorator {
    getDescription(): string {
        return `${this.coffee.getDescription()} + 牛奶`;
    }

    getCost(): number {
        return this.coffee.getCost() + 2;
    }
}

class SugarDecorator extends CoffeeDecorator {
    getDescription(): string {
        return `${this.coffee.getDescription()} + 糖`;
    }

    getCost(): number {
        return this.coffee.getCost() + 1;
    }
}

class WhippedCreamDecorator extends CoffeeDecorator {
    getDescription(): string {
        return `${this.coffee.getDescription()} + 奶油`;
    }

    getCost(): number {
        return this.coffee.getCost() + 3;
    }
}

// 使用
let coffee: Coffee = new SimpleCoffee();
console.log(`装饰器模式: ${coffee.getDescription()} - ¥${coffee.getCost()}`);

coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhippedCreamDecorator(coffee);
console.log(`装饰器模式: ${coffee.getDescription()} - ¥${coffee.getCost()}`);

// ============================================
// 6. 适配器模式 (Adapter)
// ============================================

// 旧接口
interface OldAPI {
    request(xml: string): string;
}

class LegacyService implements OldAPI {
    request(xml: string): string {
        console.log("处理 XML:", xml);
        return "<response>OK</response>";
    }
}

// 新接口
interface NewAPI {
    fetch(json: object): object;
}

// 适配器
class APIAdapter implements NewAPI {
    constructor(private legacyService: OldAPI) {}

    fetch(json: object): object {
        // 将 JSON 转换为 XML
        const xml = this.jsonToXml(json);
        // 调用旧接口
        const xmlResponse = this.legacyService.request(xml);
        // 将响应转换回 JSON
        return this.xmlToJson(xmlResponse);
    }

    private jsonToXml(json: object): string {
        // 简化实现
        return `<request>${JSON.stringify(json)}</request>`;
    }

    private xmlToJson(xml: string): object {
        // 简化实现
        return { response: xml };
    }
}

// 使用
const legacyService = new LegacyService();
const adapter = new APIAdapter(legacyService);
const result = adapter.fetch({ action: "getData" });
console.log("适配器模式:", result);

// ============================================
// 7. 建造者模式 (Builder)
// ============================================

interface User {
    name: string;
    email: string;
    age?: number;
    phone?: string;
    address?: string;
}

class UserBuilder {
    private user: Partial<User> = {};

    setName(name: string): this {
        this.user.name = name;
        return this;
    }

    setEmail(email: string): this {
        this.user.email = email;
        return this;
    }

    setAge(age: number): this {
        this.user.age = age;
        return this;
    }

    setPhone(phone: string): this {
        this.user.phone = phone;
        return this;
    }

    setAddress(address: string): this {
        this.user.address = address;
        return this;
    }

    build(): User {
        if (!this.user.name || !this.user.email) {
            throw new Error("name 和 email 是必需的");
        }
        return this.user as User;
    }
}

// 使用
const user = new UserBuilder()
    .setName("张三")
    .setEmail("zhangsan@example.com")
    .setAge(25)
    .setPhone("13800138000")
    .build();

console.log("建造者模式:", user);

// ============================================
// 8. 命令模式 (Command)
// ============================================

interface Command {
    execute(): void;
    undo(): void;
}

class TextEditor {
    private content: string = "";

    getContent(): string {
        return this.content;
    }

    setContent(content: string): void {
        this.content = content;
    }

    append(text: string): void {
        this.content += text;
    }

    deleteLast(count: number): void {
        this.content = this.content.slice(0, -count);
    }
}

class AppendCommand implements Command {
    private previousContent: string = "";

    constructor(
        private editor: TextEditor,
        private text: string
    ) {}

    execute(): void {
        this.previousContent = this.editor.getContent();
        this.editor.append(this.text);
    }

    undo(): void {
        this.editor.setContent(this.previousContent);
    }
}

class CommandManager {
    private history: Command[] = [];
    private redoStack: Command[] = [];

    execute(command: Command): void {
        command.execute();
        this.history.push(command);
        this.redoStack = [];  // 清空重做栈
    }

    undo(): void {
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo(): void {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.history.push(command);
        }
    }
}

// 使用
const editor = new TextEditor();
const commandManager = new CommandManager();

commandManager.execute(new AppendCommand(editor, "Hello "));
commandManager.execute(new AppendCommand(editor, "World"));
console.log("命令模式 - 当前内容:", editor.getContent());

commandManager.undo();
console.log("命令模式 - 撤销后:", editor.getContent());

commandManager.redo();
console.log("命令模式 - 重做后:", editor.getContent());

// ============================================
// 9. 状态模式 (State)
// ============================================

interface State {
    handle(context: TrafficLight): void;
    getName(): string;
}

class RedState implements State {
    handle(context: TrafficLight): void {
        console.log("红灯 -> 绿灯");
        context.setState(new GreenState());
    }

    getName(): string {
        return "红灯";
    }
}

class GreenState implements State {
    handle(context: TrafficLight): void {
        console.log("绿灯 -> 黄灯");
        context.setState(new YellowState());
    }

    getName(): string {
        return "绿灯";
    }
}

class YellowState implements State {
    handle(context: TrafficLight): void {
        console.log("黄灯 -> 红灯");
        context.setState(new RedState());
    }

    getName(): string {
        return "黄灯";
    }
}

class TrafficLight {
    private state: State;

    constructor() {
        this.state = new RedState();
    }

    setState(state: State): void {
        this.state = state;
    }

    change(): void {
        console.log(`当前: ${this.state.getName()}`);
        this.state.handle(this);
    }
}

// 使用
const light = new TrafficLight();
light.change();  // 红 -> 绿
light.change();  // 绿 -> 黄
light.change();  // 黄 -> 红

// ============================================
// 10. 代理模式 (Proxy)
// ============================================

interface Image {
    display(): void;
}

class RealImage implements Image {
    constructor(private filename: string) {
        this.loadFromDisk();
    }

    private loadFromDisk(): void {
        console.log(`从磁盘加载图片: ${this.filename}`);
    }

    display(): void {
        console.log(`显示图片: ${this.filename}`);
    }
}

class ProxyImage implements Image {
    private realImage: RealImage | null = null;

    constructor(private filename: string) {}

    display(): void {
        if (!this.realImage) {
            this.realImage = new RealImage(this.filename);
        }
        this.realImage.display();
    }
}

// 使用
console.log("--- 代理模式 ---");
const image = new ProxyImage("test.jpg");
console.log("图片对象已创建，但未加载");
image.display();  // 首次调用时才加载
image.display();  // 不会重复加载

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 实现一个简单的依赖注入容器
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
        if (this.services.has(name)) {
            return this.services.get(name) as T;
        }

        if (this.factories.has(name)) {
            const factory = this.factories.get(name)!;
            const instance = factory() as T;
            this.services.set(name, instance);
            return instance;
        }

        throw new Error(`服务 "${name}" 未注册`);
    }
}

// 使用
const container = new Container();
container.registerFactory("logger", () => ({
    log: (msg: string) => console.log(`[LOG] ${msg}`)
}));

const logger = container.resolve<{ log: (msg: string) => void }>("logger");
logger.log("练习 1 - 依赖注入成功!");

/**
 * 练习 2: 实现一个简单的发布订阅系统
 */
class PubSub {
    private channels: Map<string, Set<(data: unknown) => void>> = new Map();

    subscribe(channel: string, callback: (data: unknown) => void): () => void {
        if (!this.channels.has(channel)) {
            this.channels.set(channel, new Set());
        }
        this.channels.get(channel)!.add(callback);

        return () => {
            this.channels.get(channel)?.delete(callback);
        };
    }

    publish(channel: string, data: unknown): void {
        this.channels.get(channel)?.forEach(callback => callback(data));
    }
}

// 使用
const pubsub = new PubSub();
const unsubscribe = pubsub.subscribe("news", (data) => {
    console.log("练习 2 - 收到新闻:", data);
});

pubsub.publish("news", { title: "TypeScript 5.0 发布!" });
unsubscribe();
pubsub.publish("news", { title: "这条不会收到" });

// 导出
export {
    Singleton,
    ProductFactory,
    EventEmitter,
    PaymentContext,
    CoffeeDecorator,
    APIAdapter,
    UserBuilder,
    CommandManager,
    TrafficLight,
    ProxyImage,
    Container,
    PubSub
};
