<template>
  <v-img src="bg.jpg" class="align-center" height="100vh" width="100vw">
    <v-card-text
      style="opacity: 0.8; max-width: 500px; margin: auto"
      class="white"
    >
      {{ $auth.loggedIn }} <v-divider vertical></v-divider>
      {{ $auth.user }}
      <v-toolbar color="primary" dark>
        <v-toolbar-title> טופס התחברות למערכת </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-avatar>
          <img :src="$icon(512)" alt="לוגו מכללות אורט" />
        </v-avatar>
      </v-toolbar>
      <v-form ref="form" @submit="submit" class="mt-6">
        <v-text-field
          label="תעודת זהות"
          name="login"
          prepend-icon="mdi-account"
          type="text"
          counter="9"
          hint="נא להכניס בשדה זה מספר תעודת זהות כולל ספרת ביקורת"
          v-model="id"
          validate-on-blur
          :rules="[checkId(id)]"
          outlined
        />
        <v-text-field
          label="סיסמא"
          prepend-icon="mdi-lock"
          :type="showPass ? 'text' : 'password'"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPass = !showPass"
          :rules="emptyRules"
          hint="נא להכניס בשדה זה סיסמא, קיימת רגישות לתווים גדולים"
          v-model="pass"
          @keypress.enter="submit"
          outlined
        />
      </v-form>
      <v-divider class="my-2"></v-divider>
      <v-card-actions>
        <v-switch
          label="שמור פרטי התחברות"
          hint="מומלץ לסמן רק במחשב אישי"
          v-model="remmber"
          @change="clear"
        ></v-switch>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="forgetPass" :disabled="checkId(id) !== true">שכחתי סיסמא</v-btn>
        <v-btn color="primary" @click="submit">התחבר</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-img>
</template>

<script>
export default {
  /**
   * @param {Array} $auth 'מידע אודות המשתמש'
   * @param redirect 'פונקציה ששולחת את המשתמש לקישור רלוונטי'
   * בדיקה האם המשתמש מחובר ואם כן שליחה למקום רלונוטי
   */
  middleware: ({$auth, redirect})=>{
    if ($auth.loggedIn) redirect(`/account`);
  },
  // שינוי כותרת העמוד
  head: () => ({
    title: "התחברות",
  }),
  layout: "login",
  data: () => ({
    showPass: false,
    id: '208273326',
    pass: '123456',
    emptyRules: [(v) => !!v || "שדה זה הינו חובה"],
    remmber: false,
  }),
  methods: {
    clear() {
      localStorage.clear();
    },
    /**
     * הפונקציה בודקת האם שמור מספר זיהוי וסיסמא במערכת ועושה פעולת השמה אם כן
     */
    async check() {
      if (localStorage.getItem("id") && localStorage.getItem("pass")) {
        this.remmber = true;
        this.id = await localStorage.getItem("id");
      }
    },

    async forgetPass(){
     this.$swal({
        icon: "question",
        title: 'שחזור סיסמא בציק צאק',
        validationMessage: "כתובת מייל לא תקינה",
  input: 'email',
  inputAttributes: {
    autocapitalize: 'off',
    require: 'true'
  },
  inputLabel: 'הכנס כאן את כתובת המייל שלך',
  inputPlaceholder: 'exmple: moshe@gmail.com',
  showCancelButton: true,
  cancelButtonText: 'בטל',
  confirmButtonText: 'הבא',
  showLoaderOnConfirm: true,
  preConfirm: (email) =>{
    return this.$axios.$post(`accounts/forgetPassword`, {accountId: this.id, email: email});    
  }
  }).then (result=>{
    if (result.value.token) this.$swal("פעולה בוצעה בהצלחה!", "נשלח אלייך למיל קישור להחלפת סיסמא. מטעמי בטיחות תוקפו ל-2 דקות בלבד","success");
     else this.$swal("שגיאה לא ידועה", "אופסי! נראה כי יש שגיאה באימות המייל ומספר הזהות שלך. נסה מחדש בבקשה","error");
  })
  .catch(e=>{
    alert(e)
  })
    },


    /**
     * הפונקציה בודקת שהטופס תקין ומבצעת הלית התחברות אם כן
     * במידה וכן החשבון יעבור לעמוד רלוונטי
     * במידה ולא תוצג הודעת שגיאה
     */
    async submit() {
      if (this.$refs.form.validate()) {
        if (this.remmber) {
          localStorage.setItem("id", this.id);
        }
        try {
          await this.$auth.loginWith("local", {
          data: {
            accountId: this.id,
            pass: this.pass,
          },
        })
        } catch (error) {
          this.$swal("פרטי התחברות שגויים", "נראה שהפרטים שגויים. נסה שנית", "error")
        }
        
        
      }
    },
    /**
     * @param {string} id הפונקציה בודקת שהמחרוזת שהוזנה היא באמת מספר זהות
     */
    checkId(id) {
      if (id === null || id.length != 9) {
        return "אורך לא תקין";
      }
      var tot = 0;
      for (var i = 0; i < 8; i++) {
        var x = ((i % 2) + 1) * id.charAt(i);
        if (x > 9) {
          x = x.toString();
          x = parseInt(x.charAt(0)) + parseInt(x.charAt(1));
        }
        tot += x;
      }

      if ((tot + parseInt(id.charAt(8))) % 10 != 0) {
        this.confirmation = false;
        return "תעודה לא תקינה";
      }
      this.confirmation = this.id;
      return true;
    },
  },
};
</script>