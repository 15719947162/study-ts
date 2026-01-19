/**
 * 泛型基础 (Generic Basics)
 *
 * 泛型允许我们创建可重用的组件，这些组件可以支持多种类型
 * 而不是单一的类型
 */

// ============================================
// 1. 为什么需要泛型
// ============================================

// 不使用泛型: 需要为每种类型写重复代码
function identityNumber(arg: number): number {
    return arg;
}

function identityString(arg: string): string {
    return arg;
}

// 使用 any: 丢失类型信息
function identityAny(arg: any): any {
    return arg;
}

// 使用泛型: 保留类型信息，又能复用
function identity<T>(arg: T): T {
    return arg;
}

// 调用泛型函数
const num = identity<number>(42);        // 显式指定类型
const str = identity("hello");           // 类型推断
const bool = identity(true);             // 类型推断

console.log("泛型调用:", num, str, bool);

// ============================================
// 2. 泛型函数
// ============================================

// 单个类型参数
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

console.log("第一个元素:", firstElement([1, 2, 3]));
console.log("第一个元素:", firstElement(["a", "b", "c"]));

// 多个类型参数
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

const p = pair("hello", 42);  // [string, number]
console.log("配对:", p);

// 类型参数在返回类型中使用
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
    return arr.map(fn);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = map(numbers, n => n * 2);
const stringified = map(numbers, n => n.toString());

console.log("映射结果:", doubled, stringified);

// ============================================
// 3. 泛型箭头函数
// ============================================

// 普通写法
const reverse = <T>(arr: T[]): T[] => {
    return [...arr].reverse();
};

// 在 JSX 中需要使用 extends 避免歧义
const reverseJsx = <T extends unknown>(arr: T[]): T[] => {
    return [...arr].reverse();
};

console.log("反转:", reverse([1, 2, 3]));

// ============================================
// 4. 泛型接口
// ============================================

// 泛型接口定义
interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
}

// 实现泛型接口
class Box<T> implements Container<T> {
    constructor(public value: T) {}

    getValue(): T {
        return this.value;
    }

    setValue(value: T): void {
        this.value = value;
    }
}

const numberBox = new Box(42);
const stringBox = new Box("hello");

console.log("Box 值:", numberBox.getValue(), stringBox.getValue());

// 泛型接口用于函数类型
interface Transformer<T, U> {
    (input: T): U;
}

const numberToString: Transformer<number, string> = (n) => n.toString();
const stringToNumber: Transformer<string, number> = (s) => parseInt(s, 10);

console.log("转换:", numberToString(42), stringToNumber("123"));

// ============================================
// 5. 泛型类
// ============================================

class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);
console.log("栈顶:", numberStack.peek());
console.log("弹出:", numberStack.pop());

// ============================================
// 6. 泛型类型别名
// ============================================

// 简单泛型类型
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

let nullableNumber: Nullable<number> = 42;
nullableNumber = null;

// 对象泛型类型
type Result<T, E = Error> =
    | { success: true; data: T }
    | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
    if (b === 0) {
        return { success: false, error: "除数不能为零" };
    }
    return { success: true, data: a / b };
}

console.log("除法:", divide(10, 2));
console.log("除法:", divide(10, 0));

// 递归泛型类型
type Tree<T> = {
    value: T;
    children: Tree<T>[];
};

const tree: Tree<string> = {
    value: "root",
    children: [
        { value: "child1", children: [] },
        { value: "child2", children: [
            { value: "grandchild", children: [] }
        ]}
    ]
};

// ============================================
// 7. 默认类型参数
// ============================================

interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    message: string;
}

// 使用默认类型
const response1: ApiResponse = {
    data: { foo: "bar" },
    status: 200,
    message: "OK"
};

// 指定类型
interface User { name: string; email: string; }
const response2: ApiResponse<User> = {
    data: { name: "张三", email: "zhangsan@example.com" },
    status: 200,
    message: "OK"
};

// 类的默认类型参数
class KeyValueStore<K = string, V = unknown> {
    private store = new Map<K, V>();

    set(key: K, value: V): void {
        this.store.set(key, value);
    }

    get(key: K): V | undefined {
        return this.store.get(key);
    }

    has(key: K): boolean {
        return this.store.has(key);
    }
}

