<template>
  <v-list>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> מזהה מגמה </v-list-item-subtitle>
        <v-list-item-title>
          {{ data.id }}
        </v-list-item-title>
      </v-list-item-content>   
       </v-list-item>
       <v-divider></v-divider>
       <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> שם המגמה </v-list-item-subtitle>
        <v-list-item-title>
          {{ data.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> סה"כ סטודנטים </v-list-item-subtitle>
        <v-list-item-title>
          {{ data["students.count"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> ממוצע ציונים </v-list-item-subtitle>
        <v-list-item-title>
          {{ data["students.studentWithProject"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> סטודנטים עם פרויקט </v-list-item-subtitle>
        <v-list-item-title>
          {{ data["students.studentWithProject"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> סטודנטים בלי פרויקט </v-list-item-subtitle>
        <v-list-item-title>
          {{ data["students.count"] - data["students.studentWithProject"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>