<template>
    <div class="pagination flex-row-center">
        <el-button type="primary" @click="handleRemove" icon="el-icon-delete">删除选中</el-button>
        <el-pagination
            background
            layout="total, prev, pager, next"
            :total="total"
            :current-page.sync="p"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import api from '@/api/usr/student';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('student');

export default {
    data() {
        return {
            p: 1,
        };
    },
    computed: {
        ...mapState(['total', 'multipleSelection']),
        ...mapGetters(['multipleSelectionGuid']),
    },
    methods: {
        ...mapMutations(['setState']),

        // 翻页
        handleCurrentChange(p) {
            this.setState({ filters: { p } });
        },

        // 确认批量删除
        handleRemove() {
            if (!this.multipleSelectionGuid) { return; }

            this.$confirm('确认要删除这些数据吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.batchRemove();
            }).catch(() => {});
        },

        // 批量删除
        async batchRemove() {
            this.setState({ loading: true });

            // 远程删除
            await api.batchRemove({ ids: this.multipleSelectionGuid });

            this.$nextTick(() => this.setState({ loading: false, overdue: true }));
        },
    },
};
</script>
