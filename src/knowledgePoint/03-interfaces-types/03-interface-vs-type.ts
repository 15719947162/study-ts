/**
 * 接口 vs 类型别名 (Interface vs Type Alias)
 *
 * 接口和类型别名都可以用来定义对象类型，但它们有一些重要区别
 */

// ============================================
// 1. 语法差异
// ============================================

// 接口定义
interface PointInterface {
    x: number;
    y: number;
}

// 类型别名定义
type PointType = {
    x: number;
    y: number;
};

// 使用上没有区别
const p1: PointInterface = { x: 10, y: 20 };
const p2: PointType = { x: 30, y: 40 };

console.log("接口:", p1);
console.log("类型:", p2);

// ============================================
// 2. 扩展方式
// ============================================

// 接口使用 extends 扩展
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

// 类型别名使用交叉类型 (&) 扩展
type AnimalType = {
    name: string;
};

type DogType = AnimalType & {
    breed: string;
};

const dog1: Dog = { name: "旺财", breed: "柴犬" };
const dog2: DogType = { name: "小黑", breed: "拉布拉多" };

console.log("接口扩展:", dog1);
console.log("类型扩展:", dog2);

// 接口也可以扩展类型别名
interface Cat extends AnimalType {
    color: string;
}

// 类型别名也可以扩展接口
type Bird = Animal & {
    canFly: boolean;
};

// ============================================
// 3. 声明合并 (仅接口支持)
// ============================================

// 同名接口会自动合并
interface Window {
    title: string;
}

interface Window {
    ts: string;
}

// 合并后的 Window 接口有两个属性
const win: Window = {
    title: "TypeScript 学习",
    ts: "5.0"
};

console.log("声明合并:", win);

// 类型别名不能重复声明
// type Duplicate = { a: string };
// type Duplicate = { b: number };  // Error: 重复标识符

// ============================================
// 4. 类型别名独有的功能
// ============================================

// 原始类型别名
type Name = string;
type ID = string | number;
type Nullable<T> = T | null;

// 联合类型
type Status = "pending" | "approved" | "rejected";

// 元组类型
type Pair<T, U> = [T, U];
type Coordinate = [number, number];

// 映射类型
type Readonly2<T> = {
    readonly [K in keyof T]: T[K];
};

// 条件类型
type NonNullable2<T> = T extends null | undefined ? never : T;

// 这些都不能用接口实现
const status: Status = "pending";
const coord: Coordinate = [10, 20];
const name: Nullable<string> = null;

console.log("类型别名独有功能:", status, coord, name);

// ============================================
// 5. 计算属性
// ============================================

// 类型别名可以使用计算属性
type Keys = "firstName" | "lastName";

type Person = {
    [K in Keys]: string;
};
// 等于 { firstName: string; lastName: string; }

// 接口不能使用映射类型
// interface PersonInterface {
//     [K in Keys]: string;  // Error
// }

const person: Person = {
    firstName: "张",
    lastName: "三"
};

console.log("计算属性:", person);

// ============================================
// 6. 实现与继承
// ============================================

// 类可以实现接口
interface Printable {
    print(): void;
}

class Document implements Printable {
    print(): void {
        console.log("打印文档");
    }
}

// 类也可以实现类型别名 (只要是对象类型)
type Serializable = {
    serialize(): string;
};

class DataModel implements Serializable {
    constructor(private data: object) {}

    serialize(): string {
        return JSON.stringify(this.data);
    }
}

const doc = new Document();
doc.print();

const model = new DataModel({ id: 1, name: "test" });
console.log("序列化:", model.serialize());

// ============================================
// 7. 性能考虑
// ============================================

// 接口创建命名类型，在错误消息中更容易阅读
interface UserInterface {
    id: number;
    name: string;
    email: string;
}

// 类型别名在复杂类型时可能显示展开的类型
type UserType = {
    id: number;
    name: string;
    email: string;
};

// 当鼠标悬停时:
// - UserInterface 显示为 "UserInterface"
// - UserType 可能显示为 "{ id: number; name: string; email: string; }"

// ============================================
// 8. 最佳实践
// ============================================

// 推荐使用接口的场景:
// 1. 定义对象的形状
interface ApiResponse {
    code: number;
    message: string;
    data: unknown;
}

// 2. 需要声明合并 (如扩展第三方库)
interface Array<T> {
    customMethod?(): void;
}

// 3. 类的实现契约
interface Repository<T> {
    findById(id: string): T | null;
    save(entity: T): void;
    delete(id: string): void;
}

// 推荐使用类型别名的场景:
// 1. 联合类型
type Result<T, E> = { success: true; data: T } | { success: false; error: E };

// 2. 元组类型
type Range = [start: number, end: number];

// 3. 复杂类型操作
type Partial2<T> = { [K in keyof T]?: T[K] };

