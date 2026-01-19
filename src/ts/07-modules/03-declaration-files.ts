/**
 * 声明文件 (Declaration Files)
 *
 * 声明文件 (.d.ts) 用于为 JavaScript 库提供类型信息
 * 它们只包含类型声明，不包含实现
 */

// ============================================
// 1. 基本声明语法
// ============================================

// 声明全局变量
declare const VERSION: string;
declare let config: {
    apiUrl: string;
    timeout: number;
};

// 声明全局函数
declare function greet(name: string): string;
declare function log(message: string, level?: "info" | "warn" | "error"): void;

// 声明全局类
declare class MyGlobalClass {
    constructor(name: string);
    name: string;
    sayHello(): void;
}

// ============================================
// 2. 声明模块
// ============================================

// 为没有类型定义的 npm 包声明模块
// 这通常写在 .d.ts 文件中

/*
declare module "my-untyped-library" {
    export function doSomething(input: string): number;
    export const version: string;

    export interface Options {
        timeout?: number;
        retries?: number;
    }

    export default function(options?: Options): void;
}
*/

// 通配符模块声明
/*
declare module "*.json" {
    const value: unknown;
    export default value;
}

declare module "*.css" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.svg" {
    const content: string;
    export default content;
}
*/

// ============================================
// 3. 声明命名空间
// ============================================

declare namespace MyLib {
    interface Config {
        debug: boolean;
        version: string;
    }

    function init(config: Config): void;
    function destroy(): void;

    const utils: {
        format(value: unknown): string;
        parse(text: string): unknown;
    };
}

// ============================================
// 4. 扩展现有类型
// ============================================

// 扩展全局接口
declare global {
    interface Window {
        myCustomProperty: string;
        myCustomMethod(): void;
    }

    interface Array<T> {
        customMethod(): T[];
    }

    // 扩展 String 原型
    interface String {
        toTitleCase(): string;
    }
}

// 实现扩展方法 (在实际代码中)
String.prototype.toTitleCase = function(): string {
    return this.replace(/\b\w/g, char => char.toUpperCase());
};

console.log("标题化:", "hello world".toTitleCase());

// ============================================
// 5. 条件类型声明
// ============================================

// 声明文件中可以使用条件类型
type IsString<T> = T extends string ? true : false;
type IsArray<T> = T extends unknown[] ? true : false;

// 示例类型测试
type Test1 = IsString<"hello">;  // true
type Test2 = IsString<123>;      // false
type Test3 = IsArray<number[]>;  // true

// ============================================
// 6. 声明文件组织
// ============================================

// 模拟一个完整的库声明结构

// types/my-library/index.d.ts
namespace MyLibraryTypes {
    // 核心类型
    export interface Options {
        debug?: boolean;
        timeout?: number;
        baseUrl?: string;
    }

    export interface Response<T> {
        data: T;
        status: number;
        headers: Record<string, string>;
    }

    export interface Error {
        code: string;
        message: string;
        details?: unknown;
    }

    // 回调类型
    export type Callback<T> = (error: Error | null, result: T | null) => void;
    export type AsyncCallback<T> = () => Promise<T>;

    // 事件类型
    export type EventType = "ready" | "error" | "data" | "close";
    export type EventHandler<T = unknown> = (data: T) => void;

    // 类
    export class Client {
        constructor(options?: Options);

        connect(): Promise<void>;
        disconnect(): Promise<void>;
        request<T>(endpoint: string, data?: unknown): Promise<Response<T>>;

        on<T>(event: EventType, handler: EventHandler<T>): void;
        off(event: EventType, handler: EventHandler): void;
    }

    // 工具函数
    export function createClient(options?: Options): Client;
    export function isError(value: unknown): value is Error;
}

// 使用声明的类型
const clientOptions: MyLibraryTypes.Options = {
    debug: true,
    timeout: 5000
};

function handleResponse<T>(response: MyLibraryTypes.Response<T>): T {
    if (response.status >= 400) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response.data;
}

// ============================================
// 7. 三斜线指令
// ============================================

// 三斜线指令用于引用其他声明文件
// /// <reference path="./other.d.ts" />
// /// <reference types="node" />
// /// <reference lib="es2015" />

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 为第三方库创建类型声明
namespace JQueryLike {
    export interface JQueryStatic {
        (selector: string): JQuery;
        (element: Element): JQuery;
        (callback: () => void): void;

        ajax(url: string, settings?: AjaxSettings): Promise<unknown>;
        get(url: string): Promise<unknown>;
        post(url: string, data?: unknown): Promise<unknown>;
    }

    export interface JQuery {
        length: number;

        addClass(className: string): this;
        removeClass(className: string): this;
        toggleClass(className: string): this;
        hasClass(className: string): boolean;

        css(property: string): string;
        css(property: string, value: string | number): this;
        css(properties: Record<string, string | number>): this;

        html(): string;
        html(content: string): this;

        text(): string;
        text(content: string): this;

        val(): string;
        val(value: string): this;

        on(event: string, handler: (event: Event) => void): this;
        off(event: string, handler?: (event: Event) => void): this;

        find(selector: string): JQuery;
        parent(): JQuery;
        children(): JQuery;

        show(): this;
        hide(): this;
        toggle(): this;
    }

    export interface AjaxSettings {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        data?: unknown;
        headers?: Record<string, string>;
        timeout?: number;
        dataType?: "json" | "text" | "html";
    }
}

