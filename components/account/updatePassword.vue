<template>
  <v-row align="center">
    <v-col>
      <v-img src="password.jpg" alt="pic">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
    <v-col>
      <v-form ref="form" @submit="send" :disabled="lock">
        <v-text-field
          label="סיסמא ישנה"
          prepend-icon="mdi-lock"
          :type="showPass ? 'text' : 'password'"
          :rules="[emptyRules]"
          hint="סיסמא נוכחית. נדרש לצורך ביטחון"
          v-model="oldPass"
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
        <v-divider class="mb-6" />
        <v-text-field
          label="סיסמא חדשה"
          prepend-icon="mdi-lock"
          :type="showPass ? 'text' : 'password'"
          :rules="[emptyRules, difrentRules]"
          hint="סיסא חדשה לעדכון"
          v-model="newPass1"
          outlined
          clearable
          filled
          :disabled="!oldPass"
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
        <v-text-field
          label="אימות סיסמא חדשה"
          prepend-icon="mdi-lock"
          :type="showPass ? 'text' : 'password'"
          :rules="[emptyRules, equalRules]"
          hint="הקלד את סיסמתך החדשה כאן שנית לצורך אימות הנתונים"
          v-model="newPass2"
          outlined
          clearable
          filled
          :disabled="!newPass1"
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
      <v-divider class="mb-6" />
      <v-card-actions>
        <v-alert type="info" outlined>
          טיפ: בשביל ליצור סיסמא איכותית מומלץ לשלב כמה שיותר תווים מיוחדים,
          ספרות ואותיות גדולות וקטנות
        </v-alert>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" x-large icon @click="reset">
              <v-icon>mdi-restart</v-icon>
            </v-btn>
          </template>
          <span>אפס טופס</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" x-large icon @click="send">
              <v-icon>mdi-send mdi-flip-h</v-icon>
            </v-btn>
          </template>
          <span>שלח טופס</span>
        </v-tooltip>
      </v-card-actions>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: function () {
    return {
      oldPass: null,
      newPass1: null,
      newPass2: null,
      showPass: false,
      emptyRules: (v) => !!v || "שדה חובה",
      difrentRules: (v) =>
        v !== this.oldPass || "סיסמא חדשה חייבת להיות שונה מסיסמא ישנה",
      equalRules: (v) => v == this.newPass1 || "ערך לא זהה לסיסמא קודמת",
      lock: false,
    };
  },
  methods: {
    async send() {
      if (this.$refs.form.validate()) {
        // the form is good
        let formData = new FormData();
        formData.append("password", this.newPass1);
        const update = await this.$axios.put(
          `/accounts/${this.$auth.user.accountId}/${this.oldPass}`,
          { password: this.newPass1 }
        );
        if (update.status === 200) {
          this.$swal(
            "עודכן בהצלחה",
            "סיסמתך החדשה עודכנה בהצלחה במערכת",
            "success"
          ); // alert
          this.lock = true; // lock the form
        } else
          this.$swal(
            "שגיאה",
            "נראה כי סיסמתך הייתה שגויה. הקלד שנית ונסה מחדש",
            "error"
          ); // alert
      }
    },
    reset() {
      this.$refs.form.reset(); // rest to all fields
    },
  },
};
</script>

<style>
</style>