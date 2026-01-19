# 08 - 装饰器 (Decorators)

装饰器是一种特殊的声明，可以附加到类、方法、属性或参数上，用于修改类的行为。

## 知识点概览

1. **装饰器基础**: 装饰器的概念和语法
2. **类装饰器**: 修改或替换类的定义
3. **方法装饰器**: 修改方法的行为
4. **属性装饰器**: 修改属性的定义
5. **参数装饰器**: 为方法参数添加元数据
6. **装饰器工厂**: 创建可配置的装饰器

## 文件说明

- `01-decorator-basics.ts` - 装饰器基础
- `02-class-decorators.ts` - 类装饰器
- `03-method-decorators.ts` - 方法和属性装饰器

## 学习目标

- 理解装饰器的工作原理
- 掌握各种类型装饰器的使用
- 学会创建装饰器工厂
- 了解装饰器的实际应用场景

## 注意事项

装饰器目前是实验性特性，需要在 tsconfig.json 中启用:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```
