/**
 * TSX 高级模式
 *
 * 本文件介绍 TSX 中的高级组件模式和技巧
 */

import {
  defineComponent,
  ref,
  provide,
  inject,
  computed,
  watch,
  onMounted,
  onUnmounted,
  type PropType,
  type InjectionKey,
  type Ref,
  type ComputedRef,
} from "vue";

// ============================================
// 1. Render Props 模式
// ============================================

/**
 * Render Props: 通过 props 传递渲染函数
 * 适用于需要共享逻辑但 UI 不同的场景
 */

// 鼠标位置追踪组件
interface MousePosition {
  x: number;
  y: number;
}

interface RenderMouseTrackerProps {
  render: (position: MousePosition) => JSX.Element;
}

const MouseTracker = defineComponent({
  name: "MouseTracker",
  props: {
    render: {
      type: Function as PropType<(position: MousePosition) => JSX.Element>,
      required: true,
    },
  },
  setup(props) {
    const position = ref<MousePosition>({ x: 0, y: 0 });

    const handleMouseMove = (event: MouseEvent) => {
      position.value = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    onMounted(() => {
      window.addEventListener("mousemove", handleMouseMove);
    });

    onUnmounted(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });

    return () => props.render(position.value);
  },
});

// 使用示例
const MouseTrackerDemo = defineComponent({
  name: "MouseTrackerDemo",
  setup() {
    return () => (
      <div style={{ height: "200px", background: "#f0f0f0" }}>
        <MouseTracker
          render={(pos) => (
            <div>
              鼠标位置: ({pos.x}, {pos.y})
            </div>
          )}
        />
      </div>
    );
  },
});

// ============================================
// 2. 插槽模式 (Slots)
// ============================================

/**
 * 具名插槽和作用域插槽
 */

// 数据表格组件
interface TableColumn<T> {
  key: keyof T;
  title: string;
  width?: number;
  render?: (value: T[keyof T], row: T, index: number) => JSX.Element;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
}

