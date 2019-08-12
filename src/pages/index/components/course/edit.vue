<template>
    <div>
        <el-dialog
            title="课程"
            :visible.sync="editVisible"
            :before-close="handleClose"
            :close-on-click-modal="false"
            append-to-body
            width="820px"
            top="5vh"
        >
            <el-form ref="form" :model="form.fields" :rules="form.rules" label-width="110px" v-loading="saveBusy">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="基础信息" name="a">
                        <el-form-item prop="title1" label="课程标题">
                            <el-input v-model="form.fields.title1" minlength="1" maxlength="20" show-word-limit />
                        </el-form-item>
                        <el-form-item prop="title2" label="课程副标题">
                            <el-input v-model="form.fields.title2" minlength="1" maxlength="100" show-word-limit />
                        </el-form-item>
                        <el-form-item prop="dateRange" label="有效期">
                            <el-date-picker
                                v-model="form.fields.dateRange"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item prop="status" label="课程状态">
                            <el-radio-group v-model="form.fields.status">
                                <el-radio-button v-for="item in status" :label="item" :key="item" />
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="price" label="价格">
                            <el-input v-model="form.fields.price" />
                        </el-form-item>
                        <el-form-item prop="photo1" label="标题图片">
                            <el-upload
                                name="avatar"
                                :class="$style['photo-uploader']"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleUploadSuccess1"
                            >
                                <img v-if="form.fields.photo1" :src="photoUrl1" class="avatar">
                                <i v-else :class="[$style['photo-uploader-icon'], 'el-icon-plus']"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item prop="videoUrl" label="视频地址">
                            <el-input v-model="form.fields.videoUrl">
                                <template slot="prepend">Http://</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="description1" label="简述">
                            <el-input
                                v-model="form.fields.description1"
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 8}"
                                maxlength="100"
                                show-word-limit
                            />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="信息2" name="b">
                        <el-form-item prop="photo2" label="内容标题图片">
                            <el-upload
                                name="avatar"
                                :class="$style['photo-uploader']"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleUploadSuccess2"
                            >
                                <img v-if="form.fields.photo2" :src="photoUrl2" class="avatar">
                                <i v-else :class="[$style['photo-uploader-icon'], 'el-icon-plus']"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item prop="description2" label="课程简介2">
                            <tinymce v-model="form.fields.description2" :height="400" config="simple" />
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <span slot="footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSave" :loading="saveBusy">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import config from '@/config';
import api from '@/api/usr/course';
import Tinymce from '@/components/tinymce/index.vue';
import { rules } from '@/utils/rivers';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('course');

export default {
    components: {
        Tinymce,
    },
    data() {
        const self = this;
        return {
            uploadUrl: config.server.upload,
            saveBusy: false,
            status: ['hot', 'sales', 'new', '无'],
            activeItem: {},
            activeName: 'a',
            activeContentName: 'default',
            form: {
                fields: self.createFields(),
                rules: {
                    ...rules.noEmpty({ key: 'name', message: '学员名称不能为空' }),
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
        photoUrl1() {
            return `${config.server.img}/${this.form.fields.photo1}`;
        },

        photoUrl2() {
            return `${config.server.img}/${this.form.fields.photo2}`;
        },
    },
    methods: {
        ...mapMutations(['setState']),

        // 创建一个空的fileds副本
        createFields() {
            const fields = {
                id: '',
                title1: '',
                title2: '',
                dateRange: '',
                status: '',
                price: '',
                videoUrl: '',
                photo1: '',
                photo2: '',
                description1: '',
                description2: '',
                contents: [],
            };

            return Object.assign({ category: this.category }, fields);
        },

        // 关闭，保存中禁止关闭
        handleClose() {
            !this.saveBusy && this.setState({ editVisible: false });
            return !this.saveBusy;
        },

        handleUploadSuccess1({ data }) {
            const path = `${data.path}/${data.filename}`;
            // this.form.fields.photos.push({ name: path, url: path });
            this.form.fields.photo1 = path;
        },

        handleUploadSuccess2({ data }) {
            const path = `${data.path}/${data.filename}`;
            // this.form.fields.photos.push({ name: path, url: path });
            this.form.fields.photo2 = path;
        },

        handleUploadRemove(file) {
            const index = this.fileList.findIndex(item => item.name === file.name);
            this.form.fields.photos.splice(index, 1);
            this.fileList.splice(index, 1);
        },

        // 打卡dialog时，更新数据
        async update() {
            this.activeName = 'a';
            if (this.activeRow.id) {
                // 这里实际开发需要去请求数据并更新，现在用行数据临时更新
                // await api.detail(this.activeRow._id);
                this.form.fields = { ...this.activeRow };
            } else {
                this.form.fields = this.createFields();
            }
            this.$nextTick(() => this.$refs.form.clearValidate());
        },

        // formatData(data) {
        //     data.photos.forEach(item => ({ name: item.url, url: item }))
        // },

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
