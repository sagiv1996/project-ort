<template>
    <table-faculties :faculties="faculties" class="elevation-5"/>
</template>
<script>
export default {
  async asyncData({ $axios }) {
      const faculties = await $axios.$get("faculties");
    return { faculties };
  },
};
</script>