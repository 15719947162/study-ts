/**
 * TypeScript 原始类型 (Primitive Types)
 *
 * TypeScript 支持 JavaScript 的所有原始类型，并添加了类型注解
 */

// ============================================
// 1. 字符串类型 (string)
// ============================================
let userName: string = "张三";
let greeting: string = `你好，${userName}`; // 模板字符串
let multiLine: string = `
  这是一个
  多行字符串
`;

console.log("字符串类型示例:", greeting);

// ============================================
// 2. 数字类型 (number)
// ============================================
// TypeScript 中所有数字都是浮点数，类型都是 number
let age: number = 25;
let price: number = 99.99;
let hex: number = 0xf00d;      // 十六进制
let binary: number = 0b1010;   // 二进制
let octal: number = 0o744;     // 八进制

console.log("数字类型示例:", age, price, hex, binary, octal);

// ============================================
// 3. 布尔类型 (boolean)
// ============================================
let isActive: boolean = true;
let isCompleted: boolean = false;

console.log("布尔类型示例:", isActive, isCompleted);

// ============================================
// 4. null 和 undefined
// ============================================
// 默认情况下，null 和 undefined 是所有类型的子类型
// 开启 strictNullChecks 后，只能赋值给它们自己或 void
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// 可选的变量 (可能是 undefined)
let optionalName: string | undefined = undefined;
optionalName = "李四";

console.log("null 和 undefined 示例:", nullValue, undefinedValue, optionalName);

// ============================================
// 5. Symbol 类型
// ============================================
// Symbol 是 ES6 引入的原始类型，表示唯一的值
const sym1: symbol = Symbol("key");
const sym2: symbol = Symbol("key");

// sym1 !== sym2，即使描述相同，每个 Symbol 都是唯一的
console.log("Symbol 比较:", sym1 === sym2); // false

// unique symbol 是 symbol 的子类型
const uniqueSym: unique symbol = Symbol("unique");

// ============================================
// 6. BigInt 类型
// ============================================
// BigInt 可以表示任意大的整数
const bigNumber: bigint = 9007199254740991n;
const anotherBig: bigint = BigInt("9007199254740991");

console.log("BigInt 示例:", bigNumber, anotherBig);

// ============================================
// 7. 字面量类型 (Literal Types)
// ============================================
// 字面量类型是更精确的类型，只能是特定的值
let direction: "north" | "south" | "east" | "west";
direction = "north"; // OK
// direction = "up"; // Error: 不能将类型 "up" 分配给类型

let magicNumber: 1 | 2 | 3 = 1;
let isTrue: true = true;

console.log("字面量类型示例:", direction, magicNumber);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 声明变量
 * 为以下变量添加正确的类型注解
 */
// TODO: 添加类型注解
let studentName = "王五";
let studentAge = 20;
let isGraduated = false;
let score = 95.5;

/**
 * 练习 2: 字面量类型
 * 创建一个变量，只能存储 "red", "green", "blue" 三种颜色
 */
// TODO: 创建颜色变量
// let primaryColor = ...

/**
 * 练习 3: 理解 null 和 undefined
 * 创建一个函数，接受可能为 null 的参数
 */
function greetUser(name: string | null): string {
    // TODO: 实现函数，如果 name 为 null，返回 "Hello, Guest"
    // 否则返回 "Hello, {name}"
    return name ? `Hello, ${name}` : "Hello, Guest";
}

console.log("练习 3 测试:", greetUser("Alice"), greetUser(null));

// 导出以避免模块作用域问题
export { userName, age, isActive };
