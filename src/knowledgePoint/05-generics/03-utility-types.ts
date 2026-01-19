/**
 * 内置工具类型 (Utility Types)
 *
 * TypeScript 提供了许多内置的工具类型，用于常见的类型转换
 */

// ============================================
// 1. Partial<T> - 所有属性变为可选
// ============================================

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

function updateUser(user: User, updates: Partial<User>): User {
    return { ...user, ...updates };
}

const user: User = { id: 1, name: "张三", email: "zhangsan@example.com", age: 25 };
const updated = updateUser(user, { name: "李四", age: 26 });
console.log("Partial 更新:", updated);

// ============================================
// 2. Required<T> - 所有属性变为必选
// ============================================

interface Config {
    host?: string;
    port?: number;
    timeout?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; timeout: number; }

function initServer(config: RequiredConfig): void {
    console.log(`Server: ${config.host}:${config.port}, timeout: ${config.timeout}ms`);
}

initServer({ host: "localhost", port: 3000, timeout: 5000 });

// ============================================
// 3. Readonly<T> - 所有属性变为只读
// ============================================

type ReadonlyUser = Readonly<User>;

const readonlyUser: ReadonlyUser = {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    age: 25
};

// readonlyUser.name = "李四";  // Error: 只读属性

// ============================================
// 4. Pick<T, K> - 选取指定属性
// ============================================

type UserBasicInfo = Pick<User, "id" | "name">;
// { id: number; name: string; }

const basicInfo: UserBasicInfo = {
    id: 1,
    name: "张三"
};

console.log("Pick:", basicInfo);

// ============================================
// 5. Omit<T, K> - 排除指定属性
// ============================================

type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string; age: number; }

type PublicUser = Omit<User, "email" | "age">;
// { id: number; name: string; }

const publicUser: PublicUser = {
    id: 1,
    name: "张三"
};

console.log("Omit:", publicUser);

// ============================================
// 6. Record<K, V> - 创建键值对类型
// ============================================

type UserRole = "admin" | "user" | "guest";

type RolePermissions = Record<UserRole, string[]>;

const permissions: RolePermissions = {
    admin: ["read", "write", "delete", "manage"],
    user: ["read", "write"],
    guest: ["read"]
};

console.log("Record:", permissions);

// 动态键
type DynamicObject = Record<string, unknown>;

const data: DynamicObject = {
    name: "张三",
    age: 25,
    active: true
};

// ============================================
// 7. Exclude<T, U> - 从联合类型中排除
// ============================================

type AllStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
type ActiveStatus = Exclude<AllStatus, "completed" | "cancelled">;
// "pending" | "processing" | "failed"

function processActiveOrder(status: ActiveStatus): void {
    console.log(`处理状态: ${status}`);
}

processActiveOrder("processing");

// ============================================
// 8. Extract<T, U> - 从联合类型中提取
// ============================================

type SuccessStatus = Extract<AllStatus, "completed" | "pending" | "unknown">;
// "pending" | "completed"

// ============================================
// 9. NonNullable<T> - 排除 null 和 undefined
// ============================================

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

function processString(value: DefiniteString): void {
    console.log(value.toUpperCase());
}

// ============================================
// 10. ReturnType<T> - 获取函数返回类型
// ============================================

function createUser(name: string, age: number) {
    return { id: Date.now(), name, age, createdAt: new Date() };
}

type CreateUserReturn = ReturnType<typeof createUser>;
// { id: number; name: string; age: number; createdAt: Date; }

const newUser: CreateUserReturn = createUser("王五", 30);
console.log("ReturnType:", newUser);

// ============================================
// 11. Parameters<T> - 获取函数参数类型
// ============================================

function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

type GreetParams = Parameters<typeof greet>;
// [name: string, greeting?: string]

const params: GreetParams = ["张三", "你好"];
console.log("Parameters:", greet(...params));

// ============================================
// 12. ConstructorParameters<T> - 获取构造函数参数类型
// ============================================

class Person {
    constructor(public name: string, public age: number, public city?: string) {}
}

type PersonParams = ConstructorParameters<typeof Person>;
// [name: string, age: number, city?: string]

const personArgs: PersonParams = ["张三", 25, "北京"];
const person = new Person(...personArgs);
console.log("ConstructorParameters:", person);

// ============================================
// 13. InstanceType<T> - 获取类的实例类型
// ============================================

type PersonInstance = InstanceType<typeof Person>;
// Person

function createPerson(Ctor: typeof Person): PersonInstance {
    return new Ctor("匿名", 0);
}

