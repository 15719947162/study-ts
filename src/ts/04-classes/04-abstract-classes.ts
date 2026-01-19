/**
 * 抽象类 (Abstract Classes)
 *
 * 抽象类是不能被直接实例化的类，用于定义子类必须实现的接口
 * 抽象类可以包含抽象方法和具体实现
 */

// ============================================
// 1. 基本抽象类
// ============================================

abstract class Shape {
    constructor(public name: string) {}

    // 抽象方法: 没有实现，子类必须实现
    abstract getArea(): number;
    abstract getPerimeter(): number;

    // 具体方法: 有实现，子类可以直接使用或重写
    describe(): string {
        return `这是一个 ${this.name}，面积: ${this.getArea().toFixed(2)}`;
    }

    // 可以调用抽象方法
    compareTo(other: Shape): number {
        return this.getArea() - other.getArea();
    }
}

// const shape = new Shape("形状");  // Error: 不能实例化抽象类

class Circle extends Shape {
    constructor(public radius: number) {
        super("圆形");
    }

    // 必须实现所有抽象方法
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }

    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(
        public width: number,
        public height: number
    ) {
        super("矩形");
    }

    getArea(): number {
        return this.width * this.height;
    }

    getPerimeter(): number {
        return 2 * (this.width + this.height);
    }
}

const circle = new Circle(5);
const rectangle = new Rectangle(10, 6);

console.log(circle.describe());
console.log(rectangle.describe());
console.log("圆形比矩形大:", circle.compareTo(rectangle) > 0);

// ============================================
// 2. 抽象属性
// ============================================

abstract class Vehicle {
    // 抽象属性
    abstract readonly wheels: number;
    abstract brand: string;

    // 具体属性
    protected speed: number = 0;

    // 抽象方法
    abstract start(): void;
    abstract stop(): void;

    // 具体方法
    accelerate(amount: number): void {
        this.speed += amount;
        console.log(`${this.brand} 加速到 ${this.speed} km/h`);
    }
}

class Car extends Vehicle {
    readonly wheels: number = 4;
    brand: string;

    constructor(brand: string) {
        super();
        this.brand = brand;
    }

    start(): void {
        console.log(`${this.brand} 汽车启动`);
    }

    stop(): void {
        this.speed = 0;
        console.log(`${this.brand} 汽车停止`);
    }
}

class Motorcycle extends Vehicle {
    readonly wheels: number = 2;

    constructor(public brand: string) {
        super();
    }

    start(): void {
        console.log(`${this.brand} 摩托车启动`);
    }

    stop(): void {
        this.speed = 0;
        console.log(`${this.brand} 摩托车停止`);
    }

    // 特有方法
    wheelie(): void {
        console.log(`${this.brand} 翘起前轮!`);
    }
}

const car = new Car("特斯拉");
const motorcycle = new Motorcycle("哈雷");

car.start();
car.accelerate(60);

motorcycle.start();
motorcycle.wheelie();

// ============================================
// 3. 抽象类继承抽象类
// ============================================

abstract class Animal {
    constructor(public name: string) {}

    abstract makeSound(): void;
    abstract move(): void;

    sleep(): void {
        console.log(`${this.name} 正在睡觉`);
    }
}

// 抽象类可以继承抽象类，不必实现所有方法
abstract class Mammal extends Animal {
    protected bodyTemperature: number = 37;

    // 实现部分抽象方法
    move(): void {
        console.log(`${this.name} 用四条腿走路`);
    }

    // 新增抽象方法
    abstract feed(): void;
}

class Dog extends Mammal {
    constructor(name: string, public breed: string) {
        super(name);
    }

    // 必须实现所有剩余的抽象方法
    makeSound(): void {
        console.log(`${this.name} 汪汪叫`);
    }

    feed(): void {
        console.log(`${this.name} 喂奶`);
    }

    // 可以重写父类方法
    move(): void {
        console.log(`${this.name} (${this.breed}) 跑来跑去`);
    }
}

const dog = new Dog("旺财", "柴犬");
dog.makeSound();
dog.move();
dog.feed();
dog.sleep();

// ============================================
// 4. 抽象类与接口的区别
// ============================================

// 接口: 纯粹的契约，没有实现
interface Flyable {
    fly(): void;
    land(): void;
    altitude: number;
}

// 抽象类: 可以有实现和状态
abstract class FlyingObject {
    protected altitude: number = 0;

    abstract takeOff(): void;

    fly(height: number): void {
        this.altitude = height;
        console.log(`飞行高度: ${this.altitude}m`);
    }

    land(): void {
        console.log("降落中...");
        this.altitude = 0;
    }
}

