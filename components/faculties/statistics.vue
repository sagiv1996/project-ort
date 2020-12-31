<template>
  <v-list>
    <v-list-item v-if="data.id">
      <v-list-item-content>
        <v-list-item-subtitle> מזהה מגמה </v-list-item-subtitle>
        
      </v-list-item-content> 
      <v-list-item-content>
          <v-list-item-title>
          {{ data.id }}
        </v-list-item-title>
      </v-list-item-content>  
       </v-list-item>
       <v-divider v-if="data.id" />
       <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> שם המגמה </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ data.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> סה"כ סטודנטים </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ data["students.count"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    
    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> מספר סטודנטים עם פרויקט </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ data["students.studentWithProject"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>


    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> מספר סטודנטים ללא פרויקט </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ data["students.count"] - data["students.studentWithProject"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>


    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> ממוצע ציונים </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ parseFloat(data["students.avg"]).toFixed(1) }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> סטודנטים עם ציון </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ data["students.studentWithGrade"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> סטודנטים בלי ציון </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ data["students.count"] -  data["students.studentWithGrade"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> ציון מינימום </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ data["students.minGrade"] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

 <v-list-item>
      <v-list-item-content>
        <v-list-item-subtitle> ציון מקסימום </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>
          {{ data["students.maxGrade"] }}
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