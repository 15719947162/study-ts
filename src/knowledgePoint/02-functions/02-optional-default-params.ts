/**
 * 可选参数与默认参数 (Optional & Default Parameters)
 *
 * TypeScript 支持可选参数 (?) 和默认参数 (=)
 */

// ============================================
// 1. 可选参数
// ============================================

// 使用 ? 标记可选参数
function greet(name: string, greeting?: string): string {
    if (greeting) {
        return `${greeting}, ${name}!`;
    }
    return `Hello, ${name}!`;
}

console.log(greet("张三"));               // Hello, 张三!
console.log(greet("李四", "你好"));       // 你好, 李四!

// 可选参数的类型实际上是 T | undefined
function buildUrl(base: string, path?: string): string {
    // path 的类型是 string | undefined
    return path ? `${base}/${path}` : base;
}

console.log(buildUrl("https://api.example.com"));
console.log(buildUrl("https://api.example.com", "users"));

// ============================================
// 2. 可选参数的位置
// ============================================

// 可选参数必须在必选参数之后
function createUser2(
    name: string,          // 必选
    age: number,           // 必选
    email?: string,        // 可选
    phone?: string         // 可选
): object {
    return { name, age, email, phone };
}

console.log(createUser2("王五", 30));
console.log(createUser2("赵六", 25, "zhaoliu@example.com"));

// ============================================
// 3. 默认参数
// ============================================

// 使用 = 设置默认值
function greetWithDefault(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

console.log(greetWithDefault("张三"));           // Hello, 张三!
console.log(greetWithDefault("李四", "Hi"));    // Hi, 李四!

// 默认参数可以是表达式
function createId(prefix: string = "ID", timestamp: number = Date.now()): string {
    return `${prefix}_${timestamp}`;
}

console.log(createId());
console.log(createId("USER"));
console.log(createId("ORDER", 1234567890));

// ============================================
// 4. 默认参数与可选参数的区别
// ============================================

// 可选参数: 调用者可以不传，值为 undefined
function withOptional(value?: number) {
    console.log("可选参数值:", value);  // 可能是 undefined
}

// 默认参数: 调用者可以不传，会使用默认值
function withDefault(value: number = 10) {
    console.log("默认参数值:", value);  // 永远是 number
}

withOptional();      // undefined
withOptional(5);     // 5
withDefault();       // 10
withDefault(5);      // 5

// 默认参数可以显式传 undefined 来使用默认值
withDefault(undefined);  // 10 (使用默认值)

// ============================================
// 5. 默认参数的位置
// ============================================

// 默认参数可以在任何位置 (但最好放在后面)
function middleDefault(a: number, b: number = 5, c: number): number {
    return a + b + c;
}

// 调用时必须传 undefined 来跳过中间的默认参数
console.log(middleDefault(1, undefined, 3));  // 1 + 5 + 3 = 9
console.log(middleDefault(1, 2, 3));          // 1 + 2 + 3 = 6

// ============================================
// 6. 对象参数的可选属性与默认值
// ============================================

interface Config {
    host: string;
    port?: number;
    secure?: boolean;
    timeout?: number;
}

function createConnection(config: Config): string {
    const {
        host,
        port = 80,
        secure = false,
        timeout = 5000
    } = config;

    const protocol = secure ? "https" : "http";
    return `${protocol}://${host}:${port} (timeout: ${timeout}ms)`;
}

console.log(createConnection({ host: "localhost" }));
console.log(createConnection({ host: "api.example.com", port: 443, secure: true }));

// 使用默认参数解构
function createConnectionv2({
    host,
    port = 80,
    secure = false,
    timeout = 5000
}: Config): string {
    const protocol = secure ? "https" : "http";
    return `${protocol}://${host}:${port} (timeout: ${timeout}ms)`;
}

// 整个配置对象也可以有默认值
function fetchData(url: string, options: { method?: string; headers?: object } = {}): void {
    const { method = "GET", headers = {} } = options;
    console.log(`Fetching ${url} with ${method}`, headers);
}

fetchData("https://api.example.com/data");
fetchData("https://api.example.com/data", { method: "POST" });

// ============================================
// 7. 类型推断与默认参数
// ============================================

// 默认参数可以帮助推断类型
function createArray<T>(item: T, count: number = 3): T[] {
    return Array(count).fill(item);
}

const strArray = createArray("hello");      // string[]
const numArray = createArray(42, 5);        // number[]

console.log("字符串数组:", strArray);
console.log("数字数组:", numArray);

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: API 请求函数
interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
}

