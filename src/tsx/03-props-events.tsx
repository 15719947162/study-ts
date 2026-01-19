/**
 * TSX Props 与事件处理
 *
 * 本文件介绍 TSX 中的 Props 类型定义和事件处理
 */

import { defineComponent, ref, type PropType } from "vue";

// ============================================
// 1. Props 基础类型
// ============================================

/**
 * 基础类型 Props
 */
const BasicProps = defineComponent({
  name: "BasicProps",
  props: {
    // 字符串
    title: {
      type: String,
      required: true,
    },
    // 数字
    count: {
      type: Number,
      default: 0,
    },
    // 布尔值
    disabled: {
      type: Boolean,
      default: false,
    },
    // 数组
    items: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props) {
    return () => (
      <div>
        <h2>{props.title}</h2>
        <p>Count: {props.count}</p>
        <p>Disabled: {props.disabled ? "Yes" : "No"}</p>
        <ul>
          {props.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  },
});

// ============================================
// 2. 复杂对象 Props
// ============================================

/**
 * 用户信息接口
 */
interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  permissions: string[];
}

/**
 * 配置选项接口
 */
interface ComponentConfig {
  theme: "light" | "dark";
  size: "small" | "medium" | "large";
  showHeader: boolean;
  customStyles?: Record<string, string>;
}

const ComplexProps = defineComponent({
  name: "ComplexProps",
  props: {
    // 对象类型 - 使用 PropType
    user: {
      type: Object as PropType<UserInfo>,
      required: true,
    },
    // 可选对象类型
    config: {
      type: Object as PropType<ComponentConfig>,
      default: (): ComponentConfig => ({
        theme: "light",
        size: "medium",
        showHeader: true,
      }),
    },
    // 联合类型
    status: {
      type: String as PropType<"loading" | "success" | "error">,
      default: "loading",
    },
  },
  setup(props) {
    const getStatusColor = () => {
      const colors = {
        loading: "blue",
        success: "green",
        error: "red",
      };
      return colors[props.status];
    };

    return () => (
      <div
        class={`theme-${props.config.theme}`}
        style={{ fontSize: props.config.size === "large" ? "18px" : "14px" }}
      >
        {props.config.showHeader && (
          <header>
            <h2>用户信息</h2>
          </header>
        )}
        <div class="user-info">
          <p>ID: {props.user.id}</p>
          <p>姓名: {props.user.name}</p>
          <p>邮箱: {props.user.email}</p>
          <p>角色: {props.user.role}</p>
          <p style={{ color: getStatusColor() }}>状态: {props.status}</p>
        </div>
      </div>
    );
  },
});

// ============================================
// 3. 函数类型 Props
// ============================================

/**
 * 回调函数 Props
 */
interface CallbackItem {
  id: number;
  name: string;
}

const CallbackProps = defineComponent({
  name: "CallbackProps",
  props: {
    // 简单回调
    onClick: {
      type: Function as PropType<() => void>,
      required: false,
    },
    // 带参数的回调
    onSelect: {
      type: Function as PropType<(item: CallbackItem) => void>,
      required: false,
    },
    // 带返回值的回调
    onValidate: {
      type: Function as PropType<(value: string) => boolean>,
      required: false,
    },
    // 异步回调
    onSubmit: {
      type: Function as PropType<(data: Record<string, unknown>) => Promise<void>>,
      required: false,
    },
  },
  setup(props) {
    const items: CallbackItem[] = [
      { id: 1, name: "选项1" },
      { id: 2, name: "选项2" },
      { id: 3, name: "选项3" },
    ];

    const inputValue = ref("");

    const handleItemClick = (item: CallbackItem) => {
      props.onSelect?.(item);
    };

    const handleValidate = () => {
      if (props.onValidate) {
        const isValid = props.onValidate(inputValue.value);
        console.log("验证结果:", isValid);
      }
    };

    return () => (
      <div>
        <button onClick={props.onClick}>点击按钮</button>

        <ul>
          {items.map((item) => (
            <li key={item.id} onClick={() => handleItemClick(item)} style={{ cursor: "pointer" }}>
              {item.name}
            </li>
          ))}
        </ul>

        <input
          value={inputValue.value}
          onInput={(e) => {
            inputValue.value = (e.target as HTMLInputElement).value;
          }}
        />
        <button onClick={handleValidate}>验证</button>
      </div>
    );
  },
});

// ============================================
// 4. 事件处理
// ============================================

/**
 * 原生 DOM 事件类型
 */
const NativeEvents = defineComponent({
  name: "NativeEvents",
  setup() {
    // 点击事件
    const handleClick = (event: MouseEvent) => {
      console.log("点击位置:", event.clientX, event.clientY);
    };

    // 输入事件
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      console.log("输入值:", target.value);
    };

    // 键盘事件
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        console.log("按下回车键");
      }
    };

    // 表单提交
    const handleSubmit = (event: Event) => {
      event.preventDefault();
      console.log("表单提交");
    };

    // 焦点事件
    const handleFocus = (_event: FocusEvent) => {
      console.log("获得焦点");
    };

    const handleBlur = (_event: FocusEvent) => {
      console.log("失去焦点");
    };

    return () => (
      <div>
        {/* 点击事件 */}
        <button onClick={handleClick}>点击我</button>

        {/* 输入事件 */}
        <input
          type="text"
          onInput={handleInput}
          onKeydown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="输入内容..."
        />

        {/* 表单事件 */}
        <form onSubmit={handleSubmit}>
          <button type="submit">提交</button>
        </form>
      </div>
    );
  },
});

