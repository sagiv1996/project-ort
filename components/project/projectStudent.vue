<template>
  <div v-if="!$fetchState.pending">
    <v-stepper v-model="step" vertical class="pl-7">
      <v-stepper-step :complete="step <= maxStep" step="1" editable>
        ספר פרויקט
        <small
          >כולל נתינת שם לפרויקט, העלאת קבצים והמתנה לאישור של מנחה וראש
          מגמה</small
        >
      </v-stepper-step>

      <v-stepper-content step="1">
        <project-step-1
          :project.sync="project"
          @create="updateProject"
          @upload="updateFile"
        />
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2" :editable="2 <= maxStep"
        >הצעת פרויקט
        <small>העלאת ספר הפרויקט, אישור המנחה וראש המגמה</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <project-step-2
          :project.sync="project"
          v-if="project && project.files"
          @upload="updateFile"
        />
      </v-stepper-content>

      <v-stepper-step :complete="step > 3" step="3" :editable="3 <= maxStep">
        ציון
        <small>מועד ההגנה וציון</small>
      </v-stepper-step>

      <v-stepper-content step="3" v-if="project.ProtectionDate">
        <v-alert type="info">
          מועד ההגנה שלך נקבע ל {{ toStringDate(project.ProtectionDate) }}. צור
          קשר עם המכללה לפרטים נוספים
        </v-alert>
        <v-alert type="info" v-if="$auth.user.finishDate" outlined>
          ציונך הסופי הוא <span class=""></span>
        </v-alert>
        <v-calendar
          :value="toStringDate(project.ProtectionDate)"
          :events="[
            { name: `מועד הגנה`, start: toStringDate(project.ProtectionDate) },
          ]"
          @click:event="showDetalis"
          :event-more="false"
        />
        <v-alert type="success" v-if="$auth.user.student.gradeProject" class="mt-5">
          ציונך בהגנה הוא: {{$auth.user.student.gradeProject}}
        </v-alert>
      </v-stepper-content>
    </v-stepper>
    <project :project.sync="project" v-if="project" />
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Array,
      required: true,
    },
  },
  fetch() {
    if (this.project && this.project.ProtectionDate) this.step = 3;
    else if (
      Boolean(
        this.project &&
          this.project.files &&
          this.project.files[0].ApprovalMentorDate &&
          this.project.files[0].ApprovalHeadDate
      )
    )
      this.step = 2;
    this.maxStep = this.step;
  },
  data: () => ({
    step: 1,
    maxStep: 1,
  }),
  methods: {
    toStringDate(date) {
      const dateConvert = new Date(date);
      return `${dateConvert.getFullYear()}-${
        dateConvert.getMonth() + 1
      }-${dateConvert.getDate()} ${dateConvert.getHours()}:${dateConvert.getMinutes()}`;
    },
    showDetalis(g) {
      this.$swal({
        title: `שיהיה בהצלחה`,
        text: `ב ${g.day.date}, נקבע לך מועד ההגנה`,
        icon: "info",
        footer: "מומלץ לעמוד בקשר מול המכללה לפני ההגעה.",
      });
    },
    updateProject(project) {
      this.project = project;
    },
    updateFile(file) {
      this.project.files.push(file);
    },
  },
};
</script>