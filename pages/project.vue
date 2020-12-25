<template>
  <div>
    <project-student :project.sync="project" />
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, $auth }) {
    const project = await $axios.$get(
      `projects/${$auth.user.student.projectId}`
    );
    return { project };
  },
};
</script>