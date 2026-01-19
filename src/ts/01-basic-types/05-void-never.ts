/**
 * void 与 never 类型
 *
 * void: 表示没有任何返回值
 * never: 表示永远不会返回的类型
 */

// ============================================
// 1. void 类型
// ============================================
// void 表示函数没有返回值

// 显式声明 void
function logMessage(message: string): void {
    console.log(message);
    // 没有 return 语句，或者 return; 或者 return undefined;
}

// 也可以显式返回 undefined
function logAndReturn(message: string): void {
    console.log(message);
    return undefined;  // OK
    // return null;    // Error in strict mode
}

logMessage("Hello, void!");

// ============================================
// 2. void 作为变量类型
// ============================================
// 作为变量类型时，只能赋值 undefined
let voidValue: void = undefined;
// voidValue = null;  // Error in strict mode
// voidValue = "hello";  // Error

// void 通常用于回调函数的返回类型
type Callback = (result: string) => void;

const myCallback: Callback = (result) => {
    console.log("回调结果:", result);
    // 返回任何值都会被忽略
    return 123;  // TypeScript 允许，但返回值会被忽略
};

// ============================================
// 3. void vs undefined
// ============================================

// 函数声明为返回 undefined 时，必须显式返回 undefined
function returnsUndefined(): undefined {
    return undefined;  // 必须有 return 语句
}

// void 则不需要
function returnsVoid(): void {
    // 可以没有 return
}

// ============================================
// 4. never 类型
// ============================================
// never 表示永远不会发生的类型

// 情况 1: 抛出异常的函数
function throwError(message: string): never {
    throw new Error(message);
    // 函数永远不会正常返回
}

// 情况 2: 无限循环
function infiniteLoop(): never {
    while (true) {
        // 永远不会退出
    }
}

// 情况 3: 类型收窄后不可能的情况
function processValue(value: string | number): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else if (typeof value === "number") {
        return value.toString();
    } else {
        // value 的类型在这里是 never
        // 因为已经处理了所有可能的类型
        const exhaustiveCheck: never = value;
        return exhaustiveCheck;
    }
}

// ============================================
// 5. never 的穷尽性检查
// ============================================
// never 用于确保处理了所有可能的情况

type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; side: number }
    | { kind: "triangle"; base: number; height: number };

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
        case "triangle":
            return (shape.base * shape.height) / 2;
        default:
            // 如果添加新的 shape 类型但忘记处理
            // TypeScript 会在这里报错
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}

console.log("圆形面积:", getArea({ kind: "circle", radius: 5 }));
console.log("正方形面积:", getArea({ kind: "square", side: 4 }));

// ============================================
// 6. never 与其他类型的关系
// ============================================

// never 是所有类型的子类型
type A = never extends string ? true : false;  // true
type B = never extends number ? true : false;  // true
type C = never extends unknown ? true : false; // true

// 任何类型与 never 的联合类型都是原类型
type D = string | never;  // string
type E = number | never;  // number

// 任何类型与 never 的交叉类型都是 never
type F = string & never;  // never
type G = number & never;  // never

// never 数组是空数组的类型
const emptyArray: never[] = [];
// emptyArray.push(1);  // Error: 类型"number"的参数不能赋给类型"never"

// ============================================
// 7. 实际应用场景
// ============================================

// 场景 1: 断言函数
function assertNever(value: never, message: string): never {
    throw new Error(`${message}: ${JSON.stringify(value)}`);
}

// 场景 2: 条件类型中过滤类型
type NonNullable<T> = T extends null | undefined ? never : T;

type Result1 = NonNullable<string | null>;  // string
type Result2 = NonNullable<number | undefined>;  // number

// 场景 3: 禁止某些操作
type NoMethod<T> = T extends (...args: unknown[]) => unknown ? never : T;

// 场景 4: 类型安全的事件处理
type EventType = "click" | "focus" | "blur";

function handleEvent(event: EventType): void {
    switch (event) {
        case "click":
            console.log("处理点击事件");
            break;
        case "focus":
            console.log("处理焦点事件");
            break;
        case "blur":
            console.log("处理失焦事件");
            break;
        default:
            assertNever(event, "未知事件类型");
    }
}

// ============================================
// 8. void 与 never 的区别
// ============================================

// void: 函数正常执行完毕，但不返回有意义的值
function voidFunction(): void {
    console.log("执行完毕");
    // 隐式返回 undefined
}

// never: 函数永远不会正常完成
function neverFunction(): never {
    throw new Error("永远不会返回");
}

// 类型兼容性
const fn1: () => void = () => { };           // OK
const fn2: () => void = () => "hello";       // OK (返回值被忽略)
// const fn3: () => never = () => { };       // Error: 必须抛出或无限循环

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个日志函数
 * 不同日志级别调用不同的处理
 */
type LogLevel = "info" | "warn" | "error" | "fatal";

function log(level: LogLevel, message: string): void | never {
    switch (level) {
        case "info":
            console.log(`[INFO] ${message}`);
            break;
        case "warn":
            console.warn(`[WARN] ${message}`);
            break;
        case "error":
            console.error(`[ERROR] ${message}`);
            break;
        case "fatal":
            // fatal 级别抛出异常，永不返回
            throw new Error(`[FATAL] ${message}`);
        default:
            const _exhaustive: never = level;
            throw new Error(`Unknown level: ${_exhaustive}`);
    }
}

log("info", "应用启动");
log("warn", "内存使用率高");

/**
 * 练习 2: 实现一个类型安全的 Result 类型
 * 类似于 Rust 的 Result
 */
type Result<T, E> =
    | { success: true; value: T }
    | { success: false; error: E };

function unwrap<T, E>(result: Result<T, E>): T {
    if (result.success) {
        return result.value;
    } else {
        // 这里抛出异常，返回类型是 never
        throw new Error(String(result.error));
    }
}

function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (result.success) {
        return result.value;
    }
    return defaultValue;
}

const successResult: Result<number, string> = { success: true, value: 42 };
const errorResult: Result<number, string> = { success: false, error: "失败了" };

console.log("练习 2 - unwrap:", unwrap(successResult));
console.log("练习 2 - unwrapOr:", unwrapOr(errorResult, 0));

/**
 * 练习 3: 穷尽性检查
 * 添加新的支付方式时，TypeScript 会提醒我们处理
 */
type PaymentMethod = "credit_card" | "paypal" | "alipay" | "wechat";

function getPaymentFee(method: PaymentMethod): number {
    switch (method) {
        case "credit_card":
            return 2.5;
        case "paypal":
            return 3.0;
        case "alipay":
            return 0.5;
        case "wechat":
            return 0.5;
        default:
            // 如果添加新的支付方式但忘记处理，这里会报错
            const _exhaustive: never = method;
            throw new Error(`未处理的支付方式: ${_exhaustive}`);
    }
}

console.log("练习 3 - 信用卡费率:", getPaymentFee("credit_card"));
console.log("练习 3 - 支付宝费率:", getPaymentFee("alipay"));

// 导出
export { logMessage, throwError, getArea, log, unwrap, unwrapOr };
