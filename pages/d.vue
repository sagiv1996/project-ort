<template>
    <div>
        <v-file-input v-model="file" @change="previewFiles"/>
    </div>
</template>

<script>
export default {
    data:()=>({
        file: null
    }),
   methods: {
        previewFiles() {
            const l = this.$xlsx.readFile(this.file)
            alert(l)
       }
   }
}
</script>