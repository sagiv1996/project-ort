<template>
  <table-accounts :data="accounts" class="elevation-5"/>
</template>

<script>
export default {
  /*
   *  טעינת מידע יחד עם טעינת העמוד
   * הפונקציה טוענת מידע רלוונטי לפי סוג המשתמש מהשרת
   */
async asyncData({ $axios, $auth }) {
    let accounts;
    if($auth.user.type === 'worker' || $auth.user.type === 'boss' )accounts =  await $axios.$get("accounts");
    else if ($auth.user.type === 'headFaculty') accounts = await $axios.$get(`students/faculty/${$auth.user.accountId}`);
    return { accounts};
  },
}
</script>