// ============================================
// 5. 自定义事件 (emits)
// ============================================

/**
 * 定义自定义事件类型
 */
interface CustomEvents {
  onUpdate: (value: string) => void;
  onDelete: (id: number) => void;
  onChange: (oldValue: string, newValue: string) => void;
}

const CustomEventsComponent = defineComponent({
  name: "CustomEventsComponent",
  props: {
    initialValue: {
      type: String,
      default: "",
    },
  },
  emits: {
    // 事件验证器
    update: (value: string) => {
      return typeof value === "string";
    },
    delete: (id: number) => {
      return typeof id === "number";
    },
    change: (oldValue: string, newValue: string) => {
      return typeof oldValue === "string" && typeof newValue === "string";
    },
  },
  setup(props, { emit }) {
    const currentValue = ref(props.initialValue);

    const handleUpdate = () => {
      emit("update", currentValue.value);
    };

    const handleDelete = (id: number) => {
      emit("delete", id);
    };

    const handleChange = (newValue: string) => {
      const oldValue = currentValue.value;
      currentValue.value = newValue;
      emit("change", oldValue, newValue);
    };

    return () => (
      <div>
        <input
          value={currentValue.value}
          onInput={(e) => handleChange((e.target as HTMLInputElement).value)}
        />
        <button onClick={handleUpdate}>更新</button>
        <button onClick={() => handleDelete(1)}>删除</button>
      </div>
    );
  },
});

// ============================================
// 6. 事件修饰符替代方案
// ============================================

/**
 * TSX 中没有 v-on 修饰符，需要手动实现
 */
const EventModifiers = defineComponent({
  name: "EventModifiers",
  setup() {
    // .stop - 阻止冒泡
    const handleClickStop = (event: MouseEvent) => {
      event.stopPropagation();
      console.log("点击 - 阻止冒泡");
    };

    // .prevent - 阻止默认行为
    const handleClickPrevent = (event: Event) => {
      event.preventDefault();
      console.log("点击 - 阻止默认行为");
    };

    // .once - 只触发一次
    let clickedOnce = false;
    const handleClickOnce = () => {
      if (clickedOnce) return;
      clickedOnce = true;
      console.log("只触发一次");
    };

    // .self - 只在元素本身触发
    const handleClickSelf = (event: MouseEvent) => {
      if (event.target !== event.currentTarget) return;
      console.log("只在元素本身触发");
    };

    // 键盘修饰符
    const handleKeyEnter = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      console.log("按下 Enter");
    };

    const handleKeyEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      console.log("按下 Escape");
    };

    // Ctrl + Click
    const handleCtrlClick = (event: MouseEvent) => {
      if (!event.ctrlKey) return;
      console.log("Ctrl + 点击");
    };

    return () => (
      <div onClick={() => console.log("父元素点击")}>
        <h3>事件修饰符替代方案</h3>

        {/* .stop */}
        <button onClick={handleClickStop}>阻止冒泡 (.stop)</button>

        {/* .prevent */}
        <a href="https://example.com" onClick={handleClickPrevent}>
          阻止默认 (.prevent)
        </a>

        {/* .once */}
        <button onClick={handleClickOnce}>只触发一次 (.once)</button>

        {/* .self */}
        <div
          onClick={handleClickSelf}
          style={{ padding: "20px", background: "#f0f0f0" }}
        >
          只在本元素触发 (.self)
          <button>子按钮</button>
        </div>

        {/* 键盘修饰符 */}
        <input
          placeholder="按 Enter"
          onKeydown={handleKeyEnter}
        />
        <input
          placeholder="按 Escape"
          onKeydown={handleKeyEscape}
        />

        {/* 组合键 */}
        <button onClick={handleCtrlClick}>Ctrl + 点击</button>
      </div>
    );
  },
});

