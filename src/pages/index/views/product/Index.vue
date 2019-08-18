<template>
    <div class="container-complex-table" v-loading="loading">
        <!-- 搜索框 -->
        <x-search />

        <!-- 数据 -->
        <x-table />

        <!-- 分页 -->
        <x-pagination />

        <!-- 编辑 -->
        <x-edit />
        <x-edit-category />
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import XSearch from '#index/components/product/search.vue';
import XTable from '#index/components/product/table.vue';
import XPagination from '#index/components/product/pagination.vue';

const { mapState, mapMutations } = createNamespacedHelpers('product');

export default {
    components: {
        XSearch,
        XTable,
        XPagination,
        XEdit: () => import('#index/components/product/edit.vue'),
        XEditCategory: () => import('#index/components/product/editCategory.vue'),
    },
    computed: {
        ...mapState(['loading']),
    },
    beforeRouteUpdate(to, from, next) {
        this.setState({ filters: to.query, overdue: true });
        next();
    },
    methods: {
        ...mapMutations(['setState']),
    },
};
</script>
