/**
 * Getters 和 Setters (存取器)
 *
 * TypeScript 支持使用 get 和 set 关键字定义存取器
 * 存取器允许对属性的访问和赋值进行拦截
 */

// ============================================
// 1. 基本存取器
// ============================================

class Person {
    private _name: string = "";
    private _age: number = 0;

    // Getter: 获取属性时调用
    get name(): string {
        console.log("获取 name");
        return this._name;
    }

    // Setter: 设置属性时调用
    set name(value: string) {
        console.log("设置 name:", value);
        if (value.length < 2) {
            throw new Error("名字至少需要2个字符");
        }
        this._name = value;
    }

    get age(): number {
        return this._age;
    }

    set age(value: number) {
        if (value < 0 || value > 150) {
            throw new Error("年龄必须在 0-150 之间");
        }
        this._age = value;
    }
}

const person = new Person();
person.name = "张三";  // 调用 setter
console.log(person.name);  // 调用 getter

person.age = 25;
console.log("年龄:", person.age);

// person.name = "李";  // Error: 名字至少需要2个字符
// person.age = -5;     // Error: 年龄必须在 0-150 之间

// ============================================
// 2. 只读属性 (只有 getter)
// ============================================

class Circle {
    constructor(private _radius: number) {}

    get radius(): number {
        return this._radius;
    }

    // 只有 getter，没有 setter，属性是只读的
    get area(): number {
        return Math.PI * this._radius ** 2;
    }

    get circumference(): number {
        return 2 * Math.PI * this._radius;
    }

    // 可以通过方法修改内部状态
    scale(factor: number): void {
        this._radius *= factor;
    }
}

const circle = new Circle(5);
console.log("半径:", circle.radius);
console.log("面积:", circle.area.toFixed(2));
console.log("周长:", circle.circumference.toFixed(2));

// circle.area = 100;  // Error: 只读属性

circle.scale(2);
console.log("放大后面积:", circle.area.toFixed(2));

// ============================================
// 3. 只写属性 (只有 setter)
// ============================================

class PasswordManager {
    private _hashedPassword: string = "";

    // 只有 setter，不能直接获取密码
    set password(value: string) {
        // 简单的哈希模拟
        this._hashedPassword = `hashed_${value}_${Date.now()}`;
        console.log("密码已设置");
    }

    // 提供验证方法而不是直接获取密码
    validatePassword(input: string): boolean {
        return this._hashedPassword.includes(`hashed_${input}_`);
    }
}

const pm = new PasswordManager();
pm.password = "secret123";
// console.log(pm.password);  // Error: 只写属性

console.log("密码验证:", pm.validatePassword("secret123"));
console.log("密码验证:", pm.validatePassword("wrong"));

// ============================================
// 4. 计算属性
// ============================================

class Rectangle {
    constructor(
        private _width: number,
        private _height: number
    ) {}

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        if (value <= 0) throw new Error("宽度必须大于 0");
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        if (value <= 0) throw new Error("高度必须大于 0");
        this._height = value;
    }

    // 计算属性
    get area(): number {
        return this._width * this._height;
    }

    get perimeter(): number {
        return 2 * (this._width + this._height);
    }

    get isSquare(): boolean {
        return this._width === this._height;
    }

    // 可以通过 setter 间接设置多个属性
    set dimensions(value: { width: number; height: number }) {
        this.width = value.width;
        this.height = value.height;
    }
}

const rect = new Rectangle(10, 5);
console.log("面积:", rect.area);
console.log("周长:", rect.perimeter);
console.log("是正方形:", rect.isSquare);

rect.dimensions = { width: 8, height: 8 };
console.log("是正方形:", rect.isSquare);

// ============================================
// 5. 存取器与继承
// ============================================

class Animal {
    protected _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}

class Dog extends Animal {
    private _breed: string;

    constructor(name: string, breed: string) {
        super(name);
        this._breed = breed;
    }

    // 重写 getter
    get name(): string {
        return `🐕 ${super.name}`;  // 调用父类 getter
    }

    // 重写 setter
    set name(value: string) {
        super.name = value;  // 调用父类 setter
        console.log(`狗的名字改为: ${value}`);
    }

    get breed(): string {
        return this._breed;
    }

    // 组合属性
    get fullInfo(): string {
        return `${this.name} (${this._breed})`;
    }
}

