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

        <!-- 编辑内容选项卡标题 -->
        <x-edit-tab-title />
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import XSearch from '#index/components/course/search.vue';
import XTable from '#index/components/course/table.vue';
import XPagination from '#index/components/course/pagination.vue';

const { mapState, mapMutations } = createNamespacedHelpers('course');

export default {
    components: {
        XSearch,
        XTable,
        XPagination,
        XEdit: () => import('#index/components/course/edit.vue'),
        XEditTabTitle: () => import('#index/components/course/editTabTitle.vue'),
    },
    computed: {
        ...mapState(['loading']),
    },
    beforeRouteUpdate(to, from, next) {
        this.setState({ filters: to.query });
        next();
    },
    methods: {
        ...mapMutations(['setState']),
    },
};
</script>