// 一个类可以继承一个抽象类并实现多个接口
interface Controllable {
    control(direction: string): void;
}

class Drone extends FlyingObject implements Flyable, Controllable {
    altitude: number = 0;

    takeOff(): void {
        console.log("无人机起飞");
        this.altitude = 10;
    }

    // 实现 Controllable 接口
    control(direction: string): void {
        console.log(`无人机向 ${direction} 移动`);
    }
}

const drone = new Drone();
drone.takeOff();
drone.fly(100);
drone.control("north");
drone.land();

// ============================================
// 5. 抽象类作为类型
// ============================================

// 抽象类可以作为类型使用
function printShapeInfo(shape: Shape): void {
    console.log(`形状: ${shape.name}`);
    console.log(`面积: ${shape.getArea()}`);
    console.log(`周长: ${shape.getPerimeter()}`);
}

printShapeInfo(circle);
printShapeInfo(rectangle);

// 抽象类数组
const shapes: Shape[] = [
    new Circle(3),
    new Rectangle(4, 5),
    new Circle(7)
];

console.log("--- 所有形状 ---");
shapes.forEach(s => console.log(s.describe()));

// ============================================
// 6. 实际应用示例
// ============================================

// 示例 1: 数据库连接抽象
abstract class DatabaseConnection {
    protected isConnected: boolean = false;

    constructor(
        protected host: string,
        protected port: number,
        protected database: string
    ) {}

    abstract connect(): Promise<boolean>;
    abstract disconnect(): Promise<void>;
    abstract query<T>(sql: string, params?: unknown[]): Promise<T[]>;

    // 通用方法
    getConnectionString(): string {
        return `${this.host}:${this.port}/${this.database}`;
    }

    isConnectionActive(): boolean {
        return this.isConnected;
    }
}

class MySQLConnection extends DatabaseConnection {
    async connect(): Promise<boolean> {
        console.log(`连接到 MySQL: ${this.getConnectionString()}`);
        this.isConnected = true;
        return true;
    }

    async disconnect(): Promise<void> {
        console.log("断开 MySQL 连接");
        this.isConnected = false;
    }

    async query<T>(sql: string, _params?: unknown[]): Promise<T[]> {
        console.log(`MySQL 执行: ${sql}`);
        return [] as T[];
    }
}

class PostgreSQLConnection extends DatabaseConnection {
    async connect(): Promise<boolean> {
        console.log(`连接到 PostgreSQL: ${this.getConnectionString()}`);
        this.isConnected = true;
        return true;
    }

    async disconnect(): Promise<void> {
        console.log("断开 PostgreSQL 连接");
        this.isConnected = false;
    }

    async query<T>(sql: string, _params?: unknown[]): Promise<T[]> {
        console.log(`PostgreSQL 执行: ${sql}`);
        return [] as T[];
    }
}

// 使用抽象类型
async function executeQuery(
    connection: DatabaseConnection,
    sql: string
): Promise<void> {
    if (!connection.isConnectionActive()) {
        await connection.connect();
    }
    await connection.query(sql);
}

const mysql = new MySQLConnection("localhost", 3306, "mydb");
const postgres = new PostgreSQLConnection("localhost", 5432, "mydb");

executeQuery(mysql, "SELECT * FROM users");
executeQuery(postgres, "SELECT * FROM products");

// 示例 2: 模板方法模式
abstract class DataProcessor {
    // 模板方法: 定义算法骨架
    process(): void {
        this.readData();
        this.processData();
        this.saveData();
    }

    // 具体方法
    protected readData(): void {
        console.log("读取数据...");
    }

    // 抽象方法: 子类必须实现
    protected abstract processData(): void;

    // 钩子方法: 子类可以选择重写
    protected saveData(): void {
        console.log("保存数据...");
    }
}

class CSVProcessor extends DataProcessor {
    protected processData(): void {
        console.log("处理 CSV 数据");
    }

    protected saveData(): void {
        console.log("保存为 CSV 文件");
    }
}

class JSONProcessor extends DataProcessor {
    protected processData(): void {
        console.log("处理 JSON 数据");
    }
}

console.log("--- CSV 处理 ---");
new CSVProcessor().process();

console.log("--- JSON 处理 ---");
new JSONProcessor().process();

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个支付系统抽象类
 */
abstract class PaymentProcessor {
    protected transactionId: string = "";

    constructor(protected amount: number) {}

    abstract validatePayment(): boolean;
    abstract processPayment(): Promise<boolean>;
    abstract getReceipt(): string;

    protected generateTransactionId(): string {
        this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        return this.transactionId;
    }
}

