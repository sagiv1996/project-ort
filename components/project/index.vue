<template>
  <v-card>
    <v-card-title class="justify-center">
      {{ this.project.name }}
      <v-subheader v-if="project.dataUpdate">{{
        project.dataUpdate.slice(0, 10)
      }}</v-subheader>
      <v-tooltip top v-if="$auth.user.type === 'worker' || $auth.user.type === 'headFaculty'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="update = true">
            <v-icon>mdi-cog-transfer-outline</v-icon>
          </v-btn>
        </template>
        <span>הגדרות פרויקט</span>
      </v-tooltip>
      <v-dialog v-model="update" transition="dialog-transition" max-width="500">
        <update-project :project.sync="project" />
      </v-dialog>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-progress-linear
            :value="score"
            :color="
              score < 30
                ? 'red'
                : score < 60
                ? 'orange'
                : score < 100
                ? 'info'
                : 'green'
            "
            height="22"
            striped
            v-bind="attrs"
            v-on="on"
          >
            {{ score }}%
          </v-progress-linear>
        </template>
        <span>מד התקדמות של הפרויקט</span>
      </v-tooltip>
    </v-card-title>
    <v-expansion-panels>
      <v-expansion-panel
        :disabled="project.mentorAccountId === null"
        v-if="project.mentorAccountId != $auth.user.accountId"
      >
        <v-expansion-panel-header>
          <v-icon>mdi-teach</v-icon>
          <span v-if="project.mentorAccountId"
            >פרטי מנחה {{ project.mentorAccountId }}</span
          >
          <span v-else>לא קיים מנחה מקושר. נא לפנות למכללה להוספת מנחה</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <load-account
            :accountId.sync="project.mentorAccountId"
            :location="true"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel
        v-for="student in project.students"
        :key="student.accountId"
        :location="true"
        v-show="student.accountId != $auth.user.accountId"
      >
        <v-expansion-panel-header>
          <v-icon>mdi-school-outline</v-icon>
          <span>פרטי סטודנט {{ student.accountId }}</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <load-account :accountId="student.accountId" :location="true" />
          <v-slider
            v-if="project.ProtectionDate != null"
            :readonly="$auth.user.type != 'worker'"
            hint="טווח 0- 100"
            max="100"
            min="0"
            label="ציון הפרויקט"
            v-model="student.gradeProject"
            thumb-label="always"
            :color="
              student.gradeProject < 30
                ? 'red'
                : student.gradeProject < 60
                ? 'orange'
                : student.gradeProject < 100
                ? 'info'
                : 'green'
            "
            :thumb-color="
              student.gradeProject < 30
                ? 'red'
                : student.gradeProject < 60
                ? 'orange'
                : student.gradeProject < 100
                ? 'info'
                : 'green'
            "
            @change="updateStudent(student)"
          ></v-slider>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel v-for="file in project.files" :key="file.id">
        <v-expansion-panel-header>
          <v-icon :color="file.ApprovalMentorDate && file.ApprovalHeadDate? 'green' : 'red'">mdi-file</v-icon>
          <span>{{ file.type }} - {{ file.name }}</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item v-if="file.id">
              <v-list-item-icon>
                <v-icon>mdi-identifier</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle> מזהה קובץ </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>
                  {{ file.id }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle> מועד יצירה </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>
                  {{ file.createAt.slice(0, 10) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-file-pdf-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle> קובץ </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="download(file)"
                    >
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>הורד קובץ</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>

            <v-list-item v-if="file.ApprovalMentorDate" two-line>
              <v-list-item-icon>
                <v-icon>mdi-calendar-clock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle> מועד אישור מנחה </v-list-item-subtitle>
                <v-list-item-title>{{
                  file.ApprovalMentorDate.slice(0, 10)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-else-if="$auth.user.type === 'mentor'" three-line>
              <v-list-item-icon
                ><v-icon>mdi-thumb-up-outline</v-icon></v-list-item-icon
              >
              <v-list-item-content>
                <v-list-item-subtitle>אשר קובץ</v-list-item-subtitle
                ><v-list-item-title
                  >לאחר אישור הקובץ הסטודנט יתקדם לשלבים
                  הבאים</v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      :disabled="file.ApprovalMentorDate"
                      @click.once="toConfirm(file)"
                    >
                      <v-icon>mdi-beaker-check-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>אשר קובץ</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="file.ApprovalHeadDate" two-line>
              <v-list-item-icon>
                <v-icon>mdi-calendar-clock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>
                  מועד אישור ראש מגמה
                </v-list-item-subtitle>
                <v-list-item-title>
                  {{ file.ApprovalHeadDate.slice(0, 10) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-else-if="$auth.user.type === 'headFaculty' && file.ApprovalMentorDate">
              <v-list-item-icon>mdi-thumb-up-outline</v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>אשר קובץ</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      :disabled="file.ApprovalHeadDate"
                      @click.once="toConfirm(file)"
                    >
                      <v-icon>mdi-beaker-check-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>אשר קובץ</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="$auth.user.type === 'worker'">
              <v-list-item-icon>
                <v-icon>mdi-email-send</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>שלח למה"ט </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      :disabled="!file.ApprovalMentorDate && !file.ApprovalHeadDate"
                      @click="sendMahat"
                    >
                      <v-icon>mdi-email-send-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>שלח למהט</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    update: false,
  }),
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  methods: {
    sendMahat(){
      this.$swal("שליחה למהט", "זמנית המערכת איננה תומכת בשליחה למהט", 'info')
    },
    async updateStudent(student){
      const data = {student: {gradeProject: student.gradeProject}};
      const result = await this.$axios.put(`students/${student.accountId}`, data);
      if (result.status === 200) this.$swal("ציון עודכן בהצלחה", `הציון לסטודנט עודכן בצהלחה!`, 'success')
    },
    async download(file) {
      const res = await this.$axios.$get("/file/" + file.id, {
        responseType: "blob",
      });
      var fileURL = window.URL.createObjectURL(res);
      var fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", file.name);
      document.body.appendChild(fileLink);
      fileLink.click();
    },
    async toConfirm(file) {
      let data;
      if (this.$auth.user.type === "mentor")
        data = { ApprovalMentorDate: new Date().toISOString() };
      else data = { ApprovalHeadDate: new Date().toISOString() };
      const resultUpdate = await this.$axios.put(`/file/${file.id}`, data);
      if (resultUpdate.status === 200) {
        //update is good
        this.$swal({
          title: `קובץ אושר בהצלחה`,
          text: `הקובץ אושר בהצלחה, תודה ויום מוצלח `,
          icon: "success",
        });
        if (this.$auth.user.type === "mentor")
          file.ApprovalMentorDate = new Date().toISOString();
        else file.ApprovalHeadDate = new Date().toISOString();
      }
    },
  },
  computed: {
    score() {
      let score = 20;
      if (!this.project) return (score = 0);
      if (this.project.ProtectionDate) score = 100;
      else if (
        this.project.files &&
        this.project.files.length === 2 &&
        this.project.files[1].ApprovalHeadDate
      )
        score = 90;
      else if (
        this.project.files &&
        this.project.files.length === 2 &&
        this.project.files[1].ApprovalMentorDate
      )
        score = 80;
      else if (this.project.files && this.project.files.length == 2) score = 70;
      else if (
        this.project.files &&
        this.project.files.length == 1 &&
        this.project.files[0].ApprovalHeadDate
      )
        score = 60;
      else if (
        this.project.files &&
        this.project.files.length == 1 &&
        this.project.files[0].ApprovalMentorDate
      )
        score = 50;
      else if (this.project.files) score = 40;
      else if (this.project.mentorAccountId) score = 30;
      return score;
    },
  },
};
</script>