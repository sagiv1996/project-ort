<template>
  <v-card>
    <v-card-title class="justify-center">
      הגדרות פרויקט מספר {{ project.id }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form2">
        <v-autocomplete
          :items.sync="students"
          item-value="accountId"
          label="בחר סטודנט"
          prepend-icon="mdi-teach"
          hint="מינימום 1 מקסימום 3"
          menu-props="auto"
          :loading="!students[0]"
          multiple
          counter="3"
          :rules="[emptyArray, maxArray]"
          v-model="project.students"
          @input="checkMax3"
          return-object
          outlined
          :disabled="project.ProtectionDate"
          @blur="updateStudent"
          :filter="filterObject"
        >
          <template v-slot:item="{ item }">
            {{ item.firstName }} {{ item.lastName }}
            <v-divider />
            {{ item.accountId }}
          </template>
          <template v-slot:selection="{ item }">
            <v-chip
              :close="project.ProtectionDate === null"
              @click:close="deleteValue(item)"
            >
              {{ item.firstName }} {{ item.lastName }}
            </v-chip>
          </template>
        </v-autocomplete>
      </v-form>

      <v-form ref="form1">
        <v-autocomplete
          :items.sync="mentors"
          item-value="accountId"
          label="בחר מנחה"
          prepend-icon="mdi-teach"
          hint="מנחה הפרויקט הוא המנחה שתפקידו לעזור לסטודנטים"
          hide-selected
          :filter="filterObject"
          v-model="project.mentorAccountId"
          :rules="[emptyRules]"
          @change="update"
          menu-props="auto"
          :loading="!mentors[0]"
          outlined
          :disabled="project.ProtectionDate"
        >
          <template v-slot:item="{ item }">
            {{ item.firstName }} {{ item.lastName }}
            <v-divider />
            {{ item.accountId }}
          </template>
          <template v-slot:selection="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>
        </v-autocomplete>

        <template
          v-if="
            project.files &&
            project.files.length > 1 &&
            project.files[1].ApprovalMentorDate &&
            project.files[1].ApprovalHeadDate
          "
        >
          <v-menu
            v-model="menuDate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="inputDate"
                readonly
                v-on="on"
                prepend-icon="mdi-calendar-plus"
                label="תאריך"
                hint="מינימום חודש וחצי, מקסימום 7 חודשים וחצי"
                outlined
                :rules="[emptyRules]"
                clearable
                filled
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="inputDate"
              @input="[(menuDate = false), (menuTime = true), update]"
              :no-title="!inputDate"
              :min="minTime"
              :max="maxTime"
              :allowed-dates="goodDays"
            ></v-date-picker>
          </v-menu>
          <v-menu
            v-model="menuTime"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="menuTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="inputTime"
                label="בחר שעה"
                prepend-icon="mdi-calendar-clock"
                readonly
                v-on="on"
                outlined
                :rules="[emptyRules]"
                @blur="update"
                clearable
                filled
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuTime"
              v-model="inputTime"
              full-width
              @input="menuTime = false, update"
              format="24hr"
              :allowedHours="goodHouers"
              :no-title="!inputTime"
            ></v-time-picker>
          </v-menu>
        </template>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
    },
  },
  data: () => ({
    mentors: [],
    students: [],
    emptyRules: (v) => !!v || "שדה חובה",
    emptyArray: (v) => (v && v.length > 0) || "שדה חובה",
    maxArray: (v) => (v && v.length < 4) || "שדה חובה",
    goodHouers: (v) => v >= 9 && v <= 20,
    goodDays: (val) => new Date(val).getDay() < 5,
    inputDate: null,
    menuDate: false,
    inputTime: null,
    menuTime: null,
    now: new Date(),
  }),
  methods: {
    filterObject(item, queryText, itemText) {
      return (
        item.firstName
          .toLocaleLowerCase()
          .indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.lastName
          .toLocaleLowerCase()
          .indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.accountId.indexOf(queryText) > -1
      );
    },

    async update() {
      if (this.$refs.form1.validate()) {
        const project = {
          mentorAccountId: this.project.mentorAccountId,
          ProtectionDate: this.timeString,
        };
        const resultAxios = await this.$axios.put(
          `projects/${this.project.id}`,
          project
        );
        if (resultAxios.status === 200) {
          this.$swal({
            title: `עודכן בהצלחה`,
            text: `הפרויקט עודכן בהצלחה :) :) `,
            icon: "success",
            footer: "המידע יעודכן בפרויקט מייד עם הרענון הבא של העמוד",
          });
          this.$emit("update", this.project, resultAxios.data);
        }
      }
    },

    checkMax3() {
      if (this.project.students.length > 3) {
        this.project.students = this.project.students.slice(0, 3);
        this.$swal({
          title: "שגיאה בבחירת סטודנט",
          icon: "error",
          text: "לא ניתן לקשר מעל 3 סטודנטים לפרויקט.",
        });
      }
    },

    deleteValue(item) {
      const index = this.project.students.indexOf(
        (student) => student.accountId === item.accountId
      );
      this.project.students.splice(index, 1);
    },

    async updateStudent() {
      if (this.$refs.form2.validate()) {
        let data = [null, "null", "null"];
        for (let i = 0; i < this.project.students.length; i++) {
          data[i] = this.project.students[i].accountId;
        }
        const resultAxios = await this.$axios.put(
          `students/${data.join("/")}`,
          { projectId: this.project.id }
        );
        if (resultAxios.status === 200) {
          this.$swal({
            title: "הסטודנטים עודכנו בהצלחה!",
            icon: "success",
            text: `${resultAxios.data} נוספו בהצלחה לפרויקט`,
          });
        }
      }
    },
  },
  async fetch() {
    const accounts = await this.$axios.$get("accounts");
    this.mentors = accounts.filter((account) => account.type === "mentor");
    this.students = accounts.filter((account) => account.type === "student");
    if (this.project.ProtectionDate) {
      const temp = new Date(this.project.ProtectionDate);
      this.inputDate = new Date(
        temp.getFullYear(),
        temp.getMonth() + 1,
        temp.getDay() + 15
      )
        .toISOString()
        .slice(0, 10);

      this.inputTime = `${temp.getHours()}:${temp.getMinutes()}:00`;
    }
  },
  computed: {
    timeString() {
      return `${this.inputDate} ${this.inputTime}`;
    },
    minTime() {
      return new Date(
        this.now.getFullYear(),
        this.now.getMonth() + 1,
        this.now.getDay() + 15
      )
        .toISOString()
        .slice(0, 10);
    },
    maxTime() {
      return new Date(
        this.now.getFullYear(),
        this.now.getMonth() + 7,
        this.now.getDay() + 15
      )
        .toISOString()
        .slice(0, 10);
    },
  },
};
</script>