/**
 * 函数重载 (Function Overloads)
 *
 * 函数重载允许一个函数根据不同的参数类型返回不同的类型
 * TypeScript 通过多个函数签名 + 一个实现签名来实现重载
 */

// ============================================
// 1. 函数重载基础
// ============================================

// 重载签名 (overload signatures)
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;

// 实现签名 (implementation signature)
function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
    if (month !== undefined && day !== undefined) {
        return new Date(yearOrTimestamp, month - 1, day);
    }
    return new Date(yearOrTimestamp);
}

console.log("重载 1:", makeDate(1609459200000));      // 时间戳
console.log("重载 2:", makeDate(2024, 6, 15));        // 年月日

// makeDate(2024, 6);  // Error: 没有匹配的重载

// ============================================
// 2. 重载签名的匹配规则
// ============================================

// TypeScript 从上到下匹配重载签名

// 重载签名
function processInput(input: string): string;
function processInput(input: number): number;
function processInput(input: boolean): string;

// 实现签名必须兼容所有重载签名
function processInput(input: string | number | boolean): string | number {
    if (typeof input === "string") {
        return input.toUpperCase();
    }
    if (typeof input === "number") {
        return input * 2;
    }
    return input ? "Yes" : "No";
}

console.log("处理字符串:", processInput("hello"));   // HELLO
console.log("处理数字:", processInput(21));           // 42
console.log("处理布尔:", processInput(true));         // Yes

// ============================================
// 3. 方法重载
// ============================================

class Calculator {
    // 方法重载
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: number[], b: number[]): number[];
    add(a: unknown, b: unknown): unknown {
        if (typeof a === "number" && typeof b === "number") {
            return a + b;
        }
        if (typeof a === "string" && typeof b === "string") {
            return a + b;
        }
        if (Array.isArray(a) && Array.isArray(b)) {
            return [...a, ...b];
        }
        throw new Error("Invalid arguments");
    }
}

const calc = new Calculator();
console.log("数字相加:", calc.add(1, 2));
console.log("字符串相加:", calc.add("Hello, ", "World"));
console.log("数组相加:", calc.add([1, 2], [3, 4]));

// ============================================
// 4. 构造函数重载
// ============================================

class Point {
    x: number;
    y: number;

