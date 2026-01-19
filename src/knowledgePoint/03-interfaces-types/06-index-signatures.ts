/**
 * 索引签名 (Index Signatures)
 *
 * 索引签名允许定义具有动态属性名的对象类型
 */

// ============================================
// 1. 字符串索引签名
// ============================================

// 基本字符串索引签名
interface StringDictionary {
    [key: string]: string;
}

const dict: StringDictionary = {
    hello: "你好",
    world: "世界",
    typescript: "类型脚本"
};

console.log("字典:", dict["hello"]);

// 访问任意属性
dict["newKey"] = "新值";
console.log("动态属性:", dict["newKey"]);

// ============================================
// 2. 数字索引签名
// ============================================

// 数字索引 (用于类数组对象)
interface NumberArray {
    [index: number]: string;
    length: number;
}

const arr: NumberArray = {
    0: "first",
    1: "second",
    2: "third",
    length: 3
};

console.log("类数组:", arr[0], arr[1], arr.length);

// 数字索引的值类型必须是字符串索引值类型的子类型
interface Mixed {
    [key: string]: string | number;
    [index: number]: string;  // string 是 string | number 的子类型
}

// ============================================
// 3. 索引签名与具体属性
// ============================================

interface Config {
    // 具体属性
    name: string;
    version: number;
    // 索引签名 (允许其他任意属性)
    [key: string]: string | number | boolean;
}

const config: Config = {
    name: "MyApp",
    version: 1,
    debug: true,
    apiUrl: "https://api.example.com"
};

console.log("配置:", config.name, config.debug);

// 注意: 具体属性的类型必须与索引签名兼容
interface InvalidConfig {
    // name: Date;  // Error: Date 不是 string | number | boolean 的子类型
    // [key: string]: string | number | boolean;
}

// ============================================
// 4. 只读索引签名
// ============================================

interface ReadonlyStringArray {
    readonly [index: number]: string;
}

const roArray: ReadonlyStringArray = ["a", "b", "c"];
// roArray[0] = "x";  // Error: 只读属性

interface ReadonlyDictionary {
    readonly [key: string]: number;
}

const scores: ReadonlyDictionary = {
    math: 90,
    english: 85,
    science: 92
};

// scores["math"] = 100;  // Error: 只读属性
console.log("只读字典:", scores["math"]);

// ============================================
// 5. 映射类型 (Mapped Types)
// ============================================

// 基本映射类型
type Readonly2<T> = {
    readonly [K in keyof T]: T[K];
};

type Optional<T> = {
    [K in keyof T]?: T[K];
};

interface User {
    id: number;
    name: string;
    email: string;
}

type ReadonlyUser = Readonly2<User>;
type OptionalUser = Optional<User>;

const readonlyUser: ReadonlyUser = {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com"
};

// readonlyUser.id = 2;  // Error: 只读

const optionalUser: OptionalUser = {
    name: "李四"
    // id 和 email 是可选的
};

console.log("映射类型:", readonlyUser, optionalUser);

// ============================================
// 6. 键重映射 (Key Remapping)
// ============================================

// 使用 as 子句重映射键
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
    [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface Person {
    name: string;
    age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

type PersonSetters = Setters<Person>;
// { setName: (value: string) => void; setAge: (value: number) => void; }

// 过滤键
type FilterByType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K];
};

interface Mixed {
    id: number;
    name: string;
    age: number;
    email: string;
}

type StringProps = FilterByType<Mixed, string>;
// { name: string; email: string; }

type NumberProps = FilterByType<Mixed, number>;
// { id: number; age: number; }

// ============================================
// 7. 模板字面量与映射类型
// ============================================

type EventHandlers<T> = {
    [K in keyof T as `on${Capitalize<string & K>}Change`]: (newValue: T[K], oldValue: T[K]) => void;
};

interface FormData {
    username: string;
    password: string;
    remember: boolean;
}

type FormEventHandlers = EventHandlers<FormData>;
// {
//   onUsernameChange: (newValue: string, oldValue: string) => void;
//   onPasswordChange: (newValue: string, oldValue: string) => void;
//   onRememberChange: (newValue: boolean, oldValue: boolean) => void;
// }

