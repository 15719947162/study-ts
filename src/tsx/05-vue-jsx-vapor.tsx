/**
 * Vue JSX Vapor 基础用法
 *
 * vue-jsx-vapor 是 Vue 3.6+ 的 Vapor Mode JSX 实现
 * 支持所有 Vue 指令和大多数宏
 *
 * 配置要求:
 * - tsconfig.json: "jsx": "preserve", "jsxImportSource": "vue-jsx-vapor"
 * - 安装: npm install vue-jsx-vapor
 */

import { ref, computed, defineVaporComponent } from "vue";
import { useRef } from "vue-jsx-vapor";

// ============================================
// 1. defineVaporComponent 基础
// ============================================

/**
 * defineVaporComponent 与 defineComponent 的区别:
 * - setup 直接返回 JSX，不需要返回函数
 * - 支持 props 解构
 * - 更好的性能优化
 */

// 基础组件
const BasicVaporComponent = defineVaporComponent(() => {
  const count = ref(0);

  return (
    <div>
      <h2>基础 Vapor 组件</h2>
      <p>计数: {count.value}</p>
      <button onClick={() => count.value++}>增加</button>
    </div>
  );
});

// 带 Props 解构的组件
const PropsDestructuring = defineVaporComponent(({ name, age = 18 }) => {
  // Props 可以直接解构使用
  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
    </div>
  );
});

// 手动定义 props 类型
interface UserProps {
  name: string;
  age?: number;
  role: "admin" | "user";
}

const TypedPropsComponent = defineVaporComponent(
  (props: UserProps) => {
    return (
      <div class="user-card">
        <h3>{props.name}</h3>
        <p>年龄: {props.age ?? "未知"}</p>
        <span class={`role-${props.role}`}>{props.role}</span>
      </div>
    );
  },
  {
    props: ["name", "age", "role"],
  }
);

// ============================================
// 2. Vue 指令支持
// ============================================

/**
 * vue-jsx-vapor 支持所有 Vue 指令
 * 语法与模板指令一致
 */

// v-if / v-else-if / v-else
const ConditionalDirectives = defineVaporComponent(({ status = 0 }) => {
  return (
    <div>
      <h3>条件渲染 (v-if)</h3>
      <div v-if={status === 0}>状态: 待处理</div>
      <div v-else-if={status === 1}>状态: 进行中</div>
      <div v-else-if={status === 2}>状态: 已完成</div>
      <div v-else>状态: 未知</div>
    </div>
  );
});

// v-show
const ShowDirective = defineVaporComponent(() => {
  const visible = ref(true);

  return (
    <div>
      <h3>显示隐藏 (v-show)</h3>
      <button onClick={() => (visible.value = !visible.value)}>
        切换显示
      </button>
      <p v-show={visible.value}>这段文字可以被隐藏</p>
    </div>
  );
});

// v-for
const ForDirective = defineVaporComponent(() => {
  const items = ref([
    { id: 1, name: "苹果" },
    { id: 2, name: "香蕉" },
    { id: 3, name: "橙子" },
  ]);

  return (
    <div>
      <h3>列表渲染 (v-for)</h3>

      {/* 遍历数组 */}
      <ul>
        <li v-for={(item, index) in items.value} key={item.id}>
          {index + 1}. {item.name}
        </li>
      </ul>

      {/* 遍历数字 */}
      <div>
        <span v-for={(n, i) in 5} key={i} style={{ marginRight: "8px" }}>
          {n}
        </span>
      </div>
    </div>
  );
});

// v-model
const ModelDirective = defineVaporComponent(() => {
  const text = ref("");
  const checked = ref(false);
  const selected = ref("option1");

  return (
    <div>
      <h3>双向绑定 (v-model)</h3>

      {/* 文本输入 */}
      <div>
        <input v-model={text.value} placeholder="输入文本" />
        <span>值: {text.value}</span>
      </div>

      {/* 复选框 */}
      <div>
        <label>
          <input type="checkbox" v-model={checked.value} />
          同意条款
        </label>
        <span>选中: {checked.value ? "是" : "否"}</span>
      </div>

      {/* 下拉选择 */}
      <div>
        <select v-model={selected.value}>
          <option value="option1">选项1</option>
          <option value="option2">选项2</option>
          <option value="option3">选项3</option>
        </select>
        <span>选中: {selected.value}</span>
      </div>
    </div>
  );
});

