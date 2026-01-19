/**
 * 继承与多态 (Inheritance & Polymorphism)
 *
 * TypeScript 类支持单继承，通过 extends 关键字实现
 * 多态允许子类以不同方式实现父类的方法
 */

// ============================================
// 1. 基本继承
// ============================================

class Animal {
    constructor(
        public name: string,
        protected age: number
    ) {}

    speak(): void {
        console.log(`${this.name} 发出声音`);
    }

    move(distance: number): void {
        console.log(`${this.name} 移动了 ${distance} 米`);
    }
}

class Dog extends Animal {
    constructor(name: string, age: number, public breed: string) {
        super(name, age);  // 必须调用父类构造函数
    }

    // 重写父类方法
    speak(): void {
        console.log(`${this.name} 汪汪叫`);
    }

    // 新增方法
    fetch(): void {
        console.log(`${this.name} 去捡球`);
    }
}

const dog = new Dog("旺财", 3, "柴犬");
dog.speak();   // 旺财 汪汪叫
dog.move(10);  // 继承的方法
dog.fetch();   // 新增方法

// ============================================
// 2. super 关键字
// ============================================

class Cat extends Animal {
    constructor(name: string, age: number, private indoor: boolean) {
        super(name, age);
    }

    speak(): void {
        // 调用父类方法
        super.speak();
        console.log(`${this.name} 喵喵叫`);
    }

    getInfo(): string {
        return `${this.name}, ${this.age}岁, ${this.indoor ? "室内猫" : "室外猫"}`;
    }
}

const cat = new Cat("咪咪", 2, true);
cat.speak();
console.log(cat.getInfo());

// ============================================
// 3. 方法重写与多态
// ============================================

class Shape {
    constructor(public color: string) {}

    getArea(): number {
        return 0;
    }

    getDescription(): string {
        return `一个 ${this.color} 的形状`;
    }
}

class Circle extends Shape {
    constructor(color: string, public radius: number) {
        super(color);
    }

    // 重写方法
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }

    getDescription(): string {
        return `一个 ${this.color} 的圆，半径 ${this.radius}`;
    }
}

class Rectangle extends Shape {
    constructor(color: string, public width: number, public height: number) {
        super(color);
    }

    getArea(): number {
        return this.width * this.height;
    }

    getDescription(): string {
        return `一个 ${this.color} 的矩形，${this.width} x ${this.height}`;
    }
}

// 多态: 父类引用指向子类对象
const shapes: Shape[] = [
    new Circle("红色", 5),
    new Rectangle("蓝色", 10, 5),
    new Circle("绿色", 3)
];

// 统一处理不同类型的形状
let totalArea = 0;
for (const shape of shapes) {
    console.log(shape.getDescription());
    console.log(`面积: ${shape.getArea().toFixed(2)}`);
    totalArea += shape.getArea();
}
console.log(`总面积: ${totalArea.toFixed(2)}`);

// ============================================
// 4. instanceof 类型守卫
// ============================================

function processShape(shape: Shape): void {
    console.log(`处理: ${shape.getDescription()}`);

    if (shape instanceof Circle) {
        console.log(`圆的周长: ${(2 * Math.PI * shape.radius).toFixed(2)}`);
    } else if (shape instanceof Rectangle) {
        console.log(`矩形的周长: ${2 * (shape.width + shape.height)}`);
    }
}

processShape(new Circle("紫色", 7));
processShape(new Rectangle("橙色", 8, 4));

// ============================================
// 5. 多层继承
// ============================================

class Vehicle {
    constructor(public brand: string) {}

    start(): void {
        console.log(`${this.brand} 启动`);
    }

    stop(): void {
        console.log(`${this.brand} 停止`);
    }
}

class Car extends Vehicle {
    constructor(brand: string, public model: string) {
        super(brand);
    }

    drive(): void {
        console.log(`${this.brand} ${this.model} 行驶中`);
    }
}

class ElectricCar extends Car {
    constructor(brand: string, model: string, public batteryCapacity: number) {
        super(brand, model);
    }

    charge(): void {
        console.log(`${this.brand} ${this.model} 充电中，电池容量: ${this.batteryCapacity}kWh`);
    }

    // 重写启动方法
    start(): void {
        console.log(`${this.brand} ${this.model} 静默启动 (电动)`);
    }
}

