<template>
  <v-form ref="form">
    <v-file-input
      :label="type"
      :rules="[emptylRules]"
      append-icon="mdi-arrow-left"
      @click:append="uploadFile"
      v-model="file"
      :disabled="lock"
      outlined
      @change="uploadFile"
      prepend-icon="mdi-file"
      clearable
      filled
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