// 4. 函数类型
type EventHandler<T> = (event: T) => void;

// 5. 原始类型别名
type UserId = string;

// ============================================
// 9. 综合对比示例
// ============================================

// 场景: 构建一个状态管理系统

// 使用接口定义状态形状
interface AppState {
    user: UserState | null;
    theme: ThemeState;
    notifications: Notification[];
}

interface UserState {
    id: number;
    name: string;
    role: UserRole;
}

interface ThemeState {
    mode: ThemeMode;
    primaryColor: string;
}

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    read: boolean;
}

// 使用类型别名定义联合类型和工具类型
type UserRole = "admin" | "user" | "guest";
type ThemeMode = "light" | "dark" | "system";
type NotificationType = "info" | "success" | "warning" | "error";

// Action 类型使用类型别名 (联合类型)
type AppAction =
    | { type: "SET_USER"; payload: UserState }
    | { type: "LOGOUT" }
    | { type: "SET_THEME"; payload: ThemeMode }
    | { type: "ADD_NOTIFICATION"; payload: Notification }
    | { type: "MARK_READ"; payload: string };

// Reducer 函数
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case "SET_USER":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        case "SET_THEME":
            return {
                ...state,
                theme: { ...state.theme, mode: action.payload }
            };
        case "ADD_NOTIFICATION":
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
        case "MARK_READ":
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, read: true } : n
                )
            };
    }
}

// 初始状态
const initialState: AppState = {
    user: null,
    theme: { mode: "light", primaryColor: "#007bff" },
    notifications: []
};

// 测试 reducer
let state = initialState;
state = appReducer(state, {
    type: "SET_USER",
    payload: { id: 1, name: "张三", role: "admin" }
});
state = appReducer(state, { type: "SET_THEME", payload: "dark" });

console.log("状态管理示例:", state);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 选择合适的定义方式
 * 根据场景选择使用接口或类型别名
 */

// 定义 HTTP 方法 (应该用类型别名 - 联合类型)
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 定义请求配置 (可以用接口 - 对象形状)
interface RequestConfig {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
}

// 定义响应结果 (应该用类型别名 - 联合类型)
type ResponseResult<T> =
    | { ok: true; data: T; status: number }
    | { ok: false; error: string; status: number };

console.log("练习 1 完成");

/**
 * 练习 2: 扩展第三方类型
 * 使用声明合并扩展接口
 */

// 假设这是一个第三方库定义的接口
interface ThirdPartyConfig {
    apiKey: string;
}

// 我们可以通过声明合并添加属性
interface ThirdPartyConfig {
    customOption?: string;
    debug?: boolean;
}

const config: ThirdPartyConfig = {
    apiKey: "xxx",
    customOption: "custom",
    debug: true
};

console.log("练习 2 - 扩展配置:", config);

/**
 * 练习 3: 混合使用接口和类型别名
 * 创建一个表单验证系统
 */

// 使用类型别名定义验证规则类型
type ValidatorFn<T> = (value: T) => string | null;

type ValidationResult = {
    valid: boolean;
    errors: Record<string, string[]>;
};

// 使用接口定义表单字段
interface FormField<T> {
    value: T;
    validators: ValidatorFn<T>[];
    touched: boolean;
    dirty: boolean;
}

// 使用映射类型创建表单类型
type Form<T> = {
    [K in keyof T]: FormField<T[K]>;
};

// 示例表单数据类型
interface LoginData {
    email: string;
    password: string;
}

// 创建登录表单
const loginForm: Form<LoginData> = {
    email: {
        value: "",
        validators: [
            (v) => v.length === 0 ? "邮箱不能为空" : null,
            (v) => !v.includes("@") ? "邮箱格式不正确" : null
        ],
        touched: false,
        dirty: false
    },
    password: {
        value: "",
        validators: [
            (v) => v.length === 0 ? "密码不能为空" : null,
            (v) => v.length < 6 ? "密码至少6个字符" : null
        ],
        touched: false,
        dirty: false
    }
};

// 验证函数
function validateForm<T>(form: Form<T>): ValidationResult {
    const errors: Record<string, string[]> = {};
    let valid = true;

    for (const key of Object.keys(form) as Array<keyof T>) {
        const field = form[key];
        const fieldErrors: string[] = [];

        for (const validator of field.validators) {
            const error = validator(field.value);
            if (error) {
                fieldErrors.push(error);
                valid = false;
            }
        }

        if (fieldErrors.length > 0) {
            errors[key as string] = fieldErrors;
        }
    }

    return { valid, errors };
}

console.log("练习 3 - 表单验证:", validateForm(loginForm));

// 导出
export {
    PointInterface,
    PointType,
    AppState,
    AppAction,
    appReducer,
    HttpMethod,
    RequestConfig,
    ResponseResult,
    Form,
    validateForm
};
