/**
 * 类型体操练习 (Type Challenges)
 *
 * 通过实际练习来掌握 TypeScript 高级类型
 */

// ============================================
// 1. 简单难度
// ============================================

// 1.1 实现 Pick
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

// 1.2 实现 Readonly
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};

// 1.3 实现 TupleToObject
type TupleToObject<T extends readonly (string | number | symbol)[]> = {
    [K in T[number]]: K;
};

const tuple = ["tesla", "model 3", "model X", "model Y"] as const;
type TupleObj = TupleToObject<typeof tuple>;
// { tesla: "tesla"; "model 3": "model 3"; ... }

// 1.4 实现 First
type First<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never;

// 1.5 实现 Length
type Length<T extends readonly unknown[]> = T["length"];

type LengthOfTuple = Length<typeof tuple>;  // 4

// ============================================
// 2. 中等难度
// ============================================

// 2.1 实现 ReturnType
type MyReturnType<T extends (...args: unknown[]) => unknown> =
    T extends (...args: unknown[]) => infer R ? R : never;

// 2.2 实现 Omit
type MyOmit<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};

// 2.3 实现 DeepReadonly
type DeepReadonly<T> = T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

interface DeepObj {
    a: {
        b: {
            c: number;
        };
    };
}

type DeepRO = DeepReadonly<DeepObj>;

// 2.4 实现 TupleToUnion
type TupleToUnion<T extends readonly unknown[]> = T[number];

// 2.5 实现 Chainable
type Chainable<T = {}> = {
    option<K extends string, V>(
        key: K extends keyof T ? never : K,
        value: V
    ): Chainable<T & { [P in K]: V }>;
    get(): T;
};

declare const config: Chainable;
const result = config
    .option("name", "TypeScript")
    .option("version", 5)
    .option("strict", true)
    .get();
// { name: string; version: number; strict: boolean; }

// 2.6 实现 Last
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

// 2.7 实现 Pop
type Pop<T extends unknown[]> = T extends [...infer R, unknown] ? R : [];

// 2.8 实现 PromiseAll
type PromiseAllType<T extends readonly unknown[]> = {
    [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K];
};

// 2.9 实现 LookUp
type LookUp<U, T> = U extends { type: T } ? U : never;

interface Cat { type: "cat"; meow(): void; }
interface Dog { type: "dog"; bark(): void; }
type Animal = Cat | Dog;

type DogType = LookUp<Animal, "dog">;  // Dog

// 2.10 实现 Trim
type TrimLeft<S extends string> = S extends `${" " | "\n" | "\t"}${infer R}` ? TrimLeft<R> : S;
type TrimRight<S extends string> = S extends `${infer L}${" " | "\n" | "\t"}` ? TrimRight<L> : S;
type Trim<S extends string> = TrimLeft<TrimRight<S>>;

type Trimmed = Trim<"  Hello World  ">;  // "Hello World"

// ============================================
// 3. 困难难度
// ============================================

// 3.1 实现 Currying
type Curry<F> = F extends (...args: infer Args) => infer R
    ? Args extends [infer First, ...infer Rest]
        ? (arg: First) => Curry<(...args: Rest) => R>
        : R
    : never;

declare function curry<F extends (...args: unknown[]) => unknown>(fn: F): Curry<F>;

function sum3(a: number, b: number, c: number): number {
    return a + b + c;
}

const curriedSum = curry(sum3);
// (a: number) => (b: number) => (c: number) => number

