/**
 * 命名空间 (Namespaces)
 *
 * 命名空间是 TypeScript 特有的代码组织方式
 * 用于将相关代码分组，避免全局命名冲突
 */

// ============================================
// 1. 基本命名空间
// ============================================

namespace Geometry {
    // 命名空间内部的成员默认是私有的
    const PI = 3.14159;

    // 导出的成员可以在外部访问
    export interface Point {
        x: number;
        y: number;
    }

    export interface Circle {
        center: Point;
        radius: number;
    }

    export interface Rectangle {
        topLeft: Point;
        width: number;
        height: number;
    }

    export function distance(p1: Point, p2: Point): number {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    export function circleArea(circle: Circle): number {
        return PI * circle.radius * circle.radius;
    }

    export function rectangleArea(rect: Rectangle): number {
        return rect.width * rect.height;
    }
}

// 使用命名空间
const point1: Geometry.Point = { x: 0, y: 0 };
const point2: Geometry.Point = { x: 3, y: 4 };

console.log("两点距离:", Geometry.distance(point1, point2));

const circle: Geometry.Circle = { center: point1, radius: 5 };
console.log("圆面积:", Geometry.circleArea(circle));

// ============================================
// 2. 嵌套命名空间
// ============================================

namespace App {
    export namespace Models {
        export interface User {
            id: number;
            name: string;
            email: string;
        }

        export interface Product {
            id: number;
            name: string;
            price: number;
        }
    }

    export namespace Services {
        export class UserService {
            private users: Models.User[] = [];

            create(user: Models.User): void {
                this.users.push(user);
                console.log(`用户 ${user.name} 创建成功`);
            }

            findById(id: number): Models.User | undefined {
                return this.users.find(u => u.id === id);
            }
        }

        export class ProductService {
            private products: Models.Product[] = [];

            create(product: Models.Product): void {
                this.products.push(product);
            }

            findAll(): Models.Product[] {
                return [...this.products];
            }
        }
    }

    export namespace Utils {
        export function formatCurrency(amount: number): string {
            return `¥${amount.toFixed(2)}`;
        }

        export function generateId(): number {
            return Date.now() + Math.random();
        }
    }
}

// 使用嵌套命名空间
const user: App.Models.User = {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com"
};

const userService = new App.Services.UserService();
userService.create(user);

console.log("格式化价格:", App.Utils.formatCurrency(99.9));

// ============================================
// 3. 命名空间别名
// ============================================

// 使用 import 为命名空间创建别名
import Models = App.Models;
import Utils = App.Utils;

const product: Models.Product = {
    id: Utils.generateId(),
    name: "TypeScript 书籍",
    price: 99
};

console.log("产品:", product.name, Utils.formatCurrency(product.price));

// ============================================
// 4. 命名空间合并
// ============================================

namespace Animals {
    export class Dog {
        constructor(public name: string) {}

        bark(): void {
            console.log(`${this.name} 汪汪!`);
        }
    }
}

// 同名命名空间会自动合并
namespace Animals {
    export class Cat {
        constructor(public name: string) {}

        meow(): void {
            console.log(`${this.name} 喵喵!`);
        }
    }

    // 可以访问之前定义的成员
    export function createDog(name: string): Dog {
        return new Dog(name);
    }
}

const dog = Animals.createDog("旺财");
const cat = new Animals.Cat("咪咪");

dog.bark();
cat.meow();

// ============================================
// 5. 命名空间与类合并
// ============================================

class Album {
    constructor(public title: string, public year: number) {}
}

// 命名空间可以与类合并，为类添加静态成员
namespace Album {
    export interface Track {
        name: string;
        duration: number;
    }

    export function createEmpty(): Album {
        return new Album("Untitled", new Date().getFullYear());
    }

