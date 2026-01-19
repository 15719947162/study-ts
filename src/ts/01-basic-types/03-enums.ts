/**
 * 枚举类型 (Enums)
 *
 * 枚举是 TypeScript 特有的类型，用于定义一组命名的常量
 */

// ============================================
// 1. 数字枚举 (Numeric Enums)
// ============================================
// 默认从 0 开始递增
enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right    // 3
}

console.log("数字枚举:", Direction.Up, Direction.Down);
console.log("反向映射:", Direction[0]); // "Up"

// 自定义起始值
enum StatusCode {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    InternalError = 500
}

console.log("HTTP 状态码:", StatusCode.OK, StatusCode.NotFound);

// ============================================
// 2. 字符串枚举 (String Enums)
// ============================================
// 字符串枚举每个成员都必须初始化
enum Color {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE"
}

console.log("字符串枚举:", Color.Red, Color.Green);

// 字符串枚举没有反向映射
// console.log(Color["RED"]); // undefined

// ============================================
// 3. 异构枚举 (Heterogeneous Enums)
// ============================================
// 混合数字和字符串 (不推荐使用)
enum Mixed {
    No = 0,
    Yes = "YES"
}

console.log("异构枚举:", Mixed.No, Mixed.Yes);

// ============================================
// 4. 计算成员与常量成员
// ============================================
enum FileAccess {
    // 常量成员
    None,
    Read = 1 << 1,      // 2
    Write = 1 << 2,     // 4
    ReadWrite = Read | Write,  // 6

    // 计算成员
    G = "123".length    // 3
}

console.log("位运算枚举:", FileAccess.Read, FileAccess.Write, FileAccess.ReadWrite);

// ============================================
// 5. const 枚举
// ============================================
// const 枚举在编译时会被完全删除，只保留值
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

// 使用 const 枚举
let dir = Directions.Up;
// 编译后: let dir = 0;

console.log("const 枚举:", dir);

// ============================================
// 6. 枚举成员类型
// ============================================
enum ShapeKind {
    Circle,
    Square
}

interface Circle {
    kind: ShapeKind.Circle;  // 使用枚举成员作为类型
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

const circle: Circle = {
    kind: ShapeKind.Circle,
    radius: 10
};

console.log("枚举成员类型:", circle);

// ============================================
// 7. 枚举的类型守卫
// ============================================
enum Animal {
    Dog = "DOG",
    Cat = "CAT",
    Bird = "BIRD"
}

function getAnimalSound(animal: Animal): string {
    switch (animal) {
        case Animal.Dog:
            return "汪汪!";
        case Animal.Cat:
            return "喵喵!";
        case Animal.Bird:
            return "叽叽!";
        default:
            // 穷尽性检查
            const _exhaustiveCheck: never = animal;
            return _exhaustiveCheck;
    }
}

console.log("动物叫声:", getAnimalSound(Animal.Dog));

// ============================================
// 8. 枚举 vs 联合类型
// ============================================

// 使用枚举
enum LogLevel {
    Error = "ERROR",
    Warn = "WARN",
    Info = "INFO",
    Debug = "DEBUG"
}

function logWithEnum(level: LogLevel, message: string) {
    console.log(`[${level}] ${message}`);
}

logWithEnum(LogLevel.Info, "这是一条信息");

// 使用联合类型 (更轻量的替代方案)
type LogLevelUnion = "ERROR" | "WARN" | "INFO" | "DEBUG";

function logWithUnion(level: LogLevelUnion, message: string) {
    console.log(`[${level}] ${message}`);
}

logWithUnion("INFO", "这是联合类型版本");

// ============================================
// 9. 枚举的实际应用
// ============================================

// 应用场景 1: 用户角色
enum UserRole {
    Admin = "ADMIN",
    Editor = "EDITOR",
    Viewer = "VIEWER",
    Guest = "GUEST"
}

interface User {
    id: number;
    name: string;
    role: UserRole;
}

function hasPermission(user: User, requiredRole: UserRole): boolean {
    const roleHierarchy = {
        [UserRole.Admin]: 4,
        [UserRole.Editor]: 3,
        [UserRole.Viewer]: 2,
        [UserRole.Guest]: 1
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

const admin: User = { id: 1, name: "管理员", role: UserRole.Admin };
console.log("权限检查:", hasPermission(admin, UserRole.Editor)); // true

// 应用场景 2: 状态机
enum OrderStatus {
    Pending = "PENDING",
    Processing = "PROCESSING",
    Shipped = "SHIPPED",
    Delivered = "DELIVERED",
    Cancelled = "CANCELLED"
}

interface Order {
    id: string;
    status: OrderStatus;
}

function canCancelOrder(order: Order): boolean {
    return order.status === OrderStatus.Pending ||
           order.status === OrderStatus.Processing;
}

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个表示一周七天的枚举
 * 并创建一个函数判断是否是工作日
 */
enum DayOfWeek {
    // TODO: 定义七天
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

function isWeekday(day: DayOfWeek): boolean {
    // TODO: 判断是否是工作日 (周一到周五)
    return day >= DayOfWeek.Monday && day <= DayOfWeek.Friday;
}

console.log("练习 1 - 周一是工作日:", isWeekday(DayOfWeek.Monday));
console.log("练习 1 - 周日是工作日:", isWeekday(DayOfWeek.Sunday));

/**
 * 练习 2: 创建一个 HTTP 方法枚举
 * 并创建一个判断方法是否安全 (不修改资源) 的函数
 */
enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}

function isSafeMethod(method: HttpMethod): boolean {
    // TODO: GET 是安全的，其他都不安全
    return method === HttpMethod.GET;
}

console.log("练习 2 - GET 是安全的:", isSafeMethod(HttpMethod.GET));
console.log("练习 2 - POST 是安全的:", isSafeMethod(HttpMethod.POST));

/**
 * 练习 3: 使用位运算枚举实现权限系统
 */
enum Permission {
    None = 0,
    Read = 1 << 0,      // 1
    Write = 1 << 1,     // 2
    Execute = 1 << 2,   // 4
    Delete = 1 << 3     // 8
}

function hasAllPermissions(userPermission: number, required: number): boolean {
    // TODO: 检查用户是否有所有必需的权限
    return (userPermission & required) === required;
}

const userPerm = Permission.Read | Permission.Write; // 3
console.log("练习 3 - 有读权限:", hasAllPermissions(userPerm, Permission.Read));
console.log("练习 3 - 有删除权限:", hasAllPermissions(userPerm, Permission.Delete));

// 导出
export { Direction, Color, UserRole, DayOfWeek, HttpMethod, Permission };
