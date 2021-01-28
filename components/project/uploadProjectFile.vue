<template>
  <v-form ref="form">
    <v-file-input
      :label="type"
      :rules="[emptylRules, sizeRules, pdfRules]"
      append-icon="mdi-arrow-left"
      @click:append="uploadFile"
      v-model="file"
      :disabled="lock"
      outlined
      @change="uploadFile"
      prepend-icon="mdi-file"
      clearable
      filled
      accept="application/pdf"
      :show-size="true"
      hint="יש להעלות קבצי pdf בלבד"
    />
  </v-form>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
    lock: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    file: null,
    emptylRules: (v) => !!v || "שדה חובה",
    sizeRules: (v) => v &&  v.size < 50000000 || 'קובץ צריך להיות מקסימום 50 MB',
    pdfRules:(v) => v && v.name.split('.').pop() === 'pdf'  || 'המערכת תומכת רק בקבצי pdf'
  }),
  methods: {
    /**
     * פונקציה מעלה קובץ לשרת
     * בודקת תקינות של הטופס
     * שולחת מידע לשרת ומדפיסה הודעה בהתאם לתוצאה
     */
    async uploadFile() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("projectId", this.project.id);
        formData.append("type", this.type);
        formData.append("file", this.file);
        const file = await this.$axios.post(`file`, formData);
        if (file.status === 201) {
          this.$swal(
            "קובץ עלה בהצלחה",
            "הקובץ עלה בהצלחה לשרת וכעת ניתן לצפייה בקישור לפרויקט!",
            "success"
          ); // alert

          this.$emit("upload", file.data);
        }
      }
    },
  },
};
</script>