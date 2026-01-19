/**
 * 剩余参数与展开运算符 (Rest Parameters & Spread Operator)
 *
 * 剩余参数允许函数接受不定数量的参数
 * 展开运算符允许将数组展开为函数参数
 */

// ============================================
// 1. 剩余参数基础
// ============================================

// 使用 ... 收集剩余参数
function sum(...numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
}

console.log("求和:", sum(1, 2, 3));           // 6
console.log("求和:", sum(1, 2, 3, 4, 5));     // 15
console.log("求和:", sum());                   // 0

// 剩余参数必须是数组类型
function joinStrings(...strings: string[]): string {
    return strings.join(" ");
}

console.log("拼接:", joinStrings("Hello", "TypeScript", "World"));

// ============================================
// 2. 剩余参数与普通参数结合
// ============================================

// 剩余参数必须是最后一个参数
function greetMany(greeting: string, ...names: string[]): void {
    for (const name of names) {
        console.log(`${greeting}, ${name}!`);
    }
}

greetMany("Hello", "Alice", "Bob", "Charlie");

// 混合普通参数、可选参数和剩余参数
function buildPath(base: string, ...segments: string[]): string {
    return [base, ...segments].join("/");
}

console.log("路径:", buildPath("/api"));
console.log("路径:", buildPath("/api", "users", "123", "posts"));

// ============================================
// 3. 剩余参数的类型
// ============================================

// 元组类型的剩余参数
function tupleRest(...args: [string, number, boolean]): void {
    const [name, age, active] = args;
    console.log(`Name: ${name}, Age: ${age}, Active: ${active}`);
}

tupleRest("张三", 25, true);

// 带有可选元素的元组
function flexibleArgs(...args: [string, number?, ...boolean[]]): void {
    console.log("参数:", args);
}

flexibleArgs("hello");
flexibleArgs("hello", 42);
flexibleArgs("hello", 42, true, false, true);

// ============================================
// 4. 展开运算符 (Spread Operator)
// ============================================

// 展开数组作为函数参数
const nums: number[] = [1, 2, 3, 4, 5];
console.log("最大值:", Math.max(...nums));
console.log("总和:", sum(...nums));

// 展开元组
const point: [number, number] = [10, 20];

function setPosition(x: number, y: number): void {
    console.log(`Position: (${x}, ${y})`);
}

setPosition(...point);

// ============================================
// 5. 类型安全的展开
// ============================================

// TypeScript 会检查展开的类型是否匹配
function multiply3(a: number, b: number, c: number): number {
    return a * b * c;
}

const triple: [number, number, number] = [2, 3, 4];
console.log("三数相乘:", multiply3(...triple));

// 使用 as const 确保类型精确
const constArgs = [1, 2, 3] as const;
// multiply3(...constArgs);  // OK, 因为类型是 readonly [1, 2, 3]

// ============================================
// 6. 对象展开
// ============================================

interface Person {
    name: string;
    age: number;
}

interface ExtendedPerson extends Person {
    email: string;
}

function createExtendedPerson(
    basePerson: Person,
    email: string
): ExtendedPerson {
    return { ...basePerson, email };
}

const basePerson: Person = { name: "张三", age: 25 };
const extended = createExtendedPerson(basePerson, "zhangsan@example.com");
console.log("扩展后:", extended);

// ============================================
// 7. 泛型剩余参数
// ============================================

// 泛型与剩余参数结合
function firstElement<T>(...args: T[]): T | undefined {
    return args[0];
}

console.log("第一个元素:", firstElement(1, 2, 3));
console.log("第一个元素:", firstElement("a", "b", "c"));

// 更复杂的泛型剩余参数
function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
    const length = Math.min(arr1.length, arr2.length);
    const result: [T, U][] = [];
    for (let i = 0; i < length; i++) {
        result.push([arr1[i], arr2[i]]);
    }
    return result;
}

console.log("压缩:", zip([1, 2, 3], ["a", "b", "c"]));

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 日志记录器
function createLogger(prefix: string) {
    return (...messages: unknown[]): void => {
        console.log(`[${prefix}]`, ...messages);
    };
}

const infoLog = createLogger("INFO");
const errorLog = createLogger("ERROR");

infoLog("应用启动", { version: "1.0.0" });
errorLog("发生错误", new Error("测试错误"));

