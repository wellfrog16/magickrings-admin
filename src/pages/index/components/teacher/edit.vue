<template>
    <el-dialog
        title="学员资历"
        :visible.sync="editVisible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        class="or-dialog"
        width="500px"
        top="50px"
    >
        <el-form ref="form" :model="form.fields" :rules="form.rules" label-width="80px" v-loading="saveBusy">
            <el-form-item prop="name" label="导师姓名">
                <el-input v-model="form.fields.name" minlength="1" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item prop="description" label="简介">
                <el-input v-model="form.fields.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item prop="photo" label="照片">
                <el-upload
                    name="avatar"
                    :class="$style['photo-uploader']"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="handleUploadSuccess"
                >
                    <img v-if="form.fields.photo" :src="photoUrl" class="avatar">
                    <i v-else :class="[$style['photo-uploader-icon'], 'el-icon-plus']"></i>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSave" :loading="saveBusy">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import config from '@/config';
import api from '@/api/usr/teacher';
import { rules } from '@/utils/rivers';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('teacher');

const fields = {
    id: '',
    name: '',
    description: '',
    photo: '',
};

export default {
    data() {
        const self = this;
        return {
            uploadUrl: config.server.upload,
            saveBusy: false,
            form: {
                fields: self.createFields(),
                rules: {
                    ...rules.noEmpty({ key: 'name', message: '导师名称不能为空' }),
                    ...rules.noEmpty({ key: 'description', message: '简介不能为空' }),
                    ...rules.noEmpty({ key: 'photo', message: '请上传照片' }),
                },
            },
        };
    },
    watch: {
        editVisible(val) {
            val && this.update();
        },
    },
    computed: {
        ...mapState(['editVisible', 'activeIndex']),
        ...mapGetters(['activeRow']),

        // 图片地址
        photoUrl() {
            return `${config.server.img}/${this.form.fields.photo}`;
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
            !this.saveBusy && this.setState({ editVisible: false });
            return !this.saveBusy;
        },

        handleUploadSuccess({ data }) {
            const path = `${data.path}/${data.filename}`;
            this.form.fields.photo = path;
        },

        // 打卡dialog时，更新数据
        async update() {
            if (this.activeRow.id) {
                // 这里实际开发需要去请求数据并更新，现在用行数据临时更新
                // await api.detail(this.activeRow._id);
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
                await api.update(this.form.fields);
            } else {
                // 远程写入
                await api.insert(this.form.fields);
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

<style lang="less" module>
.level :global(.el-form-item__content) {
    margin-left: 0 !important;
}

.photo-uploader {
    :global(.el-upload) {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        line-height: 0;

        &:hover {
            border-color: #409eff;
        }
    }

    img {
        width: 178px;
        height: 178px;
    }
}

.photo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
</style>
