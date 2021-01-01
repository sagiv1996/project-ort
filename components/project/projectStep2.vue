<template>
  <v-row align="center">
    <v-col>
      <v-img src="project2.jpg" alt="pic">
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
      <upload-project-file
        type="ספר פרויקט"
        :project.sync="project"
        :lock="Boolean(project.files[1])"
        @upload="upload"
      />
      <div v-if="project.files[1]">
        <v-checkbox
          color="success"
          readonly
          :input-value="Boolean(project.files[1].ApprovalMentorDate)"
          label
        >
          <template v-slot:label>
            <span v-if="!project.files[1].ApprovalMentorDate">
              מנחה טרם אישר קובץ
            </span>
            <span v-else
              >מועד אישור מנחה{{
                toStringDate(project.files[1].ApprovalMentorDate)
              }}</span
            >
          </template>
        </v-checkbox>
        <v-checkbox
          color="success"
          readonly
          :input-value="Boolean(project.files[1].ApprovalHeadDate)"
          label
        >
          <template v-slot:label>
            <span v-if="!project.files[1].ApprovalHeadDate">
              ראש מגמה טרם אישר קובץ
            </span>
            <span v-else
              >מועד אישור ראש מגמה{{
                toStringDate(project.files[1].ApprovalHeadDate)
              }}</span
            >
          </template>
        </v-checkbox>
        <v-alert
          type="info"
          v-if="
            project.files[1].ApprovalMentorDate &&
            project.files[1].ApprovalHeadDate &&
            !$auth.user.finishDate
          "
          outlined
        >
          תעבור לשלב הבא עם קביעת מועד הגנה
        </v-alert>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  methods: {
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