// 示例 2: 事件发射器
type EventHandler = (...args: unknown[]) => void;

class EventEmitter {
    private events: Map<string, EventHandler[]> = new Map();

    on(event: string, handler: EventHandler): void {
        const handlers = this.events.get(event) || [];
        handlers.push(handler);
        this.events.set(event, handlers);
    }

    emit(event: string, ...args: unknown[]): void {
        const handlers = this.events.get(event);
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }
}

const emitter = new EventEmitter();
emitter.on("userLogin", (userId: unknown, timestamp: unknown) => {
    console.log(`用户 ${userId} 在 ${timestamp} 登录`);
});
emitter.emit("userLogin", 123, new Date().toISOString());

// 示例 3: 组合函数
function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
    return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

const add10 = (x: number) => x + 10;
const multiply2 = (x: number) => x * 2;
const subtract5 = (x: number) => x - 5;

const composed = compose(subtract5, multiply2, add10);
console.log("组合函数结果:", composed(5));  // (5 + 10) * 2 - 5 = 25

// 示例 4: SQL 查询构建器
function select(...columns: string[]): string {
    return `SELECT ${columns.length ? columns.join(", ") : "*"}`;
}

function where(...conditions: string[]): string {
    return conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
}

console.log("SQL:", select("id", "name", "email") + where("active = true", "age > 18"));

// ============================================
// 9. 参数数组推断
// ============================================

// 从剩余参数推断数组类型
function makeArray<T extends unknown[]>(...args: T): T {
    return args;
}

const arr1 = makeArray(1, "hello", true);  // [number, string, boolean]
const arr2 = makeArray(1, 2, 3);           // [number, number, number]

console.log("创建数组:", arr1, arr2);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 实现一个 printf 风格的格式化函数
 * 支持 %s (字符串), %d (数字), %b (布尔)
 */
function printf(template: string, ...args: (string | number | boolean)[]): string {
    let index = 0;
    return template.replace(/%[sdb]/g, (match) => {
        const arg = args[index++];
        switch (match) {
            case "%s":
                return String(arg);
            case "%d":
                return Number(arg).toString();
            case "%b":
                return Boolean(arg).toString();
            default:
                return match;
        }
    });
}

console.log("练习 1:", printf("Name: %s, Age: %d, Active: %b", "张三", 25, true));

/**
 * 练习 2: 创建一个类型安全的 curry 函数
 * 支持任意数量的参数
 */
function add3Numbers(a: number, b: number, c: number): number {
    return a + b + c;
}

// 简化版柯里化 (部分应用)
function partial<T extends unknown[], U extends unknown[], R>(
    fn: (...args: [...T, ...U]) => R,
    ...presetArgs: T
): (...args: U) => R {
    return (...args: U) => fn(...presetArgs, ...args);
}

const add10To = partial(add3Numbers, 10);
console.log("练习 2 - 部分应用:", add10To(5, 3));  // 18

/**
 * 练习 3: 实现一个合并函数
 * 将多个对象合并为一个
 */
function mergeObjects<T extends object[]>(...objects: T): object {
    return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
}

console.log("练习 3 - 合并:", mergeObjects(
    { a: 1 },
    { b: 2 },
    { c: 3, a: 10 }
));

/**
 * 练习 4: 创建一个链式调用的数组操作
 */
class ArrayChain<T> {
    constructor(private items: T[]) {}

    static of<U>(...items: U[]): ArrayChain<U> {
        return new ArrayChain(items);
    }

    map<U>(fn: (item: T) => U): ArrayChain<U> {
        return new ArrayChain(this.items.map(fn));
    }

    filter(predicate: (item: T) => boolean): ArrayChain<T> {
        return new ArrayChain(this.items.filter(predicate));
    }

    reduce<U>(fn: (acc: U, item: T) => U, initial: U): U {
        return this.items.reduce(fn, initial);
    }

    toArray(): T[] {
        return [...this.items];
    }
}

const result = ArrayChain.of(1, 2, 3, 4, 5)
    .map(x => x * 2)
    .filter(x => x > 4)
    .toArray();

console.log("练习 4 - 链式调用:", result);

// 导出
export {
    sum,
    joinStrings,
    greetMany,
    buildPath,
    createLogger,
    EventEmitter,
    compose,
    printf,
    mergeObjects,
    ArrayChain
};
