/**
 * 访问修饰符 (Access Modifiers)
 *
 * TypeScript 提供三种访问修饰符: public, private, protected
 * 还有 readonly 修饰符用于只读属性
 */

// ============================================
// 1. public 修饰符
// ============================================

class Animal {
    // public 是默认修饰符，可以省略
    public name: string;
    public age: number;

    public constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    public speak(): void {
        console.log(`${this.name} 发出声音`);
    }
}

const animal = new Animal("动物", 5);
console.log(animal.name);  // OK: public 属性可以在外部访问
animal.speak();            // OK: public 方法可以在外部调用

// ============================================
// 2. private 修饰符
// ============================================

class BankAccount {
    public accountNumber: string;
    private balance: number;
    private pin: string;

    constructor(accountNumber: string, initialBalance: number, pin: string) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.pin = pin;
    }

    // 公开方法访问私有属性
    public getBalance(inputPin: string): number | null {
        if (this.validatePin(inputPin)) {
            return this.balance;
        }
        return null;
    }

    public deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
            console.log(`存入 ${amount}，余额: ${this.balance}`);
        }
    }

    public withdraw(amount: number, inputPin: string): boolean {
        if (!this.validatePin(inputPin)) {
            console.log("PIN 码错误");
            return false;
        }
        if (amount > this.balance) {
            console.log("余额不足");
            return false;
        }
        this.balance -= amount;
        console.log(`取出 ${amount}，余额: ${this.balance}`);
        return true;
    }

    // 私有方法只能在类内部调用
    private validatePin(inputPin: string): boolean {
        return this.pin === inputPin;
    }
}

const account = new BankAccount("123456", 1000, "1234");
console.log("账号:", account.accountNumber);  // OK
// console.log(account.balance);  // Error: 私有属性
// console.log(account.pin);      // Error: 私有属性
// account.validatePin("1234");   // Error: 私有方法

console.log("余额:", account.getBalance("1234"));
account.withdraw(100, "1234");

// ============================================
// 3. ES2022 私有字段 (#)
// ============================================

class SecureData {
    // 使用 # 前缀定义真正的私有字段 (运行时强制)
    #secret: string;
    #data: Map<string, unknown> = new Map();

    constructor(secret: string) {
        this.#secret = secret;
    }

    setData(key: string, value: unknown, inputSecret: string): boolean {
        if (inputSecret !== this.#secret) {
            return false;
        }
        this.#data.set(key, value);
        return true;
    }

    getData(key: string, inputSecret: string): unknown {
        if (inputSecret !== this.#secret) {
            return undefined;
        }
        return this.#data.get(key);
    }
}

const secure = new SecureData("mySecret");
secure.setData("password", "123456", "mySecret");
console.log("安全数据:", secure.getData("password", "mySecret"));
// console.log(secure.#secret);  // Error: 私有字段

// ============================================
// 4. protected 修饰符
// ============================================

class Person {
    public name: string;
    protected age: number;  // 子类可以访问
    private ssn: string;    // 子类不能访问

    constructor(name: string, age: number, ssn: string) {
        this.name = name;
        this.age = age;
        this.ssn = ssn;
    }

    protected getAgeGroup(): string {
        if (this.age < 18) return "未成年";
        if (this.age < 60) return "成年";
        return "老年";
    }

    public getInfo(): string {
        return `${this.name}, ${this.getAgeGroup()}`;
    }
}

class Employee extends Person {
    public department: string;

    constructor(name: string, age: number, ssn: string, department: string) {
        super(name, age, ssn);
        this.department = department;
    }

    public getEmployeeInfo(): string {
        // 可以访问 protected 属性和方法
        return `${this.name} (${this.age}岁), 部门: ${this.department}`;
        // return this.ssn;  // Error: 不能访问 private 属性
    }

    public getBirthYear(): number {
        // 可以访问 protected 属性
        return new Date().getFullYear() - this.age;
    }
}

