<template>
    <div>
        <el-dialog
            title="课程内容"
            :visible.sync="editTabContent2Visible"
            :before-close="handleClose"
            :close-on-click-modal="false"
            append-to-body
            width="820px"
            top="5vh"
        >
            <el-form ref="form" :model="form.fields" label-width="110px" v-loading="saveBusy">
                <el-form-item prop="title" label="临时标题">
                    <el-input v-model="form.fields.title" placeholder="前端不会显示" minlength="1" maxlength="20" show-word-limit />
                </el-form-item>
                <el-form-item prop="title" label="显示结构">
                    <el-select v-model="form.fields.type" placeholder="请选择">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item prop="photo" label="照片">
                    <el-upload
                        name="avatar"
                        :class="$style['photo-uploader']"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="handleUploadSuccess"
                        accept=".jpg,.png,.jpeg"
                    >
                        <img v-if="form.fields.photo" :src="photoUrl" class="avatar">
                        <i v-else :class="[$style['photo-uploader-icon'], 'el-icon-plus']"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容">
                    <tinymce v-model="form.fields.content" :height="400" config="simple" />
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="save" :loading="saveBusy">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import config from '@/config';
import api from '@/api/usr/course';
// import { rules } from '@/utils/rivers';
import Tinymce from '@/components/tinymce/index.vue';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('course');

export default {
    components: {
        Tinymce,
    },
    data() {
        return {
            title: '',
            saveBusy: false,
            uploadUrl: config.server.upload,
            typeOptions: [
                { value: 'left', label: '左图右文' },
                { value: 'right', label: '右图左文' },
                { value: 'custom', label: '自定义' },
            ],
            form: {
                fields: this.createFields(),
            },
        };
    },
    watch: {
        editTabContent2Visible(val) {
            val && this.update();
        },
    },
    computed: {
        ...mapState(['editTabContent2Visible', 'activeIndex', 'courses']),
        ...mapGetters(['activeRow1']),

        list() {
            return (this.activeRow1 && this.activeRow1.contents) || [];
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

        // 创建一个空的fileds副本
        createFields() {
            const fields = {
                title: '',
                type: '',
                photo: '',
                content: '',
            };

            return Object.assign({ category: this.category }, fields);
        },

        // 关闭，保存中禁止关闭
        handleClose() {
            !this.saveBusy && this.setState({ editTabContent2Visible: false, overdue: true });
            return !this.saveBusy;
        },

        handleUploadSuccess({ data }) {
            const path = `${data.path}/${data.filename}`;
            this.form.fields.photo = path;
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

<style lang="less" module>
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
