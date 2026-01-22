<script setup lang="ts">

const inputList = ref([{
    text: '1'
}, {
    text: '2'
}, {
    text: '3'
}, {
    text: '4'
}, {
    text: '5'
}, {
    text: '6'
}, {
    text: '7'
}, {
    text: '8'
}, {
    text: '9'
}])
const text = ref();


const handleClick = () =>{
    const inputRef = useTemplateRef(`inputRef`)
    debugger
}

</script>

<template>
    <div class="w-180px">
        <el-button @click="handleClick">获取ref</el-button>
        <el-input v-for="(item,index) in inputList" :key="index" v-model="item.text"
            :ref="useTemplateRef(`inputRef-${index}`)"></el-input>
    </div>
</template>

<style lang="scss" scoped>
.read-the-docs {
    color: #888;
}
</style>
