<template>
  <v-card>
    <v-card-title primary-title> יצירת חשבון חדש </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          label="תעודת זהות"
          prepend-icon="mdi-account-key-outline"
          type="text"
          counter="9"
          hint="נא להכניס בשדה זה מספר תעודת זהות כולל ספרת ביקורת"
          v-model="accountId"
          validate-on-blur
          outlined
          clearable
          filled
          :rules="[checkId(id)]"
        />
        <v-text-field
          label="שם פרטי"
          counter="10"
          v-model="firstName"
          :rules="[emptyRules]"
          prepend-icon="mdi-contacts"
          outlined
          clearable
          filled
        />
        <v-text-field
          label="שם משפחה"
          counter="10"
          v-model="lastName"
          :rules="[emptyRules]"
          prepend-icon="mdi-scale-bathroom"
          outlined
          clearable
          filled
        />
        <v-text-field
          label="מספר פלאפון"
          counter="10"
          v-model="phone"
          :rules="[emptyRules, phoneRules]"
          prepend-icon="mdi-cellphone-iphone"
          outlined
          clearable
          filled
        />
        <v-text-field
          label="כתובת מייל"
          counter="70"
          v-model="email"
          :rules="[emptyRules, emailRules]"
          prepend-icon="mdi-gmail"
          outlined
          clearable
          filled
          validate-on-blur
        />
        <v-radio-group
          v-model="sex"
          row
          label="מין:"
          :rules="[emptyRules]"
          prepend-icon="mdi-gender-male-female"
        >
          <v-radio label="זכר" value="זכר"></v-radio>
          <v-radio label="נקבה" value="נקבה"></v-radio>
        </v-radio-group>
        <v-text-field
          label="כתובת מגורים"
          counter="25"
          v-model="addres"
          :rules="[emptyRules]"
          prepend-icon="mdi-map-marker-radius"
          outlined
          clearable
          filled
        />
        <v-radio-group
          v-model="type"
          row
          label="סוג משתמש"
          :rules="[emptyRules]"
          prepend-icon="mdi-gender-male-female"
        >
          <v-radio
            label="סטודנט"
            value="student"
          ></v-radio>
          <v-radio label="מנחה" value="mentor"></v-radio>
          <v-radio
            label="ראש מגמה"
            value="headFaculty"
          ></v-radio>
          <v-radio label="עובד מכללה" value="worker"></v-radio>
          <v-radio label="מנהל מכללה" value="boss" disabled></v-radio>
        </v-radio-group>
        <template v-if="type === 'mentor'">
          <v-text-field
            label="השכלה"
            v-model="education"
            prepend-icon="mdi-school"
            :rules="[emptyRules]"
            outlined
            clearable
            filled
            counter="50"
            hint="לדוגמא: מהנדס תכנה"
          ></v-text-field>

          <v-text-field
            label="מיקום עבודה"
            v-model="workLocation"
            prepend-icon="mdi-yoga"
            :rules="[emptyRules]"
            outlined
            clearable
            filled
            counter="50"
            hint="לדוגמא: מכללת אורט"
          ></v-text-field>
        </template>

        <template v-else-if="type === 'student'">
          <v-autocomplete
            :items.sync="faculties"
            item-text="name"
            item-value="id"
            label="מגמה"
            v-model="facultyId"
            :rules="emptyRules"
            outlined
            clearable
            filled
            prepend-icon="mdi-format-list-bulleted-type"
            :loading="!faculties[0]"
          />
        </template>
      </v-form>
      <v-divider></v-divider>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="$emit('close')">סגירה</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="submit" tile
        >שליחת טופס <v-icon>mdi-arrow-left</v-icon></v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    emptyRules: (v) => !!v || "שדה חובה",
    emailRules: (v) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      "מייל זה איננו תקין",
    phoneRules: (v) => /^05\d([-]{0,1})\d{7}$/.test(v) || "מספר טלפון לא תקין",
    faculties: [],
    accountId: null,
    firstName:null,
    lastName: null,
    sex: null,
    email:  null,
    phone: null,
    type: null,
    addres: null,
    facultyId: null,
    education: null,
    workLocation: null
  }),
  methods: {
    /*
      פונקציה זאת היא בודקת שערכי הטופס תקינים ואם כן היא שולחת אותם לשרת ומציגה הודעה רלוונטית
    */
    async submit() {
      if (this.$refs.form.validate()) {
        let account = {
          accountId: this.accountId,
          firstName: this.firstName,
          lastName: this.lastName,
          sex: this.sex,
          email: this.email,
          phone: this.phone,
          type: this.type,
          addres: this.addres
        };
        
        let request;
        switch (this.type) { //שליחה לקישור רלוונטי
          case "student":
            account[`student`] = {
              facultyId: this.facultyId,
              accountId: this.accountId,
            };
            request = await this.$axios.post(
              `students/${this.accountId}`,
              account
            );
            break;
          case "mentor":
            account[`mentor`] = {
              accountId: this.accountId,
              WorkLocation: this.workLocation,
              Education: this.education,
            };
            request = await this.$axios.post(
              `mentors/${this.accountId}`,
              account
            );
            break;
          default:
            request = await this.$axios.post(
              `accounts/create/${this.accountId}`,
              account
            );
            break;
        }
        if (request.status === 200) { // במידה והכל תקין ואין שגיאה
          this.$emit("update", request.data); // יצירת ארוע במקום שמכיל את הקומפננטה
          this.$swal(
            "החשבון נוצר בהצלחה",
            `חשבון ${this.firstName} ${this.lastName} (${this.accountId})נוצר בהצלחה`,
            "success"
          );
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
  watch:{
    async type(value){ // טוען מגמות במידה ובוחריפ סטודנט
      if (value === 'student' && !this.faculties[0])
      this.faculties = await this.$axios.$get("faculties"); // load faculties only choose student a first time
    }
  }
};
</script>