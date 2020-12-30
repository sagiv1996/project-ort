<template>
    <div>
        <v-file-input v-model="file"/>
        {{dd}}
        {{file}}
    </div>
</template>

<script>
export default {
    data:()=>({
        file: null
    }),
    computed:{
        dd(){
            console.log(this.file)
            return this.file
        }
    }
}
</script>