const employee = new Employee("张三", 30, "123-45-6789", "技术部");
console.log(employee.getEmployeeInfo());
console.log("出生年:", employee.getBirthYear());
// console.log(employee.age);  // Error: protected 属性不能在类外部访问

// ============================================
// 5. protected 构造函数
// ============================================

class Singleton {
    private static instance: Singleton;
    public value: number;

    // protected 构造函数阻止直接实例化
    protected constructor(value: number) {
        this.value = value;
    }

    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton(42);
        }
        return Singleton.instance;
    }
}

// const s = new Singleton(10);  // Error: 构造函数是 protected
const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();
console.log("单例相同:", singleton1 === singleton2);  // true

// ============================================
// 6. readonly 修饰符
// ============================================

class Config {
    // readonly 属性只能在声明时或构造函数中赋值
    readonly apiUrl: string;
    readonly version: string = "1.0.0";
    readonly features: readonly string[];  // 只读数组

    constructor(apiUrl: string, features: string[]) {
        this.apiUrl = apiUrl;
        this.features = features;
    }

    // 不能修改只读属性
    // updateUrl(url: string): void {
    //     this.apiUrl = url;  // Error
    // }
}

const config = new Config("https://api.example.com", ["feature1", "feature2"]);
console.log("配置:", config.apiUrl, config.version);
// config.apiUrl = "new-url";  // Error: 只读属性
// config.features.push("new");  // Error: 只读数组

// ============================================
// 7. 访问修饰符与接口
// ============================================

interface IService {
    // 接口只能定义 public 成员
    name: string;
    execute(): void;
}

class Service implements IService {
    public name: string;
    private logger: Console;

    constructor(name: string) {
        this.name = name;
        this.logger = console;
    }

    public execute(): void {
        this.log(`执行服务: ${this.name}`);
    }

    private log(message: string): void {
        this.logger.log(`[Service] ${message}`);
    }
}

const service = new Service("DataService");
service.execute();

// ============================================
// 8. 实际应用示例
// ============================================

// 示例: 用户认证系统
interface IUser {
    id: string;
    username: string;
    email: string;
}

class AuthService {
    private users: Map<string, IUser & { passwordHash: string }> = new Map();
    private currentUser: IUser | null = null;
    private readonly saltRounds: number = 10;

    // 私有方法: 模拟密码哈希
    private hashPassword(password: string): string {
        // 简化实现，实际应使用 bcrypt 等库
        return `hashed_${password}_${this.saltRounds}`;
    }

    private verifyPassword(password: string, hash: string): boolean {
        return this.hashPassword(password) === hash;
    }

    // 受保护方法: 子类可以扩展
    protected generateId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 公开方法
    public register(username: string, email: string, password: string): IUser | null {
        // 检查用户是否存在
        for (const user of this.users.values()) {
            if (user.username === username || user.email === email) {
                console.log("用户名或邮箱已存在");
                return null;
            }
        }

        const id = this.generateId();
        const passwordHash = this.hashPassword(password);
        const user = { id, username, email, passwordHash };
        this.users.set(id, user);

        // 返回用户信息 (不含密码)
        return { id, username, email };
    }

    public login(username: string, password: string): boolean {
        for (const user of this.users.values()) {
            if (user.username === username && this.verifyPassword(password, user.passwordHash)) {
                this.currentUser = { id: user.id, username: user.username, email: user.email };
                console.log(`登录成功: ${username}`);
                return true;
            }
        }
        console.log("用户名或密码错误");
        return false;
    }

    public logout(): void {
        if (this.currentUser) {
            console.log(`用户 ${this.currentUser.username} 已登出`);
            this.currentUser = null;
        }
    }

    public getCurrentUser(): IUser | null {
        return this.currentUser;
    }

    public isAuthenticated(): boolean {
        return this.currentUser !== null;
    }
}

// 扩展认证服务
class EnhancedAuthService extends AuthService {
    private loginAttempts: Map<string, number> = new Map();
    private readonly maxAttempts: number = 3;

