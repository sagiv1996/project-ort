<template>
  <table-accounts :data="accounts" class="elevation-5"/>
</template>

<script>
export default {
async asyncData({ $axios, $auth }) {
    let accounts;
    if($auth.user.type === 'worker' || $auth.user.type === 'boss' )accounts =  await $axios.$get("accounts");
    else if ($auth.user.type === 'headFaculty') accounts = await $axios.$get(`students/faculty/${$auth.user.accountId}`);
    return { accounts};
  },
}
</script>