<template>
  <div>
    <v-btn-toggle mandatory v-model="type">
      <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon value="bars" v-bind="attrs" v-on="on"><v-icon>mdi-chart-bar</v-icon></v-btn>
              </template>
              <span>גרף עמודות</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon value="trend" v-bind="attrs" v-on="on"> <v-icon>mdi-trending-up</v-icon></v-btn>
              </template>
              <span>גרף שורות</span>
            </v-tooltip>
      
      
    </v-btn-toggle>   
    <v-sparkline :value="values" :labels="labels" show-labels :type="type" label-size="4" :gradient="['#00c6ff', '#F0F', '#FF0']">
      <template v-slot:label="item">
        {{item.value}}
          </template>
    </v-sparkline>
  </div>
</template>

<script>
export default {
  data:()=>({
    type: null
  }),
    async asyncData({ $axios }) {
    const stat = await $axios.$get('students/stat/faculty');
    return { stat };
  },
  computed:{
    values() {
   return this.stat.map(x=>x.students.length);
 },
labels() {
  return this.stat.map(x=>`${x.name} - ${x.students.length}`);
}
  }
}
</script>