// v-model 修饰符
const ModelModifiers = defineVaporComponent(() => {
  const trimmed = ref("");
  const number = ref(0);
  const lazy = ref("");

  return (
    <div>
      <h3>v-model 修饰符</h3>

      {/* .trim 修饰符 - 注意语法 */}
      <div>
        <input v-model_trim={trimmed.value} placeholder="自动去除空格" />
        <span>值: "{trimmed.value}"</span>
      </div>

      {/* .number 修饰符 */}
      <div>
        <input v-model_number={number.value} type="number" />
        <span>值: {number.value} (类型: {typeof number.value})</span>
      </div>

      {/* .lazy 修饰符 */}
      <div>
        <input v-model_lazy={lazy.value} placeholder="失焦时更新" />
        <span>值: {lazy.value}</span>
      </div>
    </div>
  );
});

// ============================================
// 3. 宏 (Macros)
// ============================================

/**
 * vue-jsx-vapor 支持类似 Vue SFC 的宏
 * 无需显式导入
 */

// defineModel - 组件双向绑定
const CustomInput = defineVaporComponent(() => {
  // defineModel 宏 - 类似 Vue 3.4+ 的 defineModel
  const modelValue = defineModel<string>();

  return (
    <input
      value={modelValue!.value}
      onInput={(e) => {
        modelValue!.value = (e.target as HTMLInputElement).value;
      }}
      class="custom-input"
    />
  );
});

// 使用 CustomInput
const UseCustomInput = defineVaporComponent(() => {
  const inputValue = ref("");

  return (
    <div>
      <h3>defineModel 宏</h3>
      <CustomInput v-model={inputValue.value} />
      <p>输入值: {inputValue.value}</p>
    </div>
  );
});

// defineExpose - 暴露组件实例
const ExposedComponent = defineVaporComponent(() => {
  const count = ref(0);

  const increment = () => {
    count.value++;
  };

  const reset = () => {
    count.value = 0;
  };

  // 暴露给父组件
  defineExpose({
    count,
    increment,
    reset,
  });

  return (
    <div>
      <p>内部计数: {count.value}</p>
    </div>
  );
});

// 使用暴露的组件
const UseExposedComponent = defineVaporComponent(() => {
  const compRef = useRef<{
    count: { value: number };
    increment: () => void;
    reset: () => void;
  }>();

  return (
    <div>
      <h3>defineExpose 宏</h3>
      <ExposedComponent ref={compRef} />
      <div>
        <button onClick={() => compRef.value?.increment()}>
          父组件调用 increment
        </button>
        <button onClick={() => compRef.value?.reset()}>
          父组件调用 reset
        </button>
        <p>从父组件读取: {compRef.value?.count.value ?? 0}</p>
      </div>
    </div>
  );
});

// defineSlots - 插槽类型定义
const SlottedComponent = defineVaporComponent(() => {
  defineSlots<{
    default: () => any;
    header: (props: { title: string }) => any;
    footer: () => any;
  }>();

  return (
    <div class="slotted-component">
      <header>
        <slot name="header" title="标题内容" />
      </header>
      <main>
        <slot />
      </main>
      <footer>
        <slot name="footer" />
      </footer>
    </div>
  );
});

// ============================================
// 4. 插槽 (Slots)
// ============================================

/**
 * v-slot 和 v-slots 指令
 */

const Card = defineVaporComponent(() => {
  defineSlots<{
    default: () => any;
    title: () => any;
    actions: () => any;
  }>();

  return (
    <div class="card">
      <div class="card-header">
        <slot name="title" />
      </div>
      <div class="card-body">
        <slot />
      </div>
      <div class="card-actions">
        <slot name="actions" />
      </div>
    </div>
  );
});

// 使用 v-slot
const UseCardWithVSlot = defineVaporComponent(() => {
  return (
    <Card>
      {/* 默认插槽 */}
      <p>这是卡片内容</p>

      {/* 具名插槽 - 使用 template */}
      <template v-slot:title>
        <h2>卡片标题</h2>
      </template>

      <template v-slot:actions>
        <button>确认</button>
        <button>取消</button>
      </template>
    </Card>
  );
});