class CreditCardPayment extends PaymentProcessor {
    constructor(
        amount: number,
        private cardNumber: string,
        private cvv: string
    ) {
        super(amount);
    }

    validatePayment(): boolean {
        // 简单验证
        return this.cardNumber.length === 16 && this.cvv.length === 3;
    }

    async processPayment(): Promise<boolean> {
        if (!this.validatePayment()) {
            console.log("信用卡验证失败");
            return false;
        }
        this.generateTransactionId();
        console.log(`处理信用卡支付: ¥${this.amount}`);
        return true;
    }

    getReceipt(): string {
        return `信用卡支付收据\n交易ID: ${this.transactionId}\n金额: ¥${this.amount}\n卡号: ****${this.cardNumber.slice(-4)}`;
    }
}

class AlipayPayment extends PaymentProcessor {
    constructor(
        amount: number,
        private userId: string
    ) {
        super(amount);
    }

    validatePayment(): boolean {
        return this.userId.length > 0 && this.amount > 0;
    }

    async processPayment(): Promise<boolean> {
        if (!this.validatePayment()) {
            console.log("支付宝验证失败");
            return false;
        }
        this.generateTransactionId();
        console.log(`处理支付宝支付: ¥${this.amount}`);
        return true;
    }

    getReceipt(): string {
        return `支付宝支付收据\n交易ID: ${this.transactionId}\n金额: ¥${this.amount}\n用户: ${this.userId}`;
    }
}

async function processOrder(payment: PaymentProcessor): Promise<void> {
    const success = await payment.processPayment();
    if (success) {
        console.log(payment.getReceipt());
    }
}

const creditCard = new CreditCardPayment(99.99, "1234567890123456", "123");
const alipay = new AlipayPayment(199.99, "user@example.com");

processOrder(creditCard);
processOrder(alipay);

/**
 * 练习 2: 创建一个游戏角色抽象类
 */
abstract class GameCharacter {
    protected health: number;

    constructor(
        public name: string,
        protected maxHealth: number,
        protected attackPower: number
    ) {
        this.health = maxHealth;
    }

    abstract attack(target: GameCharacter): void;
    abstract defend(): void;
    abstract useSpecialAbility(): void;

    takeDamage(damage: number): void {
        this.health = Math.max(0, this.health - damage);
        console.log(`${this.name} 受到 ${damage} 点伤害，剩余生命: ${this.health}`);
    }

    heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
        console.log(`${this.name} 恢复 ${amount} 点生命，当前生命: ${this.health}`);
    }

    isAlive(): boolean {
        return this.health > 0;
    }

    getStatus(): string {
        return `${this.name}: ${this.health}/${this.maxHealth} HP`;
    }
}

class Warrior extends GameCharacter {
    private shield: number = 10;

    constructor(name: string) {
        super(name, 150, 20);
    }

    attack(target: GameCharacter): void {
        console.log(`${this.name} 挥剑攻击!`);
        target.takeDamage(this.attackPower);
    }

    defend(): void {
        this.shield += 5;
        console.log(`${this.name} 举起盾牌，防御力: ${this.shield}`);
    }

    useSpecialAbility(): void {
        console.log(`${this.name} 使用狂暴!`);
        this.attackPower *= 2;
    }
}

class Mage extends GameCharacter {
    private mana: number = 100;

    constructor(name: string) {
        super(name, 80, 35);
    }

    attack(target: GameCharacter): void {
        if (this.mana >= 10) {
            this.mana -= 10;
            console.log(`${this.name} 释放魔法飞弹!`);
            target.takeDamage(this.attackPower);
        } else {
            console.log(`${this.name} 魔力不足，使用法杖攻击`);
            target.takeDamage(10);
        }
    }

    defend(): void {
        console.log(`${this.name} 创建魔法护盾!`);
    }

    useSpecialAbility(): void {
        console.log(`${this.name} 释放火球术!`);
        this.mana -= 30;
    }
}

const warrior = new Warrior("亚瑟");
const mage = new Mage("梅林");

console.log("--- 战斗开始 ---");
warrior.attack(mage);
mage.attack(warrior);
warrior.defend();
mage.useSpecialAbility();
console.log(warrior.getStatus());
console.log(mage.getStatus());

// 导出
export {
    Shape,
    Circle,
    Rectangle,
    Vehicle,
    Car,
    Motorcycle,
    Animal,
    Mammal,
    Dog,
    DatabaseConnection,
    MySQLConnection,
    PostgreSQLConnection,
    PaymentProcessor,
    CreditCardPayment,
    AlipayPayment,
    GameCharacter,
    Warrior,
    Mage
};
