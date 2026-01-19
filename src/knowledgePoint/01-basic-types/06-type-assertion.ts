/**
 * 类型断言 (Type Assertion)
 *
 * 类型断言是告诉编译器"我比你更了解这个值的类型"
 * 它不会进行运行时检查，只在编译时起作用
 */

// ============================================
// 1. 基本语法
// ============================================

// 方式 1: as 语法 (推荐)
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;

// 方式 2: 尖括号语法 (在 JSX 中不能使用)
let anotherLength: number = (<string>someValue).length;

console.log("字符串长度:", strLength, anotherLength);

// ============================================
// 2. 常见使用场景
// ============================================

// 场景 1: DOM 元素操作
// document.getElementById 返回 HTMLElement | null
// 我们知道它是特定类型的元素
const inputElement = document.getElementById("myInput") as HTMLInputElement;
// 现在可以访问 HTMLInputElement 特有的属性
// inputElement.value = "hello";

// 更安全的写法: 先检查 null
const maybeInput = document.getElementById("myInput");
if (maybeInput) {
    const input = maybeInput as HTMLInputElement;
    // input.value = "safe";
}

// 场景 2: 处理联合类型
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

function getSmallPet(): Fish | Bird {
    return {
        swim() { console.log("游泳"); },
        layEggs() { console.log("产卵"); }
    };
}

const pet = getSmallPet();
// 使用类型断言访问特定类型的方法
(pet as Fish).swim();
// (pet as Bird).fly();  // 运行时会报错，因为 pet 实际上是 Fish

// 场景 3: 事件处理
// const handleClick = (event: Event) => {
//     const target = event.target as HTMLButtonElement;
//     console.log(target.innerText);
// };

// ============================================
// 3. 非空断言操作符 (!)
// ============================================
// 告诉编译器这个值一定不是 null 或 undefined

function processValue(value: string | null | undefined) {
    // 使用 ! 断言值不为空
    const length = value!.length;  // 如果 value 为 null，运行时会报错
    return length;
}

// 更安全的做法
function safeProcessValue(value: string | null | undefined) {
    if (value != null) {
        return value.length;  // TypeScript 自动收窄类型
    }
    return 0;
}

// 明确赋值断言
class Example {
    name!: string;  // 告诉 TypeScript 这个属性会在其他地方初始化

    constructor() {
        this.initialize();
    }

    initialize() {
        this.name = "Example";
    }
}

// ============================================
// 4. const 断言
// ============================================
// as const 使值变成字面量类型，且为只读

// 普通对象
let normalObj = { x: 10, y: 20 };
// 类型: { x: number; y: number; }

// const 断言后
let constObj = { x: 10, y: 20 } as const;
// 类型: { readonly x: 10; readonly y: 20; }
// constObj.x = 30;  // Error: 无法分配到 "x"，因为它是只读属性

// 数组的 const 断言
let normalArray = [1, 2, 3];        // number[]
let constArray = [1, 2, 3] as const; // readonly [1, 2, 3]

// 字符串的 const 断言
let direction = "north" as const;  // 类型是 "north" 而不是 string

console.log("const 断言:", constObj, constArray);

// 实际应用: 创建枚举替代品
const Colors = {
    Red: "RED",
    Green: "GREEN",
    Blue: "BLUE"
} as const;

type ColorType = typeof Colors[keyof typeof Colors];  // "RED" | "GREEN" | "BLUE"

function setColor(color: ColorType) {
    console.log("设置颜色:", color);
}

setColor(Colors.Red);  // OK
// setColor("YELLOW");  // Error

// ============================================
// 5. 双重断言
// ============================================
// 当直接断言不被允许时，可以使用双重断言
// 但这通常是代码有问题的信号

interface Person {
    name: string;
    age: number;
}

// 直接断言不允许
// const person = "hello" as Person;  // Error

// 双重断言 (强制转换，非常危险！)
const forcedPerson = "hello" as unknown as Person;
// console.log(forcedPerson.name);  // 运行时错误: undefined

// ============================================
// 6. 类型断言 vs 类型守卫
// ============================================

// 类型断言: 编译时告诉 TypeScript 类型
function assertionExample(value: string | number) {
    // 我们"假设"它是 string
    const str = value as string;
    return str.toUpperCase();  // 如果是 number，运行时报错
}

// 类型守卫: 运行时检查类型 (更安全)
function guardExample(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase();  // TypeScript 知道这里是 string
    }
    return value.toFixed(2);  // TypeScript 知道这里是 number
}