const dog = new Dog("旺财", "柴犬");
console.log(dog.name);       // 🐕 旺财
console.log(dog.fullInfo);   // 🐕 旺财 (柴犬)

dog.name = "小黑";
console.log(dog.name);       // 🐕 小黑

// ============================================
// 6. 存取器与接口
// ============================================

interface HasLength {
    readonly length: number;
}

// 可以用 getter 实现只读接口属性
class MyString implements HasLength {
    constructor(private _value: string) {}

    get length(): number {
        return this._value.length;
    }

    get value(): string {
        return this._value;
    }

    set value(v: string) {
        this._value = v;
    }
}

const myStr = new MyString("Hello");
console.log("长度:", myStr.length);

myStr.value = "Hello World";
console.log("新长度:", myStr.length);

// ============================================
// 7. 延迟初始化
// ============================================

class ExpensiveResource {
    private _data: string[] | null = null;
    private _loadCount: number = 0;

    // 延迟加载: 只在第一次访问时初始化
    get data(): string[] {
        if (this._data === null) {
            console.log("首次加载数据...");
            this._data = this.loadData();
        }
        this._loadCount++;
        return this._data;
    }

    get loadCount(): number {
        return this._loadCount;
    }

    private loadData(): string[] {
        // 模拟耗时操作
        return ["item1", "item2", "item3"];
    }

    // 清除缓存，下次访问会重新加载
    clearCache(): void {
        this._data = null;
        this._loadCount = 0;
    }
}

const resource = new ExpensiveResource();
console.log("第一次访问:", resource.data);  // 会加载
console.log("第二次访问:", resource.data);  // 使用缓存
console.log("访问次数:", resource.loadCount);

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 表单验证
class FormField<T> {
    private _value: T;
    private _touched: boolean = false;
    private _errors: string[] = [];
    private validators: Array<(value: T) => string | null>;

    constructor(
        public name: string,
        initialValue: T,
        validators: Array<(value: T) => string | null> = []
    ) {
        this._value = initialValue;
        this.validators = validators;
    }

    get value(): T {
        return this._value;
    }

    set value(v: T) {
        this._value = v;
        this._touched = true;
        this.validate();
    }

    get touched(): boolean {
        return this._touched;
    }

    get errors(): string[] {
        return [...this._errors];
    }

    get isValid(): boolean {
        return this._errors.length === 0;
    }

    get hasErrors(): boolean {
        return this._touched && this._errors.length > 0;
    }

    private validate(): void {
        this._errors = [];
        for (const validator of this.validators) {
            const error = validator(this._value);
            if (error) {
                this._errors.push(error);
            }
        }
    }

    touch(): void {
        this._touched = true;
        this.validate();
    }

    reset(value: T): void {
        this._value = value;
        this._touched = false;
        this._errors = [];
    }
}

// 验证器
const required = (value: string) => value.length === 0 ? "此字段必填" : null;
const minLength = (min: number) => (value: string) =>
    value.length < min ? `至少需要 ${min} 个字符` : null;
const email = (value: string) =>
    !value.includes("@") ? "请输入有效的邮箱地址" : null;

const emailField = new FormField("email", "", [required, email]);
const passwordField = new FormField("password", "", [required, minLength(6)]);

emailField.value = "invalid";
console.log("邮箱错误:", emailField.errors);

emailField.value = "test@example.com";
console.log("邮箱有效:", emailField.isValid);

passwordField.value = "123";
console.log("密码错误:", passwordField.errors);

// 示例 2: 响应式数据
type Subscriber<T> = (value: T) => void;

class Observable<T> {
    private _value: T;
    private subscribers: Set<Subscriber<T>> = new Set();

    constructor(initialValue: T) {
        this._value = initialValue;
    }

    get value(): T {
        return this._value;
    }

    set value(newValue: T) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.notify();
        }
    }

    subscribe(subscriber: Subscriber<T>): () => void {
        this.subscribers.add(subscriber);
        // 返回取消订阅函数
        return () => this.subscribers.delete(subscriber);
    }

    private notify(): void {
        this.subscribers.forEach(subscriber => subscriber(this._value));
    }
}

const counter = new Observable(0);

const unsubscribe = counter.subscribe(value => {
    console.log(`计数器变化: ${value}`);
});

counter.value = 1;
counter.value = 2;
counter.value = 2;  // 相同值，不会触发通知
counter.value = 3;

unsubscribe();
counter.value = 4;  // 已取消订阅，不会打印