    constructor();
    constructor(x: number, y: number);
    constructor(point: { x: number; y: number });
    constructor(xOrPoint?: number | { x: number; y: number }, y?: number) {
        if (xOrPoint === undefined) {
            this.x = 0;
            this.y = 0;
        } else if (typeof xOrPoint === "number") {
            this.x = xOrPoint;
            this.y = y!;
        } else {
            this.x = xOrPoint.x;
            this.y = xOrPoint.y;
        }
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

console.log("Point 1:", new Point().toString());
console.log("Point 2:", new Point(10, 20).toString());
console.log("Point 3:", new Point({ x: 30, y: 40 }).toString());

// ============================================
// 5. 重载与泛型结合
// ============================================

// 泛型重载
function first<T>(arr: T[]): T | undefined;
function first<T>(arr: T[], defaultValue: T): T;
function first<T>(arr: T[], defaultValue?: T): T | undefined {
    return arr.length > 0 ? arr[0] : defaultValue;
}

console.log("第一个元素:", first([1, 2, 3]));           // 1
console.log("空数组默认值:", first([], 0));             // 0
console.log("空数组无默认值:", first([]));              // undefined

// ============================================
// 6. 重载 vs 联合类型
// ============================================

// 方式 1: 使用重载
function getLength(value: string): number;
function getLength(value: unknown[]): number;
function getLength(value: string | unknown[]): number {
    return value.length;
}

// 方式 2: 使用联合类型 (更简单，如果返回类型相同)
function getLengthSimple(value: string | unknown[]): number {
    return value.length;
}

// 重载更适合返回类型不同的情况
function getValue(key: "name"): string;
function getValue(key: "age"): number;
function getValue(key: "active"): boolean;
function getValue(key: string): unknown {
    const data: Record<string, unknown> = {
        name: "张三",
        age: 25,
        active: true
    };
    return data[key];
}

const name = getValue("name");    // 类型是 string
const age = getValue("age");      // 类型是 number
const active = getValue("active"); // 类型是 boolean

console.log("获取值:", name, age, active);

// ============================================
// 7. 实际应用示例
// ============================================

// 示例 1: DOM 元素选择器
function querySelector(selector: string): Element | null;
function querySelector<K extends keyof HTMLElementTagNameMap>(
    selector: K
): HTMLElementTagNameMap[K] | null;
function querySelector(selector: string): Element | null {
    // 模拟实现
    console.log(`选择器: ${selector}`);
    return null;
}

// 示例 2: 事件监听器
interface EventListenerOptions {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}

function addEventListener(
    type: "click",
    listener: (event: MouseEvent) => void,
    options?: EventListenerOptions
): void;
function addEventListener(
    type: "keydown",
    listener: (event: KeyboardEvent) => void,
    options?: EventListenerOptions
): void;
function addEventListener(
    type: "focus",
    listener: (event: FocusEvent) => void,
    options?: EventListenerOptions
): void;
function addEventListener(
    type: string,
    listener: (event: Event) => void,
    _options?: EventListenerOptions
): void {
    console.log(`添加 ${type} 事件监听器`);
    // 模拟实现
    listener(new Event(type));
}

addEventListener("click", (e) => {
    console.log("点击事件:", e.button);  // MouseEvent 的属性
});

// 示例 3: API 响应解析
interface SuccessResponse<T> {
    success: true;
    data: T;
}

interface ErrorResponse {
    success: false;
    error: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

function parseResponse(response: ApiResponse<string>): string;
function parseResponse(response: ApiResponse<number>): number;
function parseResponse<T>(response: ApiResponse<T>): T | never;
function parseResponse<T>(response: ApiResponse<T>): T {
    if (response.success) {
        return response.data;
    }
    throw new Error(response.error);
}

const stringResponse: ApiResponse<string> = { success: true, data: "Hello" };
console.log("解析响应:", parseResponse(stringResponse));

// 示例 4: 数据转换器
function convert(value: string, to: "number"): number;
function convert(value: number, to: "string"): string;
function convert(value: string, to: "boolean"): boolean;
function convert(
    value: string | number,
    to: "number" | "string" | "boolean"
): number | string | boolean {
    switch (to) {
        case "number":
            return Number(value);
        case "string":
            return String(value);
        case "boolean":
            return Boolean(value);
    }
}

console.log("转换:", convert("42", "number"));    // 42 (number)
console.log("转换:", convert(42, "string"));      // "42" (string)
console.log("转换:", convert("true", "boolean")); // true (boolean)

// ============================================
// 8. 重载的最佳实践
// ============================================

// 好的实践: 重载签名从最具体到最不具体
function handleValue(value: null): "null";
function handleValue(value: undefined): "undefined";
function handleValue(value: number): "number";
function handleValue(value: string): "string";
function handleValue(value: object): "object";
function handleValue(value: unknown): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    return typeof value;
}

// 避免: 太多重载，考虑使用泛型或条件类型替代

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个 clamp 函数
 * 将值限制在指定范围内
 */
function clamp(value: number, min: number, max: number): number;
function clamp(value: string, minLength: number, maxLength: number): string;
function clamp(
    value: number | string,
    min: number,
    max: number
): number | string {
    if (typeof value === "number") {
        return Math.min(Math.max(value, min), max);
    }
    if (value.length < min) {
        return value.padEnd(min, " ");
    }
    if (value.length > max) {
        return value.slice(0, max);
    }
    return value;
}

console.log("练习 1 - 数字:", clamp(15, 0, 10));
console.log("练习 1 - 字符串:", clamp("Hello World", 0, 5));

/**
 * 练习 2: 创建一个 merge 函数
 * 合并两个对象或两个数组
 */
function merge<T extends object, U extends object>(a: T, b: U): T & U;
function merge<T>(a: T[], b: T[]): T[];
function merge<T, U>(a: T | T[], b: U | U[]): unknown {
    if (Array.isArray(a) && Array.isArray(b)) {
        return [...a, ...b];
    }
    return { ...a, ...b };
}

console.log("练习 2 - 对象:", merge({ a: 1 }, { b: 2 }));
console.log("练习 2 - 数组:", merge([1, 2], [3, 4]));

/**
 * 练习 3: 创建一个类型安全的事件系统
 */
interface Events {
    login: { userId: number; timestamp: Date };
    logout: { userId: number };
    error: { message: string; code: number };
}

function emit<K extends keyof Events>(event: K, data: Events[K]): void {
    console.log(`事件 ${event}:`, data);
}

emit("login", { userId: 1, timestamp: new Date() });
emit("logout", { userId: 1 });
emit("error", { message: "出错了", code: 500 });

/**
 * 练习 4: 创建一个格式化函数
 */
function format(value: Date): string;
function format(value: number, decimals?: number): string;
function format(value: string, maxLength?: number): string;
function format(
    value: Date | number | string,
    option?: number
): string {
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === "number") {
        return value.toFixed(option ?? 2);
    }
    if (option !== undefined && value.length > option) {
        return value.slice(0, option) + "...";
    }
    return value;
}

console.log("练习 4 - 日期:", format(new Date()));
console.log("练习 4 - 数字:", format(3.14159, 2));
console.log("练习 4 - 字符串:", format("Hello TypeScript World", 10));

// 导出
export {
    makeDate,
    processInput,
    Calculator,
    Point,
    first,
    getValue,
    convert,
    clamp,
    merge,
    emit,
    format
};
