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
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import XSearch from '#index/components/taobao-info/search.vue';
import XTable from '#index/components/taobao-info/table.vue';
import XPagination from '#index/components/taobao-info/pagination.vue';

const { mapState, mapMutations } = createNamespacedHelpers('taobaoInfo');

export default {
    components: {
        XSearch,
        XTable,
        XPagination,
        XEdit: () => import('#index/components/taobao-info/edit.vue'),
    },
    computed: {
        ...mapState(['loading']),
    },
    beforeRouteUpdate(to, from, next) {
        this.setState({ filters: to.query });
        next();
    },
    methods: {
        ...mapMutations(['setState', 'test']),
    },
};
</script>