const tesla = new ElectricCar("Tesla", "Model 3", 75);
tesla.start();    // 重写的方法
tesla.drive();    // 继承自 Car
tesla.charge();   // 自己的方法
tesla.stop();     // 继承自 Vehicle

// ============================================
// 6. 混入模式 (Mixins)
// ============================================

// TypeScript 不支持多继承，但可以使用混入模式

// 定义混入类型
type Constructor<T = {}> = new (...args: unknown[]) => T;

// 时间戳混入
function Timestamped<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        timestamp = Date.now();

        getTimestamp(): string {
            return new Date(this.timestamp).toISOString();
        }
    };
}

// 可激活混入
function Activatable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        isActive = false;

        activate(): void {
            this.isActive = true;
        }

        deactivate(): void {
            this.isActive = false;
        }
    };
}

// 可标记混入
function Taggable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        tags: string[] = [];

        addTag(tag: string): void {
            if (!this.tags.includes(tag)) {
                this.tags.push(tag);
            }
        }

        removeTag(tag: string): void {
            const index = this.tags.indexOf(tag);
            if (index > -1) {
                this.tags.splice(index, 1);
            }
        }
    };
}

// 基类
class BaseEntity {
    constructor(public id: string, public name: string) {}
}

// 应用混入
const EnhancedEntity = Taggable(Activatable(Timestamped(BaseEntity)));

const entity = new EnhancedEntity("1", "测试实体");
entity.activate();
entity.addTag("important");
entity.addTag("featured");
console.log("混入实体:", {
    id: entity.id,
    name: entity.name,
    isActive: entity.isActive,
    tags: entity.tags,
    timestamp: entity.getTimestamp()
});

// ============================================
// 7. 实际应用: 组件继承
// ============================================

abstract class Component {
    protected element: string | null = null;

    constructor(public id: string) {}

    abstract render(): string;

    mount(container: string): void {
        this.element = this.render();
        console.log(`将组件 ${this.id} 挂载到 ${container}`);
        console.log(`渲染内容: ${this.element}`);
    }

    unmount(): void {
        console.log(`卸载组件 ${this.id}`);
        this.element = null;
    }
}

class Button extends Component {
    constructor(
        id: string,
        private label: string,
        private onClick: () => void
    ) {
        super(id);
    }

    render(): string {
        return `<button id="${this.id}">${this.label}</button>`;
    }

    click(): void {
        console.log(`按钮 ${this.id} 被点击`);
        this.onClick();
    }
}

class Input extends Component {
    private value: string = "";

    constructor(
        id: string,
        private placeholder: string
    ) {
        super(id);
    }

    render(): string {
        return `<input id="${this.id}" placeholder="${this.placeholder}" value="${this.value}" />`;
    }

    setValue(value: string): void {
        this.value = value;
        console.log(`输入框 ${this.id} 值变为: ${value}`);
    }

    getValue(): string {
        return this.value;
    }
}

class Form extends Component {
    private children: Component[] = [];

    constructor(id: string) {
        super(id);
    }

    addChild(child: Component): void {
        this.children.push(child);
    }

    render(): string {
        const childrenHtml = this.children.map(c => c.render()).join("\n");
        return `<form id="${this.id}">\n${childrenHtml}\n</form>`;
    }

    submit(): void {
        console.log(`表单 ${this.id} 提交`);
    }
}

const form = new Form("loginForm");
form.addChild(new Input("username", "请输入用户名"));
form.addChild(new Input("password", "请输入密码"));
form.addChild(new Button("submitBtn", "登录", () => form.submit()));
form.mount("#app");

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个支付方式继承体系
 */
abstract class PaymentMethod {
    constructor(public name: string) {}

    abstract pay(amount: number): boolean;
    abstract getDetails(): string;

    formatAmount(amount: number): string {
        return `¥${amount.toFixed(2)}`;
    }
}

class CreditCard extends PaymentMethod {
    constructor(
        private cardNumber: string,
        private expiryDate: string
    ) {
        super("信用卡");
    }

    pay(amount: number): boolean {
        console.log(`使用信用卡 **** ${this.cardNumber.slice(-4)} 支付 ${this.formatAmount(amount)}`);
        return true;
    }

