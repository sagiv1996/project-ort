<template>
<div>
  <statistics :data="statics" />
</div>
</template>

<script>
export default {
    async asyncData({$axios, $auth}){
        const statics = await $axios.$get(`students/stat/${$auth.user.accountId}`);
        return {statics}
    }
}
</script>