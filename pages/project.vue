<template>
  <project-student :project.sync="project" />
</template>

<script>
export default {
  async asyncData({ $axios, $auth }) {
    const project = await $axios.$get(
      `projects/student/${$auth.user.accountId}`
    );
    return { project };
  },
};
</script>