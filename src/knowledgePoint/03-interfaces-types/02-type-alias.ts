/**
 * 类型别名 (Type Aliases)
 *
 * 类型别名使用 type 关键字为类型创建新名称
 * 它可以命名任何类型，包括原始类型、联合类型、元组等
 */

// ============================================
// 1. 基本类型别名
// ============================================

// 为原始类型创建别名
type ID = string | number;
type Name = string;
type Age = number;

const userId: ID = "user_123";
const numericId: ID = 456;

console.log("ID 示例:", userId, numericId);

// 为复杂类型创建别名
type Point = {
    x: number;
    y: number;
};

const point: Point = { x: 10, y: 20 };
console.log("Point:", point);

// ============================================
// 2. 对象类型别名
// ============================================

type User = {
    id: ID;
    name: Name;
    email: string;
    age?: Age;
};

const user: User = {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com"
};

console.log("User:", user);

// 嵌套对象类型
type Address = {
    street: string;
    city: string;
    country: string;
    zipCode?: string;
};

type Customer = {
    user: User;
    address: Address;
    orders: Order[];
};

type Order = {
    id: string;
    total: number;
    items: OrderItem[];
};

type OrderItem = {
    productId: string;
    quantity: number;
    price: number;
};

// ============================================
// 3. 函数类型别名
// ============================================

// 简单函数类型
type Callback = () => void;
type NumberOperation = (a: number, b: number) => number;

const add: NumberOperation = (a, b) => a + b;
const multiply: NumberOperation = (a, b) => a * b;

console.log("函数类型:", add(5, 3), multiply(4, 6));

// 带泛型的函数类型
type Mapper<T, U> = (item: T) => U;
type Predicate<T> = (item: T) => boolean;
type Reducer<T, U> = (accumulator: U, current: T) => U;

const stringToNumber: Mapper<string, number> = (str) => str.length;
const isPositive: Predicate<number> = (num) => num > 0;
const sum: Reducer<number, number> = (acc, curr) => acc + curr;

console.log("stringToNumber:", stringToNumber("hello"));
console.log("isPositive:", isPositive(5));
console.log("sum:", [1, 2, 3].reduce(sum, 0));

// ============================================
// 4. 联合类型别名
// ============================================

// 字面量联合类型
type Direction = "north" | "south" | "east" | "west";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Status = "pending" | "processing" | "completed" | "failed";

function move(direction: Direction, distance: number): void {
    console.log(`向 ${direction} 移动 ${distance} 米`);
}

move("north", 100);

// 对象联合类型
type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

function handleResult<T>(result: Result<T>): void {
    if (result.success) {
        console.log("成功:", result.data);
    } else {
        console.log("失败:", result.error);
    }
}

handleResult({ success: true, data: { name: "张三" } });
handleResult({ success: false, error: "网络错误" });

// ============================================
// 5. 元组类型别名
// ============================================

type Coordinate = [number, number];
type Coordinate3D = [number, number, number];
type RGB = [red: number, green: number, blue: number];
type NamedPoint = [name: string, x: number, y: number];

const coord: Coordinate = [10, 20];
const color: RGB = [255, 128, 0];
const namedPoint: NamedPoint = ["原点", 0, 0];

console.log("坐标:", coord);
console.log("颜色:", color);
console.log("命名点:", namedPoint);

// 可变长度元组
type StringList = [string, ...string[]];
type NumberPairs = [number, number, ...Array<[number, number]>];

const stringList: StringList = ["first", "second", "third"];
console.log("字符串列表:", stringList);

// ============================================
// 6. 条件类型别名
// ============================================

// 简单条件类型
type IsString<T> = T extends string ? true : false;
type IsNumber<T> = T extends number ? true : false;

type Test1 = IsString<"hello">;  // true
type Test2 = IsString<123>;      // false
type Test3 = IsNumber<456>;      // true

// 提取类型
type ExtractArrayType<T> = T extends Array<infer U> ? U : never;
type ElementType = ExtractArrayType<string[]>;  // string

// 常用工具类型的实现
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

type PartialUser = MyPartial<User>;
type RequiredUser = MyRequired<User>;

// ============================================
// 7. 模板字面量类型
// ============================================

// 基本模板字面量
type Greeting = `Hello, ${string}`;
type EventName = `on${Capitalize<string>}`;

const greeting: Greeting = "Hello, World";
console.log(greeting);

// 组合字面量类型
type Vertical = "top" | "middle" | "bottom";
type Horizontal = "left" | "center" | "right";
type Position = `${Vertical}-${Horizontal}`;
// "top-left" | "top-center" | "top-right" | "middle-left" | ...

const position: Position = "top-center";
console.log("位置:", position);

// CSS 单位类型
type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;

const fontSize: CSSValue = "16px";
const margin: CSSValue = "1.5em";

console.log("CSS 值:", fontSize, margin);

// ============================================
// 8. 递归类型别名
// ============================================

