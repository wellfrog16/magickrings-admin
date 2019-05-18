<template>
    <el-dialog
        title="课程"
        :visible.sync="editVisible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :custom-class="$style.main"
        width="1000px"
    >
        <el-form ref="form" :model="form.fields" :rules="form.rules" label-width="80px" v-loading="saveBusy">
            <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="a">
                    <el-form-item prop="name" label="课程名称">
                        <el-input v-model="form.fields.name" minlength="1" maxlength="20" />
                    </el-form-item>
                    <el-form-item prop="dateRange" label="有效期">
                        <el-date-picker
                            v-model="form.fields.dateRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="code" label="人数">
                        <el-input-number v-model="form.fields.num1" :min="0" controls-position="right" placeholder="剩余"></el-input-number> /
                        <el-input-number v-model="form.fields.num2" :min="1" controls-position="right" placeholder="总人数"></el-input-number>
                    </el-form-item>
                    <el-form-item prop="code" label="价格">
                        <el-input-number v-model="form.fields.price" :min="0" label="价格" :controls="false"></el-input-number>
                    </el-form-item>
                    <el-form-item prop="description" label="简述">
                        <el-input v-model="form.fields.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" />
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
                </el-tab-pane>
                <el-tab-pane label="详细描述" name="b">
                    <tinymce v-model="form.fields.content" config="simple" :height="400" />
                </el-tab-pane>
                <el-tab-pane label="视频" name="c">视频</el-tab-pane>
                <el-tab-pane label="其他" name="d">其他</el-tab-pane>
            </el-tabs>
        </el-form>
        <span slot="footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSave" :loading="saveBusy">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import config from '@/config';
import api from '@/api/usr/course';
import Tinymce from '@/components/tinymce/index.vue';
import { rules } from '@/utils/rivers';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('course');

const fields = {
    id: '',
    name: '',
    dateRange: '',
    num1: undefined,
    num2: undefined,
    price: 0,
    code: '',
    course: [],
    message: '',
    photo: '',
    level: 0,
};

export default {
    components: {
        Tinymce,
    },
    data() {
        const self = this;
        return {
            activeName: 'a',
            uploadUrl: config.server.upload,
            saveBusy: false,
            form: {
                fields: self.createFields(),
                rules: {
                    ...rules.noEmpty({ key: 'name', message: '学员名称不能为空' }),
                    ...rules.noEmpty({ key: 'code', message: '证书编号不能为空' }),
                    ...rules.noEmpty({ key: 'photo', message: '请上传照片' }),
                    ...rules.check({
                        key: 'message', message: '描述内容长度不能超过100', max: 100,
                    }),
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
        ...mapState(['editVisible', 'activeIndex', 'courses']),
        ...mapGetters(['activeRow']),

        // 图片地址
        photoUrl() {
            return `${config.server.img}/image/${this.form.fields.photo}`;
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
.main {
    line-height: 1;
}

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