const store = new KeyValueStore();  // 使用默认类型
store.set("name", "张三");
store.set("age", 25);

const typedStore = new KeyValueStore<number, string>();  // 指定类型
typedStore.set(1, "one");
typedStore.set(2, "two");

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 通用数据获取函数
async function fetchData<T>(url: string): Promise<Result<T, Error>> {
    try {
        // 模拟 API 调用
        console.log(`Fetching: ${url}`);
        const mockData = { id: 1, name: "Mock Data" } as T;
        return { success: true, data: mockData };
    } catch (error) {
        return { success: false, error: error as Error };
    }
}

// 示例 2: 事件发射器
class EventEmitter<EventMap extends Record<string, unknown[]>> {
    private listeners: {
        [K in keyof EventMap]?: Array<(...args: EventMap[K]) => void>;
    } = {};

    on<K extends keyof EventMap>(
        event: K,
        listener: (...args: EventMap[K]) => void
    ): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(listener);
    }

    emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]): void {
        const eventListeners = this.listeners[event];
        if (eventListeners) {
            eventListeners.forEach(listener => listener(...args));
        }
    }

    off<K extends keyof EventMap>(
        event: K,
        listener: (...args: EventMap[K]) => void
    ): void {
        const eventListeners = this.listeners[event];
        if (eventListeners) {
            this.listeners[event] = eventListeners.filter(l => l !== listener);
        }
    }
}

// 定义事件类型
interface AppEvents {
    login: [userId: number, username: string];
    logout: [userId: number];
    error: [error: Error];
}

const emitter = new EventEmitter<AppEvents>();

emitter.on("login", (userId, username) => {
    console.log(`用户登录: ${username} (ID: ${userId})`);
});

emitter.on("logout", (userId) => {
    console.log(`用户登出: ID ${userId}`);
});

emitter.emit("login", 1, "张三");
emitter.emit("logout", 1);

// 示例 3: 可观察对象
class Observable<T> {
    private observers: Array<(value: T) => void> = [];

    subscribe(observer: (value: T) => void): () => void {
        this.observers.push(observer);
        // 返回取消订阅函数
        return () => {
            const index = this.observers.indexOf(observer);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
        };
    }

    next(value: T): void {
        this.observers.forEach(observer => observer(value));
    }

    pipe<U>(transform: (value: T) => U): Observable<U> {
        const newObservable = new Observable<U>();
        this.subscribe(value => {
            newObservable.next(transform(value));
        });
        return newObservable;
    }
}

const numberObservable = new Observable<number>();
const stringObservable = numberObservable.pipe(n => `Value: ${n}`);

stringObservable.subscribe(console.log);
numberObservable.next(42);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 实现一个泛型队列
 */
class Queue<T> {
    private items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    front(): T | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

const queue = new Queue<string>();
queue.enqueue("first");
queue.enqueue("second");
console.log("练习 1 - 出队:", queue.dequeue());

/**
 * 练习 2: 实现一个泛型缓存
 */
class Cache<K, V> {
    private cache = new Map<K, { value: V; expiry: number }>();

    set(key: K, value: V, ttlMs: number = 60000): void {
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttlMs
        });
    }

    get(key: K): V | undefined {
        const item = this.cache.get(key);
        if (!item) return undefined;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return undefined;
        }

        return item.value;
    }

    delete(key: K): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    has(key: K): boolean {
        const item = this.cache.get(key);
        if (!item) return false;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
}

const cache = new Cache<string, number>();
cache.set("count", 42, 5000);
console.log("练习 2 - 缓存:", cache.get("count"));

/**
 * 练习 3: 实现一个泛型工厂函数
 */
interface Creator<T> {
    create(): T;
}

function createInstance<T>(creator: Creator<T>): T {
    return creator.create();
}

class UserCreator implements Creator<{ id: number; name: string }> {
    private idCounter = 0;

    create() {
        return {
            id: ++this.idCounter,
            name: `User${this.idCounter}`
        };
    }
}

const userCreator = new UserCreator();
console.log("练习 3 - 创建:", createInstance(userCreator));
console.log("练习 3 - 创建:", createInstance(userCreator));

// 导出
export {
    identity,
    firstElement,
    pair,
    map,
    Box,
    Stack,
    Result,
    EventEmitter,
    Observable,
    Queue,
    Cache
};
