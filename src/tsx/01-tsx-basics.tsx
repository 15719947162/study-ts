/**
 * TSX 基础语法
 *
 * TSX 是 TypeScript 中的 JSX，提供类型安全的 UI 描述方式
 * 本文件基于 Vue JSX 语法演示
 */

import { defineComponent, ref } from "vue";

// ============================================
// 1. TSX 基础语法
// ============================================

/**
 * 基础 JSX 元素
 * TSX 允许在 TypeScript 中直接编写类似 HTML 的代码
 */
const BasicElement = defineComponent({
  name: "BasicElement",
  setup() {
    return () => (
      <div class="container">
        <h1>Hello TSX</h1>
        <p>这是一个基础的 TSX 组件</p>
      </div>
    );
  },
});

// ============================================
// 2. 表达式插值
// ============================================

/**
 * 在 TSX 中使用 {} 插入 JavaScript 表达式
 */
const ExpressionDemo = defineComponent({
  name: "ExpressionDemo",
  setup() {
    const userName = ref("张三");
    const age = ref(25);
    const isVip = ref(true);

    // 表达式计算
    const doubleAge = () => age.value * 2;

    return () => (
      <div>
        {/* 变量插值 */}
        <p>用户名: {userName.value}</p>

        {/* 表达式计算 */}
        <p>年龄: {age.value}，双倍: {doubleAge()}</p>

        {/* 三元表达式 */}
        <p>会员状态: {isVip.value ? "VIP用户" : "普通用户"}</p>

        {/* 模板字符串 */}
        <p>{`欢迎 ${userName.value}，您今年 ${age.value} 岁`}</p>
      </div>
    );
  },
});

// ============================================
// 3. 条件渲染
// ============================================

/**
 * TSX 中的条件渲染使用 JavaScript 表达式
 * 而不是 v-if 指令
 */
const ConditionalRendering = defineComponent({
  name: "ConditionalRendering",
  setup() {
    const isLoggedIn = ref(true);
    const userRole = ref<"admin" | "user" | "guest">("admin");
    const showDetails = ref(false);

    return () => (
      <div>
        {/* 方式1: 三元表达式 */}
        {isLoggedIn.value ? <p>欢迎回来!</p> : <p>请先登录</p>}

        {/* 方式2: 逻辑与 (&&) - 只在条件为真时渲染 */}
        {showDetails.value && <div class="details">详细信息内容...</div>}

        {/* 方式3: 多条件判断 - 使用 IIFE 或提取函数 */}
        {(() => {
          switch (userRole.value) {
            case "admin":
              return <p style={{ color: "red" }}>管理员面板</p>;
            case "user":
              return <p style={{ color: "blue" }}>用户面板</p>;
            case "guest":
              return <p style={{ color: "gray" }}>访客面板</p>;
            default:
              return null;
          }
        })()}
      </div>
    );
  },
});

// ============================================
// 4. 列表渲染
// ============================================

/**
 * 使用数组的 map 方法进行列表渲染
 * 注意: 需要为每个元素提供唯一的 key
 */

// 定义数据类型
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const ListRendering = defineComponent({
  name: "ListRendering",
  setup() {
    const todos = ref<TodoItem[]>([
      { id: 1, text: "学习 TypeScript", completed: true },
      { id: 2, text: "学习 TSX", completed: false },
      { id: 3, text: "练习组件开发", completed: false },
    ]);

    const numbers = [1, 2, 3, 4, 5];

    return () => (
      <div>
        {/* 基础列表渲染 */}
        <h3>数字列表</h3>
        <ul>
          {numbers.map((num) => (
            <li key={num}>{num}</li>
          ))}
        </ul>

        {/* 对象列表渲染 */}
        <h3>待办事项</h3>
        <ul>
          {todos.value.map((todo) => (
            <li
              key={todo.id}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </li>
          ))}
        </ul>

        {/* 带索引的列表渲染 */}
        <h3>带索引</h3>
        <ul>
          {todos.value.map((todo, index) => (
            <li key={todo.id}>
              {index + 1}. {todo.text}
            </li>
          ))}
        </ul>
      </div>
    );
  },
});

// ============================================
// 5. 样式绑定
// ============================================

/**
 * TSX 中的样式绑定
 * - class 使用 class 属性 (不是 className，Vue JSX 支持两者)
 * - style 使用对象语法，属性名使用驼峰命名
 */
const StyleBinding = defineComponent({
  name: "StyleBinding",
  setup() {
    const isActive = ref(true);
    const hasError = ref(false);
    const fontSize = ref(16);

    return () => (
      <div>
        {/* 动态 class */}
        <p class={isActive.value ? "active" : ""}>动态 class</p>

        {/* 多个 class */}
        <p
          class={{
            active: isActive.value,
            error: hasError.value,
            "text-bold": true,
          }}
        >
          对象语法 class
        </p>

        {/* 数组语法 */}
        <p class={["base-class", isActive.value && "active", hasError.value && "error"].filter(Boolean)}>
          数组语法 class
        </p>

        {/* 内联样式 - 使用对象，属性名驼峰 */}
        <p
          style={{
            fontSize: `${fontSize.value}px`,
            color: isActive.value ? "green" : "gray",
            fontWeight: "bold",
          }}
        >
          内联样式
        </p>
      </div>
    );
  },
});

// ============================================
// 6. 属性绑定
// ============================================

/**
 * TSX 中的属性绑定直接使用 {} 包裹表达式
 */
const AttributeBinding = defineComponent({
  name: "AttributeBinding",
  setup() {
    const inputId = ref("user-input");
    const isDisabled = ref(false);
    const imageUrl = ref("https://example.com/image.png");
    const inputType = ref<"text" | "password">("text");

    // 动态属性对象
    const inputAttrs = {
      id: inputId.value,
      type: inputType.value,
      placeholder: "请输入内容",
      disabled: isDisabled.value,
    };

    return () => (
      <div>
        {/* 直接绑定属性 */}
        <input
          id={inputId.value}
          type={inputType.value}
          disabled={isDisabled.value}
          placeholder="直接绑定"
        />

        {/* 展开运算符绑定多个属性 */}
        <input {...inputAttrs} />

        {/* 动态属性名 (较少使用) */}
        <img src={imageUrl.value} alt="示例图片" />
      </div>
    );
  },
});

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 基础表达式
 * 创建一个组件，显示用户信息卡片
 * - 显示姓名、年龄、邮箱
 * - 年龄大于 18 显示 "成年"，否则显示 "未成年"
 */
// TODO: 实现 UserCard 组件
// const UserCard = defineComponent({...})

/**
 * 练习 2: 列表渲染
 * 创建一个商品列表组件
 * - 定义 Product 接口 (id, name, price, inStock)
 * - 渲染商品列表
 * - 库存为 0 的商品显示 "缺货" 并添加特殊样式
 */
// TODO: 实现 ProductList 组件
// interface Product {...}
// const ProductList = defineComponent({...})

/**
 * 练习 3: 条件渲染
 * 创建一个登录状态组件
 * - 根据登录状态显示不同内容
 * - 登录后显示用户名和退出按钮
 * - 未登录显示登录表单
 */
// TODO: 实现 LoginStatus 组件
// const LoginStatus = defineComponent({...})

// 导出组件
export {
  BasicElement,
  ExpressionDemo,
  ConditionalRendering,
  ListRendering,
  StyleBinding,
  AttributeBinding,
};
