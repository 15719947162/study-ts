/**
 * 泛型约束 (Generic Constraints)
 *
 * 泛型约束允许我们限制类型参数必须满足某些条件
 * 使用 extends 关键字定义约束
 */

// ============================================
// 1. 基本约束
// ============================================

// 没有约束的问题
function getLength<T>(arg: T): number {
    // return arg.length;  // Error: T 上不存在 length 属性
    return 0;
}

// 使用约束解决
interface Lengthwise {
    length: number;
}

function getLengthConstrained<T extends Lengthwise>(arg: T): number {
    return arg.length;  // OK: T 保证有 length 属性
}

console.log("长度:", getLengthConstrained("hello"));
console.log("长度:", getLengthConstrained([1, 2, 3]));
console.log("长度:", getLengthConstrained({ length: 10, value: "test" }));
// getLengthConstrained(123);  // Error: number 没有 length 属性

// ============================================
// 2. 使用类型参数约束
// ============================================

// T 约束于 U 的键
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const person = { name: "张三", age: 25, city: "北京" };
console.log("获取属性:", getProperty(person, "name"));
console.log("获取属性:", getProperty(person, "age"));
// getProperty(person, "invalid");  // Error: "invalid" 不是 person 的键

// ============================================
// 3. 多重约束
// ============================================

interface Printable {
    print(): void;
}

interface Loggable {
    log(): void;
}

// T 必须同时满足 Printable 和 Loggable
function process<T extends Printable & Loggable>(item: T): void {
    item.print();
    item.log();
}

class Document implements Printable, Loggable {
    constructor(private content: string) {}

    print(): void {
        console.log(`打印: ${this.content}`);
    }

    log(): void {
        console.log(`日志: ${this.content}`);
    }
}

process(new Document("Hello World"));

// ============================================
// 4. 构造函数约束
// ============================================

// 约束 T 必须是一个可以 new 的构造函数
interface Constructor<T> {
    new (...args: unknown[]): T;
}

function createInstance<T>(ctor: Constructor<T>): T {
    return new ctor();
}

class MyClass {
    value = 42;
}

const instance = createInstance(MyClass);
console.log("实例:", instance.value);

// 带参数的构造函数约束
interface ConstructorWithArgs<T, Args extends unknown[]> {
    new (...args: Args): T;
}

function createWithArgs<T, Args extends unknown[]>(
    ctor: ConstructorWithArgs<T, Args>,
    ...args: Args
): T {
    return new ctor(...args);
}

class User {
    constructor(public name: string, public age: number) {}
}

const user = createWithArgs(User, "张三", 25);
console.log("用户:", user.name, user.age);

// ============================================
// 5. 条件约束
// ============================================

// 基于条件的类型约束
type IsArray<T> = T extends unknown[] ? true : false;
type IsString<T> = T extends string ? true : false;

type Test1 = IsArray<number[]>;  // true
type Test2 = IsArray<string>;    // false
type Test3 = IsString<"hello">;  // true

// 条件约束在函数中的应用
function processValue<T>(value: T): T extends string ? string : T extends number ? number : T {
    return value as T extends string ? string : T extends number ? number : T;
}

// ============================================
// 6. 约束与默认值
// ============================================

// 带默认值的约束
interface DefaultOptions {
    timeout: number;
    retries: number;
}

function fetchWithOptions<T extends Partial<DefaultOptions> = DefaultOptions>(
    url: string,
    options?: T
): void {
    const defaultOptions: DefaultOptions = {
        timeout: 5000,
        retries: 3
    };
    const finalOptions = { ...defaultOptions, ...options };
    console.log(`Fetching ${url} with options:`, finalOptions);
}

fetchWithOptions("/api/data");
fetchWithOptions("/api/data", { timeout: 10000 });

// ============================================
// 7. 递归约束
// ============================================

// 深层只读类型
type DeepReadonly<T> = T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

interface NestedObject {
    a: {
        b: {
            c: number;
        };
    };
    d: string[];
}

type ReadonlyNested = DeepReadonly<NestedObject>;

const nested: ReadonlyNested = {
    a: { b: { c: 42 } },
    d: ["one", "two"]
};
// nested.a.b.c = 100;  // Error: 只读属性

// 深层可选类型
type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

type PartialNested = DeepPartial<NestedObject>;

const partial: PartialNested = {
    a: { b: {} }  // c 是可选的
};

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 类型安全的对象合并
function merge<T extends object, U extends object>(target: T, source: U): T & U {
    return { ...target, ...source };
}

const merged = merge({ a: 1, b: 2 }, { c: 3, d: 4 });
console.log("合并:", merged);