    export const genres = ["Pop", "Rock", "Jazz", "Classical"] as const;
}

const album = Album.createEmpty();
console.log("专辑:", album.title);
console.log("音乐类型:", Album.genres);

const track: Album.Track = { name: "Track 1", duration: 180 };
console.log("曲目:", track.name);

// ============================================
// 6. 命名空间与函数合并
// ============================================

function buildLabel(name: string): string {
    return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
    export let prefix = "Hello, ";
    export let suffix = "!";
}

console.log(buildLabel("World"));  // Hello, World!

buildLabel.prefix = "Hi, ";
console.log(buildLabel("TypeScript"));  // Hi, TypeScript!

// ============================================
// 7. 命名空间与枚举合并
// ============================================

enum Color {
    Red,
    Green,
    Blue
}

namespace Color {
    export function toHex(color: Color): string {
        switch (color) {
            case Color.Red:
                return "#FF0000";
            case Color.Green:
                return "#00FF00";
            case Color.Blue:
                return "#0000FF";
        }
    }

    export function fromHex(hex: string): Color | undefined {
        switch (hex.toUpperCase()) {
            case "#FF0000":
                return Color.Red;
            case "#00FF00":
                return Color.Green;
            case "#0000FF":
                return Color.Blue;
            default:
                return undefined;
        }
    }
}

console.log("红色十六进制:", Color.toHex(Color.Red));
console.log("从十六进制:", Color.fromHex("#00FF00"));

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: 验证器命名空间
namespace Validation {
    export interface ValidationResult {
        success: boolean;
        message?: string;
    }

    export interface Validator {
        validate(value: unknown): ValidationResult;
    }

    export class StringValidator implements Validator {
        constructor(
            private minLength: number = 0,
            private maxLength: number = Infinity
        ) {}

        validate(value: unknown): ValidationResult {
            if (typeof value !== "string") {
                return { success: false, message: "必须是字符串" };
            }
            if (value.length < this.minLength) {
                return { success: false, message: `最少 ${this.minLength} 个字符` };
            }
            if (value.length > this.maxLength) {
                return { success: false, message: `最多 ${this.maxLength} 个字符` };
            }
            return { success: true };
        }
    }

    export class NumberValidator implements Validator {
        constructor(
            private min: number = -Infinity,
            private max: number = Infinity
        ) {}

        validate(value: unknown): ValidationResult {
            if (typeof value !== "number" || isNaN(value)) {
                return { success: false, message: "必须是数字" };
            }
            if (value < this.min) {
                return { success: false, message: `不能小于 ${this.min}` };
            }
            if (value > this.max) {
                return { success: false, message: `不能大于 ${this.max}` };
            }
            return { success: true };
        }
    }

    export class EmailValidator implements Validator {
        private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        validate(value: unknown): ValidationResult {
            if (typeof value !== "string") {
                return { success: false, message: "必须是字符串" };
            }
            if (!this.emailRegex.test(value)) {
                return { success: false, message: "无效的邮箱格式" };
            }
            return { success: true };
        }
    }
}

const stringValidator = new Validation.StringValidator(3, 20);
const emailValidator = new Validation.EmailValidator();

console.log("字符串验证:", stringValidator.validate("ab"));
console.log("邮箱验证:", emailValidator.validate("test@example.com"));

// 示例 2: 数据库操作命名空间
namespace Database {
    export type QueryResult<T> = {
        rows: T[];
        rowCount: number;
        duration: number;
    };

    export interface QueryBuilder<T> {
        select(...columns: (keyof T)[]): QueryBuilder<T>;
        where(condition: Partial<T>): QueryBuilder<T>;
        orderBy(column: keyof T, direction?: "ASC" | "DESC"): QueryBuilder<T>;
        limit(count: number): QueryBuilder<T>;
        execute(): QueryResult<T>;
    }

    export class Table<T extends Record<string, unknown>> {
        private data: T[] = [];

        constructor(private name: string) {}

        insert(row: T): void {
            this.data.push(row);
        }

        query(): SimpleQueryBuilder<T> {
            return new SimpleQueryBuilder(this.data);
        }
    }

    class SimpleQueryBuilder<T> implements QueryBuilder<T> {
        private _columns: (keyof T)[] = [];
        private _where: Partial<T> = {};
        private _orderBy?: { column: keyof T; direction: "ASC" | "DESC" };
        private _limit?: number;

        constructor(private data: T[]) {}

        select(...columns: (keyof T)[]): this {
            this._columns = columns;
            return this;
        }

