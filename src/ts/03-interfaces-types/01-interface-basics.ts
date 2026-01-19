/**
 * 接口基础 (Interface Basics)
 *
 * 接口是 TypeScript 中定义对象结构的主要方式
 * 它描述了对象应该具有的属性和方法
 */

// ============================================
// 1. 基本接口定义
// ============================================

interface Person {
    name: string;
    age: number;
}

const person: Person = {
    name: "张三",
    age: 25
};

console.log("Person:", person);

// 缺少属性会报错
// const invalidPerson: Person = { name: "李四" };  // Error: 缺少 age

// 多余属性会报错
// const extraPerson: Person = { name: "王五", age: 30, extra: "test" };  // Error

// ============================================
// 2. 可选属性
// ============================================

interface UserProfile {
    username: string;
    email: string;
    phone?: string;        // 可选
    bio?: string;          // 可选
    avatar?: string;       // 可选
}

const user1: UserProfile = {
    username: "zhangsan",
    email: "zhangsan@example.com"
};

const user2: UserProfile = {
    username: "lisi",
    email: "lisi@example.com",
    phone: "13800138000",
    bio: "前端开发者"
};

console.log("User 1:", user1);
console.log("User 2:", user2);

// ============================================
// 3. 只读属性
// ============================================

interface Config {
    readonly apiUrl: string;
    readonly apiKey: string;
    timeout: number;
}

const config: Config = {
    apiUrl: "https://api.example.com",
    apiKey: "secret-key-123",
    timeout: 5000
};

// config.apiUrl = "new-url";  // Error: 无法分配到 "apiUrl"，因为它是只读属性
config.timeout = 10000;  // OK

console.log("Config:", config);

// ReadonlyArray
const readonlyNumbers: ReadonlyArray<number> = [1, 2, 3, 4, 5];
// readonlyNumbers.push(6);  // Error
// readonlyNumbers[0] = 10;  // Error

// ============================================
// 4. 方法定义
// ============================================

interface Calculator {
    // 方法签名方式 1
    add(a: number, b: number): number;
    // 方法签名方式 2 (属性签名)
    subtract: (a: number, b: number) => number;
    // 可选方法
    multiply?(a: number, b: number): number;
}

const calc: Calculator = {
    add(a, b) {
        return a + b;
    },
    subtract: (a, b) => a - b,
    multiply(a, b) {
        return a * b;
    }
};

console.log("加法:", calc.add(10, 5));
console.log("减法:", calc.subtract(10, 5));
console.log("乘法:", calc.multiply?.(10, 5));

// ============================================
// 5. 函数接口
// ============================================

// 使用接口定义函数类型
interface SearchFunc {
    (source: string, keyword: string): boolean;
}

const search: SearchFunc = (source, keyword) => {
    return source.includes(keyword);
};

console.log("搜索:", search("Hello TypeScript", "Type"));

// 带有属性的函数接口
interface Counter {
    (): number;           // 调用签名
    count: number;        // 属性
    reset(): void;        // 方法
}

function createCounter(): Counter {
    const counter = (() => counter.count++) as Counter;
    counter.count = 0;
    counter.reset = () => { counter.count = 0; };
    return counter;
}

const myCounter = createCounter();
console.log("计数:", myCounter());  // 0
console.log("计数:", myCounter());  // 1
console.log("计数:", myCounter());  // 2
myCounter.reset();
console.log("重置后:", myCounter.count);  // 0

// ============================================
// 6. 构造函数接口
// ============================================

interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
    tick(): void;
    getTime(): string;
}

class DigitalClock implements ClockInterface {
    constructor(private hour: number, private minute: number) {}

    tick(): void {
        console.log("数字时钟: beep beep");
    }

    getTime(): string {
        return `${this.hour}:${this.minute.toString().padStart(2, "0")}`;
    }
}

function createClock(
    ctor: ClockConstructor,
    hour: number,
    minute: number
): ClockInterface {
    return new ctor(hour, minute);
}

const clock = createClock(DigitalClock, 14, 30);
console.log("时间:", clock.getTime());
clock.tick();

// ============================================
// 7. 接口的声明合并
// ============================================

// 同名接口会自动合并
interface Box {
    width: number;
    height: number;
}

interface Box {
    depth: number;
    color?: string;
}

// 等同于:
// interface Box {
//     width: number;
//     height: number;
//     depth: number;
//     color?: string;
// }

const box: Box = {
    width: 100,
    height: 50,
    depth: 30
};

console.log("Box:", box);

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: API 响应接口
interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
    timestamp: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface PaginatedData<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

type UserListResponse = ApiResponse<PaginatedData<User>>;

