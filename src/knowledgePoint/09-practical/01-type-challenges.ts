/**
 * 类型体操练习 (Type Challenges)
 *
 * 通过实现各种类型工具来提升 TypeScript 类型系统的理解
 */

// ============================================
// 1. 基础类型工具实现
// ============================================

// 实现 Pick: 从类型中选取指定属性
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;
// { title: string; completed: boolean; }

// 实现 Readonly: 将所有属性设为只读
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
};

type ReadonlyTodo = MyReadonly<Todo>;

// 实现 Partial: 将所有属性设为可选
type MyPartial<T> = {
    [P in keyof T]?: T[P];
};

type PartialTodo = MyPartial<Todo>;

// 实现 Required: 将所有属性设为必需
type MyRequired<T> = {
    [P in keyof T]-?: T[P];
};

// ============================================
// 2. 中级类型工具
// ============================================

// 实现 Exclude: 从联合类型中排除指定类型
type MyExclude<T, U> = T extends U ? never : T;

type T0 = MyExclude<"a" | "b" | "c", "a">;  // "b" | "c"

// 实现 Extract: 从联合类型中提取指定类型
type MyExtract<T, U> = T extends U ? T : never;

type T1 = MyExtract<"a" | "b" | "c", "a" | "f">;  // "a"

// 实现 Omit: 从类型中排除指定属性
type MyOmit<T, K extends keyof any> = {
    [P in Exclude<keyof T, K>]: T[P];
};

type TodoWithoutDescription = MyOmit<Todo, "description">;

// 实现 NonNullable: 排除 null 和 undefined
type MyNonNullable<T> = T extends null | undefined ? never : T;

type T2 = MyNonNullable<string | null | undefined>;  // string

// ============================================
// 3. 函数类型工具
// ============================================

// 实现 Parameters: 获取函数参数类型
type MyParameters<T extends (...args: unknown[]) => unknown> =
    T extends (...args: infer P) => unknown ? P : never;

function greet(name: string, age: number): string {
    return `Hello, ${name}! You are ${age} years old.`;
}

type GreetParams = MyParameters<typeof greet>;  // [string, number]

// 实现 ReturnType: 获取函数返回类型
type MyReturnType<T extends (...args: unknown[]) => unknown> =
    T extends (...args: unknown[]) => infer R ? R : never;

type GreetReturn = MyReturnType<typeof greet>;  // string

// 实现 ConstructorParameters: 获取构造函数参数类型
type MyConstructorParameters<T extends abstract new (...args: unknown[]) => unknown> =
    T extends abstract new (...args: infer P) => unknown ? P : never;

class Person {
    constructor(public name: string, public age: number) {}
}

type PersonParams = MyConstructorParameters<typeof Person>;  // [string, number]

// 实现 InstanceType: 获取构造函数实例类型
type MyInstanceType<T extends abstract new (...args: unknown[]) => unknown> =
    T extends abstract new (...args: unknown[]) => infer R ? R : never;

type PersonInstance = MyInstanceType<typeof Person>;  // Person

// ============================================
// 4. 高级类型工具
// ============================================

// 实现 DeepReadonly: 深度只读
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object
        ? T[P] extends Function
            ? T[P]
            : DeepReadonly<T[P]>
        : T[P];
};

interface NestedObject {
    name: string;
    nested: {
        value: number;
        deep: {
            data: string;
        };
    };
}

type DeepReadonlyNested = DeepReadonly<NestedObject>;

// 实现 DeepPartial: 深度可选
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object
        ? T[P] extends Function
            ? T[P]
            : DeepPartial<T[P]>
        : T[P];
};

type DeepPartialNested = DeepPartial<NestedObject>;

// 实现 Flatten: 展平数组类型
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type NestedArray = number[][][];
type FlatArray = Flatten<NestedArray>;  // number

// 实现 TupleToUnion: 元组转联合类型
type TupleToUnion<T extends unknown[]> = T[number];

type Tuple = [string, number, boolean];
type Union = TupleToUnion<Tuple>;  // string | number | boolean

// ============================================
// 5. 字符串类型工具
// ============================================

