/**
 * 静态成员 (Static Members)
 *
 * 静态成员属于类本身而不是实例
 * 使用 static 关键字声明
 */

// ============================================
// 1. 静态属性
// ============================================

class Counter {
    // 静态属性属于类，所有实例共享
    static count: number = 0;

    // 实例属性属于每个实例
    id: number;

    constructor() {
        Counter.count++;
        this.id = Counter.count;
    }

    static getCount(): number {
        return Counter.count;
    }

    static reset(): void {
        Counter.count = 0;
    }
}

const c1 = new Counter();
const c2 = new Counter();
const c3 = new Counter();

console.log("实例 ID:", c1.id, c2.id, c3.id);  // 1, 2, 3
console.log("总计数:", Counter.getCount());     // 3

// ============================================
// 2. 静态方法
// ============================================

class MathUtils {
    // 静态方法不能访问 this (没有实例)
    static readonly PI: number = 3.14159265359;

    static add(a: number, b: number): number {
        return a + b;
    }

    static multiply(a: number, b: number): number {
        return a * b;
    }

    static circleArea(radius: number): number {
        return MathUtils.PI * radius ** 2;
    }

    static factorial(n: number): number {
        if (n <= 1) return 1;
        return n * MathUtils.factorial(n - 1);
    }

    // 私有构造函数阻止实例化
    private constructor() {}
}

console.log("加法:", MathUtils.add(5, 3));
console.log("圆面积:", MathUtils.circleArea(5).toFixed(2));
console.log("阶乘:", MathUtils.factorial(5));

// const utils = new MathUtils();  // Error: 构造函数是私有的

// ============================================
// 3. 静态块 (Static Blocks)
// ============================================

class Config {
    static environment: string;
    static apiUrl: string;
    static debug: boolean;

    // 静态块: 用于复杂的静态初始化
    static {
        // 模拟环境检测
        const env = "development";  // 实际可能从环境变量读取

        Config.environment = env;
        Config.debug = env !== "production";

        if (env === "production") {
            Config.apiUrl = "https://api.example.com";
        } else if (env === "staging") {
            Config.apiUrl = "https://staging-api.example.com";
        } else {
            Config.apiUrl = "http://localhost:3000";
        }

        console.log(`配置已初始化: ${Config.environment}`);
    }

    private constructor() {}

    static getConfig(): { env: string; api: string; debug: boolean } {
        return {
            env: Config.environment,
            api: Config.apiUrl,
            debug: Config.debug
        };
    }
}

console.log("配置:", Config.getConfig());

// ============================================
// 4. 单例模式
// ============================================

class Singleton {
    private static instance: Singleton | null = null;
    private data: Map<string, unknown> = new Map();

    // 私有构造函数
    private constructor() {
        console.log("Singleton 实例已创建");
    }

    // 获取唯一实例
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

const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log("是同一实例:", instance1 === instance2);  // true

instance1.set("name", "张三");
console.log("从 instance2 获取:", instance2.get("name"));  // 张三

// ============================================
// 5. 静态成员与继承
// ============================================

class Animal {
    static kingdom: string = "动物界";
    static count: number = 0;

    constructor(public name: string) {
        Animal.count++;
    }

    static getInfo(): string {
        return `${this.kingdom}，共 ${this.count} 个`;
    }
}

class Dog extends Animal {
    static kingdom: string = "动物界-犬科";
    static dogCount: number = 0;

    constructor(name: string, public breed: string) {
        super(name);
        Dog.dogCount++;
    }

    static getInfo(): string {
        return `${this.kingdom}，共 ${this.dogCount} 只狗`;
    }
}

const animal1 = new Animal("动物1");
const dog1 = new Dog("旺财", "柴犬");
const dog2 = new Dog("小黑", "拉布拉多");

console.log(Animal.getInfo());  // 动物界，共 3 个
console.log(Dog.getInfo());     // 动物界-犬科，共 2 只狗

// ============================================
// 6. 静态属性的访问修饰符
// ============================================

class Database {
    private static instance: Database;
    private static readonly MAX_CONNECTIONS: number = 10;
    protected static connectionCount: number = 0;

    public static timeout: number = 5000;

    private constructor() {}

