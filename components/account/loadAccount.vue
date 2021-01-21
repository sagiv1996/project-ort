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
  /**
   * הפונקציה נקראת ברגע שנוצרת הקומפננטה וטוענת משתמש לפי מספר הזיהוי שלו
   */
  async fetch() {
    const user = await this.$axios.$get(`accounts/user/${this.accountId}`);
    this.account = user;
  },
  /**
   * מתי שהמספר זהות משתנה טוענים מחדש את הרכיב
   */
  watch: {
    accountId() {
      this.$fetch();
    },
  },
};
</script>

<style>
</style>