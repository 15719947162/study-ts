/**
 * 接口继承 (Interface Extends)
 *
 * 接口可以通过 extends 关键字继承其他接口或类型
 * 支持单继承和多继承
 */

// ============================================
// 1. 基本接口继承
// ============================================

interface Animal {
    name: string;
    age: number;
}

interface Dog extends Animal {
    breed: string;
    bark(): void;
}

const dog: Dog = {
    name: "旺财",
    age: 3,
    breed: "柴犬",
    bark() {
        console.log("汪汪!");
    }
};

console.log("Dog:", dog.name, dog.breed);
dog.bark();

// ============================================
// 2. 多接口继承
// ============================================

interface Flyable {
    fly(): void;
    maxAltitude: number;
}

interface Swimmable {
    swim(): void;
    maxDepth: number;
}

// 同时继承多个接口
interface Duck extends Animal, Flyable, Swimmable {
    quack(): void;
}

const duck: Duck = {
    name: "唐老鸭",
    age: 2,
    maxAltitude: 100,
    maxDepth: 5,
    fly() {
        console.log("飞行中...");
    },
    swim() {
        console.log("游泳中...");
    },
    quack() {
        console.log("嘎嘎!");
    }
};

console.log("Duck:", duck.name);
duck.fly();
duck.swim();
duck.quack();

// ============================================
// 3. 接口继承类型别名
// ============================================

type Point = {
    x: number;
    y: number;
};

interface LabeledPoint extends Point {
    label: string;
}

const labeledPoint: LabeledPoint = {
    x: 10,
    y: 20,
    label: "原点"
};

console.log("LabeledPoint:", labeledPoint);

// ============================================
// 4. 继承中的属性覆盖
// ============================================

interface BaseConfig {
    timeout: number;
    retries: number;
}

// 子接口可以覆盖父接口的属性类型 (必须兼容)
interface ExtendedConfig extends BaseConfig {
    timeout: 5000;  // 字面量类型，是 number 的子类型
    debug: boolean;
}

const config: ExtendedConfig = {
    timeout: 5000,  // 只能是 5000
    retries: 3,
    debug: true
};

console.log("Config:", config);

// 不兼容的覆盖会报错
// interface InvalidConfig extends BaseConfig {
//     timeout: string;  // Error: 类型不兼容
// }

// ============================================
// 5. 继承链
// ============================================

interface Entity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Identifiable extends Entity {
    getIdentifier(): string;
}

interface Auditable extends Identifiable {
    createdBy: string;
    updatedBy: string;
    getAuditLog(): string[];
}

interface User extends Auditable {
    username: string;
    email: string;
    role: "admin" | "user";
}

const user: User = {
    id: "user_123",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
    updatedBy: "admin",
    username: "zhangsan",
    email: "zhangsan@example.com",
    role: "user",
    getIdentifier() {
        return this.id;
    },
    getAuditLog() {
        return [
            `Created by ${this.createdBy} at ${this.createdAt}`,
            `Updated by ${this.updatedBy} at ${this.updatedAt}`
        ];
    }
};

console.log("User ID:", user.getIdentifier());
console.log("Audit Log:", user.getAuditLog());

// ============================================
// 6. 菱形继承
// ============================================

interface A {
    a: string;
    common: string;
}

interface B extends A {
    b: string;
}

interface C extends A {
    c: string;
}

// D 继承 B 和 C，它们都继承自 A
interface D extends B, C {
    d: string;
}

// common 属性只出现一次 (来自 A)
const d: D = {
    a: "from A",
    b: "from B",
    c: "from C",
    d: "from D",
    common: "shared"
};

console.log("菱形继承:", d);

// ============================================
// 7. 泛型接口继承
// ============================================

interface Repository<T> {
    findById(id: string): T | null;
    findAll(): T[];
    save(entity: T): T;
    delete(id: string): boolean;
}

