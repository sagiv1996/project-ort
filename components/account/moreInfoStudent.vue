<template>
  <v-list>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-folder-key-network-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> מזהה פרויקט </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title v-if="student.projectId">
          {{ student.projectId }}
        </v-list-item-title>
        <v-list-item-title v-else> טרם קושר פרויקט </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-format-list-bulleted-type</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> שם המגמה </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ nameFactury(student.facultyId) }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-seal-variant</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> ציון פרויקט </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title v-if="student.gradeProject">
          {{ student.gradeProject }}
        </v-list-item-title>
        <v-list-item-title v-else> טרם נקבע ציון פרויקט </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-sort-calendar-descending</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> תאריך סיום </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title v-if="student.finishDate">
          {{ student.finishDate }}
        </v-list-item-title>
        <v-list-item-title v-else> טרם נקבע תאריך סיום </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-information-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> פרטים נוספים </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          לעדכון נוסף של פרטים יש לפנות למכללה
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    student: {
      type: Object,
    },
  },
  data: () => ({
    faculties: null,
  }),
  /**
   * הפונקציה נקראת ברגע שהעמוד עולה,
   * פונקציה טוענת את כל המגמות
   */
  async fetch() {
    this.faculties = await this.$axios.$get("faculties");
  },
  methods: {
    /**
     * פונקציה מחזירה את שם המגמה לפי מזהה ששולחים לה. במידה והמגמות טרם נטענו היא תחזיר מחרוזת "טוען..."
     */
    nameFactury(facultyId) {
      return this.faculties
        ? this.faculties.find((faculty) => faculty.id === facultyId).name
        : "loading...";
    },
  },
};
</script>