// JSON 类型
type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

const json: JSONValue = {
    name: "张三",
    age: 25,
    hobbies: ["编程", "阅读"],
    address: {
        city: "北京",
        country: "中国"
    }
};

console.log("JSON:", json);

// 深度只读
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object
        ? DeepReadonly<T[K]>
        : T[K];
};

type NestedObject = {
    a: {
        b: {
            c: number;
        };
    };
};

type ReadonlyNested = DeepReadonly<NestedObject>;

// 树形结构
type TreeNode<T> = {
    value: T;
    children: TreeNode<T>[];
};

const tree: TreeNode<string> = {
    value: "root",
    children: [
        {
            value: "child1",
            children: []
        },
        {
            value: "child2",
            children: [
                { value: "grandchild", children: [] }
            ]
        }
    ]
};

console.log("树:", tree.value);

// ============================================
// 9. 实际应用示例
// ============================================

// 示例 1: API 配置类型
type RequestConfig = {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
    retries?: number;
};

type ResponseData<T> = {
    data: T;
    status: number;
    headers: Record<string, string>;
};

async function request<T>(_config: RequestConfig): Promise<ResponseData<T>> {
    // 模拟实现
    return {
        data: {} as T,
        status: 200,
        headers: {}
    };
}

// 示例 2: 状态机类型
type TrafficLight = "red" | "yellow" | "green";

type TrafficLightTransition = {
    red: "green";
    yellow: "red";
    green: "yellow";
};

function nextLight<T extends TrafficLight>(
    current: T
): TrafficLightTransition[T] {
    const transitions: TrafficLightTransition = {
        red: "green",
        yellow: "red",
        green: "yellow"
    };
    return transitions[current];
}

console.log("下一个信号灯:", nextLight("red"));  // green

// 示例 3: 表单验证类型
type ValidationRule<T> = {
    validator: (value: T) => boolean;
    message: string;
};

type FieldRules<T> = {
    [K in keyof T]?: ValidationRule<T[K]>[];
};

type LoginForm = {
    email: string;
    password: string;
};

const loginRules: FieldRules<LoginForm> = {
    email: [
        {
            validator: (value) => value.length > 0,
            message: "邮箱不能为空"
        },
        {
            validator: (value) => value.includes("@"),
            message: "请输入有效的邮箱"
        }
    ],
    password: [
        {
            validator: (value) => value.length >= 6,
            message: "密码至少6个字符"
        }
    ]
};

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个表示异步状态的类型
 */
type AsyncState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };

function renderAsyncState<T>(state: AsyncState<T>): string {
    switch (state.status) {
        case "idle":
            return "等待开始";
        case "loading":
            return "加载中...";
        case "success":
            return `成功: ${JSON.stringify(state.data)}`;
        case "error":
            return `错误: ${state.error.message}`;
    }
}

console.log("练习 1:", renderAsyncState({ status: "loading" }));
console.log("练习 1:", renderAsyncState({ status: "success", data: { id: 1 } }));

/**
 * 练习 2: 创建一个路由配置类型
 */
type RouteParams = Record<string, string>;

type Route = {
    path: string;
    component: string;
    exact?: boolean;
    children?: Route[];
    meta?: {
        title?: string;
        requiresAuth?: boolean;
        roles?: string[];
    };
};

type RouterConfig = {
    routes: Route[];
    mode: "hash" | "history";
    base?: string;
};

const routerConfig: RouterConfig = {
    mode: "history",
    base: "/app",
    routes: [
        {
            path: "/",
            component: "Home",
            meta: { title: "首页" }
        },
        {
            path: "/users",
            component: "UserLayout",
            meta: { requiresAuth: true },
            children: [
                { path: "", component: "UserList" },
                { path: ":id", component: "UserDetail" }
            ]
        }
    ]
};

console.log("练习 2 - 路由配置:", routerConfig.mode);

/**
 * 练习 3: 创建一个主题配置类型
 */
type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type ColorPalette = Record<ColorShade, string>;

type ThemeColors = {
    primary: ColorPalette;
    secondary: ColorPalette;
    gray: ColorPalette;
    success: string;
    warning: string;
    error: string;
};

type ThemeConfig = {
    colors: ThemeColors;
    fonts: {
        sans: string;
        serif: string;
        mono: string;
    };
    spacing: Record<number, string>;
    breakpoints: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
};

// 简化的主题配置示例
const theme: Partial<ThemeConfig> = {
    colors: {
        primary: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e"
        },
        secondary: {
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7e22ce",
            800: "#6b21a8",
            900: "#581c87"
        },
        gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827"
        },
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444"
    }
};

console.log("练习 3 - 主题主色:", theme.colors?.primary?.[500]);

// 导出
export {
    ID,
    Point,
    User,
    Result,
    Coordinate,
    JSONValue,
    AsyncState,
    Route,
    RouterConfig,
    ThemeConfig
};