    public static connect(): Database {
        if (Database.connectionCount >= Database.MAX_CONNECTIONS) {
            throw new Error("连接数已达上限");
        }
        if (!Database.instance) {
            Database.instance = new Database();
        }
        Database.connectionCount++;
        return Database.instance;
    }

    public static getConnectionCount(): number {
        return Database.connectionCount;
    }
}

const db = Database.connect();
console.log("数据库连接数:", Database.getConnectionCount());
console.log("超时设置:", Database.timeout);
// console.log(Database.MAX_CONNECTIONS);  // Error: 私有属性

// ============================================
// 7. 工厂模式
// ============================================

abstract class Vehicle {
    abstract getDescription(): string;
}

class Car extends Vehicle {
    constructor(
        private brand: string,
        private model: string
    ) {
        super();
    }

    getDescription(): string {
        return `汽车: ${this.brand} ${this.model}`;
    }
}

class Motorcycle extends Vehicle {
    constructor(
        private brand: string,
        private cc: number
    ) {
        super();
    }

    getDescription(): string {
        return `摩托车: ${this.brand} ${this.cc}cc`;
    }
}

class Bicycle extends Vehicle {
    constructor(private type: string) {
        super();
    }

    getDescription(): string {
        return `自行车: ${this.type}`;
    }
}

// 工厂类
class VehicleFactory {
    private static vehicles: Map<string, Vehicle> = new Map();

    static createCar(brand: string, model: string): Car {
        const key = `car_${brand}_${model}`;
        if (!this.vehicles.has(key)) {
            this.vehicles.set(key, new Car(brand, model));
        }
        return this.vehicles.get(key) as Car;
    }

    static createMotorcycle(brand: string, cc: number): Motorcycle {
        return new Motorcycle(brand, cc);
    }

    static createBicycle(type: string): Bicycle {
        return new Bicycle(type);
    }

    static getCreatedCount(): number {
        return this.vehicles.size;
    }
}

const car1 = VehicleFactory.createCar("特斯拉", "Model 3");
const car2 = VehicleFactory.createCar("特斯拉", "Model 3");  // 返回缓存的实例
const motorcycle = VehicleFactory.createMotorcycle("哈雷", 1200);

console.log(car1.getDescription());
console.log(motorcycle.getDescription());
console.log("是同一实例:", car1 === car2);  // true (工厂缓存)

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 日志管理器
type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
    private static instance: Logger;
    private static logs: Array<{
        level: LogLevel;
        message: string;
        timestamp: Date;
    }> = [];

    private static level: LogLevel = "info";
    private static readonly LEVEL_ORDER: LogLevel[] = ["debug", "info", "warn", "error"];

    private constructor(private prefix: string) {}

    static create(prefix: string): Logger {
        return new Logger(prefix);
    }

    static setLevel(level: LogLevel): void {
        Logger.level = level;
    }

    static getHistory(): typeof Logger.logs {
        return [...Logger.logs];
    }

    static clearHistory(): void {
        Logger.logs = [];
    }

    private shouldLog(level: LogLevel): boolean {
        const currentIndex = Logger.LEVEL_ORDER.indexOf(Logger.level);
        const targetIndex = Logger.LEVEL_ORDER.indexOf(level);
        return targetIndex >= currentIndex;
    }

    private log(level: LogLevel, message: string): void {
        if (!this.shouldLog(level)) return;

        const entry = {
            level,
            message: `[${this.prefix}] ${message}`,
            timestamp: new Date()
        };

        Logger.logs.push(entry);
        console.log(`[${entry.timestamp.toISOString()}] [${level.toUpperCase()}] ${entry.message}`);
    }

    debug(message: string): void {
        this.log("debug", message);
    }

    info(message: string): void {
        this.log("info", message);
    }

    warn(message: string): void {
        this.log("warn", message);
    }

    error(message: string): void {
        this.log("error", message);
    }
}

const appLogger = Logger.create("App");
const dbLogger = Logger.create("Database");

Logger.setLevel("info");

appLogger.debug("这条不会显示");
appLogger.info("应用启动");
dbLogger.info("数据库连接成功");
appLogger.warn("内存使用率高");

console.log("日志历史:", Logger.getHistory().length, "条");

// 示例 2: 缓存管理器
class CacheManager<T> {
    private static caches: Map<string, CacheManager<unknown>> = new Map();
    private cache: Map<string, { value: T; expiry: number }> = new Map();

