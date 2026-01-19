/**
 * 回调函数与高阶函数 (Callbacks & Higher-Order Functions)
 *
 * 高阶函数是接受函数作为参数或返回函数的函数
 * TypeScript 为回调函数和高阶函数提供了完整的类型支持
 */

// ============================================
// 1. 回调函数类型基础
// ============================================

// 基本回调类型定义
type Callback = (error: Error | null, result: string) => void;

function fetchData(url: string, callback: Callback): void {
    // 模拟异步操作
    setTimeout(() => {
        if (url.startsWith("http")) {
            callback(null, `Data from ${url}`);
        } else {
            callback(new Error("Invalid URL"), "");
        }
    }, 100);
}

fetchData("https://api.example.com", (error, result) => {
    if (error) {
        console.log("错误:", error.message);
    } else {
        console.log("结果:", result);
    }
});

// ============================================
// 2. 泛型回调函数
// ============================================

// 定义泛型回调类型
type AsyncCallback<T> = (error: Error | null, data: T | null) => void;

function loadUser(id: number, callback: AsyncCallback<{ name: string; id: number }>): void {
    setTimeout(() => {
        callback(null, { name: "张三", id });
    }, 100);
}

loadUser(1, (error, user) => {
    if (user) {
        console.log("用户:", user.name);  // TypeScript 知道 user 的类型
    }
});

// ============================================
// 3. 高阶函数基础
// ============================================

// 接受函数作为参数
function repeat(times: number, action: (index: number) => void): void {
    for (let i = 0; i < times; i++) {
        action(i);
    }
}

repeat(3, (i) => console.log(`第 ${i + 1} 次执行`));

// 返回函数
function createMultiplier(factor: number): (value: number) => number {
    return (value) => value * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("双倍:", double(5));
console.log("三倍:", triple(5));

// ============================================
// 4. 函数组合
// ============================================

// compose: 从右到左组合函数
function compose<A, B, C>(
    f: (b: B) => C,
    g: (a: A) => B
): (a: A) => C {
    return (a) => f(g(a));
}

const addOne = (x: number) => x + 1;
const square = (x: number) => x * x;
const addOneThenSquare = compose(square, addOne);

console.log("组合 (3+1)²:", addOneThenSquare(3));  // 16

// pipe: 从左到右组合函数
function pipe<A, B, C>(
    f: (a: A) => B,
    g: (b: B) => C
): (a: A) => C {
    return (a) => g(f(a));
}

const squareThenAddOne = pipe(square, addOne);
console.log("管道 3²+1:", squareThenAddOne(3));  // 10

// 多参数 pipe
type PipeFn<T> = (arg: T) => T;

function pipeMany<T>(...fns: PipeFn<T>[]): PipeFn<T> {
    return (arg) => fns.reduce((acc, fn) => fn(acc), arg);
}

const pipeline = pipeMany(
    (x: number) => x + 1,
    (x: number) => x * 2,
    (x: number) => x - 3
);
console.log("多函数管道:", pipeline(5));  // ((5+1)*2)-3 = 9

// ============================================
// 5. 柯里化 (Currying)
// ============================================

// 手动柯里化
function curry2<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {
    return (a) => (b) => fn(a, b);
}

function add(a: number, b: number): number {
    return a + b;
}

const curriedAdd = curry2(add);
console.log("柯里化加法:", curriedAdd(5)(3));  // 8

// 三参数柯里化
function curry3<A, B, C, R>(
    fn: (a: A, b: B, c: C) => R
): (a: A) => (b: B) => (c: C) => R {
    return (a) => (b) => (c) => fn(a, b, c);
}

function volume(length: number, width: number, height: number): number {
    return length * width * height;
}

const curriedVolume = curry3(volume);
console.log("柯里化体积:", curriedVolume(2)(3)(4));  // 24

// ============================================
// 6. 部分应用 (Partial Application)
// ============================================

function partial<A, B, R>(fn: (a: A, b: B) => R, a: A): (b: B) => R {
    return (b) => fn(a, b);
}

function greet(greeting: string, name: string): string {
    return `${greeting}, ${name}!`;
}

const sayHello = partial(greet, "Hello");
const sayHi = partial(greet, "Hi");

console.log(sayHello("张三"));
console.log(sayHi("李四"));

// ============================================
// 7. 高阶函数与数组方法
// ============================================

// 自定义 map
function myMap<T, U>(arr: T[], fn: (item: T, index: number) => U): U[] {
    const result: U[] = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(fn(arr[i], i));
    }
    return result;
}

console.log("自定义 map:", myMap([1, 2, 3], (x) => x * 2));

// 自定义 filter
function myFilter<T>(arr: T[], predicate: (item: T, index: number) => boolean): T[] {
    const result: T[] = [];
    for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i], i)) {
            result.push(arr[i]);
        }
    }
    return result;
}

console.log("自定义 filter:", myFilter([1, 2, 3, 4, 5], (x) => x % 2 === 0));

// 自定义 reduce
function myReduce<T, U>(
    arr: T[],
    fn: (acc: U, item: T, index: number) => U,
    initial: U
): U {
    let acc = initial;
    for (let i = 0; i < arr.length; i++) {
        acc = fn(acc, arr[i], i);
    }
    return acc;
}