// 声明全局变量 (实际应该在 .d.ts 文件中)
// declare const $: JQueryLike.JQueryStatic;

// 示例 2: 为 Node.js 模块创建类型声明
namespace NodeLike {
    export interface PathModule {
        join(...paths: string[]): string;
        resolve(...paths: string[]): string;
        dirname(path: string): string;
        basename(path: string, ext?: string): string;
        extname(path: string): string;
        isAbsolute(path: string): boolean;
        relative(from: string, to: string): string;
        parse(path: string): ParsedPath;
        format(pathObject: ParsedPath): string;
    }

    export interface ParsedPath {
        root: string;
        dir: string;
        base: string;
        ext: string;
        name: string;
    }

    export interface FileSystemModule {
        readFile(
            path: string,
            options: { encoding: string }
        ): Promise<string>;
        readFile(path: string): Promise<Buffer>;

        writeFile(
            path: string,
            data: string | Buffer,
            options?: { encoding?: string }
        ): Promise<void>;

        readdir(path: string): Promise<string[]>;
        mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
        rmdir(path: string): Promise<void>;
        unlink(path: string): Promise<void>;

        stat(path: string): Promise<Stats>;
        exists(path: string): Promise<boolean>;
    }

    export interface Stats {
        isFile(): boolean;
        isDirectory(): boolean;
        size: number;
        mtime: Date;
        ctime: Date;
    }

    export interface Buffer extends Uint8Array {
        toString(encoding?: string): string;
    }
}

// 示例 3: 环境变量类型声明
namespace EnvTypes {
    export interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";
        PORT?: string;
        DATABASE_URL?: string;
        API_KEY?: string;
        DEBUG?: string;
        [key: string]: string | undefined;
    }
}

// 声明 process.env 的类型
// declare const process: { env: EnvTypes.ProcessEnv };

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 为一个模拟的 HTTP 客户端创建类型声明
 */
namespace HttpClient {
    export interface RequestConfig {
        url: string;
        method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        headers?: Record<string, string>;
        params?: Record<string, string | number>;
        data?: unknown;
        timeout?: number;
        responseType?: "json" | "text" | "blob" | "arraybuffer";
    }

    export interface Response<T = unknown> {
        data: T;
        status: number;
        statusText: string;
        headers: Record<string, string>;
        config: RequestConfig;
    }

    export interface HttpClientInstance {
        request<T>(config: RequestConfig): Promise<Response<T>>;
        get<T>(url: string, config?: Omit<RequestConfig, "url" | "method">): Promise<Response<T>>;
        post<T>(url: string, data?: unknown, config?: Omit<RequestConfig, "url" | "method" | "data">): Promise<Response<T>>;
        put<T>(url: string, data?: unknown, config?: Omit<RequestConfig, "url" | "method" | "data">): Promise<Response<T>>;
        delete<T>(url: string, config?: Omit<RequestConfig, "url" | "method">): Promise<Response<T>>;
    }

    export interface CreateOptions {
        baseURL?: string;
        timeout?: number;
        headers?: Record<string, string>;
    }

    export function create(options?: CreateOptions): HttpClientInstance;
}

// 模拟实现
const httpClient: HttpClient.HttpClientInstance = {
    async request<T>(config: HttpClient.RequestConfig): Promise<HttpClient.Response<T>> {
        console.log(`${config.method || "GET"} ${config.url}`);
        return {
            data: {} as T,
            status: 200,
            statusText: "OK",
            headers: {},
            config
        };
    },
    async get<T>(url: string): Promise<HttpClient.Response<T>> {
        return this.request({ url, method: "GET" });
    },
    async post<T>(url: string, data?: unknown): Promise<HttpClient.Response<T>> {
        return this.request({ url, method: "POST", data });
    },
    async put<T>(url: string, data?: unknown): Promise<HttpClient.Response<T>> {
        return this.request({ url, method: "PUT", data });
    },
    async delete<T>(url: string): Promise<HttpClient.Response<T>> {
        return this.request({ url, method: "DELETE" });
    }
};

console.log("练习 1 - HTTP 客户端测试");
httpClient.get("/api/users");
httpClient.post("/api/users", { name: "张三" });

/**
 * 练习 2: 为一个配置管理器创建类型声明
 */
namespace ConfigManager {
    export type ConfigValue = string | number | boolean | null | ConfigValue[] | { [key: string]: ConfigValue };

    export interface ConfigSchema {
        [key: string]: {
            type: "string" | "number" | "boolean" | "array" | "object";
            required?: boolean;
            default?: ConfigValue;
            validate?: (value: ConfigValue) => boolean;
        };
    }

    export interface ConfigManagerInstance<T extends Record<string, ConfigValue>> {
        get<K extends keyof T>(key: K): T[K];
        set<K extends keyof T>(key: K, value: T[K]): void;
        has(key: keyof T): boolean;
        getAll(): T;
        reset(): void;
    }

    export function createConfig<T extends Record<string, ConfigValue>>(
        schema: ConfigSchema,
        initialValues?: Partial<T>
    ): ConfigManagerInstance<T>;
}

console.log("练习 2 - 配置管理器类型定义完成");

// 导出所有声明
export { MyLibraryTypes, JQueryLike, NodeLike, EnvTypes, HttpClient, ConfigManager };