// 示例 3: 配置管理
class AppConfig {
    private _config: Map<string, unknown> = new Map();
    private _readonly: boolean = false;

    constructor(initialConfig: Record<string, unknown> = {}) {
        for (const [key, value] of Object.entries(initialConfig)) {
            this._config.set(key, value);
        }
    }

    get<T>(key: string): T | undefined {
        return this._config.get(key) as T | undefined;
    }

    set(key: string, value: unknown): void {
        if (this._readonly) {
            throw new Error("配置已锁定，无法修改");
        }
        this._config.set(key, value);
    }

    get isReadonly(): boolean {
        return this._readonly;
    }

    // 一旦设置为只读，不能改回来
    set readonly(value: boolean) {
        if (value && !this._readonly) {
            this._readonly = true;
            console.log("配置已锁定");
        }
    }

    get all(): Record<string, unknown> {
        return Object.fromEntries(this._config);
    }
}

const appConfig = new AppConfig({
    apiUrl: "https://api.example.com",
    timeout: 5000
});

console.log("API URL:", appConfig.get<string>("apiUrl"));
appConfig.set("debug", true);

appConfig.readonly = true;
// appConfig.set("newKey", "value");  // Error: 配置已锁定

console.log("所有配置:", appConfig.all);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个温度转换类
 */
class Temperature {
    private _celsius: number;

    constructor(celsius: number) {
        this._celsius = celsius;
    }

    get celsius(): number {
        return this._celsius;
    }

    set celsius(value: number) {
        if (value < -273.15) {
            throw new Error("温度不能低于绝对零度 (-273.15°C)");
        }
        this._celsius = value;
    }

    get fahrenheit(): number {
        return this._celsius * 9 / 5 + 32;
    }

    set fahrenheit(value: number) {
        this.celsius = (value - 32) * 5 / 9;
    }

    get kelvin(): number {
        return this._celsius + 273.15;
    }

    set kelvin(value: number) {
        this.celsius = value - 273.15;
    }

    toString(): string {
        return `${this._celsius.toFixed(1)}°C / ${this.fahrenheit.toFixed(1)}°F / ${this.kelvin.toFixed(1)}K`;
    }
}

const temp = new Temperature(25);
console.log("练习 1 - 温度:", temp.toString());

temp.fahrenheit = 98.6;
console.log("练习 1 - 华氏转换:", temp.toString());

temp.kelvin = 300;
console.log("练习 1 - 开尔文转换:", temp.toString());

/**
 * 练习 2: 创建一个购物车类
 */
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

class ShoppingCart {
    private _items: Map<string, CartItem> = new Map();
    private _discount: number = 0;

    get items(): CartItem[] {
        return Array.from(this._items.values());
    }

    get itemCount(): number {
        let count = 0;
        this._items.forEach(item => count += item.quantity);
        return count;
    }

    get subtotal(): number {
        let total = 0;
        this._items.forEach(item => total += item.price * item.quantity);
        return total;
    }

    get discount(): number {
        return this._discount;
    }

    set discount(percent: number) {
        if (percent < 0 || percent > 100) {
            throw new Error("折扣必须在 0-100 之间");
        }
        this._discount = percent;
    }

    get total(): number {
        return this.subtotal * (1 - this._discount / 100);
    }

    get isEmpty(): boolean {
        return this._items.size === 0;
    }

    addItem(item: Omit<CartItem, "quantity">, quantity: number = 1): void {
        const existing = this._items.get(item.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this._items.set(item.id, { ...item, quantity });
        }
    }

    removeItem(id: string): void {
        this._items.delete(id);
    }

    updateQuantity(id: string, quantity: number): void {
        const item = this._items.get(id);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = quantity;
            }
        }
    }

    clear(): void {
        this._items.clear();
        this._discount = 0;
    }
}

const cart = new ShoppingCart();
cart.addItem({ id: "1", name: "TypeScript 书籍", price: 99 }, 2);
cart.addItem({ id: "2", name: "JavaScript 书籍", price: 79 });

console.log("练习 2 - 商品数:", cart.itemCount);
console.log("练习 2 - 小计:", cart.subtotal);

cart.discount = 10;
console.log("练习 2 - 折后总价:", cart.total);

// 导出
export {
    Person,
    Circle,
    Rectangle,
    Animal,
    Dog,
    FormField,
    Observable,
    AppConfig,
    Temperature,
    ShoppingCart
};
