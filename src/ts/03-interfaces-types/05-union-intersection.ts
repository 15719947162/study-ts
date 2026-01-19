/**
 * 联合类型与交叉类型 (Union & Intersection Types)
 *
 * 联合类型 (|): 表示值可以是几种类型之一
 * 交叉类型 (&): 表示值同时具有多种类型的特性
 */

// ============================================
// 1. 联合类型基础
// ============================================

// 基本联合类型
type StringOrNumber = string | number;

let value: StringOrNumber = "hello";
value = 42;
// value = true;  // Error: 不能赋值 boolean

console.log("联合类型:", value);

// 字面量联合类型
type Direction = "north" | "south" | "east" | "west";
type Status = "pending" | "processing" | "completed" | "failed";
type HttpCode = 200 | 201 | 400 | 401 | 404 | 500;

function move(direction: Direction): void {
    console.log(`向 ${direction} 移动`);
}

move("north");

// ============================================
// 2. 联合类型的类型收窄
// ============================================

function processValue(value: string | number): string {
    // 使用 typeof 进行类型收窄
    if (typeof value === "string") {
        return value.toUpperCase();  // TypeScript 知道这里是 string
    } else {
        return value.toFixed(2);     // TypeScript 知道这里是 number
    }
}

console.log("处理字符串:", processValue("hello"));
console.log("处理数字:", processValue(3.14159));

// 使用 in 运算符收窄
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

function getAnimalAction(animal: Bird | Fish): void {
    if ("fly" in animal) {
        animal.fly();
    } else {
        animal.swim();
    }
    // 共同方法可以直接调用
    animal.layEggs();
}

// 使用 instanceof 收窄
function processDate(value: Date | string): string {
    if (value instanceof Date) {
        return value.toISOString();
    }
    return value;
}

console.log("处理日期:", processDate(new Date()));

// ============================================
// 3. 可辨识联合 (Discriminated Unions)
// ============================================

// 使用共同的字面量属性区分类型
interface Circle {
    kind: "circle";
    radius: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

interface Triangle {
    kind: "triangle";
    base: number;
    height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
    }
}

console.log("圆面积:", getArea({ kind: "circle", radius: 5 }));
console.log("矩形面积:", getArea({ kind: "rectangle", width: 10, height: 5 }));

// 穷尽性检查
function assertNever(x: never): never {
    throw new Error(`Unexpected value: ${x}`);
}

function getPerimeter(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return 2 * Math.PI * shape.radius;
        case "rectangle":
            return 2 * (shape.width + shape.height);
        case "triangle":
            // 简化: 假设是等腰三角形
            const side = Math.sqrt(shape.base ** 2 / 4 + shape.height ** 2);
            return shape.base + 2 * side;
        default:
            return assertNever(shape);
    }
}

// ============================================
// 4. 交叉类型基础
// ============================================

// 合并对象类型
interface Person {
    name: string;
    age: number;
}

interface Employee {
    employeeId: string;
    department: string;
}

type PersonEmployee = Person & Employee;

const employee: PersonEmployee = {
    name: "张三",
    age: 30,
    employeeId: "EMP001",
    department: "技术部"
};

console.log("交叉类型:", employee);

// ============================================
// 5. 交叉类型与接口继承的区别
// ============================================

// 接口继承: 属性冲突会报错
interface A {
    x: number;
}

// interface B extends A {
//     x: string;  // Error: 类型不兼容
// }

// 交叉类型: 属性冲突会变成 never
type TypeA = {
    x: number;
};

type TypeB = {
    x: string;
};

type TypeC = TypeA & TypeB;
// TypeC 的 x 属性类型是 never (number & string = never)

// const c: TypeC = { x: ??? };  // 无法赋值

// 但如果属性类型兼容，则会取交集
type D = {
    x: number | string;
};

type E = {
    x: string | boolean;
};

type F = D & E;
// F 的 x 属性类型是 string (联合类型的交集)

