/**
 * 条件类型与 infer (Conditional Types & Infer)
 *
 * 条件类型允许基于条件选择不同的类型
 * infer 关键字允许在条件类型中推断类型
 */

// ============================================
// 1. 基本条件类型
// ============================================

// 语法: T extends U ? X : Y
type IsString<T> = T extends string ? true : false;
type IsNumber<T> = T extends number ? true : false;

type Test1 = IsString<"hello">;  // true
type Test2 = IsString<123>;      // false
type Test3 = IsNumber<456>;      // true

// 条件类型可以嵌套
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T1 = TypeName<string>;     // "string"
type T2 = TypeName<number[]>;   // "object"
type T3 = TypeName<() => void>; // "function"

// ============================================
// 2. 分布式条件类型
// ============================================

// 当 T 是联合类型时，条件类型会分布到每个成员
type ToArray<T> = T extends unknown ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// string[] | number[] (分布式)

// 使用 [T] 防止分布
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

type Combined = ToArrayNonDist<string | number>;
// (string | number)[] (非分布式)

// 实际应用: Exclude 和 Extract
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

type Excluded = MyExclude<"a" | "b" | "c", "a">;  // "b" | "c"
type Extracted = MyExtract<"a" | "b" | "c", "a" | "b">;  // "a" | "b"

// ============================================
// 3. infer 关键字
// ============================================

// infer 用于在条件类型中推断类型

// 推断函数返回类型
type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

function greet(): string {
    return "Hello";
}

type GreetReturn = MyReturnType<typeof greet>;  // string

// 推断函数参数类型
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never;

function add(a: number, b: number): number {
    return a + b;
}

type AddParams = MyParameters<typeof add>;  // [a: number, b: number]

// 推断数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never;

type NumElement = ElementType<number[]>;  // number
type StrElement = ElementType<string[]>;  // string

// 推断 Promise 的解析类型
type Unpacked<T> = T extends Promise<infer U> ? U : T;

type UnpackedPromise = Unpacked<Promise<string>>;  // string
type UnpackedNumber = Unpacked<number>;            // number

// ============================================
// 4. 高级 infer 用法
// ============================================

// 推断元组的第一个元素
type First<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never;

type FirstNum = First<[1, 2, 3]>;      // 1
type FirstStr = First<["a", "b"]>;    // "a"
type FirstEmpty = First<[]>;          // never

// 推断元组的最后一个元素
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

type LastNum = Last<[1, 2, 3]>;  // 3

// 推断元组的尾部
type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never;

type TailResult = Tail<[1, 2, 3]>;  // [2, 3]

// 推断函数的 this 类型
type ThisParameterType2<T> = T extends (this: infer U, ...args: unknown[]) => unknown ? U : unknown;

function fn(this: { name: string }) {
    return this.name;
}

type FnThis = ThisParameterType2<typeof fn>;  // { name: string }

// ============================================
// 5. 条件类型中的类型收窄
// ============================================

// 在条件类型的 true 分支中，类型会被收窄
type Flatten<T> = T extends unknown[] ? T[number] : T;

type FlatNum = Flatten<number[]>;  // number
type FlatStr = Flatten<string>;    // string

// 递归条件类型
type DeepFlatten<T> = T extends unknown[]
    ? DeepFlatten<T[number]>
    : T;

type Nested = number[][][];
type DeepFlat = DeepFlatten<Nested>;  // number

// ============================================
// 6. 实际应用示例
// ============================================

// 示例 1: 提取对象中函数属性的键
type FunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface Api {
    baseUrl: string;
    timeout: number;
    get(url: string): Promise<unknown>;
    post(url: string, data: unknown): Promise<unknown>;
    delete(url: string): Promise<unknown>;
}

type ApiFunctionKeys = FunctionKeys<Api>;  // "get" | "post" | "delete"

// 示例 2: 提取 Promise 类型
type AwaitedDeep<T> =
    T extends Promise<infer U>
        ? AwaitedDeep<U>
        : T;

