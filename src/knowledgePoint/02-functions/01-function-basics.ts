/**
 * 函数基础类型 (Function Basics)
 *
 * TypeScript 中函数的类型定义包括参数类型和返回值类型
 */

// ============================================
// 1. 函数声明的类型注解
// ============================================

// 基本函数声明
function add(a: number, b: number): number {
    return a + b;
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b;

// 返回值类型推断 (可以省略返回类型，TypeScript 会自动推断)
function subtract(a: number, b: number) {
    return a - b;  // TypeScript 推断返回类型为 number
}

console.log("加法:", add(5, 3));
console.log("乘法:", multiply(4, 6));
console.log("减法:", subtract(10, 4));

// ============================================
// 2. 函数类型表达式
// ============================================

// 定义函数类型
type MathOperation = (x: number, y: number) => number;

const divide: MathOperation = (a, b) => a / b;
const power: MathOperation = (base, exp) => Math.pow(base, exp);

console.log("除法:", divide(20, 4));
console.log("幂运算:", power(2, 8));

// 使用接口定义函数类型
interface StringProcessor {
    (input: string): string;
}

const toUpperCase: StringProcessor = (str) => str.toUpperCase();
const toLowerCase: StringProcessor = (str) => str.toLowerCase();

console.log("转大写:", toUpperCase("hello"));

// ============================================
// 3. 调用签名 (Call Signatures)
// ============================================

// 带有属性的函数类型
interface DescribableFunction {
    description: string;
    (arg: number): boolean;
}

function doSomething(fn: DescribableFunction) {
    console.log(fn.description + " 返回: " + fn(6));
}

const isEven: DescribableFunction = (num) => num % 2 === 0;
isEven.description = "检查是否为偶数";

doSomething(isEven);

// ============================================
// 4. 构造签名 (Construct Signatures)
// ============================================

// 定义可以用 new 调用的函数类型
interface DateConstructor {
    new (value: number): Date;
}

function createDate(ctor: DateConstructor, timestamp: number): Date {
    return new ctor(timestamp);
}

const date = createDate(Date, Date.now());
console.log("创建的日期:", date);

// 同时支持调用和构造
interface CallOrConstruct {
    new (s: string): Date;
    (n?: number): string;
}

// ============================================
// 5. 参数解构
// ============================================

// 对象参数解构
function printUser({ name, age }: { name: string; age: number }): void {
    console.log(`用户: ${name}, 年龄: ${age}`);
}

printUser({ name: "张三", age: 25 });

// 使用类型别名简化
type UserParams = {
    name: string;
    age: number;
    email?: string;
};

function createUser({ name, age, email = "未提供" }: UserParams): string {
    return `创建用户 ${name} (${age}岁), 邮箱: ${email}`;
}

console.log(createUser({ name: "李四", age: 30 }));
console.log(createUser({ name: "王五", age: 28, email: "wangwu@example.com" }));

// 数组参数解构
function getFirstTwo([first, second]: [number, number, ...number[]]): number {
    return first + second;
}

console.log("前两个之和:", getFirstTwo([1, 2, 3, 4, 5]));

// ============================================
// 6. 返回值类型
// ============================================

// 返回对象类型
function createPoint(x: number, y: number): { x: number; y: number } {
    return { x, y };
}

// 返回数组类型
function getRange(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}

console.log("坐标点:", createPoint(10, 20));
console.log("范围:", getRange(1, 5));

// 返回函数类型
function createMultiplier(factor: number): (value: number) => number {
    return (value) => value * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("双倍:", double(5));
console.log("三倍:", triple(5));

// ============================================
// 7. void 返回类型的特殊性
// ============================================

// 当函数类型返回 void 时，实现可以返回任何值，但会被忽略
type VoidFunc = () => void;

const f1: VoidFunc = () => {
    return true;  // 返回 true，但类型是 void
};

const f2: VoidFunc = () => true;

const v1 = f1();  // v1 的类型是 void，不是 boolean
// if (v1 === true) { }  // Error: void 不能与 boolean 比较

// 但是直接声明返回 void 的函数必须不返回值
function directVoid(): void {
    // return true;  // Error
}

// ============================================
// 8. 类型推断在函数中的应用
// ============================================

// 上下文类型推断
const names = ["Alice", "Bob", "Charlie"];

// 回调函数的参数类型可以推断
names.forEach((name) => {
    console.log(name.toUpperCase());  // name 被推断为 string
});

// map 的类型推断
const nameLengths = names.map((name) => name.length);
// nameLengths 被推断为 number[]

console.log("名字长度:", nameLengths);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个计算器函数
 * 接受两个数字和一个操作符，返回计算结果
 */
type Operator = "add" | "subtract" | "multiply" | "divide";

function calculate(a: number, b: number, operator: Operator): number {
    switch (operator) {
        case "add":
            return a + b;
        case "subtract":
            return a - b;
        case "multiply":
            return a * b;
        case "divide":
            if (b === 0) throw new Error("除数不能为零");
            return a / b;
    }
}

console.log("练习 1 - 计算:", calculate(10, 5, "add"));
console.log("练习 1 - 计算:", calculate(10, 5, "multiply"));

/**
 * 练习 2: 创建一个格式化函数
 * 将对象转换为查询字符串
 */
type QueryParams = Record<string, string | number | boolean>;

function toQueryString(params: QueryParams): string {
    return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join("&");
}

console.log("练习 2 - 查询字符串:", toQueryString({ name: "张三", age: 25, active: true }));

/**
 * 练习 3: 创建一个柯里化加法函数
 * curry(a)(b) 返回 a + b
 */
function curry(a: number): (b: number) => number {
    return (b: number) => a + b;
}

const add5 = curry(5);
console.log("练习 3 - 柯里化:", add5(3));  // 8
console.log("练习 3 - 柯里化:", curry(10)(20));  // 30

/**
 * 练习 4: 创建一个管道函数
 * 将多个函数组合成一个函数
 */
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
    return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

const addOne = (x: number) => x + 1;
const double2 = (x: number) => x * 2;
const square = (x: number) => x * x;

const pipeline = pipe(addOne, double2, square);
console.log("练习 4 - 管道:", pipeline(3));  // ((3 + 1) * 2)² = 64

// 导出
export { add, multiply, calculate, toQueryString, curry, pipe };