    getDetails(): string {
        return `信用卡: **** ${this.cardNumber.slice(-4)}, 有效期: ${this.expiryDate}`;
    }
}

class AlipayPayment extends PaymentMethod {
    constructor(private account: string) {
        super("支付宝");
    }

    pay(amount: number): boolean {
        console.log(`使用支付宝账户 ${this.account} 支付 ${this.formatAmount(amount)}`);
        return true;
    }

    getDetails(): string {
        return `支付宝账户: ${this.account}`;
    }
}

class WeChatPayment extends PaymentMethod {
    constructor(private openId: string) {
        super("微信支付");
    }

    pay(amount: number): boolean {
        console.log(`使用微信支付 ${this.formatAmount(amount)}`);
        return true;
    }

    getDetails(): string {
        return `微信 OpenID: ${this.openId.slice(0, 8)}...`;
    }
}

// 支付处理器
class PaymentProcessor {
    process(method: PaymentMethod, amount: number): void {
        console.log(`\n处理支付: ${method.name}`);
        console.log(`支付信息: ${method.getDetails()}`);
        const success = method.pay(amount);
        console.log(`支付${success ? "成功" : "失败"}`);
    }
}

const processor = new PaymentProcessor();
processor.process(new CreditCard("1234567890123456", "12/25"), 99.99);
processor.process(new AlipayPayment("user@example.com"), 199.99);
processor.process(new WeChatPayment("wx_openid_123456789"), 49.99);

/**
 * 练习 2: 创建一个游戏角色继承体系
 */
abstract class GameCharacter {
    protected health: number;
    protected maxHealth: number;

    constructor(
        public name: string,
        maxHealth: number,
        public level: number = 1
    ) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }

    abstract attack(target: GameCharacter): number;
    abstract specialAbility(): void;

    takeDamage(damage: number): void {
        this.health = Math.max(0, this.health - damage);
        console.log(`${this.name} 受到 ${damage} 点伤害，剩余生命: ${this.health}/${this.maxHealth}`);
    }

    heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
        console.log(`${this.name} 恢复 ${amount} 点生命，当前生命: ${this.health}/${this.maxHealth}`);
    }

    isAlive(): boolean {
        return this.health > 0;
    }
}

class Warrior extends GameCharacter {
    private rage: number = 0;

    constructor(name: string, level: number = 1) {
        super(name, 100 + level * 20, level);
    }

    attack(target: GameCharacter): number {
        const damage = 10 + this.level * 2;
        console.log(`${this.name} 挥剑攻击 ${target.name}!`);
        target.takeDamage(damage);
        this.rage += 10;
        return damage;
    }

    specialAbility(): void {
        if (this.rage >= 50) {
            console.log(`${this.name} 使用狂暴一击!`);
            this.rage = 0;
        } else {
            console.log(`${this.name} 怒气不足 (${this.rage}/50)`);
        }
    }
}

class Mage extends GameCharacter {
    private mana: number;
    private maxMana: number;

    constructor(name: string, level: number = 1) {
        super(name, 60 + level * 10, level);
        this.maxMana = 100 + level * 15;
        this.mana = this.maxMana;
    }

    attack(target: GameCharacter): number {
        const damage = 15 + this.level * 3;
        console.log(`${this.name} 释放魔法弹攻击 ${target.name}!`);
        target.takeDamage(damage);
        return damage;
    }

    specialAbility(): void {
        const manaCost = 30;
        if (this.mana >= manaCost) {
            console.log(`${this.name} 使用火球术!`);
            this.mana -= manaCost;
        } else {
            console.log(`${this.name} 法力不足 (${this.mana}/${this.maxMana})`);
        }
    }
}

// 战斗模拟
const warrior = new Warrior("亚瑟", 5);
const mage = new Mage("梅林", 5);

console.log("\n=== 战斗开始 ===");
warrior.attack(mage);
mage.attack(warrior);
warrior.specialAbility();
mage.specialAbility();

// 导出
export {
    Animal,
    Dog,
    Cat,
    Shape,
    Circle,
    Rectangle,
    Vehicle,
    Car,
    ElectricCar,
    Component,
    Button,
    Input,
    Form,
    PaymentMethod,
    CreditCard,
    GameCharacter,
    Warrior,
    Mage
};