// ============================================
// 14. ThisType<T> - 指定 this 的类型
// ============================================

interface HelperThisValue {
    name: string;
    logName(): void;
}

type ObjectDescriptor<D, M> = {
    data?: D;
    methods?: M & ThisType<D & M>;
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
    const data: object = desc.data || {};
    const methods: object = desc.methods || {};
    return { ...data, ...methods } as D & M;
}

const obj = makeObject({
    data: { x: 0, y: 0 },
    methods: {
        moveBy(dx: number, dy: number) {
            this.x += dx;
            this.y += dy;
        }
    }
});

obj.moveBy(10, 20);
console.log("ThisType:", obj.x, obj.y);

// ============================================
// 15. 字符串操作类型
// ============================================

type Greeting = "hello";

type UpperGreeting = Uppercase<Greeting>;      // "HELLO"
type LowerGreeting = Lowercase<"HELLO">;       // "hello"
type CapitalGreeting = Capitalize<"hello">;    // "Hello"
type UncapGreeting = Uncapitalize<"Hello">;    // "hello"

// 实际应用: 生成 getter/setter 名称
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
    [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface Point {
    x: number;
    y: number;
}

type PointGetters = Getters<Point>;
// { getX: () => number; getY: () => number; }

type PointSetters = Setters<Point>;
// { setX: (value: number) => void; setY: (value: number) => void; }

// ============================================
// 16. Awaited<T> - 获取 Promise 解析后的类型
// ============================================

type PromiseString = Promise<string>;
type ResolvedString = Awaited<PromiseString>;  // string

type NestedPromise = Promise<Promise<number>>;
type ResolvedNumber = Awaited<NestedPromise>;  // number

// ============================================
// 实际应用示例
// ============================================

// 示例 1: API 响应处理
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

type UserResponse = ApiResponse<User>;
type UserListResponse = ApiResponse<User[]>;

// 创建部分更新的 API
type UpdateUserRequest = Partial<Omit<User, "id">>;

function updateUserApi(_id: number, data: UpdateUserRequest): Promise<User> {
    console.log("更新用户:", data);
    return Promise.resolve({ ...user, ...data });
}

// 示例 2: 表单状态管理
interface FormState<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isValid: boolean;
    isSubmitting: boolean;
}

type LoginForm = {
    email: string;
    password: string;
};

type LoginFormState = FormState<LoginForm>;

const loginState: LoginFormState = {
    values: { email: "", password: "" },
    errors: { email: "邮箱必填" },
    touched: { email: true },
    isValid: false,
    isSubmitting: false
};

console.log("表单状态:", loginState);

// 示例 3: 动态属性访问
function getNestedValue<T, K1 extends keyof T>(obj: T, key1: K1): T[K1];
function getNestedValue<T, K1 extends keyof T, K2 extends keyof T[K1]>(
    obj: T, key1: K1, key2: K2
): T[K1][K2];
function getNestedValue(obj: unknown, ...keys: string[]): unknown {
    return keys.reduce((acc: unknown, key) => (acc as Record<string, unknown>)[key], obj);
}

const nestedData = {
    user: {
        profile: {
            name: "张三"
        }
    }
};

console.log("嵌套访问:", getNestedValue(nestedData, "user"));

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个 DeepPartial 类型
 */
type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

interface DeepObject {
    a: {
        b: {
            c: number;
        };
        d: string;
    };
    e: boolean;
}

type DeepPartialObject = DeepPartial<DeepObject>;

const partialDeep: DeepPartialObject = {
    a: {
        b: {}  // c 是可选的
    }
};

console.log("练习 1 - DeepPartial:", partialDeep);

/**
 * 练习 2: 创建一个 Mutable 类型 (移除 readonly)
 */
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

type MutablePerson = Mutable<ReadonlyPerson>;

const mutablePerson: MutablePerson = { name: "张三", age: 25 };
mutablePerson.name = "李四";  // OK
console.log("练习 2 - Mutable:", mutablePerson);

/**
 * 练习 3: 创建一个 PickByType 类型
 */
type PickByType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K];
};

interface Mixed {
    id: number;
    name: string;
    age: number;
    active: boolean;
    email: string;
}

type StringProperties = PickByType<Mixed, string>;
// { name: string; email: string; }

type NumberProperties = PickByType<Mixed, number>;
// { id: number; age: number; }

const stringProps: StringProperties = {
    name: "张三",
    email: "test@example.com"
};

console.log("练习 3 - PickByType:", stringProps);

// 导出
export {
    updateUser,
    permissions,
    DeepPartial,
    Mutable,
    PickByType
};