interface SoftDeleteRepository<T> extends Repository<T> {
    softDelete(id: string): boolean;
    restore(id: string): boolean;
    findDeleted(): T[];
}

interface QueryableRepository<T, Q> extends Repository<T> {
    query(query: Q): T[];
    count(query: Q): number;
}

// 实体类型
interface Product {
    id: string;
    name: string;
    price: number;
    deleted?: boolean;
}

// 查询类型
interface ProductQuery {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
}

// 组合多个泛型接口
interface ProductRepository extends
    SoftDeleteRepository<Product>,
    QueryableRepository<Product, ProductQuery> {
    findByPriceRange(min: number, max: number): Product[];
}

// 模拟实现
const productRepo: ProductRepository = {
    findById(id) {
        console.log(`查找产品 ${id}`);
        return null;
    },
    findAll() {
        return [];
    },
    save(entity) {
        console.log(`保存产品 ${entity.name}`);
        return entity;
    },
    delete(id) {
        console.log(`删除产品 ${id}`);
        return true;
    },
    softDelete(id) {
        console.log(`软删除产品 ${id}`);
        return true;
    },
    restore(id) {
        console.log(`恢复产品 ${id}`);
        return true;
    },
    findDeleted() {
        return [];
    },
    query(q) {
        console.log("执行查询:", q);
        return [];
    },
    count(q) {
        console.log("计数查询:", q);
        return 0;
    },
    findByPriceRange(min, max) {
        console.log(`查找价格在 ${min}-${max} 的产品`);
        return [];
    }
};

productRepo.save({ id: "1", name: "TypeScript 书籍", price: 99 });

// ============================================
// 8. 实际应用示例
// ============================================

// 示例 1: React 组件 Props 继承
interface BaseProps {
    className?: string;
    style?: Record<string, string | number>;
    children?: unknown;
}

interface ButtonProps extends BaseProps {
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
}

interface IconButtonProps extends ButtonProps {
    icon: string;
    iconPosition?: "left" | "right";
}

const iconButtonProps: IconButtonProps = {
    className: "btn-icon",
    onClick: () => console.log("clicked"),
    variant: "primary",
    icon: "search",
    iconPosition: "left"
};

console.log("IconButtonProps:", iconButtonProps);

// 示例 2: 事件系统继承
interface BaseEvent {
    type: string;
    timestamp: number;
    preventDefault(): void;
    stopPropagation(): void;
}

interface MouseEvent extends BaseEvent {
    type: "click" | "dblclick" | "mousedown" | "mouseup";
    clientX: number;
    clientY: number;
    button: number;
}

interface KeyboardEvent extends BaseEvent {
    type: "keydown" | "keyup" | "keypress";
    key: string;
    keyCode: number;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
}

interface TouchEvent extends BaseEvent {
    type: "touchstart" | "touchmove" | "touchend";
    touches: Array<{ clientX: number; clientY: number }>;
}

type UIEvent = MouseEvent | KeyboardEvent | TouchEvent;

function handleUIEvent(event: UIEvent): void {
    console.log(`事件类型: ${event.type}, 时间: ${event.timestamp}`);

    if ("clientX" in event) {
        console.log(`鼠标位置: (${event.clientX}, ${event.clientY})`);
    } else if ("key" in event) {
        console.log(`按键: ${event.key}`);
    } else if ("touches" in event) {
        console.log(`触摸点数: ${event.touches.length}`);
    }
}

// 示例 3: 配置继承
interface BaseServerConfig {
    host: string;
    port: number;
    ssl: boolean;
}

interface DatabaseConfig extends BaseServerConfig {
    database: string;
    username: string;
    password: string;
    pool: {
        min: number;
        max: number;
    };
}

interface RedisConfig extends BaseServerConfig {
    password?: string;
    db: number;
    keyPrefix?: string;
}

interface AppConfig {
    server: BaseServerConfig;
    database: DatabaseConfig;
    cache: RedisConfig;
    features: {
        [key: string]: boolean;
    };
}

