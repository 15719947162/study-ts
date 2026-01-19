/**
 * 数组与元组 (Arrays & Tuples)
 *
 * 数组用于存储同一类型的多个值
 * 元组用于存储固定数量和类型的值
 */

// ============================================
// 1. 数组类型 (Array Types)
// ============================================

// 方式一: 类型[]
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

// 方式二: Array<类型> (泛型写法)
let scores: Array<number> = [90, 85, 95];
let fruits: Array<string> = ["apple", "banana", "orange"];

console.log("数组示例:", numbers, names);

// ============================================
// 2. 多维数组
// ============================================
let matrix: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

let grid: Array<Array<string>> = [
    ["a", "b"],
    ["c", "d"]
];

console.log("二维数组:", matrix);

// ============================================
// 3. 只读数组 (ReadonlyArray)
// ============================================
const readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // Error: 类型"readonly number[]"上不存在属性"push"
// readonlyNumbers[0] = 10; // Error: 无法为 "0" 赋值，因为它是只读属性

const anotherReadonly: ReadonlyArray<string> = ["x", "y", "z"];

console.log("只读数组:", readonlyNumbers);

// ============================================
// 4. 元组类型 (Tuple Types)
// ============================================
// 元组是固定长度和类型的数组

// 基本元组
let point: [number, number] = [10, 20];
let person: [string, number] = ["张三", 25];

// 带标签的元组 (提高可读性)
let labeledPoint: [x: number, y: number] = [100, 200];
let user: [name: string, age: number, active: boolean] = ["李四", 30, true];

console.log("元组示例:", point, person, user);

// ============================================
// 5. 可选元组元素
// ============================================
// 使用 ? 表示可选元素，可选元素必须在末尾
let optionalTuple: [string, number?] = ["hello"];
let withOptional: [string, number?] = ["world", 42];

type Point2DOrPoint3D = [number, number, number?];
let point2D: Point2DOrPoint3D = [1, 2];
let point3D: Point2DOrPoint3D = [1, 2, 3];

console.log("可选元组:", optionalTuple, withOptional);

// ============================================
// 6. 剩余元素的元组
// ============================================
// 元组可以有剩余元素
type StringNumberBooleans = [string, number, ...boolean[]];

let snb1: StringNumberBooleans = ["hello", 1];
let snb2: StringNumberBooleans = ["world", 2, true, false, true];

// 剩余元素在中间
type Padding = [number, ...string[], number];
let padding: Padding = [1, "a", "b", "c", 2];

console.log("剩余元素元组:", snb1, snb2, padding);

// ============================================
// 7. 只读元组
// ============================================
const readonlyTuple: readonly [string, number] = ["readonly", 100];
// readonlyTuple[0] = "changed"; // Error: 无法分配给"0"，因为它是只读属性

// 使用 as const 创建只读元组
const constTuple = ["const", 200] as const;
// constTuple 的类型是 readonly ["const", 200]

console.log("只读元组:", readonlyTuple, constTuple);

// ============================================
// 8. 元组解构
// ============================================
let rgb: [number, number, number] = [255, 128, 0];
let [red, green, blue] = rgb;

console.log(`RGB 解构: R=${red}, G=${green}, B=${blue}`);

// 跳过某些元素
let [first, , third] = rgb;
console.log("跳过解构:", first, third);

// 剩余解构
let colors: [string, ...string[]] = ["red", "green", "blue", "yellow"];
let [primary, ...otherColors] = colors;
console.log("剩余解构:", primary, otherColors);

// ============================================
// 9. 数组与元组的区别
// ============================================

// 数组: 长度不固定，元素类型相同
let arr: number[] = [1, 2, 3];
arr.push(4); // OK
arr.push(5); // OK

// 元组: 长度固定，每个位置类型可以不同
let tuple: [string, number, boolean] = ["test", 1, true];
// tuple.push("extra"); // TypeScript 不会报错，但这是反模式
// tuple[3]; // Error: 长度为 3 的元组没有索引 3

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建数组
 * 创建一个存储学生成绩的数组，并计算平均分
 */
function calculateAverage(scores: number[]): number {
    // TODO: 实现计算平均分
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return sum / scores.length;
}

console.log("练习 1 - 平均分:", calculateAverage([85, 90, 78, 92, 88]));

/**
 * 练习 2: 元组应用
 * 创建一个函数，接受一个人的信息元组，返回格式化的字符串
 */
type PersonInfo = [name: string, age: number, city: string];

function formatPerson(info: PersonInfo): string {
    // TODO: 返回 "姓名: xxx, 年龄: xxx, 城市: xxx"
    const [name, age, city] = info;
    return `姓名: ${name}, 年龄: ${age}, 城市: ${city}`;
}

console.log("练习 2:", formatPerson(["王五", 28, "北京"]));

/**
 * 练习 3: 坐标转换
 * 创建一个函数，将 [x, y] 坐标元组转换为对象 { x, y }
 */
type Coordinate = [x: number, y: number];
type CoordinateObject = { x: number; y: number };

function tupleToObject(coord: Coordinate): CoordinateObject {
    // TODO: 实现转换
    const [x, y] = coord;
    return { x, y };
}

console.log("练习 3:", tupleToObject([10, 20]));

/**
 * 练习 4: 类型安全的 useState 模拟
 * 模拟 React 的 useState，返回 [值, 设置函数] 的元组
 */
function useState<T>(initial: T): [T, (newValue: T) => void] {
    let value = initial;
    const setValue = (newValue: T) => {
        value = newValue;
        console.log("State updated to:", value);
    };
    return [value, setValue];
}

const [count, setCount] = useState(0);
console.log("练习 4 - 初始值:", count);
setCount(10);

// 导出
export { numbers, point, calculateAverage, formatPerson };
