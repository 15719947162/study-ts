/**
 * TSX 组件定义
 *
 * 本文件介绍在 Vue 中使用 TSX 定义组件的各种方式
 */

import { defineComponent, ref, computed, type PropType, type Ref } from "vue";

// ============================================
// 1. 函数式组件
// ============================================

/**
 * 最简单的函数式组件
 * 直接返回 JSX 元素
 */
const SimpleGreeting = () => <h1>Hello, World!</h1>;

/**
 * 带参数的函数式组件
 * 使用 TypeScript 定义 props 类型
 */
interface GreetingProps {
  name: string;
  age?: number;
}

const Greeting = (props: GreetingProps) => (
  <div>
    <h2>你好, {props.name}!</h2>
    {props.age && <p>年龄: {props.age}</p>}
  </div>
);

// ============================================
// 2. defineComponent 定义组件
// ============================================

/**
 * 使用 defineComponent 定义组件
 * 这是 Vue 3 推荐的方式，提供完整的类型推断
 */
const Counter = defineComponent({
  name: "Counter",
  setup() {
    const count = ref(0);

    const increment = () => {
      count.value++;
    };

    const decrement = () => {
      count.value--;
    };

    return () => (
      <div class="counter">
        <button onClick={decrement}>-</button>
        <span style={{ margin: "0 16px" }}>{count.value}</span>
        <button onClick={increment}>+</button>
      </div>
    );
  },
});

// ============================================
// 3. 带 Props 的组件
// ============================================

/**
 * 定义 Props 接口
 */
interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

/**
 * 使用 defineComponent 的 props 选项
 */
const UserCard = defineComponent({
  name: "UserCard",
  props: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "/default-avatar.png",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // props 已经有正确的类型推断
    const statusText = computed(() => (props.isOnline ? "在线" : "离线"));
    const statusColor = computed(() => (props.isOnline ? "green" : "gray"));

    return () => (
      <div class="user-card">
        <img src={props.avatar} alt={props.name} class="avatar" />
        <div class="info">
          <h3>{props.name}</h3>
          <p>{props.email}</p>
          <span style={{ color: statusColor.value }}>{statusText.value}</span>
        </div>
      </div>
    );
  },
});

// ============================================
// 4. 泛型组件
// ============================================

/**
 * 泛型列表组件
 * 使用泛型来支持不同类型的数据
 */
interface ListItem {
  id: number | string;
}

interface GenericListProps<T extends ListItem> {
  items: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  keyExtractor?: (item: T) => string | number;
}

/**
 * 泛型列表组件工厂函数
 */
function createGenericList<T extends ListItem>() {
  return defineComponent({
    name: "GenericList",
    props: {
      items: {
        type: Array as PropType<T[]>,
        required: true,
      },
      renderItem: {
        type: Function as PropType<(item: T, index: number) => JSX.Element>,
        required: true,
      },
      keyExtractor: {
        type: Function as PropType<(item: T) => string | number>,
        default: (item: T) => item.id,
      },
    },
    setup(props) {
      return () => (
        <ul class="generic-list">
          {props.items.map((item, index) => (
            <li key={props.keyExtractor(item)}>{props.renderItem(item, index)}</li>
          ))}
        </ul>
      );
    },
  });
}

// 使用示例
interface User {
  id: number;
  name: string;
  role: string;
}

const UserList = createGenericList<User>();

// ============================================
// 5. 组件组合
// ============================================

/**
 * 卡片组件 - 作为容器
 */