async function request(
    url: string,
    options: RequestOptions = {}
): Promise<{ url: string; options: RequestOptions }> {
    const {
        method = "GET",
        headers = { "Content-Type": "application/json" },
        body,
        timeout = 10000
    } = options;

    // 模拟请求
    console.log(`[${method}] ${url}`);
    console.log("Headers:", headers);
    console.log("Body:", body);
    console.log("Timeout:", timeout);

    return { url, options: { method, headers, body, timeout } };
}

// 示例 2: 日志函数
type LogLevel = "debug" | "info" | "warn" | "error";

function log(
    message: string,
    level: LogLevel = "info",
    timestamp: Date = new Date()
): void {
    const time = timestamp.toISOString();
    console.log(`[${time}] [${level.toUpperCase()}] ${message}`);
}

log("应用启动");
log("调试信息", "debug");
log("警告信息", "warn", new Date("2024-01-01"));

// 示例 3: 分页参数
interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

function paginate<T>(
    items: T[],
    {
        page = 1,
        pageSize = 10,
        sortBy,
        sortOrder = "asc"
    }: PaginationParams = {}
): { data: T[]; total: number; page: number; pageSize: number } {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    let result = [...items];
    if (sortBy) {
        result.sort((a, b) => {
            const aVal = (a as Record<string, unknown>)[sortBy];
            const bVal = (b as Record<string, unknown>)[sortBy];
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return sortOrder === "asc" ? comparison : -comparison;
        });
    }

    return {
        data: result.slice(start, end),
        total: items.length,
        page,
        pageSize
    };
}

const users = [
    { id: 1, name: "张三" },
    { id: 2, name: "李四" },
    { id: 3, name: "王五" }
];

console.log("分页结果:", paginate(users));
console.log("分页结果:", paginate(users, { page: 1, pageSize: 2 }));

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 格式化数字
 * 创建一个函数，将数字格式化为货币字符串
 */
function formatCurrency(
    amount: number,
    currency: string = "CNY",
    decimals: number = 2
): string {
    const symbols: Record<string, string> = {
        CNY: "¥",
        USD: "$",
        EUR: "€"
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toFixed(decimals)}`;
}

console.log("练习 1:", formatCurrency(99.9));
console.log("练习 1:", formatCurrency(99.9, "USD"));
console.log("练习 1:", formatCurrency(99.9, "EUR", 0));

/**
 * 练习 2: 创建延迟函数
 * 返回一个 Promise，在指定时间后 resolve
 */
function delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 使用示例 (注释掉以避免等待)
// await delay();
// await delay(500);

/**
 * 练习 3: 数组分组函数
 * 将数组按指定大小分组
 */
function chunk<T>(array: T[], size: number = 2): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

console.log("练习 3:", chunk([1, 2, 3, 4, 5]));
console.log("练习 3:", chunk([1, 2, 3, 4, 5], 3));

/**
 * 练习 4: 深度合并对象
 * 合并多个对象，支持可选的深度参数
 */
function deepMerge<T extends object>(
    target: T,
    source: Partial<T>,
    deep: boolean = true
): T {
    const result = { ...target };

    for (const key of Object.keys(source) as Array<keyof T>) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (
            deep &&
            typeof sourceValue === "object" &&
            sourceValue !== null &&
            typeof targetValue === "object" &&
            targetValue !== null &&
            !Array.isArray(sourceValue)
        ) {
            result[key] = deepMerge(
                targetValue as object,
                sourceValue as object,
                deep
            ) as T[keyof T];
        } else if (sourceValue !== undefined) {
            result[key] = sourceValue as T[keyof T];
        }
    }

    return result;
}

const obj1 = { a: 1, b: { c: 2, d: 3 } };
const obj2 = { b: { c: 20 } };

console.log("练习 4 - 深度合并:", deepMerge(obj1, obj2));

// 导出
export {
    greet,
    greetWithDefault,
    createConnection,
    request,
    formatCurrency,
    delay,
    chunk,
    deepMerge
};
