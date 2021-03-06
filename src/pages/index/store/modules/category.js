import { config, cstore } from '@/helper/lakes';

export default {
    namespaced: true,
    state: {
        list: [], // 数据列表
        filters: { ...config.page }, // 查询条件
        total: 0, // 数据总数
        loading: false, // loading层
        activeRow: {}, // 当前编辑的行
        editVisible: false, // 编辑组件显示控制
        multipleSelection: [], // 批量选中的行数据
        overdue: false, // 数据是否过期，是则立刻刷新重新拉取
        editChildrenVisible: false, // 子信息组件显示控制
        activeName: '', // 当前分类名称
        activeId: 0, // 当前分类id
    },
    mutations: {
        setState: (state, payload) => cstore.mutations.setState(state, payload),
    },
};
