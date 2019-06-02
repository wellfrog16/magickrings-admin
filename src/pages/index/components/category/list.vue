<template>
    <el-row :gutter="10">
        <el-col :span="6" v-for="item in list" :key="item.id">
            <x-category :id="item.id" :name="item.name" :children="item.children" :class="$style.item" />
        </el-col>
    </el-row>
</template>

<script>
import api from '@/api/usr/category';
import XCategory from '#index/components/category/index.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapMutations } = createNamespacedHelpers('category');

export default {
    components: {
        XCategory,
    },
    data() {
        return {
            list: [],
        };
    },
    computed: {
        ...mapState(['overdue']),
    },
    watch: {
        overdue() {
            this.loadList();
        },
    },
    mounted() {
        this.loadList();
        // api.insert({ name: '招财魔法', children: [] });
    },
    methods: {
        ...mapMutations(['setState']),

        async loadList() {
            this.setState({ loading: true });

            const res = await api.list();
            this.list = [...res.list];

            this.$nextTick(() => this.setState({ loading: false, overdue: false }));
        },
    },
};
</script>

<style lang="less" module>
.item {
    margin-bottom: 10px;
}
</style>