// 3.2 实现 UnionToIntersection
type UnionToIntersection<U> =
    (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
        ? I
        : never;

type Union = { a: number } | { b: string };
type Intersection = UnionToIntersection<Union>;
// { a: number } & { b: string }

// 3.3 实现 RequiredKeys
type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface Person {
    name: string;
    age?: number;
    email: string;
}

type Required1 = RequiredKeys<Person>;  // "name" | "email"

// 3.4 实现 OptionalKeys
type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type Optional1 = OptionalKeys<Person>;  // "age"

// 3.5 实现 GetOptional
type GetOptional<T> = {
    [K in keyof T as {} extends Pick<T, K> ? K : never]: T[K];
};

// 3.6 实现 Capitalize Words
type CapitalizeWords<S extends string> =
    S extends `${infer First}${infer Rest}`
        ? First extends " "
            ? `${First}${CapitalizeWords<Capitalize<Rest>>}`
            : `${First}${CapitalizeWords<Rest>}`
        : S;

type CW = CapitalizeWords<"hello world">;  // "Hello World" (近似)

// 3.7 实现 CamelCase
type CamelCase<S extends string> =
    S extends `${infer L}_${infer R}`
        ? `${Lowercase<L>}${CamelCase<Capitalize<R>>}`
        : Lowercase<S>;

type Camel = CamelCase<"hello_world_foo">;  // "helloWorldFoo"

// 3.8 实现 ParsePrintFormat
type ParsePrintFormat<S extends string> =
    S extends `${string}%${infer Type}${infer Rest}`
        ? Type extends "s"
            ? [string, ...ParsePrintFormat<Rest>]
            : Type extends "d"
                ? [number, ...ParsePrintFormat<Rest>]
                : ParsePrintFormat<Rest>
        : [];

type Params = ParsePrintFormat<"Hello %s, you are %d years old">;
// [string, number]

// 3.9 实现 IsNever
type IsNever<T> = [T] extends [never] ? true : false;

type Never1 = IsNever<never>;  // true
type Never2 = IsNever<string>; // false

// 3.10 实现 IsUnion
type IsUnion<T, C = T> =
    T extends unknown
        ? [C] extends [T]
            ? false
            : true
        : never;

type Union1 = IsUnion<string | number>;  // true
type Union2 = IsUnion<string>;           // false

// ============================================
// 4. 地狱难度
// ============================================

// 4.1 实现 Permutation (排列)
type Permutation<T, K = T> =
    [T] extends [never]
        ? []
        : K extends K
            ? [K, ...Permutation<Exclude<T, K>>]
            : never;

type Perm = Permutation<"A" | "B" | "C">;
// ["A", "B", "C"] | ["A", "C", "B"] | ["B", "A", "C"] | ...

// 4.2 实现 StringToUnion
type StringToUnion<S extends string> =
    S extends `${infer F}${infer R}`
        ? F | StringToUnion<R>
        : never;

type SU = StringToUnion<"hello">;  // "h" | "e" | "l" | "o"

// 4.3 实现 Reverse
type Reverse<T extends unknown[]> =
    T extends [infer F, ...infer R]
        ? [...Reverse<R>, F]
        : [];

type Reversed = Reverse<[1, 2, 3]>;  // [3, 2, 1]

// 4.4 实现 FlipArguments
type FlipArguments<T extends (...args: unknown[]) => unknown> =
    T extends (...args: infer A) => infer R
        ? (...args: Reverse<A>) => R
        : never;

type Flipped = FlipArguments<(a: string, b: number) => void>;
// (a: number, b: string) => void

// 4.5 实现 FlattenDepth
type FlattenDepth<
    T extends unknown[],
    D extends number = 1,
    Count extends unknown[] = []
> = Count["length"] extends D
    ? T
    : T extends [infer F, ...infer R]
        ? F extends unknown[]
            ? [...FlattenDepth<F, D, [...Count, unknown]>, ...FlattenDepth<R, D, Count>]
            : [F, ...FlattenDepth<R, D, Count>]
        : T;

type Flattened = FlattenDepth<[[1, 2], [[3]]], 2>;

// ============================================
// 实用类型工具集
// ============================================

// 深度 Partial
type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

// 深度 Required
type DeepRequired<T> = T extends object
    ? { [K in keyof T]-?: DeepRequired<T[K]> }
    : T;

// 路径访问
type PathValue<T, P extends string> =
    P extends `${infer K}.${infer R}`
        ? K extends keyof T
            ? PathValue<T[K], R>
            : never
        : P extends keyof T
            ? T[P]
            : never;

// 所有路径
type Paths<T, P extends string = ""> = T extends object
    ? {
        [K in keyof T]: K extends string
            ? P extends ""
                ? K | Paths<T[K], K>
                : `${P}.${K}` | Paths<T[K], `${P}.${K}`>
            : never;
    }[keyof T]
    : never;

interface User {
    name: string;
    address: {
        city: string;
        zip: string;
    };
}

type UserPaths = Paths<User>;
// "name" | "address" | "address.city" | "address.zip"

// ============================================
// 测试输出
// ============================================

console.log("类型体操练习完成!");
console.log("这些类型只在编译时存在，运行时无输出");

// 导出部分类型
export {
    MyPick,
    MyReadonly,
    MyOmit,
    DeepReadonly,
    Trim,
    UnionToIntersection,
    RequiredKeys,
    OptionalKeys,
    CamelCase,
    IsNever,
    IsUnion,
    Permutation,
    StringToUnion,
    Reverse,
    DeepPartial,
    DeepRequired,
    Paths
};