const handlers: FormEventHandlers = {
    onUsernameChange(newVal, oldVal) {
        console.log(`用户名从 ${oldVal} 改为 ${newVal}`);
    },
    onPasswordChange(newVal, _oldVal) {
        console.log(`密码已更新: ${newVal.length} 个字符`);
    },
    onRememberChange(newVal) {
        console.log(`记住我: ${newVal}`);
    }
};

handlers.onUsernameChange("newuser", "olduser");

// ============================================
// 8. Record 工具类型
// ============================================

// Record<K, V> 创建一个对象类型，键为 K，值为 V
type UserRoles = Record<"admin" | "user" | "guest", boolean>;

const roles: UserRoles = {
    admin: false,
    user: true,
    guest: false
};

console.log("用户角色:", roles);

// 更复杂的 Record
type PageInfo = {
    title: string;
    url: string;
};

type Pages = Record<"home" | "about" | "contact", PageInfo>;

const pages: Pages = {
    home: { title: "首页", url: "/" },
    about: { title: "关于", url: "/about" },
    contact: { title: "联系", url: "/contact" }
};

console.log("页面配置:", pages.home.title);

// ============================================
// 9. 实际应用示例
// ============================================

// 示例 1: 国际化 (i18n) 配置
type LocaleKey = "zh-CN" | "en-US" | "ja-JP";

interface Translation {
    [key: string]: string;
}

type I18nConfig = Record<LocaleKey, Translation>;

const i18n: I18nConfig = {
    "zh-CN": {
        greeting: "你好",
        farewell: "再见",
        welcome: "欢迎"
    },
    "en-US": {
        greeting: "Hello",
        farewell: "Goodbye",
        welcome: "Welcome"
    },
    "ja-JP": {
        greeting: "こんにちは",
        farewell: "さようなら",
        welcome: "ようこそ"
    }
};

function translate(key: string, locale: LocaleKey): string {
    return i18n[locale][key] || key;
}

console.log("翻译:", translate("greeting", "zh-CN"));
console.log("翻译:", translate("greeting", "ja-JP"));

// 示例 2: CSS 样式对象
interface CSSProperties {
    [property: string]: string | number | undefined;
}

interface StyleSheet {
    [className: string]: CSSProperties;
}

const styles: StyleSheet = {
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        backgroundColor: "#f0f0f0"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333"
    },
    button: {
        padding: "10px 20px",
        borderRadius: 4,
        cursor: "pointer"
    }
};

console.log("样式:", styles.container);

// 示例 3: 数据库表映射
interface Column {
    type: "string" | "number" | "boolean" | "date";
    nullable?: boolean;
    primaryKey?: boolean;
    unique?: boolean;
    default?: unknown;
}

interface TableSchema {
    [columnName: string]: Column;
}

interface DatabaseSchema {
    [tableName: string]: TableSchema;
}

const schema: DatabaseSchema = {
    users: {
        id: { type: "number", primaryKey: true },
        username: { type: "string", unique: true },
        email: { type: "string", unique: true },
        createdAt: { type: "date", default: "NOW()" }
    },
    posts: {
        id: { type: "number", primaryKey: true },
        title: { type: "string" },
        content: { type: "string", nullable: true },
        authorId: { type: "number" },
        published: { type: "boolean", default: false }
    }
};

console.log("数据库表:", Object.keys(schema));

// 示例 4: 事件总线
type EventCallback = (...args: unknown[]) => void;

interface EventBus {
    [eventName: string]: EventCallback[];
}

class EventEmitter {
    private events: EventBus = {};

    on(event: string, callback: EventCallback): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event: string, ...args: unknown[]): void {
        const callbacks = this.events[event];
        if (callbacks) {
            callbacks.forEach(callback => callback(...args));
        }
    }

    off(event: string, callback: EventCallback): void {
        const callbacks = this.events[event];
        if (callbacks) {
            this.events[event] = callbacks.filter(cb => cb !== callback);
        }
    }
}

