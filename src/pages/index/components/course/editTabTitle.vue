<template>
    <div>
        <el-dialog
            title="课程"
            :visible.sync="editTabTitleVisible"
            :before-close="handleClose"
            :close-on-click-modal="false"
            append-to-body
            width="820px"
            top="5vh"
        >
            <el-row>
                <el-button type="primary" @click="handleClickAdd" :disabled="list && list.length >= 4">添加</el-button>
            </el-row>
            <el-table
                ref="table"
                class="table"
                height="500"
                border
                stripe
                :data="list"
            >
                <el-table-column prop="title" label="选项卡名称" />
                <el-table-column label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button @click="handleEditTitle(scope.row)" type="text" size="mini" icon="el-icon-edit">修改</el-button>
                        <el-button @click="handleEdit(scope.row)" type="text" size="mini" icon="el-icon-edit">编辑内容</el-button>
                        <el-button @click="handleDelete(scope.$index)" type="text" size="mini" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="save" :loading="saveBusy">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
// import config from '@/config';
import api from '@/api/usr/course';
// import { rules } from '@/utils/rivers';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('course');

export default {
    data() {
        return {
            title: '',
            saveBusy: false,
        };
    },
    watch: {
        editTabTitleVisible(val) {
            val && this.update();
        },
    },
    computed: {
        ...mapState(['editTabTitleVisible', 'activeIndex', 'courses']),
        ...mapGetters(['activeRow']),

        list() {
            return this.activeRow.contents;
        },
    },
    methods: {
        ...mapMutations(['setState']),

        handleClickAdd() {
            this.$prompt('请输入标题', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                value && this.activeRow.contents.push({ title: value, contents: [] });
            }).catch(() => {});
        },

        handleEditTitle(row) {
            this.$prompt('请输入标题', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: row.title,
            }).then(({ value }) => {
                if (value) {
                    row.title = value; // eslint-disable-line
                }
            }).catch(() => {});
        },

        // 删除确认
        handleDelete(activeIndex) {
            this.$confirm('确认要删除这条数据吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.remove(activeIndex);
            }).catch(() => {});
        },

        // 删除
        async remove(activeIndex) {
            this.activeRow.contents.splice(activeIndex, 1);
        },


        // 关闭，保存中禁止关闭
        handleClose() {
            !this.saveBusy && this.setState({ editTabTitleVisible: false, overdue: true });
            return !this.saveBusy;
        },

        // 打卡dialog时，更新数据
        async update() {
            console.log(this.activeRow);
            // if (this.activeRow.id) {
            //     // 这里实际开发需要去请求数据并更新，现在用行数据临时更新
            //     // await api.detail(this.activeRow._id);
            //     this.form.fields = { ...this.activeRow };
            // } else {
            //     this.form.fields = this.createFields();
            // }
            // this.$nextTick(() => this.$refs.form.clearValidate());
        },

        // 保存动作
        async save() {
            this.saveBusy = true;

            // 远程更新
            await api.update(this.activeRow);

            this.$nextTick(() => {
                this.saveBusy = false;
                this.handleClose();
                this.setState({ overdue: true });
            });
        },
    },
};
</script>