    // 覆盖 generateId 使用不同的格式
    protected generateId(): string {
        return `enhanced_${super.generateId()}`;
    }

    // 增强登录方法
    public login(username: string, password: string): boolean {
        const attempts = this.loginAttempts.get(username) || 0;

        if (attempts >= this.maxAttempts) {
            console.log(`账户 ${username} 已被锁定`);
            return false;
        }

        const result = super.login(username, password);

        if (!result) {
            this.loginAttempts.set(username, attempts + 1);
            console.log(`剩余尝试次数: ${this.maxAttempts - attempts - 1}`);
        } else {
            this.loginAttempts.delete(username);
        }

        return result;
    }
}

const auth = new EnhancedAuthService();
auth.register("testuser", "test@example.com", "password123");
auth.login("testuser", "wrongpassword");
auth.login("testuser", "password123");
console.log("当前用户:", auth.getCurrentUser());

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个受保护的配置管理器
 */
class ConfigManager {
    private static instance: ConfigManager;
    private config: Map<string, unknown> = new Map();
    private readonly protectedKeys: Set<string> = new Set(["apiKey", "secret"]);

    private constructor() {}

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    public set(key: string, value: unknown): void {
        this.config.set(key, value);
    }

    public get<T>(key: string): T | undefined {
        return this.config.get(key) as T | undefined;
    }

    // 受保护的键只能通过特定方法设置
    public setProtected(key: string, value: unknown, adminKey: string): boolean {
        if (adminKey !== "admin123") {
            console.log("无权限设置受保护的配置");
            return false;
        }
        this.config.set(key, value);
        this.protectedKeys.add(key);
        return true;
    }

    public getAllKeys(): string[] {
        return Array.from(this.config.keys()).filter(
            key => !this.protectedKeys.has(key)
        );
    }
}

const configManager = ConfigManager.getInstance();
configManager.set("theme", "dark");
configManager.setProtected("apiKey", "secret-key", "admin123");
console.log("练习 1 - 配置键:", configManager.getAllKeys());

/**
 * 练习 2: 创建一个访问控制的日志系统
 */
type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
    private static logHistory: Array<{
        level: LogLevel;
        message: string;
        timestamp: Date;
    }> = [];

    private level: LogLevel;
    protected prefix: string;

    constructor(prefix: string, level: LogLevel = "info") {
        this.prefix = prefix;
        this.level = level;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ["debug", "info", "warn", "error"];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }

    private formatMessage(level: LogLevel, message: string): string {
        return `[${new Date().toISOString()}] [${level.toUpperCase()}] [${this.prefix}] ${message}`;
    }

    protected addToHistory(level: LogLevel, message: string): void {
        Logger.logHistory.push({
            level,
            message,
            timestamp: new Date()
        });
    }

    public debug(message: string): void {
        if (this.shouldLog("debug")) {
            console.log(this.formatMessage("debug", message));
            this.addToHistory("debug", message);
        }
    }

    public info(message: string): void {
        if (this.shouldLog("info")) {
            console.log(this.formatMessage("info", message));
            this.addToHistory("info", message);
        }
    }

    public warn(message: string): void {
        if (this.shouldLog("warn")) {
            console.warn(this.formatMessage("warn", message));
            this.addToHistory("warn", message);
        }
    }

    public error(message: string): void {
        if (this.shouldLog("error")) {
            console.error(this.formatMessage("error", message));
            this.addToHistory("error", message);
        }
    }

    public static getHistory(): typeof Logger.logHistory {
        return [...Logger.logHistory];
    }
}

const logger = new Logger("App", "info");
logger.debug("这条不会显示");
logger.info("应用启动");
logger.warn("内存使用率高");
console.log("练习 2 - 日志历史:", Logger.getHistory().length, "条");

// 导出
export {
    Animal,
    BankAccount,
    SecureData,
    Person,
    Employee,
    Singleton,
    Config,
    AuthService,
    EnhancedAuthService,
    ConfigManager,
    Logger
};