const response: UserListResponse = {
    code: 200,
    message: "success",
    data: {
        items: [
            { id: 1, name: "张三", email: "zhangsan@example.com" },
            { id: 2, name: "李四", email: "lisi@example.com" }
        ],
        total: 100,
        page: 1,
        pageSize: 10,
        hasMore: true
    },
    timestamp: Date.now()
};

console.log("API 响应:", response);

// 示例 2: 表单配置接口
interface FormField {
    name: string;
    label: string;
    type: "text" | "number" | "email" | "password" | "select";
    required?: boolean;
    placeholder?: string;
    defaultValue?: string | number;
    options?: Array<{ label: string; value: string | number }>;
    validators?: Array<{
        type: "required" | "email" | "min" | "max" | "pattern";
        value?: unknown;
        message: string;
    }>;
}

interface FormConfig {
    title: string;
    fields: FormField[];
    submitLabel?: string;
    onSubmit: (values: Record<string, unknown>) => void;
}

const loginForm: FormConfig = {
    title: "用户登录",
    fields: [
        {
            name: "email",
            label: "邮箱",
            type: "email",
            required: true,
            placeholder: "请输入邮箱",
            validators: [
                { type: "required", message: "邮箱不能为空" },
                { type: "email", message: "请输入有效的邮箱地址" }
            ]
        },
        {
            name: "password",
            label: "密码",
            type: "password",
            required: true,
            validators: [
                { type: "required", message: "密码不能为空" },
                { type: "min", value: 6, message: "密码至少6个字符" }
            ]
        }
    ],
    submitLabel: "登录",
    onSubmit: (values) => {
        console.log("表单提交:", values);
    }
};

console.log("表单配置:", loginForm.title);

// 示例 3: 事件接口
interface EventTarget {
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
    dispatchEvent(event: Event): boolean;
}

interface Event {
    type: string;
    target: EventTarget | null;
    timestamp: number;
}

interface EventListener {
    (event: Event): void;
}

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 定义一个博客文章接口
 */
interface BlogPost {
    id: number;
    title: string;
    content: string;
    author: {
        id: number;
        name: string;
        avatar?: string;
    };
    tags: string[];
    createdAt: Date;
    updatedAt?: Date;
    published: boolean;
    views: number;
    likes: number;
}

const post: BlogPost = {
    id: 1,
    title: "TypeScript 入门指南",
    content: "TypeScript 是 JavaScript 的超集...",
    author: {
        id: 1,
        name: "张三",
        avatar: "https://example.com/avatar.jpg"
    },
    tags: ["TypeScript", "前端", "教程"],
    createdAt: new Date(),
    published: true,
    views: 1000,
    likes: 50
};

console.log("练习 1 - 博客文章:", post.title);

/**
 * 练习 2: 定义一个购物车接口
 */
interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface ShoppingCart {
    items: CartItem[];
    readonly userId: number;
    couponCode?: string;
    getTotal(): number;
    addItem(item: CartItem): void;
    removeItem(productId: number): void;
    clear(): void;
}

const cart: ShoppingCart = {
    userId: 123,
    items: [],
    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    addItem(item) {
        const existing = this.items.find(i => i.productId === item.productId);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
    },
    removeItem(productId) {
        const index = this.items.findIndex(i => i.productId === productId);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    },
    clear() {
        this.items = [];
    }
};

cart.addItem({ productId: 1, name: "TypeScript 书籍", price: 99, quantity: 2 });
cart.addItem({ productId: 2, name: "JavaScript 书籍", price: 79, quantity: 1 });
console.log("练习 2 - 购物车总价:", cart.getTotal());

/**
 * 练习 3: 定义一个数据库连接接口
 */
interface DatabaseConnection {
    readonly host: string;
    readonly port: number;
    readonly database: string;
    connected: boolean;
    connect(): Promise<boolean>;
    disconnect(): Promise<void>;
    query<T>(sql: string, params?: unknown[]): Promise<T[]>;
}

// 模拟实现
const db: DatabaseConnection = {
    host: "localhost",
    port: 5432,
    database: "myapp",
    connected: false,
    async connect() {
        console.log(`连接到 ${this.host}:${this.port}/${this.database}`);
        this.connected = true;
        return true;
    },
    async disconnect() {
        console.log("断开连接");
        this.connected = false;
    },
    async query<T>(sql: string, _params?: unknown[]): Promise<T[]> {
        console.log("执行查询:", sql);
        return [] as T[];
    }
};

console.log("练习 3 - 数据库:", db.host);

// 导出
export {
    Person,
    UserProfile,
    Config,
    Calculator,
    ApiResponse,
    FormConfig,
    BlogPost,
    ShoppingCart,
    DatabaseConnection
};