const f: F = { x: "hello" };  // OK
console.log("类型交集:", f);

// ============================================
// 6. 混合使用联合和交叉类型
// ============================================

// 复杂类型组合
type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

type PaginatedResult<T> = Result<T> & {
    page: number;
    totalPages: number;
};

// 但这样会导致问题，因为 error 分支也需要分页信息
// 更好的方式:
type PaginatedData<T> = {
    items: T[];
    page: number;
    totalPages: number;
    total: number;
};

type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

type PaginatedApiResult<T> = ApiResult<PaginatedData<T>>;

function handlePaginatedResult<T>(result: PaginatedApiResult<T>): void {
    if (result.success) {
        console.log(`共 ${result.data.total} 条，当前第 ${result.data.page} 页`);
        console.log("数据:", result.data.items);
    } else {
        console.log("错误:", result.error);
    }
}

// ============================================
// 7. 条件类型与联合类型
// ============================================

// 分布式条件类型
type ToArray<T> = T extends unknown ? T[] : never;

type StrOrNumArray = ToArray<string | number>;
// string[] | number[] (分布式)

// 非分布式条件类型
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

type StrOrNumArrayNonDist = ToArrayNonDist<string | number>;
// (string | number)[] (非分布式)

// 从联合类型中排除
type Exclude2<T, U> = T extends U ? never : T;

type Remaining = Exclude2<"a" | "b" | "c", "a">;
// "b" | "c"

// 提取联合类型
type Extract2<T, U> = T extends U ? T : never;

type Extracted = Extract2<string | number | boolean, string | boolean>;
// string | boolean

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: Redux Action 类型
interface AddTodoAction {
    type: "ADD_TODO";
    payload: {
        id: string;
        text: string;
    };
}

interface ToggleTodoAction {
    type: "TOGGLE_TODO";
    payload: {
        id: string;
    };
}

interface RemoveTodoAction {
    type: "REMOVE_TODO";
    payload: {
        id: string;
    };
}

interface SetFilterAction {
    type: "SET_FILTER";
    payload: {
        filter: "all" | "active" | "completed";
    };
}

type TodoAction =
    | AddTodoAction
    | ToggleTodoAction
    | RemoveTodoAction
    | SetFilterAction;

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface TodoState {
    todos: Todo[];
    filter: "all" | "active" | "completed";
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
    switch (action.type) {
        case "ADD_TODO":
            return {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: action.payload.id,
                        text: action.payload.text,
                        completed: false
                    }
                ]
            };
        case "TOGGLE_TODO":
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };
        case "REMOVE_TODO":
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload.id)
            };
        case "SET_FILTER":
            return {
                ...state,
                filter: action.payload.filter
            };
    }
}

// 示例 2: 混入模式 (Mixins)
type Constructor<T = {}> = new (...args: unknown[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        timestamp = Date.now();
    };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        isActive = false;

        activate() {
            this.isActive = true;
        }

        deactivate() {
            this.isActive = false;
        }
    };
}

class BaseClass {
    constructor(public name: string) {}
}

// 组合混入
const TimestampedActivatableClass = Timestamped(Activatable(BaseClass));

const instance = new TimestampedActivatableClass("测试");
console.log("混入示例:", instance.name, instance.timestamp, instance.isActive);
instance.activate();
console.log("激活后:", instance.isActive);

// 示例 3: 表单字段类型
interface BaseField {
    name: string;
    label: string;
    required?: boolean;
}

interface TextField extends BaseField {
    type: "text" | "email" | "password";
    placeholder?: string;
    maxLength?: number;
}

interface NumberField extends BaseField {
    type: "number";
    min?: number;
    max?: number;
    step?: number;
}

interface SelectField extends BaseField {
    type: "select";
    options: Array<{ value: string; label: string }>;
    multiple?: boolean;
}

interface CheckboxField extends BaseField {
    type: "checkbox";
    checked?: boolean;
}

