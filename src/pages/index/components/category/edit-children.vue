<template>
    <el-dialog
        :title="title"
        :visible.sync="editChildrenVisible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        class="or-dialog"
        width="300px"
        top="50px"
    >
        <el-form ref="form" :model="form.fields" :rules="form.rules" label-width="50px" v-loading="saveBusy">
            <el-form-item prop="name" label="名称">
                <el-input v-model.trim="form.fields.name" />
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSave" :loading="saveBusy">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import api from '@/api/usr/category';
import { rules } from '@/utils/rivers';

const { mapState, mapMutations } = createNamespacedHelpers('category');

const fields = {
    id: 0,
    name: '',
};

export default {
    data() {
        const self = this;
        return {
            saveBusy: false,
            form: {
                fields: self.createFields(),
                rules: {
                    ...rules.noEmpty({ key: 'name', message: '名称不能为空' }),
                },
            },
        };
    },
    watch: {
        editChildrenVisible(val) {
            val && this.update();
        },
    },
    computed: {
        ...mapState(['editChildrenVisible', 'activeRow', 'activeId']),
        title() {
            return this.form.fields.id === 0 ? '新建' : '编辑';
        },
    },
    methods: {
        ...mapMutations(['setState']),

        // 创建一个空的fileds副本
        createFields() {
            return Object.assign({}, fields);
        },

        // 关闭，保存中禁止关闭
        handleClose() {
            !this.saveBusy && this.setState({ editChildrenVisible: false });
            return !this.saveBusy;
        },

        // 打卡dialog时，更新数据
        update() {
            if (this.activeRow.id) {
                console.log(this.activeRow.id);
                // 这里实际开发需要去请求数据并更新，现在用行数据临时更新
                // await api.detail();
                this.form.fields = { ...this.activeRow };
            } else {
                this.form.fields = this.createFields();
            }
            this.$nextTick(() => this.$refs.form.clearValidate());
        },

        // 保存信息
        handleSave() {
            this.$refs.form.validate((valid) => {
                valid && this.save();
            });
        },

        // 保存动作
        async save() {
            this.saveBusy = true;

            // 更新列表（非刷新获取，仅前端根据当前数据更新）
            if (this.form.fields.id) {
                // 远程更新
                await api.modifyChildren(this.activeId, this.form.fields);
            } else {
                // 远程写入
                await api.appendChildren(this.activeId, this.form.fields);
            }

            this.$nextTick(() => {
                this.saveBusy = false;
                this.handleClose();
                this.setState({ overdue: true });
            });
        },
    },
};
</script>