const appConfig: AppConfig = {
    server: {
        host: "localhost",
        port: 3000,
        ssl: false
    },
    database: {
        host: "localhost",
        port: 5432,
        ssl: true,
        database: "myapp",
        username: "admin",
        password: "secret",
        pool: { min: 2, max: 10 }
    },
    cache: {
        host: "localhost",
        port: 6379,
        ssl: false,
        db: 0,
        keyPrefix: "app:"
    },
    features: {
        darkMode: true,
        notifications: true,
        analytics: false
    }
};

console.log("App Config:", appConfig.server.host);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 设计一个内容管理系统的接口继承结构
 */

interface Content {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    author: string;
}

interface Article extends Content {
    body: string;
    summary: string;
    tags: string[];
    category: string;
    published: boolean;
}

interface Video extends Content {
    url: string;
    duration: number;  // 秒
    thumbnail: string;
    resolution: "480p" | "720p" | "1080p" | "4k";
}

interface Gallery extends Content {
    images: Array<{
        url: string;
        caption?: string;
    }>;
    layout: "grid" | "carousel" | "masonry";
}

type ContentItem = Article | Video | Gallery;

function renderContent(content: ContentItem): void {
    console.log(`渲染内容: ${content.title}`);

    if ("body" in content) {
        console.log("文章类型");
    } else if ("duration" in content) {
        console.log(`视频时长: ${content.duration}秒`);
    } else if ("images" in content) {
        console.log(`图库包含 ${content.images.length} 张图片`);
    }
}

const article: Article = {
    id: "1",
    title: "TypeScript 入门",
    createdAt: new Date(),
    updatedAt: new Date(),
    author: "张三",
    body: "内容...",
    summary: "摘要...",
    tags: ["TypeScript", "前端"],
    category: "教程",
    published: true
};

renderContent(article);

/**
 * 练习 2: 设计一个权限系统的接口继承
 */

interface Permission {
    id: string;
    name: string;
    description: string;
}

interface Role extends Permission {
    permissions: Permission[];
    inherits?: Role[];
}

interface UserWithRole {
    id: string;
    username: string;
    roles: Role[];
}

function hasPermission(user: UserWithRole, permissionId: string): boolean {
    for (const role of user.roles) {
        // 检查直接权限
        if (role.permissions.some(p => p.id === permissionId)) {
            return true;
        }
        // 检查继承的角色
        if (role.inherits) {
            for (const inheritedRole of role.inherits) {
                if (inheritedRole.permissions.some(p => p.id === permissionId)) {
                    return true;
                }
            }
        }
    }
    return false;
}

const readPermission: Permission = { id: "read", name: "读取", description: "读取权限" };
const writePermission: Permission = { id: "write", name: "写入", description: "写入权限" };
const deletePermission: Permission = { id: "delete", name: "删除", description: "删除权限" };

const viewerRole: Role = {
    id: "viewer",
    name: "查看者",
    description: "只能查看",
    permissions: [readPermission]
};

const editorRole: Role = {
    id: "editor",
    name: "编辑者",
    description: "可以编辑",
    permissions: [writePermission],
    inherits: [viewerRole]
};

const adminRole: Role = {
    id: "admin",
    name: "管理员",
    description: "完全控制",
    permissions: [deletePermission],
    inherits: [editorRole]
};

const testUser: UserWithRole = {
    id: "user1",
    username: "admin",
    roles: [adminRole]
};

console.log("练习 2 - 有读取权限:", hasPermission(testUser, "read"));
console.log("练习 2 - 有删除权限:", hasPermission(testUser, "delete"));

// 导出
export {
    Animal,
    Dog,
    Duck,
    Entity,
    User,
    Repository,
    ProductRepository,
    AppConfig,
    Content,
    Article,
    Video,
    Gallery,
    Role,
    hasPermission
};
