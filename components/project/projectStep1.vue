<template>
  <v-row align="center">
    <v-col>
      <v-img src="project1.jpg" alt="pic">
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
      <v-form ref="form">
        <v-text-field
          label="הכנס כאן את שם הפרויקט שלך :) "
          :rules="[emptylRules]"
          prepend-icon="mdi-comment-text-outline"
          append-icon="mdi-arrow-left"
          outlined
          hint="שים לב: לא ניתן להחליף את השם לאחר ההגדרה שלו"
          counter="20"
          @click:append="createProject"
          clearable
          v-model="name"
          :messages="project ? 'שדה זה כבר מולא בהצלחה' : null"
          :disabled="Boolean(project)"
          @keypress.enter.once="createProject"
          filled
        />
      </v-form>
      <upload-project-file
        v-if="project"
        type="הצעת פרויקט"
        :project.sync="project"
        :lock="
          !Boolean(project) ||
          Boolean(project.files && project.files.length > 0)
        "
        @upload="upload"
      />
      <div v-if="project && project.files && project.files.length > 0">
        <v-checkbox
          color="success"
          readonly
          :input-value="Boolean(project.files[0].ApprovalMentorDate)"
          label
        >
          <template v-slot:label>
            <span v-if="!project.files[0].ApprovalMentorDate">
              מנחה טרם אישר קובץ
            </span>
            <span v-else
              >מועד אישור מנחה{{
                toStringDate(project.files[0].ApprovalMentorDate)
              }}</span
            >
          </template>
        </v-checkbox>
        <v-checkbox
          color="success"
          readonly
          :input-value="Boolean(project.files[0].ApprovalHeadDate)"
          label
        >
          <template v-slot:label>
            <span v-if="!project.files[0].ApprovalHeadDate">
              ראש מגמה טרם אישר קובץ
            </span>
            <span v-else
              >מועד אישור ראש מגמה{{
                toStringDate(project.files[0].ApprovalHeadDate)
              }}</span
            >
          </template>
        </v-checkbox>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    project: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    emptylRules: (v) => !!v || "שדה חובה",
    name: null,
  }),
  methods: {
    async createProject() {
      if (this.$refs.form.validate()) {
        const result = await this.$axios.post(`projects`, {
          studentId: this.$auth.user.accountId,
          name: this.name,
        });
        if (result.status === 201) {
          this.$swal("נוצר בהלחה", "פרויקט חדש נוצר בהצלחה!", "success"); // alert
          //this.project = result.data;
          this.$emit("create", result.data);
        }
      }
    },
    upload(file) {
      this.$emit("upload", file);
    },
    toStringDate(date) {
      const dateConvert = new Date(date);
      return `${dateConvert.getFullYear()}-${
        dateConvert.getMonth() + 1
      }-${dateConvert.getDate()}`;
    },
  },
};
</script>