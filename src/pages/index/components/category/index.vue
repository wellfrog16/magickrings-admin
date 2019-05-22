<template>
    <el-card shadow="never" :class="$style.main">
        <div slot="header" :class="$style.header">
            <span>{{ name }}</span>
            <el-button type="text">添加分类</el-button>
        </div>
        <ul :class="$style.list">
            <li v-for="item in children" :key="item.id">
                <span>{{ item.name }}</span>
                <div><el-button type="text">添加分类</el-button></div>
            </li>
        </ul>
    </el-card>
</template>

<script>
export default {
    props: {
        name: { type: String, required: true },
        children: { type: Array, required: true },
    },
    mounted() {
        // console.log(this.children);
    },
};
</script>

<style lang="less" module>
.main {
    height: 300px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.list {
    margin: 0;
    padding: 0;

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
