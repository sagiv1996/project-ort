<template>
<v-row align="center" justify="center">
    
    <v-col sm="8">
        
    <v-card-title class="justify-center">
      העלאת קורות חיים ואישור השכלה
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-file-input
          v-model="resume"
          @change="upload('resume', resume)"
          label="קורות חיים"
          :rules="[emptylRules]"
          filled
          outlined
          :clearable="false"
        />
        <v-file-input
          v-model="certificate"
          @change="upload('certificate', certificate)"
          label="אישור השכלה"
          :rules="[emptylRules]"
          filled
          outlined
          :clearable="false"
        />
      </v-form>
      <v-alert type="info" outlined>
        בעת העלאת קובץ חדש הקבצים השמורים במערכת ימחקו ויוחלפו לקבצים החדשים
      </v-alert>

      <more-info-to-mentor :mentor.sync="mentor" />
    </v-card-text>
    </v-col>
    <v-col cols="12">
     <v-img src="resume.gif" />
    </v-col>
</v-row>
</template>

<script>
export default {
  /**
   * טעינת מידע יחד עם העמוד
   * טעינת מידע על מנחה לפי מספר זהות
   */
  async asyncData({$axios, $auth}){
    const mentor = await $axios.$get(`mentors/${$auth.user.accountId}`);
    return {mentor};
  },
  data: () => ({
    resume: null,
    certificate: null,
    emptylRules: (v) => !!v || "שדה חובה",
  }),
  methods: {
    /**
     * העלאת פרויקט
     * @param {string} name סוג הקובץ (קו"ח / אישור השכלה)
     * @param {object} file הקובץ להעלאה
     * הפונקציה מעלה את הקובץ לשרת -> אם קיים קובץ הוא יעודכן
     * הפונקציה תדפיס הודעה לאחר מכן 
     */
    async upload(name, file) {
      if (file) {
        let formData = new FormData();
        formData.append("file", file);
        const result = await this.$axios.put(
          `mentors/${name}/${this.$auth.user.accountId}`,
          formData
        );    
        if (result.status === 201){
          this.$swal({title: "הקובץ עלה בהצלחה למערכת", text: "מזל טוב! הקובץ עודכן במערכת המכללה", icon: 'success'});
          }
        else this.$swal("שגיאה בהעלאת הקובץ", "הקובץ איננו עלה בהצלחה",  "error")
      }
      
    },
  },
  watch:{
    // עדכון הקובץ לאחר העלאתו
    resume(){
      this.mentor.resumeName = this.resume.name;
    },
    // עדכון הקובץ לאחר העלאתו
    certificate(){
      this.mentor.certificateName = this.certificate.name;
    }
  }
};
</script>