// 使用 v-slots (对象语法)
const UseCardWithVSlots = defineVaporComponent(() => {
  return (
    <Card
      v-slots={{
        default: () => <p>这是卡片内容</p>,
        title: () => <h2>卡片标题</h2>,
        actions: () => (
          <>
            <button>确认</button>
            <button>取消</button>
          </>
        ),
      }}
    />
  );
});

// 作用域插槽
const DataList = defineVaporComponent(({ items = [] as { id: number; name: string }[] }) => {
  defineSlots<{
    item: (props: { item: { id: number; name: string }; index: number }) => any;
    empty: () => any;
  }>();

  return (
    <ul class="data-list">
      {items.length === 0 ? (
        <slot name="empty" />
      ) : (
        items.map((item, index) => (
          <li key={item.id}>
            <slot name="item" item={item} index={index} />
          </li>
        ))
      )}
    </ul>
  );
});

const UseScopedSlots = defineVaporComponent(() => {
  const users = ref([
    { id: 1, name: "张三" },
    { id: 2, name: "李四" },
    { id: 3, name: "王五" },
  ]);

  return (
    <div>
      <h3>作用域插槽</h3>
      <DataList
        items={users.value}
        v-slots={{
          item: ({ item, index }) => (
            <span>
              {index + 1}. {item.name}
            </span>
          ),
          empty: () => <span>暂无数据</span>,
        }}
      />
    </div>
  );
});

// ============================================
// 5. useRef Hook
// ============================================

/**
 * useRef 用于获取组件引用
 * 类似 Vue 的 ref 但专为 JSX 优化
 */

const FocusInput = defineVaporComponent(() => {
  const inputRef = useRef<HTMLInputElement>();

  const focusInput = () => {
    inputRef.value?.focus();
  };

  const clearInput = () => {
    if (inputRef.value) {
      inputRef.value.value = "";
      inputRef.value.focus();
    }
  };

  return (
    <div>
      <h3>useRef Hook</h3>
      <input ref={inputRef} type="text" placeholder="点击按钮聚焦" />
      <button onClick={focusInput}>聚焦</button>
      <button onClick={clearInput}>清空并聚焦</button>
    </div>
  );
});

// ============================================
// 6. 与 React 迁移对比
// ============================================

/**
 * 从 React 迁移到 vue-jsx-vapor 的对照
 */

// React useImperativeHandle -> Vue defineExpose
const ImperativeHandleExample = defineVaporComponent(
  ({ count = 0 }) => {
    // 在 React 中:
    // useImperativeHandle(ref, () => ({ count: count * 2 }), [count])

    // 在 Vue JSX Vapor 中:
    defineExpose(
      computed(() => ({
        doubleCount: count * 2,
      }))
    );

    return <div>Count: {count}</div>;
  }
);

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个 TodoList 组件
 * 要求:
 * - 使用 defineVaporComponent
 * - 使用 v-for 渲染列表
 * - 使用 v-model 实现输入绑定
 * - 使用 v-if 显示空状态
 */
// TODO: 实现 TodoList

/**
 * 练习 2: 创建一个 Tabs 组件
 * 要求:
 * - 使用 defineSlots 定义插槽类型
 * - 支持作用域插槽传递当前 tab 信息
 * - 使用 v-show 切换面板
 */
// TODO: 实现 Tabs

/**
 * 练习 3: 创建一个可控的 Dialog 组件
 * 要求:
 * - 使用 defineModel 实现 v-model:visible
 * - 使用 defineExpose 暴露 open/close 方法
 * - 使用 v-if 控制显示
 */
// TODO: 实现 Dialog

// 导出组件
export {
  BasicVaporComponent,
  PropsDestructuring,
  TypedPropsComponent,
  ConditionalDirectives,
  ShowDirective,
  ForDirective,
  ModelDirective,
  ModelModifiers,
  CustomInput,
  UseCustomInput,
  ExposedComponent,
  UseExposedComponent,
  SlottedComponent,
  Card,
  UseCardWithVSlot,
  UseCardWithVSlots,
  DataList,
  UseScopedSlots,
  FocusInput,
  ImperativeHandleExample,
};