function createDataTable<T extends Record<string, unknown>>() {
  return defineComponent({
    name: "DataTable",
    props: {
      data: {
        type: Array as PropType<T[]>,
        required: true,
      },
      columns: {
        type: Array as PropType<TableColumn<T>[]>,
        required: true,
      },
    },
    setup(props, { slots }) {
      return () => (
        <table class="data-table">
          <thead>
            <tr>
              {props.columns.map((col) => (
                <th key={String(col.key)} style={{ width: col.width ? `${col.width}px` : "auto" }}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.data.length === 0 ? (
              <tr>
                <td colspan={props.columns.length}>
                  {slots.empty?.() ?? "暂无数据"}
                </td>
              </tr>
            ) : (
              props.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {props.columns.map((col) => (
                    <td key={String(col.key)}>
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {slots.footer && <tfoot>{slots.footer()}</tfoot>}
        </table>
      );
    },
  });
}

// ============================================
// 3. 组合模式 (Compound Components)
// ============================================

/**
 * 组合组件模式: 多个组件协同工作
 */

// 选项卡组件系统
interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

// 定义注入的 key
interface TabsContext {
  activeKey: Ref<string>;
  setActiveKey: (key: string) => void;
}

const TabsContextKey: InjectionKey<TabsContext> = Symbol("TabsContext");

// 父组件: Tabs
const Tabs = defineComponent({
  name: "Tabs",
  props: {
    defaultActiveKey: {
      type: String,
      default: "",
    },
  },
  emits: ["change"],
  setup(props, { slots, emit }) {
    const activeKey = ref(props.defaultActiveKey);

    const setActiveKey = (key: string) => {
      activeKey.value = key;
      emit("change", key);
    };

    // 提供上下文
    provide(TabsContextKey, {
      activeKey,
      setActiveKey,
    });

    return () => <div class="tabs">{slots.default?.()}</div>;
  },
});

// 子组件: TabList
const TabList = defineComponent({
  name: "TabList",
  setup(_props, { slots }) {
    return () => <div class="tab-list" role="tablist">{slots.default?.()}</div>;
  },
});

// 子组件: Tab
const Tab = defineComponent({
  name: "Tab",
  props: {
    tabKey: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const context = inject(TabsContextKey);

    if (!context) {
      throw new Error("Tab must be used within Tabs");
    }

    const isActive = computed(() => context.activeKey.value === props.tabKey);

    const handleClick = () => {
      if (!props.disabled) {
        context.setActiveKey(props.tabKey);
      }
    };

    return () => (
      <button
        class={["tab", { active: isActive.value, disabled: props.disabled }]}
        onClick={handleClick}
        disabled={props.disabled}
        role="tab"
        aria-selected={isActive.value}
      >
        {slots.default?.()}
      </button>
    );
  },
});

// 子组件: TabPanels
const TabPanels = defineComponent({
  name: "TabPanels",
  setup(_props, { slots }) {
    return () => <div class="tab-panels">{slots.default?.()}</div>;
  },
});

// 子组件: TabPanel
const TabPanel = defineComponent({
  name: "TabPanel",
  props: {
    tabKey: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const context = inject(TabsContextKey);

    if (!context) {
      throw new Error("TabPanel must be used within Tabs");
    }

    const isActive = computed(() => context.activeKey.value === props.tabKey);

    return () =>
      isActive.value ? (
        <div class="tab-panel" role="tabpanel">
          {slots.default?.()}
        </div>
      ) : null;
  },
});

// 使用示例
const TabsDemo = defineComponent({
  name: "TabsDemo",
  setup() {
    return () => (
      <Tabs defaultActiveKey="tab1" onChange={(key) => console.log("Tab changed:", key)}>
        <TabList>
          <Tab tabKey="tab1">选项卡 1</Tab>
          <Tab tabKey="tab2">选项卡 2</Tab>
          <Tab tabKey="tab3" disabled>
            选项卡 3 (禁用)
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel tabKey="tab1">
            <p>内容 1</p>
          </TabPanel>
          <TabPanel tabKey="tab2">
            <p>内容 2</p>
          </TabPanel>
          <TabPanel tabKey="tab3">
            <p>内容 3</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    );
  },
});

// ============================================
// 4. 高阶组件 (HOC)
// ============================================

/**
 * 高阶组件: 增强现有组件的功能
 */

// 添加加载状态的 HOC
interface WithLoadingProps {
  loading?: boolean;
  loadingText?: string;
}

function withLoading<P extends object>(WrappedComponent: any) {
  return defineComponent({
    name: `WithLoading(${WrappedComponent.name || "Component"})`,
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      loadingText: {
        type: String,
        default: "加载中...",
      },
    },
    setup(props, { attrs, slots }) {
      return () => {
        if (props.loading) {
          return (
            <div class="loading-wrapper">
              <div class="loading-spinner" />
              <span>{props.loadingText}</span>
            </div>
          );
        }
        return <WrappedComponent {...attrs} v-slots={slots} />;
      };
    },
  });
}

// 添加错误边界的 HOC
function withErrorBoundary<P extends object>(WrappedComponent: any) {
  return defineComponent({
    name: `WithErrorBoundary(${WrappedComponent.name || "Component"})`,
    props: {
      fallback: {
        type: Function as PropType<(error: Error) => JSX.Element>,
        default: (error: Error) => <div class="error">发生错误: {error.message}</div>,
      },
    },
    setup(props, { attrs, slots }) {
      const error = ref<Error | null>(null);

      // 注意: Vue 3 需要使用 onErrorCaptured
      return () => {
        if (error.value) {
          return props.fallback(error.value);
        }
        return <WrappedComponent {...attrs} v-slots={slots} />;
      };
    },
  });
}

// ============================================
// 5. 自定义 Hook 组合
// ============================================

/**
 * 可组合函数 (Composables) 与 TSX 结合
 */

// useCounter hook
interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

interface UseCounterReturn {
  count: Ref<number>;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  canIncrement: ComputedRef<boolean>;
  canDecrement: ComputedRef<boolean>;
}

function useCounter(initialValue = 0, options: UseCounterOptions = {}): UseCounterReturn {
  const { min = -Infinity, max = Infinity, step = 1 } = options;

  const count = ref(initialValue);

  const canIncrement = computed(() => count.value + step <= max);
  const canDecrement = computed(() => count.value - step >= min);

  const increment = () => {
    if (canIncrement.value) {
      count.value += step;
    }
  };

  const decrement = () => {
    if (canDecrement.value) {
      count.value -= step;
    }
  };

  const reset = () => {
    count.value = initialValue;
  };

  return {
    count,
    increment,
    decrement,
    reset,
    canIncrement,
    canDecrement,
  };
}

// useLocalStorage hook
function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key);
  const data = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue) as Ref<T>;

  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  const remove = () => {
    localStorage.removeItem(key);
    data.value = defaultValue;
  };

  return { data, remove };
}

// 使用 hooks 的组件
const CounterWithStorage = defineComponent({
  name: "CounterWithStorage",
  setup() {
    const { data: savedCount, remove: clearStorage } = useLocalStorage("counter", 0);
    const { count, increment, decrement, reset, canIncrement, canDecrement } = useCounter(
      savedCount.value,
      { min: 0, max: 100, step: 5 }
    );

    // 同步到 localStorage
    watch(count, (newVal) => {
      savedCount.value = newVal;
    });

    return () => (
      <div class="counter-with-storage">
        <h3>带存储的计数器</h3>
        <p>当前值: {count.value}</p>
        <div class="buttons">
          <button onClick={decrement} disabled={!canDecrement.value}>
            -5
          </button>
          <button onClick={increment} disabled={!canIncrement.value}>
            +5
          </button>
          <button onClick={reset}>重置</button>
          <button onClick={clearStorage}>清除存储</button>
        </div>
        <p class="hint">范围: 0 - 100，步长: 5</p>
      </div>
    );
  },
});

// ============================================
// 6. 受控与非受控组件
// ============================================

/**
 * 受控组件: 状态由父组件管理
 * 非受控组件: 状态由组件内部管理
 */

// 同时支持受控和非受控的输入组件
const ControlledInput = defineComponent({
  name: "ControlledInput",
  props: {
    // 受控模式
    modelValue: {
      type: String,
      default: undefined,
    },
    // 非受控模式的默认值
    defaultValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    // 判断是否为受控模式
    const isControlled = computed(() => props.modelValue !== undefined);

    // 内部状态 (非受控模式使用)
    const internalValue = ref(props.defaultValue);

    // 当前显示的值
    const displayValue = computed(() =>
      isControlled.value ? props.modelValue : internalValue.value
    );

    const handleInput = (event: Event) => {
      const newValue = (event.target as HTMLInputElement).value;

      if (isControlled.value) {
        // 受控模式: 通知父组件
        emit("update:modelValue", newValue);
      } else {
        // 非受控模式: 更新内部状态
        internalValue.value = newValue;
      }

      emit("change", newValue);
    };

    return () => (
      <input
        type="text"
        value={displayValue.value}
        onInput={handleInput}
        placeholder={props.placeholder}
      />
    );
  },
});

// ============================================
// 练习题
// ============================================

/**
 * 练习 1: 创建一个 Accordion 组合组件
 * - Accordion (容器)
 * - AccordionItem (项)
 * - AccordionHeader (头部，可点击)
 * - AccordionPanel (内容面板)
 * 要求:
 * - 支持单选/多选模式
 * - 使用 provide/inject 共享状态
 */
// TODO: 实现 Accordion 组合组件

/**
 * 练习 2: 创建一个 useAsync hook
 * - 接收一个返回 Promise 的函数
 * - 返回 { data, loading, error, execute }
 * - 支持自动执行和手动执行
 */
// TODO: 实现 useAsync hook

/**
 * 练习 3: 创建一个 withAuth 高阶组件
 * - 检查用户是否登录
 * - 未登录时显示登录提示或重定向
 * - 登录后渲染被包裹的组件
 */
// TODO: 实现 withAuth HOC

// 导出组件
export {
  MouseTracker,
  MouseTrackerDemo,
  createDataTable,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabsDemo,
  withLoading,
  withErrorBoundary,
  CounterWithStorage,
  ControlledInput,
};

// 导出 hooks
export { useCounter, useLocalStorage };

// 导出类型
export type {
  MousePosition,
  RenderMouseTrackerProps,
  TableColumn,
  DataTableProps,
  TabItem,
  TabsContext,
  WithLoadingProps,
  UseCounterOptions,
  UseCounterReturn,
};
