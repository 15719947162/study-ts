# TSX 知识点

TSX 是 TypeScript 中的 JSX 语法扩展，允许在 TypeScript 中编写类似 HTML 的代码来描述 UI 结构。

## 本章内容

| 文件 | 知识点 |
|------|--------|
| 01-tsx-basics.tsx | TSX 基础语法、表达式、条件渲染、列表渲染 |
| 02-components.tsx | 函数组件、类型定义、组件组合 |
| 03-props-events.tsx | Props 类型、事件处理、子组件通信 |
| 04-advanced-patterns.tsx | 泛型组件、Render Props、组合模式 |
| 05-vue-jsx-vapor.tsx | Vue JSX Vapor 指令、宏、插槽、useRef |

## TSX vs JSX

- **JSX**: JavaScript 的语法扩展
- **TSX**: TypeScript 的 JSX，提供完整的类型检查

## 配置要求

在 `tsconfig.json` 中需要配置：

```json
{
  "compilerOptions": {
    "jsx": "preserve",          // 保留 JSX 语法，由构建工具处理
    "jsxImportSource": "vue"    // 或 "react"，指定 JSX 运行时
  }
}
```

## 学习目标

1. 理解 TSX 基础语法和表达式
2. 掌握函数组件的类型定义
3. 学会 Props 和事件的类型约束
4. 了解高级组件模式
