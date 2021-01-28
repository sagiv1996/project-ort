<template>

  <div v-if="!$fetchState.pending">
    <project :project.sync="project"/>
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
    
  </div>
</template>

<script>
export default {
  /**
   * @param $axios מודל לגישה לשרת
   * @param {object} $auth  מידע על המשתמש המחובר
   * מידע נטען עם עליית העמוד
   * פונקציה טוענת מידע על פרויקט של סטודנט מהשרת
   */
  async asyncData({ $axios, $auth }) {
    let project = await $axios.$get(
      `projects/${$auth.user.student.projectId}`
    );
    //if(!project) project = new Object();
    return { project };
  },

/**
 * פונקציה נטענת כאשר העמוד נטען
 * פונקציה מוצאת את המקום החלון הרלוונטי שצריך לשלוח אליו את הסטודנט
 */
  fetch() {
    if (this.project && this.project.ProtectionDate) this.step = 3;
    else if (
      Boolean(
        this.project &&
          this.project.files &&
          this.project.files[0] &&
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
    /**
     * @param {date} משתנה מכיל תאריך 
     * פונקציה ממירה תאריך לפורמט רצוי
     */
    toStringDate(date) {
      const dateConvert = new Date(date);
      return `${dateConvert.getFullYear()}-${
        dateConvert.getMonth() + 1
      }-${dateConvert.getDate()} ${dateConvert.getHours()}:${dateConvert.getMinutes()}`;
    },
    /**
     * פונקציה מציגה הודעה רלוונטית 
     */
    showDetalis(g) {
      this.$swal({
        title: `שיהיה בהצלחה`,
        text: `ב ${g.day.date}, נקבע לך מועד ההגנה`,
        icon: "info",
        footer: "מומלץ לעמוד בקשר מול המכללה לפני ההגעה.",
      });
    },
    /**
     * @param {object} project הפרויקט החדש המעודכן
     * עדכון פרויקט ישן לפרויקט מעודכן
     */
    updateProject(project) {
      this.project = project;
    },
    /**
     * @param {object} file מידע על הקובץ
     * הפונקציה מוסיפה מידע על קובץ לפרויקט לאחר שסטודנט מעלה קובץ
     */
    updateFile(file) {
      this.project.files.push(file);
    },
  },
};
</script>