type DeepPromise = Promise<Promise<Promise<string>>>;
type Resolved = AwaitedDeep<DeepPromise>;  // string

// 示例 3: 函数重载的返回类型联合
type OverloadedReturnType<T> =
    T extends { (...args: unknown[]): infer R; (...args: unknown[]): infer R2 }
        ? R | R2
        : T extends (...args: unknown[]) => infer R
            ? R
            : never;

// 示例 4: 路径类型推断
type PathImpl<T, K extends keyof T> =
    K extends string
        ? T[K] extends Record<string, unknown>
            ? K | `${K}.${PathImpl<T[K], keyof T[K]> & string}`
            : K
        : never;

type Path<T> = PathImpl<T, keyof T>;

interface User {
    name: string;
    address: {
        city: string;
        zip: string;
    };
}

type UserPaths = Path<User>;  // "name" | "address" | "address.city" | "address.zip"

// 示例 5: 类型安全的 EventEmitter
type EventMap = {
    click: { x: number; y: number };
    keydown: { key: string };
    load: undefined;
};

type EventHandler<T> = T extends undefined
    ? () => void
    : (data: T) => void;

class TypedEmitter<Events extends Record<string, unknown>> {
    private handlers: {
        [K in keyof Events]?: EventHandler<Events[K]>[];
    } = {};

    on<K extends keyof Events>(
        event: K,
        handler: EventHandler<Events[K]>
    ): void {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event]!.push(handler);
    }

    emit<K extends keyof Events>(
        event: K,
        ...args: Events[K] extends undefined ? [] : [Events[K]]
    ): void {
        const handlers = this.handlers[event];
        if (handlers) {
            handlers.forEach(handler => {
                if (args.length > 0) {
                    (handler as (data: Events[K]) => void)(args[0]);
                } else {
                    (handler as () => void)();
                }
            });
        }
    }
}

const emitter = new TypedEmitter<EventMap>();
emitter.on("click", ({ x, y }) => console.log(`Click: ${x}, ${y}`));
emitter.on("load", () => console.log("Loaded"));
emitter.emit("click", { x: 100, y: 200 });
emitter.emit("load");

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 实现 TupleToUnion
 * 将元组类型转换为联合类型
 */
type TupleToUnion<T extends unknown[]> = T[number];

type TU = TupleToUnion<[1, "2", true]>;  // 1 | "2" | true

/**
 * 练习 2: 实现 Concat
 * 连接两个元组
 */
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];

type Concatenated = Concat<[1, 2], [3, 4]>;  // [1, 2, 3, 4]

/**
 * 练习 3: 实现 Includes
 * 检查元组中是否包含某个类型
 */
type Includes<T extends unknown[], U> =
    T extends [infer F, ...infer R]
        ? (F extends U ? (U extends F ? true : Includes<R, U>) : Includes<R, U>)
        : false;

type Inc1 = Includes<[1, 2, 3], 2>;     // true
type Inc2 = Includes<[1, 2, 3], 4>;     // false

/**
 * 练习 4: 实现 Push 和 Unshift
 */
type Push<T extends unknown[], U> = [...T, U];
type Unshift<T extends unknown[], U> = [U, ...T];

type Pushed = Push<[1, 2], 3>;      // [1, 2, 3]
type Unshifted = Unshift<[1, 2], 0>; // [0, 1, 2]

/**
 * 练习 5: 实现 GetRequired
 * 获取对象中所有必需属性的键
 */
type GetRequired<T> = {
    [K in keyof T as {} extends Pick<T, K> ? never : K]: T[K];
};

interface Person {
    name: string;
    age?: number;
    email: string;
}

type RequiredPerson = GetRequired<Person>;
// { name: string; email: string; }

console.log("条件类型与 infer 示例完成");

// 导出
export {
    IsString,
    TypeName,
    ToArray,
    MyReturnType,
    MyParameters,
    First,
    Last,
    Tail,
    FunctionKeys,
    TypedEmitter,
    TupleToUnion,
    Concat,
    Includes,
    Push,
    Unshift,
    GetRequired
};