console.log("类型守卫:", guardExample("hello"), guardExample(123.456));

// ============================================
// 7. 自定义类型守卫
// ============================================
// 使用 is 关键字创建类型谓词

interface Cat {
    meow(): void;
    name: string;
}

interface Dog {
    bark(): void;
    name: string;
}

function isCat(animal: Cat | Dog): animal is Cat {
    return "meow" in animal;
}

function isDog(animal: Cat | Dog): animal is Dog {
    return "bark" in animal;
}

function makeSound(animal: Cat | Dog) {
    if (isCat(animal)) {
        animal.meow();  // TypeScript 知道是 Cat
    } else {
        animal.bark();  // TypeScript 知道是 Dog
    }
}

// ============================================
// 8. 断言函数 (Assertion Functions)
// ============================================
// TypeScript 3.7+ 支持断言函数

function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Value must be a string");
    }
}

function assertNonNull<T>(value: T): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Value must not be null or undefined");
    }
}

function processInput(input: unknown) {
    assertIsString(input);
    // 在这之后，TypeScript 知道 input 是 string
    console.log(input.toUpperCase());
}

// processInput("hello");  // OK
// processInput(123);      // 运行时抛出错误

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: DOM 类型断言
 * 创建一个函数，获取表单中所有输入框的值
 */
function getFormValues(formId: string): Record<string, string> {
    // 模拟 DOM 环境
    const mockForm = {
        elements: [
            { name: "username", value: "张三", tagName: "INPUT" },
            { name: "email", value: "zhangsan@example.com", tagName: "INPUT" },
            { name: "submit", value: "提交", tagName: "BUTTON" }
        ]
    };

    const result: Record<string, string> = {};

    // TODO: 遍历 form.elements，获取所有 INPUT 元素的 name 和 value
    for (const element of mockForm.elements) {
        if (element.tagName === "INPUT") {
            // 使用类型断言
            const input = element as { name: string; value: string };
            result[input.name] = input.value;
        }
    }

    return result;
}

console.log("练习 1 - 表单值:", getFormValues("myForm"));

/**
 * 练习 2: 安全的 JSON 解析
 * 创建一个带类型断言的 JSON 解析函数
 */
interface ApiResponse {
    code: number;
    message: string;
    data: unknown;
}

function parseApiResponse(jsonString: string): ApiResponse {
    const parsed = JSON.parse(jsonString);

    // 验证必要字段存在
    if (
        typeof parsed === "object" &&
        parsed !== null &&
        "code" in parsed &&
        "message" in parsed
    ) {
        return parsed as ApiResponse;
    }

    throw new Error("Invalid API response format");
}

const jsonStr = '{"code": 200, "message": "success", "data": {"id": 1}}';
console.log("练习 2 - 解析响应:", parseApiResponse(jsonStr));

/**
 * 练习 3: 创建类型守卫
 * 验证对象是否符合 Rectangle 接口
 */
interface Rectangle {
    width: number;
    height: number;
}

interface Circle {
    radius: number;
}

type Shape = Rectangle | Circle;

function isRectangle(shape: Shape): shape is Rectangle {
    // TODO: 实现类型守卫
    return "width" in shape && "height" in shape;
}

function isCircle(shape: Shape): shape is Circle {
    return "radius" in shape;
}

function calculateArea(shape: Shape): number {
    if (isRectangle(shape)) {
        return shape.width * shape.height;
    } else {
        return Math.PI * shape.radius ** 2;
    }
}

console.log("练习 3 - 矩形面积:", calculateArea({ width: 10, height: 5 }));
console.log("练习 3 - 圆形面积:", calculateArea({ radius: 7 }));

/**
 * 练习 4: const 断言实践
 * 创建一个类型安全的配置对象
 */
const AppConfig = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    features: {
        darkMode: true,
        notifications: false
    }
} as const;

// 创建配置的类型
type AppConfigType = typeof AppConfig;
type FeatureKey = keyof typeof AppConfig.features;

function isFeatureEnabled(feature: FeatureKey): boolean {
    return AppConfig.features[feature];
}

console.log("练习 4 - darkMode 启用:", isFeatureEnabled("darkMode"));
console.log("练习 4 - notifications 启用:", isFeatureEnabled("notifications"));

// 导出
export {
    processValue,
    guardExample,
    isCat,
    isDog,
    assertIsString,
    calculateArea,
    isFeatureEnabled
};
