<template>
  <v-dialog :value="true" max-width="500">
    <v-card class="text-center">
      <v-card-title class="info--text justify-center">
        שינוי סיסמא
      </v-card-title>
      <v-card-text>
        <v-form ref="passwordForm">
          <v-text-field
            label="סיסמא חדשה"
            prepend-icon="mdi-lock"
            :type="showPass ? 'text' : 'password'"
            :rules="[emptyRules]"
            hint="סיסא חדשה לעדכון"
            v-model="pass"
            outlined
            clearable
            filled
          >
            <template v-slot:append>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    @click="showPass = !showPass"
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon v-text="showPass ? 'mdi-eye' : 'mdi-eye-off'" />
                  </v-btn>
                </template>
                <span v-text="showPass ? 'הסתר סיסמא' : 'הצג סיסמא'" />
              </v-tooltip>
            </template>
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="update" outlined v-text="'שלח'" color="info" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  layout: "login",
  auth: "guest",
  middleware: "setUserToken",
  data: () => ({
    showPass: false,
    pass: null,
    emptyRules: [(v) => !!v || "שדה זה הינו חובה"],
  }),
  methods: {
    async update() {
      const resultAxios = await this.$axios.put(
        `accounts/${this.$auth.user.accountId}`,
        { password: this.pass }
      );
      if (resultAxios.status === 200)
        this.$swal(
          "עודכן בהצלחה",
          "סיסמתך החדשה עודכנה בהצלחה במערכת",
          "success"
        );
      // alert
      else
        this.$swal("שגיאה", "נראה כי הייתה תקלה, צור קשר עם המכללה", "error"); // alert
      this.$router.push({
        path: "/",
      });
    },
  },
};
</script>