        where(condition: Partial<T>): this {
            this._where = condition;
            return this;
        }

        orderBy(column: keyof T, direction: "ASC" | "DESC" = "ASC"): this {
            this._orderBy = { column, direction };
            return this;
        }

        limit(count: number): this {
            this._limit = count;
            return this;
        }

        execute(): QueryResult<T> {
            const start = Date.now();
            let result = [...this.data];

            // 应用 where
            for (const [key, value] of Object.entries(this._where)) {
                result = result.filter(row => row[key] === value);
            }

            // 应用 orderBy
            if (this._orderBy) {
                const { column, direction } = this._orderBy;
                result.sort((a, b) => {
                    const aVal = a[column];
                    const bVal = b[column];
                    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                    return direction === "ASC" ? cmp : -cmp;
                });
            }

            // 应用 limit
            if (this._limit !== undefined) {
                result = result.slice(0, this._limit);
            }

            return {
                rows: result,
                rowCount: result.length,
                duration: Date.now() - start
            };
        }
    }
}

// 使用数据库命名空间
interface User {
    id: number;
    name: string;
    age: number;
}

const usersTable = new Database.Table<User>("users");
usersTable.insert({ id: 1, name: "张三", age: 25 });
usersTable.insert({ id: 2, name: "李四", age: 30 });
usersTable.insert({ id: 3, name: "王五", age: 28 });

const result = usersTable
    .query()
    .where({ age: 28 })
    .execute();

console.log("查询结果:", result);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个数学工具命名空间
 */
namespace MathTools {
    export namespace Trigonometry {
        export const PI = Math.PI;

        export function sin(degrees: number): number {
            return Math.sin(degrees * PI / 180);
        }

        export function cos(degrees: number): number {
            return Math.cos(degrees * PI / 180);
        }

        export function tan(degrees: number): number {
            return Math.tan(degrees * PI / 180);
        }
    }

    export namespace Statistics {
        export function mean(numbers: number[]): number {
            return numbers.reduce((a, b) => a + b, 0) / numbers.length;
        }

        export function median(numbers: number[]): number {
            const sorted = [...numbers].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0
                ? sorted[mid]
                : (sorted[mid - 1] + sorted[mid]) / 2;
        }

        export function standardDeviation(numbers: number[]): number {
            const avg = mean(numbers);
            const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
            return Math.sqrt(mean(squareDiffs));
        }
    }

    export namespace Random {
        export function integer(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        export function float(min: number, max: number): number {
            return Math.random() * (max - min) + min;
        }

        export function choice<T>(array: T[]): T {
            return array[integer(0, array.length - 1)];
        }

        export function shuffle<T>(array: T[]): T[] {
            const result = [...array];
            for (let i = result.length - 1; i > 0; i--) {
                const j = integer(0, i);
                [result[i], result[j]] = [result[j], result[i]];
            }
            return result;
        }
    }
}

console.log("练习 1 - sin(30):", MathTools.Trigonometry.sin(30).toFixed(4));
console.log("练习 1 - 平均值:", MathTools.Statistics.mean([1, 2, 3, 4, 5]));
console.log("练习 1 - 随机整数:", MathTools.Random.integer(1, 100));

/**
 * 练习 2: 创建一个日期工具命名空间
 */
namespace DateUtils {
    export function format(date: Date, pattern: string): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return pattern
            .replace("YYYY", String(year))
            .replace("MM", month)
            .replace("DD", day)
            .replace("HH", hours)
            .replace("mm", minutes)
            .replace("ss", seconds);
    }

    export function addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    export function diffInDays(date1: Date, date2: Date): number {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    export function isWeekend(date: Date): boolean {
        const day = date.getDay();
        return day === 0 || day === 6;
    }
}

const now = new Date();
console.log("练习 2 - 格式化:", DateUtils.format(now, "YYYY-MM-DD HH:mm:ss"));
console.log("练习 2 - 7天后:", DateUtils.format(DateUtils.addDays(now, 7), "YYYY-MM-DD"));
console.log("练习 2 - 是否周末:", DateUtils.isWeekend(now));

// 导出命名空间
export { Geometry, App, Validation, Database, MathTools, DateUtils };