console.log("自定义 reduce:", myReduce([1, 2, 3, 4], (acc, x) => acc + x, 0));

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 函数记忆化 (Memoization)
function memoize<Args extends unknown[], Result>(
    fn: (...args: Args) => Result
): (...args: Args) => Result {
    const cache = new Map<string, Result>();

    return (...args: Args): Result => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log("从缓存获取:", key);
            return cache.get(key)!;
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

const slowFibonacci = (n: number): number => {
    if (n <= 1) return n;
    return slowFibonacci(n - 1) + slowFibonacci(n - 2);
};

const fastFibonacci = memoize(slowFibonacci);
console.log("记忆化斐波那契:", fastFibonacci(10));

// 示例 2: 防抖 (Debounce)
function debounce<Args extends unknown[]>(
    fn: (...args: Args) => void,
    delay: number
): (...args: Args) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Args): void => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delay);
    };
}

const debouncedLog = debounce((message: string) => {
    console.log("防抖日志:", message);
}, 300);

// 示例 3: 节流 (Throttle)
function throttle<Args extends unknown[]>(
    fn: (...args: Args) => void,
    limit: number
): (...args: Args) => void {
    let inThrottle = false;

    return (...args: Args): void => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

const throttledLog = throttle((message: string) => {
    console.log("节流日志:", message);
}, 1000);

// 示例 4: 重试机制
async function retry<T>(
    fn: () => Promise<T>,
    attempts: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            console.log(`尝试 ${i + 1}/${attempts} 失败:`, lastError.message);
            if (i < attempts - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    throw lastError;
}

// 示例 5: 装饰器模式
function withLogging<Args extends unknown[], Result>(
    fn: (...args: Args) => Result,
    name: string
): (...args: Args) => Result {
    return (...args: Args): Result => {
        console.log(`[${name}] 调用参数:`, args);
        const result = fn(...args);
        console.log(`[${name}] 返回结果:`, result);
        return result;
    };
}

const loggedAdd = withLogging(add, "add");
loggedAdd(2, 3);

// ============================================
// 9. 类型安全的事件处理
// ============================================

// 定义事件映射
interface EventMap {
    click: { x: number; y: number };
    keypress: { key: string; code: number };
    submit: { formId: string; data: Record<string, unknown> };
}

// 类型安全的事件处理器
type EventHandler<K extends keyof EventMap> = (event: EventMap[K]) => void;

class TypedEventEmitter {
    private handlers: {
        [K in keyof EventMap]?: EventHandler<K>[];
    } = {};

    on<K extends keyof EventMap>(event: K, handler: EventHandler<K>): void {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event]!.push(handler);
    }

    emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
        const handlers = this.handlers[event];
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }
}

const emitter = new TypedEventEmitter();
emitter.on("click", ({ x, y }) => console.log(`点击位置: (${x}, ${y})`));
emitter.on("keypress", ({ key }) => console.log(`按键: ${key}`));

emitter.emit("click", { x: 100, y: 200 });
emitter.emit("keypress", { key: "Enter", code: 13 });

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 实现 once 函数
 * 确保函数只被调用一次
 */
function once<Args extends unknown[], Result>(
    fn: (...args: Args) => Result
): (...args: Args) => Result | undefined {
    let called = false;
    let result: Result;

    return (...args: Args): Result | undefined => {
        if (!called) {
            called = true;
            result = fn(...args);
            return result;
        }
        return result;  // 返回缓存的结果
    };
}

const initOnce = once(() => {
    console.log("初始化!");
    return "initialized";
});

console.log("练习 1:", initOnce());  // 初始化!
console.log("练习 1:", initOnce());  // 不会再次调用

/**
 * 练习 2: 实现 after 函数
 * 函数在调用 n 次后才真正执行
 */
function after<Args extends unknown[], Result>(
    n: number,
    fn: (...args: Args) => Result
): (...args: Args) => Result | undefined {
    let count = 0;

    return (...args: Args): Result | undefined => {
        count++;
        if (count >= n) {
            return fn(...args);
        }
        return undefined;
    };
}

const afterThree = after(3, () => console.log("第三次调用!"));
afterThree();  // 无输出
afterThree();  // 无输出
console.log("练习 2:");
afterThree();  // "第三次调用!"

/**
 * 练习 3: 实现 negate 函数
 * 返回原函数结果的否定
 */
function negate<Args extends unknown[]>(
    predicate: (...args: Args) => boolean
): (...args: Args) => boolean {
    return (...args: Args): boolean => !predicate(...args);
}

const isEven = (n: number) => n % 2 === 0;
const isOdd = negate(isEven);

console.log("练习 3 - 4是奇数:", isOdd(4));  // false
console.log("练习 3 - 5是奇数:", isOdd(5));  // true

/**
 * 练习 4: 实现 zipWith 函数
 * 使用给定函数合并两个数组
 */
function zipWith<A, B, C>(
    arr1: A[],
    arr2: B[],
    fn: (a: A, b: B) => C
): C[] {
    const length = Math.min(arr1.length, arr2.length);
    const result: C[] = [];
    for (let i = 0; i < length; i++) {
        result.push(fn(arr1[i], arr2[i]));
    }
    return result;
}

console.log("练习 4:", zipWith([1, 2, 3], [4, 5, 6], (a, b) => a + b));  // [5, 7, 9]
console.log("练习 4:", zipWith(["a", "b"], [1, 2], (a, b) => a.repeat(b)));  // ["a", "bb"]

// 导出
export {
    fetchData,
    createMultiplier,
    compose,
    pipe,
    pipeMany,
    curry2,
    curry3,
    partial,
    memoize,
    debounce,
    throttle,
    retry,
    withLogging,
    TypedEventEmitter,
    once,
    after,
    negate,
    zipWith
};