type FormField = TextField | NumberField | SelectField | CheckboxField;

function renderField(field: FormField): void {
    console.log(`渲染字段: ${field.label} (${field.type})`);

    switch (field.type) {
        case "text":
        case "email":
        case "password":
            console.log(`  placeholder: ${field.placeholder || "无"}`);
            break;
        case "number":
            console.log(`  范围: ${field.min ?? "无"} - ${field.max ?? "无"}`);
            break;
        case "select":
            console.log(`  选项数: ${field.options.length}`);
            break;
        case "checkbox":
            console.log(`  默认值: ${field.checked || false}`);
            break;
    }
}

const fields: FormField[] = [
    { name: "username", label: "用户名", type: "text", placeholder: "请输入用户名" },
    { name: "age", label: "年龄", type: "number", min: 0, max: 150 },
    { name: "country", label: "国家", type: "select", options: [
        { value: "cn", label: "中国" },
        { value: "us", label: "美国" }
    ]},
    { name: "agree", label: "同意条款", type: "checkbox" }
];

fields.forEach(renderField);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个支付方式联合类型
 */
interface CreditCardPayment {
    method: "credit_card";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

interface PayPalPayment {
    method: "paypal";
    email: string;
}

interface BankTransferPayment {
    method: "bank_transfer";
    bankName: string;
    accountNumber: string;
}

interface CryptoPayment {
    method: "crypto";
    currency: "BTC" | "ETH" | "USDT";
    walletAddress: string;
}

type PaymentMethod = CreditCardPayment | PayPalPayment | BankTransferPayment | CryptoPayment;

function processPayment(payment: PaymentMethod, amount: number): void {
    console.log(`处理 ¥${amount} 的付款`);

    switch (payment.method) {
        case "credit_card":
            console.log(`使用信用卡 ****${payment.cardNumber.slice(-4)}`);
            break;
        case "paypal":
            console.log(`使用 PayPal 账户 ${payment.email}`);
            break;
        case "bank_transfer":
            console.log(`银行转账到 ${payment.bankName}`);
            break;
        case "crypto":
            console.log(`使用 ${payment.currency} 支付`);
            break;
    }
}

processPayment(
    { method: "credit_card", cardNumber: "1234567890123456", expiryDate: "12/25", cvv: "123" },
    100
);

/**
 * 练习 2: 创建一个响应式状态类型
 */
type LoadingState = { status: "loading" };
type ErrorState = { status: "error"; error: Error };
type SuccessState<T> = { status: "success"; data: T };
type IdleState = { status: "idle" };

type AsyncState<T> = IdleState | LoadingState | ErrorState | SuccessState<T>;

function renderAsyncState<T>(state: AsyncState<T>, render: (data: T) => string): string {
    switch (state.status) {
        case "idle":
            return "等待开始...";
        case "loading":
            return "加载中...";
        case "error":
            return `错误: ${state.error.message}`;
        case "success":
            return render(state.data);
    }
}

console.log("练习 2:", renderAsyncState(
    { status: "success", data: { name: "张三" } },
    (data) => `用户: ${data.name}`
));

/**
 * 练习 3: 使用交叉类型创建可扩展的配置
 */
type WithId = { id: string };
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type WithSoftDelete = { deletedAt?: Date; isDeleted: boolean };

type BaseEntity = WithId & WithTimestamps;
type SoftDeletableEntity = BaseEntity & WithSoftDelete;

interface UserEntity extends SoftDeletableEntity {
    username: string;
    email: string;
}

const userEntity: UserEntity = {
    id: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    username: "zhangsan",
    email: "zhangsan@example.com"
};

console.log("练习 3 - 用户实体:", userEntity.username, userEntity.id);

// 导出
export {
    Shape,
    getArea,
    TodoAction,
    todoReducer,
    FormField,
    PaymentMethod,
    AsyncState,
    renderAsyncState,
    UserEntity
};
