<template>
    <el-table
        ref="table"
        class="table"
        height="500"
        border
        stripe
        :data="list"
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column prop="name" label="学员姓名" />
        <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index)" type="primary" size="mini" icon="el-icon-edit" />
                <el-button @click="handleDelete(scope.$index, scope.row)" type="warning" size="mini" icon="el-icon-delete" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import api from '@/api/usr/teacher';

const { mapState, mapMutations } = createNamespacedHelpers('teacher');

export default {
    data() {
        return {
        };
    },
    computed: {
        ...mapState(['list', 'colums']),
    },
    mounted() {
    },
    methods: {
        ...mapMutations(['setState']),

        // 编辑
        handleEdit(activeIndex) {
            this.setState({ activeIndex, editVisible: true });
        },

        // 删除确认
        handleDelete(activeIndex, row) {
            this.$confirm('确认要删除这条数据吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.remove(activeIndex, row);
            }).catch(() => {});
        },

        // 删除
        async remove(activeIndex, row) {
            this.setState({ activeIndex, loading: true });

            // 远程删除
            await api.remove(row.id);

            this.$nextTick(() => this.setState({ loading: false, overdue: true }));
        },

        // 批量选择
        handleSelectionChange(val) {
            this.setState({ multipleSelection: val });
        },
    },
};
</script>
