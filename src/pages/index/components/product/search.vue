<template>
    <div class="search">
        <el-form ref="form" :inline="true" :model="form.fields" :rules="form.rules">
            <el-form-item>
                <el-input
                    placeholder="请输入查询内容"
                    v-model="form.fields.q"
                    prefix-icon="el-icon-search"
                    autocomplete="on"
                    maxlength="20"
                    clearable
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import api from '@/api/usr/product';

const { mapState, mapMutations } = createNamespacedHelpers('product');

export default {
    data() {
        return {
            category: this.$route.params.id,
            form: {
                fields: {
                    q: '',
                },
                rules: {},
            },
        };
    },
    computed: {
        ...mapState(['filters', 'overdue', 'courses']),
    },
    watch: {
        // 检测保存的查询参数副本变化，一变化就更新查询
        filters: {
            handler() {
                this.loadList();
            },
            deep: true,
        },
        overdue(val) {
            val && this.refresh();
        },
    },
    mounted() {
        this.refresh();
    },
    methods: {
        ...mapMutations(['setState']),

        // 查询
        async handleSearch() {
            await this.checkParams() && this.loadList();
        },

        // 刷新
        refresh() {
            this.loadList();
        },

        // 检测必填，并保存查询参数
        async checkParams() {
            const valid = await this.$refs.form.validate();
            valid && this.setState({ filters: { ...this.form.fields, p: 1 } });
            return valid;
        },

        // 请求数据
        async loadList() {
            this.setState({ loading: true });

            const res = await api.list(this.formatFilters(this.filters));
            res && this.setState({ list: res.list, total: res.total });
            this.$nextTick(() => this.setState({ loading: false, overdue: false }));
        },

        formatFilters(params) {
            const p = { ...params };

            p.category = this.$route.params.id;
            return p;
        },

        // 新建
        handleCreate() {
            this.setState({ activeIndex: -1, editVisible: true });
        },
    },
};
</script>