const Card = defineComponent({
  name: "Card",
  props: {
    title: {
      type: String,
      required: true,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div
        class="card"
        style={{
          border: props.bordered ? "1px solid #e0e0e0" : "none",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <div class="card-header">
          <h3>{props.title}</h3>
        </div>
        <div class="card-body">{slots.default?.()}</div>
        {slots.footer && <div class="card-footer">{slots.footer()}</div>}
      </div>
    );
  },
});

/**
 * 使用 Card 组件的页面
 */
const Dashboard = defineComponent({
  name: "Dashboard",
  setup() {
    const stats = ref({
      users: 1234,
      orders: 567,
      revenue: 89012,
    });

    return () => (
      <div class="dashboard">
        <Card title="用户统计">
          <p>总用户数: {stats.value.users}</p>
        </Card>

        <Card title="订单统计">
          <p>总订单数: {stats.value.orders}</p>
        </Card>

        <Card
          title="收入统计"
          v-slots={{
            footer: () => <button>查看详情</button>,
          }}
        >
          <p>总收入: ¥{stats.value.revenue}</p>
        </Card>
      </div>
    );
  },
});

// ============================================
// 6. 状态管理组件
// ============================================

/**
 * 带有复杂状态的表单组件
 */
interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const LoginForm = defineComponent({
  name: "LoginForm",
  emits: ["submit", "cancel"],
  setup(_props, { emit }) {
    const formData: Ref<FormData> = ref({
      username: "",
      password: "",
      rememberMe: false,
    });

    const errors: Ref<FormErrors> = ref({});
    const isSubmitting = ref(false);

    const validate = (): boolean => {
      const newErrors: FormErrors = {};

      if (!formData.value.username) {
        newErrors.username = "用户名不能为空";
      } else if (formData.value.username.length < 3) {
        newErrors.username = "用户名至少3个字符";
      }

      if (!formData.value.password) {
        newErrors.password = "密码不能为空";
      } else if (formData.value.password.length < 6) {
        newErrors.password = "密码至少6个字符";
      }

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validate()) return;

      isSubmitting.value = true;
      try {
        // 模拟 API 调用
        await new Promise((resolve) => setTimeout(resolve, 1000));
        emit("submit", formData.value);
      } finally {
        isSubmitting.value = false;
      }
    };

    const handleCancel = () => {
      formData.value = {
        username: "",
        password: "",
        rememberMe: false,
      };
      errors.value = {};
      emit("cancel");
    };

    return () => (
      <form class="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            type="text"
            value={formData.value.username}
            onInput={(e) => {
              formData.value.username = (e.target as HTMLInputElement).value;
            }}
          />
          {errors.value.username && (
            <span class="error">{errors.value.username}</span>
          )}
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            type="password"
            value={formData.value.password}
            onInput={(e) => {
              formData.value.password = (e.target as HTMLInputElement).value;
            }}
          />
          {errors.value.password && (
            <span class="error">{errors.value.password}</span>
          )}
        </div>

        <div class="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.value.rememberMe}
              onChange={(e) => {
                formData.value.rememberMe = (e.target as HTMLInputElement).checked;
              }}
            />
            记住我
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" disabled={isSubmitting.value}>
            {isSubmitting.value ? "登录中..." : "登录"}
          </button>
          <button type="button" onClick={handleCancel}>
            取消
          </button>
        </div>
      </form>
    );
  },
});

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建 Badge 组件
 * - 支持 type: 'success' | 'warning' | 'error' | 'info'
 * - 支持 size: 'small' | 'medium' | 'large'
 * - 显示传入的文本内容
 */
// TODO: 实现 Badge 组件
// const Badge = defineComponent({...})

/**
 * 练习 2: 创建 Tabs 组件
 * - 接收 tabs 数组，每个 tab 包含 { key, label, content }
 * - 支持切换 tab 显示对应内容
 * - 当前选中的 tab 高亮显示
 */
// TODO: 实现 Tabs 组件
// interface Tab {...}
// const Tabs = defineComponent({...})

/**
 * 练习 3: 创建 Modal 组件
 * - 支持 visible 控制显示/隐藏
 * - 支持 title 标题
 * - 支持 default slot 内容
 * - 支持确认和取消按钮及事件
 */
// TODO: 实现 Modal 组件
// const Modal = defineComponent({...})

// 导出组件
export {
  SimpleGreeting,
  Greeting,
  Counter,
  UserCard,
  createGenericList,
  UserList,
  Card,
  Dashboard,
  LoginForm,
};

// 导出类型
export type { GreetingProps, UserCardProps, GenericListProps, FormData };