const emitter = new EventEmitter();
emitter.on("userLogin", (userId: unknown) => {
    console.log(`用户 ${userId} 登录了`);
});
emitter.emit("userLogin", 123);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个类型安全的缓存
 */
interface Cache<T> {
    [key: string]: {
        value: T;
        expiry: number;
    };
}

class TypedCache<T> {
    private cache: Cache<T> = {};

    set(key: string, value: T, ttlMs: number = 60000): void {
        this.cache[key] = {
            value,
            expiry: Date.now() + ttlMs
        };
    }

    get(key: string): T | undefined {
        const item = this.cache[key];
        if (!item) return undefined;

        if (Date.now() > item.expiry) {
            delete this.cache[key];
            return undefined;
        }

        return item.value;
    }

    delete(key: string): void {
        delete this.cache[key];
    }

    clear(): void {
        this.cache = {};
    }
}

const userCache = new TypedCache<{ name: string; age: number }>();
userCache.set("user1", { name: "张三", age: 25 });
console.log("练习 1 - 缓存:", userCache.get("user1"));

/**
 * 练习 2: 创建一个 API 端点映射
 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface Endpoint {
    method: HttpMethod;
    path: string;
    requiresAuth: boolean;
}

type ApiEndpoints = {
    [name: string]: Endpoint;
};

const api: ApiEndpoints = {
    getUsers: { method: "GET", path: "/users", requiresAuth: true },
    createUser: { method: "POST", path: "/users", requiresAuth: true },
    updateUser: { method: "PUT", path: "/users/:id", requiresAuth: true },
    deleteUser: { method: "DELETE", path: "/users/:id", requiresAuth: true },
    login: { method: "POST", path: "/auth/login", requiresAuth: false }
};

function buildUrl(endpoint: Endpoint, params?: Record<string, string>): string {
    let path = endpoint.path;
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            path = path.replace(`:${key}`, value);
        }
    }
    return path;
}

console.log("练习 2 - API URL:", buildUrl(api.updateUser, { id: "123" }));

/**
 * 练习 3: 创建一个验证规则映射
 */
type ValidationRule<T> = (value: T) => string | null;

type ValidationRules<T> = {
    [K in keyof T]?: ValidationRule<T[K]>[];
};

interface RegistrationForm {
    username: string;
    email: string;
    password: string;
    age: number;
}

const registrationRules: ValidationRules<RegistrationForm> = {
    username: [
        (value) => value.length < 3 ? "用户名至少3个字符" : null,
        (value) => value.length > 20 ? "用户名最多20个字符" : null,
        (value) => !/^[a-zA-Z0-9_]+$/.test(value) ? "用户名只能包含字母、数字和下划线" : null
    ],
    email: [
        (value) => !value.includes("@") ? "请输入有效的邮箱" : null
    ],
    password: [
        (value) => value.length < 6 ? "密码至少6个字符" : null,
        (value) => !/[A-Z]/.test(value) ? "密码需要包含大写字母" : null,
        (value) => !/[0-9]/.test(value) ? "密码需要包含数字" : null
    ],
    age: [
        (value) => value < 0 ? "年龄不能为负数" : null,
        (value) => value > 150 ? "年龄不能超过150" : null
    ]
};

function validate<T extends object>(
    data: T,
    rules: ValidationRules<T>
): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    for (const key of Object.keys(rules) as Array<keyof T>) {
        const fieldRules = rules[key];
        if (!fieldRules) continue;

        const fieldErrors: string[] = [];
        for (const rule of fieldRules) {
            const error = rule(data[key]);
            if (error) {
                fieldErrors.push(error);
            }
        }

        if (fieldErrors.length > 0) {
            errors[key as string] = fieldErrors;
        }
    }

    return errors;
}

const formData: RegistrationForm = {
    username: "ab",
    email: "invalid",
    password: "weak",
    age: 25
};

console.log("练习 3 - 验证结果:", validate(formData, registrationRules));

// 导出
export {
    StringDictionary,
    Config,
    Getters,
    Setters,
    FilterByType,
    EventHandlers,
    TypedCache,
    ApiEndpoints,
    ValidationRules,
    validate
};