// ============================================
// 7. 双向绑定
// ============================================

/**
 * TSX 中的 v-model 替代方案
 */
const TwoWayBinding = defineComponent({
  name: "TwoWayBinding",
  setup() {
    const textValue = ref("");
    const numberValue = ref(0);
    const checkboxValue = ref(false);
    const selectValue = ref("option1");
    const multiSelect = ref<string[]>([]);

    return () => (
      <div>
        <h3>双向绑定</h3>

        {/* 文本输入 */}
        <div>
          <label>文本: </label>
          <input
            type="text"
            value={textValue.value}
            onInput={(e) => {
              textValue.value = (e.target as HTMLInputElement).value;
            }}
          />
          <span>值: {textValue.value}</span>
        </div>

        {/* 数字输入 */}
        <div>
          <label>数字: </label>
          <input
            type="number"
            value={numberValue.value}
            onInput={(e) => {
              numberValue.value = Number((e.target as HTMLInputElement).value);
            }}
          />
          <span>值: {numberValue.value}</span>
        </div>

        {/* 复选框 */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={checkboxValue.value}
              onChange={(e) => {
                checkboxValue.value = (e.target as HTMLInputElement).checked;
              }}
            />
            复选框
          </label>
          <span>选中: {checkboxValue.value ? "是" : "否"}</span>
        </div>

        {/* 下拉选择 */}
        <div>
          <label>选择: </label>
          <select
            value={selectValue.value}
            onChange={(e) => {
              selectValue.value = (e.target as HTMLSelectElement).value;
            }}
          >
            <option value="option1">选项1</option>
            <option value="option2">选项2</option>
            <option value="option3">选项3</option>
          </select>
          <span>选中: {selectValue.value}</span>
        </div>

        {/* 多选 */}
        <div>
          <label>多选: </label>
          <select
            multiple
            value={multiSelect.value}
            onChange={(e) => {
              const select = e.target as HTMLSelectElement;
              multiSelect.value = Array.from(select.selectedOptions).map(
                (opt) => opt.value
              );
            }}
          >
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
          </select>
          <span>选中: {multiSelect.value.join(", ")}</span>
        </div>
      </div>
    );
  },
});

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个评分组件 Rating
 * Props:
 * - value: number (当前评分, 1-5)
 * - maxRating: number (最大评分, 默认5)
 * - readonly: boolean (是否只读)
 * - onRate: (rating: number) => void (评分回调)
 */
// TODO: 实现 Rating 组件

/**
 * 练习 2: 创建一个搜索框组件 SearchBox
 * Props:
 * - placeholder: string
 * - debounceMs: number (防抖延迟)
 * - onSearch: (query: string) => void
 * 要求:
 * - 支持 Enter 键搜索
 * - 支持清除按钮
 * - 实现防抖功能
 */
// TODO: 实现 SearchBox 组件

/**
 * 练习 3: 创建一个可编辑表格单元格 EditableCell
 * Props:
 * - value: string
 * - editing: boolean
 * - onSave: (value: string) => void
 * - onCancel: () => void
 * 要求:
 * - 非编辑状态显示文本
 * - 编辑状态显示输入框
 * - Enter 保存，Escape 取消
 */
// TODO: 实现 EditableCell 组件

// 导出组件
export {
  BasicProps,
  ComplexProps,
  CallbackProps,
  NativeEvents,
  CustomEventsComponent,
  EventModifiers,
  TwoWayBinding,
};

// 导出类型
export type { UserInfo, ComponentConfig, CustomEvents, CallbackItem };
