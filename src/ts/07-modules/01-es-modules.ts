/**
 * ES 模块基础 (ES Modules)
 *
 * TypeScript 完全支持 ES6 模块语法
 * 模块是在自己的作用域中执行的，不是全局作用域
 */

// ============================================
// 1. 命名导出 (Named Exports)
// ============================================

// 声明时导出
export const PI = 3.14159;
export const E = 2.71828;

export function add(a: number, b: number): number {
    return a + b;
}

export function multiply(a: number, b: number): number {
    return a * b;
}

export interface Point {
    x: number;
    y: number;
}

export type ID = string | number;

export class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }
}

// 先声明后导出
const VERSION = "1.0.0";
const AUTHOR = "TypeScript Team";

function subtract(a: number, b: number): number {
    return a - b;
}

export { VERSION, AUTHOR, subtract };

// 重命名导出
const internalName = "internal";
export { internalName as publicName };

// ============================================
// 2. 默认导出 (Default Export)
// ============================================

// 每个模块只能有一个默认导出
// export default class MainClass {
//     constructor(public name: string) {}
// }

// 或者导出表达式
// export default function() {
//     console.log("默认函数");
// }

// 导出值
// export default 42;

// ============================================
// 3. 导入语法 (Import Syntax)
// ============================================

// 命名导入
// import { add, multiply, Point } from './math';

// 重命名导入
// import { add as addNumbers } from './math';

// 导入所有命名导出
// import * as MathUtils from './math';
// MathUtils.add(1, 2);

// 默认导入
// import MyClass from './myClass';

// 混合导入
// import MyClass, { helper } from './myClass';

// 仅执行模块（副作用导入）
// import './polyfills';

// ============================================
// 4. 类型导入 (Type-Only Imports)
// ============================================

// 仅导入类型（编译后会被移除）
// import type { Point, ID } from './types';

// 内联类型导入
// import { type Point, add } from './math';

// 类型导出
export type { Point as PointType };

// ============================================
// 5. 重新导出 (Re-exports)
// ============================================

// 从其他模块重新导出
// export { add, subtract } from './math';

// 重命名重新导出
// export { add as sum } from './math';

// 导出所有
// export * from './math';

// 导出所有并命名
// export * as MathUtils from './math';

// ============================================
// 6. 模块内部代码组织
// ============================================

// 私有变量（不导出）
const privateCounter = { count: 0 };

// 私有函数
function privateIncrement(): void {
    privateCounter.count++;
}

// 公开的 API
export function incrementCounter(): number {
    privateIncrement();
    return privateCounter.count;
}

export function getCount(): number {
    return privateCounter.count;
}

// ============================================
// 7. 实际应用示例
// ============================================

// 示例 1: API 服务模块
export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    headers?: Record<string, string>;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

export class ApiService {
    constructor(private config: ApiConfig) {}

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        console.log(`GET ${this.config.baseUrl}${endpoint}`);
        // 模拟 API 调用
        return {
            data: {} as T,
            status: 200,
            message: "Success"
        };
    }

    async post<T, U>(endpoint: string, body: T): Promise<ApiResponse<U>> {
        console.log(`POST ${this.config.baseUrl}${endpoint}`, body);
        return {
            data: {} as U,
            status: 201,
            message: "Created"
        };
    }
}

// 导出工厂函数
export function createApiService(config: ApiConfig): ApiService {
    return new ApiService(config);
}

// 示例 2: 常量模块
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
} as const;

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// 示例 3: 工具函数模块
export const StringUtils = {
    capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    truncate(str: string, length: number): string {
        return str.length > length ? str.slice(0, length) + "..." : str;
    },

    slugify(str: string): string {
        return str
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    }
};

export const ArrayUtils = {
    chunk<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    },

    unique<T>(array: T[]): T[] {
        return [...new Set(array)];
    },

    shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
};

// ============================================
// 8. 模块模式与封装
// ============================================

// 使用立即执行函数创建模块
export const Counter = (() => {
    let count = 0;

    return {
        increment(): number {
            return ++count;
        },
        decrement(): number {
            return --count;
        },
        getCount(): number {
            return count;
        },
        reset(): void {
            count = 0;
        }
    };
})();

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个验证器模块
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export type Validator<T> = (value: T) => string | null;

