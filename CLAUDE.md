# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 **TypeScript 学习与练习项目**，包含从基础到高级的完整知识点体系，每个知识点都有详细的讲解和可运行的练习代码。

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (可在浏览器中查看)
npm run dev

# 直接运行 TypeScript 文件 (需要安装 ts-node)
npx ts-node src/01-basic-types/01-primitives.ts

# TypeScript 类型检查
npx tsc --noEmit

# 构建生产版本
npm run build
```

## 技术栈

- **TypeScript 5.8** - 严格模式启用
- **Vite 6** - 构建工具
- **Vue 3.5** - 可选的前端框架支持

## 项目结构

```
src/
├── 01-basic-types/          # 基础类型
│   ├── 01-primitives.ts     # 原始类型: string, number, boolean, null, undefined, symbol, bigint
│   ├── 02-arrays-tuples.ts  # 数组与元组
│   ├── 03-enums.ts          # 枚举类型
│   ├── 04-any-unknown.ts    # any 与 unknown 的区别
│   ├── 05-void-never.ts     # void 与 never 类型
│   └── 06-type-assertion.ts # 类型断言
│
├── 02-functions/            # 函数与类型
│   ├── 01-function-basics.ts      # 函数基础类型
│   ├── 02-optional-default-params.ts # 可选参数与默认值
│   ├── 03-rest-params.ts          # 剩余参数与展开运算符
│   ├── 04-function-overloads.ts   # 函数重载
│   ├── 05-this-type.ts            # this 类型
│   └── 06-callback-types.ts       # 回调函数与高阶函数
│
├── 03-interfaces-types/     # 接口与类型别名
│   ├── 01-interface-basics.ts   # 接口基础
│   ├── 02-type-alias.ts         # 类型别名
│   ├── 03-interface-vs-type.ts  # 接口与类型别名对比
│   ├── 04-interface-extends.ts  # 接口继承
│   ├── 05-union-intersection.ts # 联合类型与交叉类型
│   └── 06-index-signatures.ts   # 索引签名
│
├── 04-classes/              # 类与面向对象
│   ├── 01-class-basics.ts       # 类的基础
│   ├── 02-access-modifiers.ts   # 访问修饰符: public, private, protected
│   ├── 03-inheritance.ts        # 继承与多态
│   ├── 04-abstract-classes.ts   # 抽象类
│   ├── 05-static-members.ts     # 静态成员
│   └── 06-getters-setters.ts    # 存取器
│
├── 05-generics/             # 泛型
│   ├── 01-generic-basics.ts     # 泛型基础
│   ├── 02-generic-constraints.ts # 泛型约束
│   └── 03-utility-types.ts      # 内置工具类型
│
├── 06-advanced-types/       # 高级类型
│   ├── 01-conditional-infer.ts  # 条件类型与 infer
│   └── 02-type-challenges.ts    # 类型体操练习
│
├── 07-modules/              # 模块与命名空间
│   ├── 01-es-modules.ts         # ES 模块基础
│   ├── 02-namespaces.ts         # 命名空间
│   └── 03-declaration-files.ts  # 声明文件
│
├── 08-decorators/           # 装饰器
│   └── 01-decorator-basics.ts   # 装饰器基础 (需要启用 experimentalDecorators)
│
└── 09-practical/            # 实战练习
    ├── 01-type-challenges.ts    # 类型体操挑战
    └── 02-design-patterns.ts    # 设计模式实现
```

## 学习路径

### 第一阶段: 基础入门
1. **基础类型** - 掌握 TypeScript 的类型系统基础
2. **函数类型** - 理解函数参数和返回值的类型定义

### 第二阶段: 核心概念
3. **接口与类型别名** - 学会定义复杂的对象类型
4. **类与面向对象** - 掌握 TypeScript 的 OOP 特性

### 第三阶段: 进阶提升
5. **泛型** - 创建可重用的类型安全组件
6. **高级类型** - 条件类型、映射类型、类型体操

## TypeScript 配置

- `tsconfig.app.json` - 应用代码配置，启用严格模式
- `tsconfig.node.json` - Node.js 环境配置

## 学习建议

1. 按顺序学习每个章节的 README.md
2. 阅读代码中的注释了解知识点
3. 完成每个文件末尾的练习题
4. 尝试修改代码观察类型检查效果
