/**
 * any 与 unknown 类型
 *
 * any: 任意类型，关闭类型检查
 * unknown: 未知类型，类型安全的 any
 */

// ============================================
// 1. any 类型
// ============================================
// any 类型可以赋值为任何值，也可以赋给任何类型
let anyValue: any = "hello";
anyValue = 123;
anyValue = true;
anyValue = { name: "test" };
anyValue = [1, 2, 3];

// any 可以访问任何属性和方法 (不进行类型检查)
anyValue.foo.bar;       // 不报错
anyValue();             // 不报错
anyValue[0].method();   // 不报错

// any 可以赋给任何类型
let str: string = anyValue;  // 不报错，但可能运行时出错!
let num: number = anyValue;  // 不报错

console.log("any 类型示例:", anyValue);

// ============================================
// 2. any 的问题
// ============================================
// any 会"污染"其他变量，导致类型安全性丢失

function unsafeAdd(a: any, b: any) {
    return a + b;  // 返回类型是 any
}

let result = unsafeAdd("hello", 123);  // "hello123"
// result 的类型是 any，丢失了类型信息

// ============================================
// 3. 隐式 any
// ============================================
// 当没有指定类型且无法推断时，TypeScript 会使用隐式 any
// 在 strict 模式下，隐式 any 会报错

// function implicitAny(value) { }  // Error in strict mode
// let implicitVar;  // 类型是 any (如果未初始化)

// ============================================
// 4. unknown 类型
// ============================================
// unknown 是类型安全的 any

let unknownValue: unknown = "hello";
unknownValue = 123;
unknownValue = true;
unknownValue = { name: "test" };

// unknown 不能直接使用，必须先进行类型检查
// unknownValue.foo;        // Error: 对象的类型为 "unknown"
// unknownValue();          // Error
// unknownValue.method();   // Error

// unknown 不能赋给其他类型 (除了 any 和 unknown)
// let str2: string = unknownValue;  // Error
// let num2: number = unknownValue;  // Error

console.log("unknown 类型示例:", unknownValue);

// ============================================
// 5. unknown 的类型收窄
// ============================================

function processUnknown(value: unknown): string {
    // 必须先检查类型才能使用

    // 方式 1: typeof 检查
    if (typeof value === "string") {
        return value.toUpperCase();  // OK, value 是 string
    }

    // 方式 2: instanceof 检查
    if (value instanceof Date) {
        return value.toISOString();  // OK, value 是 Date
    }

    // 方式 3: 类型断言 (需要确保类型正确)
    if (isArray(value)) {
        return (value as unknown[]).join(", ");
    }

    // 方式 4: 自定义类型守卫
    if (isUser(value)) {
        return value.name;  // OK, value 是 User
    }

    return String(value);
}

// 类型守卫函数
function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

interface User {
    name: string;
    age: number;
}

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        "age" in value
    );
}

console.log("unknown 处理:", processUnknown("hello"));
console.log("unknown 处理:", processUnknown(new Date()));
console.log("unknown 处理:", processUnknown([1, 2, 3]));
console.log("unknown 处理:", processUnknown({ name: "张三", age: 25 }));

// ============================================
// 6. any vs unknown 对比
// ============================================

// any: 放弃类型检查
function dangerousFunction(data: any) {
    // 可以做任何操作，但没有类型安全
    return data.foo.bar.baz;  // 运行时可能报错
}

// unknown: 强制类型检查
function safeFunction(data: unknown) {
    // 必须先验证类型
    if (
        typeof data === "object" &&
        data !== null &&
        "foo" in data
    ) {
        // 只有验证后才能安全访问
        console.log((data as { foo: unknown }).foo);
    }
}

// ============================================
// 7. 实际应用场景
// ============================================

// 场景 1: JSON 解析
function safeJsonParse(jsonString: string): unknown {
    try {
        return JSON.parse(jsonString);  // 返回 unknown 更安全
    } catch {
        return null;
    }
}

const parsed = safeJsonParse('{"name": "张三", "age": 25}');

// 使用时必须验证类型
if (isUser(parsed)) {
    console.log("解析的用户:", parsed.name, parsed.age);
}

// 场景 2: API 响应处理
interface ApiResponse<T> {
    data: T;
    error: unknown;  // 错误可能是任何类型
}

function handleError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "未知错误";
}

// 场景 3: 事件处理
function handleEvent(event: unknown) {
    if (event instanceof MouseEvent) {
        console.log("鼠标事件:", event.clientX, event.clientY);
    } else if (event instanceof KeyboardEvent) {
        console.log("键盘事件:", event.key);
    }
}

// ============================================
// 8. 类型断言与 unknown
// ============================================

// 双重断言 (谨慎使用)
function doubleAssertion(value: unknown): string {
    // unknown -> any -> string
    return value as unknown as string;
}

// 更安全的做法: 使用类型守卫
function safeCast<T>(value: unknown, guard: (v: unknown) => v is T): T | undefined {
    return guard(value) ? value : undefined;
}

const maybeUser = safeCast({ name: "李四", age: 30 }, isUser);
console.log("安全转换:", maybeUser);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 类型安全的 localStorage 包装器
 * 创建一个函数从 localStorage 获取值并安全地解析
 */
function getStorageItem<T>(key: string, validator: (v: unknown) => v is T): T | null {
    // TODO: 实现
    // 1. 从 localStorage 获取字符串
    // 2. 解析 JSON
    // 3. 使用 validator 验证类型
    // 4. 返回验证后的值或 null

    // 模拟实现 (因为没有真实的 localStorage)
    const mockStorage: Record<string, string> = {
        "user": '{"name": "测试用户", "age": 20}'
    };

    const item = mockStorage[key];
    if (!item) return null;

    try {
        const parsed: unknown = JSON.parse(item);
        return validator(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

const storageUser = getStorageItem("user", isUser);
console.log("练习 1 - 存储用户:", storageUser);

/**
 * 练习 2: 创建一个类型守卫
 * 验证对象是否是 Product 类型
 */
interface Product {
    id: number;
    name: string;
    price: number;
}

function isProduct(value: unknown): value is Product {
    // TODO: 实现类型守卫
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value && typeof (value as Product).id === "number" &&
        "name" in value && typeof (value as Product).name === "string" &&
        "price" in value && typeof (value as Product).price === "number"
    );
}

const testProduct: unknown = { id: 1, name: "商品", price: 99.99 };
console.log("练习 2 - 是否是产品:", isProduct(testProduct));

/**
 * 练习 3: 安全的属性访问
 * 创建一个函数安全地访问嵌套属性
 */
function safeGet<T>(obj: unknown, path: string[]): T | undefined {
    // TODO: 实现安全的嵌套属性访问
    let current: unknown = obj;

    for (const key of path) {
        if (typeof current !== "object" || current === null) {
            return undefined;
        }
        current = (current as Record<string, unknown>)[key];
    }

    return current as T;
}

const nested = { a: { b: { c: 42 } } };
console.log("练习 3 - 嵌套访问:", safeGet<number>(nested, ["a", "b", "c"]));
console.log("练习 3 - 不存在的路径:", safeGet<number>(nested, ["a", "x", "y"]));

// 导出
export { processUnknown, handleError, isUser, isProduct, safeGet };