// 示例 2: 路径访问器
type PathValue<T, P extends string> =
    P extends `${infer K}.${infer Rest}`
        ? K extends keyof T
            ? PathValue<T[K], Rest>
            : never
        : P extends keyof T
            ? T[P]
            : never;

function get<T, P extends string>(obj: T, path: P): PathValue<T, P> {
    const keys = path.split(".");
    let result: unknown = obj;
    for (const key of keys) {
        result = (result as Record<string, unknown>)[key];
    }
    return result as PathValue<T, P>;
}

const data = {
    user: {
        name: "张三",
        address: {
            city: "北京"
        }
    }
};

console.log("路径访问:", get(data, "user.name"));
console.log("路径访问:", get(data, "user.address.city"));

// 示例 3: 类型安全的事件系统
type EventConstraint = Record<string, unknown[]>;

class TypedEventEmitter<Events extends EventConstraint> {
    private listeners: {
        [K in keyof Events]?: Array<(...args: Events[K]) => void>;
    } = {};

    on<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(listener);
        return this;
    }

    emit<K extends keyof Events>(event: K, ...args: Events[K]): this {
        const callbacks = this.listeners[event];
        if (callbacks) {
            callbacks.forEach(cb => cb(...args));
        }
        return this;
    }

    once<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this {
        const onceListener = (...args: Events[K]) => {
            this.off(event, onceListener);
            listener(...args);
        };
        return this.on(event, onceListener);
    }

    off<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this {
        const callbacks = this.listeners[event];
        if (callbacks) {
            this.listeners[event] = callbacks.filter(cb => cb !== listener);
        }
        return this;
    }
}

// 使用
interface AppEvents {
    click: [x: number, y: number];
    keypress: [key: string, ctrl: boolean, shift: boolean];
    resize: [width: number, height: number];
}

const events = new TypedEventEmitter<AppEvents>();

events.on("click", (x, y) => {
    console.log(`点击: (${x}, ${y})`);
});

events.on("keypress", (key, ctrl, shift) => {
    console.log(`按键: ${key}, Ctrl: ${ctrl}, Shift: ${shift}`);
});

events.emit("click", 100, 200);
events.emit("keypress", "Enter", false, false);

// 示例 4: 表单验证器
type Validator<T> = (value: T) => string | null;

interface ValidationSchema<T extends object> {
    [K in keyof T]?: Validator<T[K]>[];
}

function createValidator<T extends object>(schema: ValidationSchema<T>) {
    return (data: T): Record<keyof T, string[]> => {
        const errors = {} as Record<keyof T, string[]>;

        for (const key of Object.keys(schema) as Array<keyof T>) {
            const validators = schema[key];
            if (!validators) continue;

            const fieldErrors: string[] = [];
            for (const validator of validators) {
                const error = validator(data[key]);
                if (error) {
                    fieldErrors.push(error);
                }
            }

            if (fieldErrors.length > 0) {
                errors[key] = fieldErrors;
            }
        }

        return errors;
    };
}

interface LoginForm {
    email: string;
    password: string;
}

const validateLogin = createValidator<LoginForm>({
    email: [
        (v) => !v ? "邮箱必填" : null,
        (v) => !v.includes("@") ? "邮箱格式错误" : null
    ],
    password: [
        (v) => !v ? "密码必填" : null,
        (v) => v.length < 6 ? "密码至少6位" : null
    ]
});

console.log("验证:", validateLogin({ email: "test", password: "123" }));

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个类型安全的 pick 函数
 */
function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
        result[key] = obj[key];
    }
    return result;
}

const fullUser = { name: "张三", age: 25, email: "test@example.com", password: "secret" };
const publicUser = pick(fullUser, ["name", "age", "email"]);
console.log("练习 1 - Pick:", publicUser);

/**
 * 练习 2: 创建一个类型安全的 omit 函数
 */
function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result as Omit<T, K>;
}

const safeUser = omit(fullUser, ["password"]);
console.log("练习 2 - Omit:", safeUser);

/**
 * 练习 3: 创建一个深度比较函数
 */
function deepEqual<T>(a: T, b: T): boolean {
    if (a === b) return true;

    if (typeof a !== "object" || a === null ||
        typeof b !== "object" || b === null) {
        return false;
    }

    const keysA = Object.keys(a) as Array<keyof T>;
    const keysB = Object.keys(b) as Array<keyof T>;

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!deepEqual(a[key], b[key])) {
            return false;
        }
    }

    return true;
}

console.log("练习 3 - 深度比较:", deepEqual(
    { a: 1, b: { c: 2 } },
    { a: 1, b: { c: 2 } }
));

// 导出
export {
    getLengthConstrained,
    getProperty,
    createInstance,
    createWithArgs,
    merge,
    get,
    TypedEventEmitter,
    createValidator,
    pick,
    omit,
    deepEqual
};
