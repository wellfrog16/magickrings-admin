<template>
    <el-row :gutter="10">
        <el-col :span="6" v-for="item in list" :key="item.id">
            <x-category :name="item.name" :children="item.children" :class="$style.item" />
        </el-col>
    </el-row>
</template>

<script>
import api from '@/api/usr/category';
import XCategory from '#index/components/category/index.vue';

export default {
    components: {
        XCategory,
    },
    data() {
        return {
            list: [],
        };
    },
    mounted() {
        this.loadList();
    },
    methods: {
        async loadList() {
            const res = await api.list();
            this.list = [...res.list];
        },
    },
};
</script>

<style lang="less" module>
.item {
    margin-bottom: 10px;
}
</style>
