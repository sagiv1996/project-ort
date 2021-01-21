<template>
<div>
  <statistics :data="statics" />
</div>
</template>

<script>
export default {
  /**
   * פונקציה נטענת עם עליית העמוד
   * פונקציה טוענת סטיסטיקה על מגמה לפי מספר זהות של המנחה
   */
    async asyncData({$axios, $auth}){
        const statics = await $axios.$get(`students/stat/${$auth.user.accountId}`);
        return {statics}
    }
}
</script>