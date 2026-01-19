/**
 * this 类型 (this Type)
 *
 * TypeScript 允许在函数中声明 this 的类型，确保方法调用的类型安全
 */

// ============================================
// 1. this 参数基础
// ============================================

// this 参数是一个假参数，必须放在参数列表的第一位
interface User {
    name: string;
    age: number;
    greet(this: User): string;
}

const user: User = {
    name: "张三",
    age: 25,
    greet() {
        return `你好，我是 ${this.name}，今年 ${this.age} 岁`;
    }
};

console.log(user.greet());

// 如果以错误的方式调用，TypeScript 会报错
// const greetFn = user.greet;
// greetFn();  // Error: The 'this' context is not assignable

// ============================================
// 2. 类中的 this 类型
// ============================================

class Counter {
    private count: number = 0;

    increment(this: Counter): this {
        this.count++;
        return this;  // 返回 this 支持链式调用
    }

    decrement(this: Counter): this {
        this.count--;
        return this;
    }

    getCount(this: Counter): number {
        return this.count;
    }
}

const counter = new Counter();
console.log("链式调用:", counter.increment().increment().increment().getCount());

// ============================================
// 3. this 类型作为返回类型
// ============================================

// this 类型在继承中特别有用
class Builder {
    protected data: Record<string, unknown> = {};

    set(key: string, value: unknown): this {
        this.data[key] = value;
        return this;
    }

    build(): Record<string, unknown> {
        return { ...this.data };
    }
}

class UserBuilder extends Builder {
    setName(name: string): this {
        return this.set("name", name);
    }

    setAge(age: number): this {
        return this.set("age", age);
    }

    setEmail(email: string): this {
        return this.set("email", email);
    }
}

// this 类型确保返回的是子类实例
const userObj = new UserBuilder()
    .setName("李四")
    .setAge(30)
    .setEmail("lisi@example.com")
    .build();

console.log("构建的用户:", userObj);

// ============================================
// 4. ThisParameterType 工具类型
// ============================================

// 提取函数的 this 类型
function getUserName(this: { name: string }) {
    return this.name;
}

type GetUserNameThis = ThisParameterType<typeof getUserName>;
// GetUserNameThis = { name: string }

// 如果函数没有 this 参数，返回 unknown
function regularFunction() { }
type RegularThis = ThisParameterType<typeof regularFunction>;  // unknown

// ============================================
// 5. OmitThisParameter 工具类型
// ============================================

// 移除函数的 this 参数
function greetUser(this: { name: string }, greeting: string): string {
    return `${greeting}, ${this.name}!`;
}

type GreetWithoutThis = OmitThisParameter<typeof greetUser>;
// (greeting: string) => string

// 使用 bind 时有用
const boundGreet: GreetWithoutThis = greetUser.bind({ name: "王五" });
console.log("绑定后调用:", boundGreet("Hello"));

// ============================================
// 6. ThisType<T> 工具类型
// ============================================

// ThisType<T> 用于在对象字面量中指定 this 的类型
interface ObjectDescriptor<D, M> {
    data?: D;
    methods?: M & ThisType<D & M>;  // this 的类型是 D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
    const data: object = desc.data || {};
    const methods: object = desc.methods || {};
    return { ...data, ...methods } as D & M;
}

const obj = makeObject({
    data: { x: 0, y: 0 },
    methods: {
        moveBy(dx: number, dy: number) {
            this.x += dx;  // this 被正确推断
            this.y += dy;
        },
        getPosition() {
            return { x: this.x, y: this.y };
        }
    }
});

obj.moveBy(10, 20);
console.log("位置:", obj.getPosition());

// ============================================
// 7. 回调函数中的 this
// ============================================

interface ClickHandler {
    element: string;
    onClick(this: ClickHandler, event: { type: string }): void;
}

const handler: ClickHandler = {
    element: "button",
    onClick(event) {
        console.log(`${this.element} 被点击了: ${event.type}`);
    }
};

// 正确调用
handler.onClick({ type: "click" });

// 使用箭头函数避免 this 问题
class Button {
    label: string = "Click me";

    // 箭头函数自动捕获外层 this
    handleClick = () => {
        console.log(`按钮 "${this.label}" 被点击`);
    };
}

const button = new Button();
const clickHandler = button.handleClick;
clickHandler();  // 仍然可以正确访问 this.label

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 链式 API 设计
class QueryBuilder {
    private query: string[] = [];

    select(this: QueryBuilder, ...columns: string[]): this {
        this.query.push(`SELECT ${columns.join(", ")}`);
        return this;
    }

    from(this: QueryBuilder, table: string): this {
        this.query.push(`FROM ${table}`);
        return this;
    }

