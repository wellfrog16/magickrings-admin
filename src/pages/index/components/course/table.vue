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
        <el-table-column prop="title1" label="课程名称" />
        <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index)" type="text" size="mini" icon="el-icon-edit">修改基本信息</el-button>
                <el-button @click="handleTabEdit(scope.$index)" type="text" size="mini" icon="el-icon-edit">修改内容选项卡</el-button>
                <el-button @click="handleDelete(scope.$index, scope.row)" type="text" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import api from '@/api/usr/course';

const { mapState, mapMutations } = createNamespacedHelpers('course');

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

        // 编辑
        handleTabEdit(activeIndex) {
            this.setState({ activeIndex, editTabTitleVisible: true });
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
