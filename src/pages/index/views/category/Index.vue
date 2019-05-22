<template>
    <div>
        <x-list />

        <edit-children />
    </div>
</template>

<script>
import XList from '#index/components/category/list.vue';
import EditChildren from '#index/components/category/edit-children.vue';

export default {
    components: {
        XList,
        EditChildren,
    },
};
</script>
