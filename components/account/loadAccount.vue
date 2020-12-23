<template>
  <div>
    <v-progress-circular indeterminate v-if="$fetchState.pending" />
    <v-subheader v-else-if="$fetchState.error">שגיאה בטעינה נתונים</v-subheader>
    <div v-else>
      <account :account.sync="account" :location="location" :title="title" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accountId: {
      type: String,
      required: true,
    },
    location: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    account: null,
  }),
  async fetch() {
    const user = await this.$axios.$get(`accounts/user/${this.accountId}`);
    this.account = user;
  },
  watch: {
    accountId() {
      this.$fetch();
    },
  },
};
</script>

<style>
</style>