export const Validators = {
    required: (message: string = "此字段必填"): Validator<unknown> => {
        return (value) => {
            if (value === null || value === undefined || value === "") {
                return message;
            }
            return null;
        };
    },

    minLength: (min: number, message?: string): Validator<string> => {
        return (value) => {
            if (value.length < min) {
                return message || `最少需要 ${min} 个字符`;
            }
            return null;
        };
    },

    maxLength: (max: number, message?: string): Validator<string> => {
        return (value) => {
            if (value.length > max) {
                return message || `最多允许 ${max} 个字符`;
            }
            return null;
        };
    },

    email: (message: string = "请输入有效的邮箱"): Validator<string> => {
        return (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return message;
            }
            return null;
        };
    },

    pattern: (regex: RegExp, message: string): Validator<string> => {
        return (value) => {
            if (!regex.test(value)) {
                return message;
            }
            return null;
        };
    }
};

export function validate<T>(
    value: T,
    validators: Validator<T>[]
): ValidationResult {
    const errors: string[] = [];

    for (const validator of validators) {
        const error = validator(value);
        if (error) {
            errors.push(error);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// 使用示例
const emailValidation = validate("test@example.com", [
    Validators.required(),
    Validators.email()
]);
console.log("邮箱验证:", emailValidation);

/**
 * 练习 2: 创建一个事件模块
 */
type EventHandler<T = unknown> = (data: T) => void;

export class EventEmitter<Events extends Record<string, unknown>> {
    private handlers: Map<keyof Events, Set<EventHandler<unknown>>> = new Map();

    on<K extends keyof Events>(
        event: K,
        handler: EventHandler<Events[K]>
    ): () => void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler as EventHandler<unknown>);

        // 返回取消订阅函数
        return () => this.off(event, handler);
    }

    off<K extends keyof Events>(
        event: K,
        handler: EventHandler<Events[K]>
    ): void {
        this.handlers.get(event)?.delete(handler as EventHandler<unknown>);
    }

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
        this.handlers.get(event)?.forEach(handler => handler(data));
    }

    once<K extends keyof Events>(
        event: K,
        handler: EventHandler<Events[K]>
    ): void {
        const onceHandler: EventHandler<Events[K]> = (data) => {
            handler(data);
            this.off(event, onceHandler);
        };
        this.on(event, onceHandler);
    }
}

// 定义事件类型
interface AppEvents {
    login: { userId: string; timestamp: Date };
    logout: { userId: string };
    error: { message: string; code: number };
}

// 使用
const appEvents = new EventEmitter<AppEvents>();

appEvents.on("login", ({ userId, timestamp }) => {
    console.log(`用户 ${userId} 在 ${timestamp.toLocaleString()} 登录`);
});

appEvents.emit("login", { userId: "user123", timestamp: new Date() });

/**
 * 练习 3: 创建一个存储模块
 */
export interface Storage<T> {
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    remove(key: string): void;
    clear(): void;
    keys(): string[];
}

export class MemoryStorage<T> implements Storage<T> {
    private store: Map<string, T> = new Map();

    get(key: string): T | undefined {
        return this.store.get(key);
    }

    set(key: string, value: T): void {
        this.store.set(key, value);
    }

    remove(key: string): void {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }

    keys(): string[] {
        return Array.from(this.store.keys());
    }
}

// 带过期时间的存储
export class ExpiringStorage<T> implements Storage<T> {
    private store: Map<string, { value: T; expiry: number }> = new Map();

    constructor(private defaultTtl: number = 60000) {}

    get(key: string): T | undefined {
        const item = this.store.get(key);
        if (!item) return undefined;

        if (Date.now() > item.expiry) {
            this.store.delete(key);
            return undefined;
        }

        return item.value;
    }

    set(key: string, value: T, ttl?: number): void {
        this.store.set(key, {
            value,
            expiry: Date.now() + (ttl ?? this.defaultTtl)
        });
    }

    remove(key: string): void {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }

    keys(): string[] {
        // 清理过期的键
        const now = Date.now();
        const validKeys: string[] = [];

        this.store.forEach((item, key) => {
            if (now <= item.expiry) {
                validKeys.push(key);
            } else {
                this.store.delete(key);
            }
        });

        return validKeys;
    }
}

// 使用
const storage = new ExpiringStorage<string>(5000);
storage.set("token", "abc123");
console.log("Token:", storage.get("token"));
