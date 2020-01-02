<template>
    <el-card shadow="never" :loading="saveBusy">
        <el-form ref="form" :model="form.fields" :rules="form.rules">
            <el-form-item label="公告图片" prop="photo">
                <div style="clear: both;">
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
                </div>
            </el-form-item>
            <el-form-item label="链接地址" prop="url">
                <el-input placeholder="链接地址" v-model="form.url" />
            </el-form-item>
            <el-form-item>
                <el-switch
                    v-model="form.fields.show"
                    active-text="开启"
                    inactive-text="关闭">
                </el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSave">保 存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import api from '@/api/usr/notification';
import { rules } from '@/utils/rivers';
import config from '@/config';
// import { createNamespacedHelpers } from 'vuex';

// const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('baseForm');

export default {
    data() {
        return {
            saveBusy: false,
            uploadUrl: config.server.upload,
            form: {
                fields: {
                    guid: 'notification', // 数据库存储标识
                    photo: '',
                    url: '',
                    show: false,
                },
                rules: {
                    ...rules.check({ key: 'photo', message: '请上传图片' }),
                },
            },
        };
    },
    computed: {
        // 图片地址
        photoUrl() {
            return `${config.server.img}/${this.form.fields.photo}`;
        },
    },
    mounted() {
        this.loadDetail();
    },
    methods: {
        async loadDetail() {
            this.saveBusy = true;
            const res = await api.detail();
            if (res) {
                this.form.fields.title = res.title;
                this.form.fields.content = res.content;
                this.form.fields.photo = res.photo;
                this.form.fields.show = res.show;
            }
            this.$nextTick(() => {
                this.saveBusy = false;
            });
        },
        handleSave() {
            this.$refs.form.validate((valid) => {
                valid && this.save();
            });
        },
        async save() {
            this.saveBusy = true;

            if (this.form.fields.guid) {
                // 远程更新
                await api.update(this.form.fields);
            }

            this.$nextTick(() => {
                this.saveBusy = false;
            });
        },
        handleUploadSuccess({ data }) {
            const path = `${data.path}/${data.filename}`;
            this.form.fields.photo = path;
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
        width: 750px;
        height: 450px;

        &:hover {
            border-color: #409eff;
        }
    }

    img {
        width: 748px;
        height: 448px;
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