// 实现 Capitalize: 首字母大写
type MyCapitalize<S extends string> = S extends `${infer F}${infer R}`
    ? `${Uppercase<F>}${R}`
    : S;

type Capitalized = MyCapitalize<"hello">;  // "Hello"

// 实现 Uncapitalize: 首字母小写
type MyUncapitalize<S extends string> = S extends `${infer F}${infer R}`
    ? `${Lowercase<F>}${R}`
    : S;

type Uncapitalized = MyUncapitalize<"Hello">;  // "hello"

// 实现 KebabCase: 驼峰转短横线
type KebabCase<S extends string> = S extends `${infer C}${infer T}`
    ? T extends Uncapitalize<T>
        ? `${Lowercase<C>}${KebabCase<T>}`
        : `${Lowercase<C>}-${KebabCase<T>}`
    : S;

type Kebab = KebabCase<"getUserInfo">;  // "get-user-info"

// 实现 CamelCase: 短横线转驼峰
type CamelCase<S extends string> = S extends `${infer P1}-${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>;

type Camel = CamelCase<"get-user-info">;  // "getuserinfo" (简化版)

// ============================================
// 6. 对象类型工具
// ============================================

// 实现 Merge: 合并两个类型
type Merge<F, S> = {
    [P in keyof F | keyof S]: P extends keyof S
        ? S[P]
        : P extends keyof F
            ? F[P]
            : never;
};

type A = { name: string; age: number };
type B = { age: string; email: string };
type Merged = Merge<A, B>;  // { name: string; age: string; email: string; }

// 实现 Diff: 获取两个类型的差异
type Diff<O, O1> = {
    [P in Exclude<keyof O, keyof O1> | Exclude<keyof O1, keyof O>]:
        P extends keyof O
            ? O[P]
            : P extends keyof O1
                ? O1[P]
                : never;
};

type DiffResult = Diff<{ name: string; age: number }, { age: number; email: string }>;
// { name: string; email: string; }

// 实现 RequiredKeys: 获取必需属性的键
type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface Mixed {
    name: string;
    age?: number;
    email: string;
}

type Required2 = RequiredKeys<Mixed>;  // "name" | "email"

// 实现 OptionalKeys: 获取可选属性的键
type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type Optional = OptionalKeys<Mixed>;  // "age"

// ============================================
// 7. 条件类型进阶
// ============================================

// 实现 If: 条件判断
type If<C extends boolean, T, F> = C extends true ? T : F;

type Result1 = If<true, "a", "b">;   // "a"
type Result2 = If<false, "a", "b">;  // "b"

// 实现 IsNever: 判断是否为 never
type IsNever<T> = [T] extends [never] ? true : false;

type Test1 = IsNever<never>;     // true
type Test2 = IsNever<string>;    // false

// 实现 IsAny: 判断是否为 any
type IsAny<T> = 0 extends (1 & T) ? true : false;

type Test3 = IsAny<any>;      // true
type Test4 = IsAny<unknown>;  // false

// 实现 IsUnion: 判断是否为联合类型
type IsUnion<T, B = T> = T extends B
    ? [B] extends [T]
        ? false
        : true
    : never;

type Test5 = IsUnion<string | number>;  // true
type Test6 = IsUnion<string>;           // false

// ============================================
// 8. 实战类型挑战
// ============================================

// 挑战 1: 实现 Awaited - 获取 Promise 的解析类型
type MyAwaited<T> = T extends Promise<infer U>
    ? U extends Promise<unknown>
        ? MyAwaited<U>
        : U
    : T;

type AwaitedResult = MyAwaited<Promise<Promise<string>>>;  // string

// 挑战 2: 实现 TrimLeft - 去除字符串左侧空白
type TrimLeft<S extends string> = S extends `${" " | "\n" | "\t"}${infer R}`
    ? TrimLeft<R>
    : S;

type Trimmed = TrimLeft<"  Hello">;  // "Hello"

// 挑战 3: 实现 Length - 获取元组长度
type Length<T extends readonly unknown[]> = T["length"];

type TupleLength = Length<[1, 2, 3]>;  // 3

// 挑战 4: 实现 Concat - 连接两个数组
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];

type Concatenated = Concat<[1, 2], [3, 4]>;  // [1, 2, 3, 4]

// 挑战 5: 实现 Push - 向数组末尾添加元素
type Push<T extends unknown[], U> = [...T, U];

type Pushed = Push<[1, 2], 3>;  // [1, 2, 3]

// 挑战 6: 实现 Unshift - 向数组开头添加元素
type Unshift<T extends unknown[], U> = [U, ...T];

type Unshifted = Unshift<[1, 2], 0>;  // [0, 1, 2]

// 挑战 7: 实现 First - 获取数组第一个元素
type First<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never;

type FirstElement = First<[1, 2, 3]>;  // 1

// 挑战 8: 实现 Last - 获取数组最后一个元素
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

type LastElement = Last<[1, 2, 3]>;  // 3

// ============================================
// 9. 类型工具综合应用
// ============================================

// 创建一个类型安全的 API 响应处理系统
interface ApiEndpoint<TRequest, TResponse> {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    request: TRequest;
    response: TResponse;
}

type ApiEndpoints = {
    getUsers: ApiEndpoint<{ page: number }, { users: Person[]; total: number }>;
    getUser: ApiEndpoint<{ id: string }, Person>;
    createUser: ApiEndpoint<{ name: string; age: number }, Person>;
    updateUser: ApiEndpoint<{ id: string; data: Partial<Person> }, Person>;
    deleteUser: ApiEndpoint<{ id: string }, { success: boolean }>;
};

// 获取请求类型
type GetRequest<T extends keyof ApiEndpoints> = ApiEndpoints[T]["request"];

// 获取响应类型
type GetResponse<T extends keyof ApiEndpoints> = ApiEndpoints[T]["response"];

// 使用示例
type CreateUserRequest = GetRequest<"createUser">;  // { name: string; age: number }
type CreateUserResponse = GetResponse<"createUser">;  // Person

// 类型安全的 API 调用函数签名
type ApiFunction<K extends keyof ApiEndpoints> = (
    request: GetRequest<K>
) => Promise<GetResponse<K>>;

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 实现 Includes - 判断数组是否包含某元素
 */
type Includes<T extends readonly unknown[], U> =
    T extends [infer First, ...infer Rest]
        ? Equal<First, U> extends true
            ? true
            : Includes<Rest, U>
        : false;

// 辅助类型: 判断两个类型是否相等
type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

type HasNumber = Includes<[1, 2, 3], 2>;  // true
type HasString = Includes<[1, 2, 3], "2">;  // false

/**
 * 练习 2: 实现 Reverse - 反转元组
 */
type Reverse<T extends unknown[]> =
    T extends [infer First, ...infer Rest]
        ? [...Reverse<Rest>, First]
        : [];

type Reversed = Reverse<[1, 2, 3]>;  // [3, 2, 1]

/**
 * 练习 3: 实现 Zip - 合并两个元组
 */
type Zip<T extends unknown[], U extends unknown[]> =
    T extends [infer T1, ...infer TRest]
        ? U extends [infer U1, ...infer URest]
            ? [[T1, U1], ...Zip<TRest, URest>]
            : []
        : [];

type Zipped = Zip<[1, 2, 3], ["a", "b", "c"]>;  // [[1, "a"], [2, "b"], [3, "c"]]

/**
 * 练习 4: 实现 ObjectEntries - 获取对象的键值对
 */
type ObjectEntries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T];

type Entries = ObjectEntries<{ name: string; age: number }>;
// ["name", string] | ["age", number]

// 测试输出
console.log("类型体操练习完成!");
console.log("所有类型定义在编译时生效");

// 导出类型
export {
    MyPick,
    MyReadonly,
    MyPartial,
    MyRequired,
    MyExclude,
    MyExtract,
    MyOmit,
    MyNonNullable,
    MyParameters,
    MyReturnType,
    DeepReadonly,
    DeepPartial,
    Flatten,
    TupleToUnion,
    Merge,
    Diff,
    RequiredKeys,
    OptionalKeys,
    If,
    IsNever,
    IsAny,
    IsUnion,
    MyAwaited,
    Includes,
    Reverse,
    Zip,
    ObjectEntries
};