    where(this: QueryBuilder, condition: string): this {
        this.query.push(`WHERE ${condition}`);
        return this;
    }

    orderBy(this: QueryBuilder, column: string, direction: "ASC" | "DESC" = "ASC"): this {
        this.query.push(`ORDER BY ${column} ${direction}`);
        return this;
    }

    build(this: QueryBuilder): string {
        return this.query.join(" ");
    }
}

const sql = new QueryBuilder()
    .select("id", "name", "email")
    .from("users")
    .where("active = true")
    .orderBy("name")
    .build();

console.log("SQL:", sql);

// 示例 2: 状态管理
interface State {
    count: number;
    message: string;
}

interface Actions {
    increment(): void;
    setMessage(msg: string): void;
    reset(): void;
}

function createStore<S, A>(
    initialState: S,
    actions: A & ThisType<S & A>
): S & A {
    const state = { ...initialState };
    const boundActions: Partial<A> = {};

    for (const key of Object.keys(actions) as Array<keyof A>) {
        const action = actions[key];
        if (typeof action === "function") {
            boundActions[key] = (action as Function).bind(
                { ...state, ...boundActions }
            ) as A[keyof A];
        }
    }

    return { ...state, ...boundActions } as S & A;
}

// 示例 3: 事件监听器管理
class EventManager<T extends Record<string, unknown[]>> {
    private listeners: Map<keyof T, Set<Function>> = new Map();

    on<K extends keyof T>(
        this: EventManager<T>,
        event: K,
        listener: (...args: T[K]) => void
    ): this {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
        return this;
    }

    off<K extends keyof T>(
        this: EventManager<T>,
        event: K,
        listener: (...args: T[K]) => void
    ): this {
        this.listeners.get(event)?.delete(listener);
        return this;
    }

    emit<K extends keyof T>(
        this: EventManager<T>,
        event: K,
        ...args: T[K]
    ): this {
        this.listeners.get(event)?.forEach(listener => listener(...args));
        return this;
    }
}

interface MyEvents {
    click: [x: number, y: number];
    message: [text: string];
}

const events = new EventManager<MyEvents>();
events
    .on("click", (x, y) => console.log(`点击: (${x}, ${y})`))
    .on("message", (text) => console.log(`消息: ${text}`));

events.emit("click", 100, 200);
events.emit("message", "Hello!");

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个支持链式调用的验证器
 */
class Validator<T> {
    private value: T;
    private errors: string[] = [];

    constructor(value: T) {
        this.value = value;
    }

    required(this: Validator<T>, message: string = "值是必需的"): this {
        if (this.value === null || this.value === undefined || this.value === "") {
            this.errors.push(message);
        }
        return this;
    }

    min(this: Validator<number | string>, minValue: number, message?: string): this {
        const actual = typeof this.value === "string" ? this.value.length : this.value;
        if (actual < minValue) {
            this.errors.push(message || `值必须大于等于 ${minValue}`);
        }
        return this as unknown as this;
    }

    max(this: Validator<number | string>, maxValue: number, message?: string): this {
        const actual = typeof this.value === "string" ? this.value.length : this.value;
        if (actual > maxValue) {
            this.errors.push(message || `值必须小于等于 ${maxValue}`);
        }
        return this as unknown as this;
    }

    isValid(this: Validator<T>): boolean {
        return this.errors.length === 0;
    }

    getErrors(this: Validator<T>): string[] {
        return [...this.errors];
    }
}

const validation = new Validator("Hello")
    .required()
    .min(3)
    .max(10);

console.log("练习 1 - 是否有效:", validation.isValid());
console.log("练习 1 - 错误:", validation.getErrors());

/**
 * 练习 2: 创建一个可撤销的操作管理器
 */
class UndoManager<T> {
    private history: T[] = [];
    private current: T;

    constructor(initialValue: T) {
        this.current = initialValue;
    }

    execute(this: UndoManager<T>, newValue: T): this {
        this.history.push(this.current);
        this.current = newValue;
        return this;
    }

    undo(this: UndoManager<T>): this {
        const previous = this.history.pop();
        if (previous !== undefined) {
            this.current = previous;
        }
        return this;
    }

    getValue(this: UndoManager<T>): T {
        return this.current;
    }
}

const undoManager = new UndoManager(0);
undoManager.execute(1).execute(2).execute(3);
console.log("练习 2 - 当前值:", undoManager.getValue());  // 3
undoManager.undo();
console.log("练习 2 - 撤销后:", undoManager.getValue());  // 2

// 导出
export {
    Counter,
    Builder,
    UserBuilder,
    QueryBuilder,
    EventManager,
    Validator,
    UndoManager
};
