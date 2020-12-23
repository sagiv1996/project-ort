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
          v-model="account.accountId"
          validate-on-blur
          :disabled="edit"
          outlined
          clearable
          filled
        />
        <v-text-field
          label="שם פרטי"
          counter="10"
          v-model="account.firstName"
          :rules="[emptyRules]"
          prepend-icon="mdi-contacts"
          outlined
          clearable
          filled
        />
        <v-text-field
          label="שם משפחה"
          counter="10"
          v-model="account.lastName"
          :rules="[emptyRules]"
          prepend-icon="mdi-scale-bathroom"
          outlined
          clearable
          filled
        />
        <v-text-field
          label="מספר פלאפון"
          counter="10"
          v-model="account.phone"
          :rules="[emptyRules, phoneRules]"
          prepend-icon="mdi-cellphone-iphone"
          outlined
          clearable
          filled
        />
        <v-text-field
          label="כתובת מייל"
          counter="40"
          v-model="account.email"
          :rules="[emptyRules, emailRules]"
          prepend-icon="mdi-gmail"
          outlined
          clearable
          filled
          validate-on-blur
        />
        <v-radio-group
          v-model="account.sex"
          row
          label="מין:"
          :rules="[emptyRules]"
          prepend-icon="mdi-gender-male-female"
          :disabled="edit"
        >
          <v-radio label="זכר" value="זכר"></v-radio>
          <v-radio label="נקבה" value="נקבה"></v-radio>
        </v-radio-group>
        <v-text-field
          label="כתובת מגורים"
          counter="25"
          v-model="account.addres"
          :rules="[emptyRules]"
          prepend-icon="mdi-map-marker-radius"
          outlined
          clearable
          filled
        />
        <v-radio-group
          v-model="account.type"
          row
          label="סוג משתמש"
          :rules="[emptyRules]"
          prepend-icon="mdi-gender-male-female"
          :disabled="edit"
        >
          <v-radio
            label="סטודנט"
            value="student"
            @change="loadFaculties"
          ></v-radio>
          <v-radio label="מנחה" value="mentor"></v-radio>
          <v-radio
            label="ראש מגמה"
            value="headFaculty"
            @change="loadFaculties"
          ></v-radio>
          <v-radio label="עובד מכללה" value="worker"></v-radio>
          <v-radio label="מנהל מכללה" value="boss" disabled></v-radio>
        </v-radio-group>
        <template v-if="account.type === 'mentor'">
          <v-text-field
            label="השכלה"
            v-model="account.mentor.Education"
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
            v-model="account.mentor.WorkLocation"
            prepend-icon="mdi-yoga"
            :rules="[emptyRules]"
            outlined
            clearable
            filled
            counter="50"
            hint="לדוגמא: מכללת אורט"
          ></v-text-field>
        </template>

        <template v-else-if="account.type === 'student'">
          {{ account.student.facultyId }}
          <v-autocomplete
            :items.sync="faculties"
            item-text="name"
            item-value="id"
            label="מגמה"
            v-model="account.student.facultyId"
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
  props: {
    account: {
      type: Array,
    },
    edit: {
      type: Boolean,
    },
  },
  data: () => ({
    emptyRules: (v) => !!v || "שדה חובה",
    emailRules: (v) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      "מייל זה איננו תקין",
    phoneRules: (v) => /^05\d([-]{0,1})\d{7}$/.test(v) || "מספר טלפון לא תקין",
    faculties: [],
  }),
  async fetch() {
    await this.loadFaculties();
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        let account = {
          accountId: this.account.accountId,
          firstName: this.account.firstName,
          lastName: this.account.lastName,
          sex: this.account.sex,
          email: this.account.email,
          phone: this.account.phone,
          type: this.account.type,
          addres: this.account.addres,
          student: null,
          mentor: null,
        };
        let request;
        switch (this.account.type) {
          case "student":
            account.student = {
              facultyId: this.account.student.facultyId,
              accountId: this.account.accountId,
            };
            request = await this.$axios.post(
              `students/${account.accountId}`,
              account
            );
            break;
          case "mentor":
            account.mentor = {
              accountId: this.account.accountId,
              WorkLocation: this.account.mentor.WorkLocation,
              Education: this.account.mentor.Education,
            };
            request = await this.$axios.post(
              `mentors/${account.accountId}`,
              account
            );
            break;
          default:
            request = await this.$axios.post(
              `accounts/create/${account.accountId}`,
              account
            );
            break;
        }
        if (request.status === 200) {
          this.$emit("update", request.data);
          this.$swal(
            "החשבון עודכן או נוצר בהצלחה",
            `חשבון ${account.firstName} ${account.lastName} (${account.accountId}) עודכן או נוצר בהצלחה!`,
            "success"
          );
        }
      }
    },
    async loadFaculties() {
      if (!this.faculties[0]) {
        this.faculties = await this.$axios.$get("faculties"); // load faculties only choose student a first time
      }
    },
  },
  watch: {
    edit: function (val) {
      if (!val) this.$refs.form.resetValidation();
    },
  },
};
</script>