    private constructor(private name: string) {}

    static getCache<T>(name: string): CacheManager<T> {
        if (!CacheManager.caches.has(name)) {
            CacheManager.caches.set(name, new CacheManager<T>(name));
        }
        return CacheManager.caches.get(name) as CacheManager<T>;
    }

    static clearAll(): void {
        CacheManager.caches.forEach(cache => cache.clear());
    }

    set(key: string, value: T, ttlMs: number = 60000): void {
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttlMs
        });
    }

    get(key: string): T | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return undefined;
        }

        return entry.value;
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

const userCache = CacheManager.getCache<{ name: string }>("users");
const productCache = CacheManager.getCache<{ price: number }>("products");

userCache.set("u1", { name: "张三" });
productCache.set("p1", { price: 99.99 });

console.log("用户缓存:", userCache.get("u1"));
console.log("产品缓存:", productCache.get("p1"));

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个 ID 生成器
 */
class IdGenerator {
    private static counters: Map<string, number> = new Map();
    private static readonly DEFAULT_PREFIX = "ID";

    static generate(prefix: string = IdGenerator.DEFAULT_PREFIX): string {
        const count = (IdGenerator.counters.get(prefix) || 0) + 1;
        IdGenerator.counters.set(prefix, count);
        return `${prefix}_${count.toString().padStart(6, "0")}`;
    }

    static generateUUID(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static reset(prefix?: string): void {
        if (prefix) {
            IdGenerator.counters.delete(prefix);
        } else {
            IdGenerator.counters.clear();
        }
    }
}

console.log("练习 1 - ID:", IdGenerator.generate("USER"));
console.log("练习 1 - ID:", IdGenerator.generate("USER"));
console.log("练习 1 - ID:", IdGenerator.generate("ORDER"));
console.log("练习 1 - UUID:", IdGenerator.generateUUID());

/**
 * 练习 2: 创建一个事件总线
 */
type EventCallback = (...args: unknown[]) => void;

class EventBus {
    private static instance: EventBus;
    private events: Map<string, Set<EventCallback>> = new Map();

    private constructor() {}

    static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    on(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)!.add(callback);
    }

    off(event: string, callback: EventCallback): void {
        this.events.get(event)?.delete(callback);
    }

    emit(event: string, ...args: unknown[]): void {
        this.events.get(event)?.forEach(callback => callback(...args));
    }

    once(event: string, callback: EventCallback): void {
        const onceCallback: EventCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}

const bus = EventBus.getInstance();
bus.on("userLogin", (user: unknown) => console.log("用户登录:", user));
bus.emit("userLogin", { id: 1, name: "张三" });

/**
 * 练习 3: 创建一个对象池
 */
class ObjectPool<T> {
    private available: T[] = [];
    private inUse: Set<T> = new Set();

    constructor(
        private factory: () => T,
        private reset: (obj: T) => void,
        initialSize: number = 0
    ) {
        for (let i = 0; i < initialSize; i++) {
            this.available.push(factory());
        }
    }

    acquire(): T {
        let obj: T;
        if (this.available.length > 0) {
            obj = this.available.pop()!;
        } else {
            obj = this.factory();
        }
        this.inUse.add(obj);
        return obj;
    }

    release(obj: T): void {
        if (this.inUse.has(obj)) {
            this.inUse.delete(obj);
            this.reset(obj);
            this.available.push(obj);
        }
    }

    getStats(): { available: number; inUse: number } {
        return {
            available: this.available.length,
            inUse: this.inUse.size
        };
    }
}

// 使用对象池
interface Particle {
    x: number;
    y: number;
    active: boolean;
}

const particlePool = new ObjectPool<Particle>(
    () => ({ x: 0, y: 0, active: false }),
    (p) => { p.x = 0; p.y = 0; p.active = false; },
    10
);

const p1 = particlePool.acquire();
p1.x = 100;
p1.y = 200;
p1.active = true;

console.log("练习 3 - 对象池状态:", particlePool.getStats());
particlePool.release(p1);
console.log("练习 3 - 释放后:", particlePool.getStats());

// 导出
export {
    Counter,
    MathUtils,
    Config,
    Singleton,
    Database,
    VehicleFactory,
    Logger,
    CacheManager,
    IdGenerator,
    EventBus,
    ObjectPool
};
