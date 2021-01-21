<template>
    <table-faculties :faculties="faculties" class="elevation-5"/>
</template>
<script>
export default {
  /**
   * טעינת מידע יחד עם טעינת העמוד
   * הפונקציה טוענת את כל המגמות
   */
  async asyncData({ $axios }) {
      const faculties = await $axios.$get("faculties");
    return { faculties };
  },
};
</script>