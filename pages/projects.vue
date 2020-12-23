<template>
  <table-projects
  class="elevation-5"
          :projects.sync="projects"
        />
</template>
<script>
export default {
    async asyncData({ $axios, $auth }) {
        let projects;
    if ($auth.user.type === 'mentor') projects = await $axios.$get(`projects/mentor/${$auth.user.accountId}`);
    else if ($auth.user.type === 'worker') projects = await $axios.$get("projects");
    else if ($auth.user.type === 'headFaculty') projects = await $axios.$get(`projects/headFaculty/${$auth.user.accountId}`);
    return { projects };
  },
}
</script>