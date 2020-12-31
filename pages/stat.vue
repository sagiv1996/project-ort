<template>
  <v-row class="elevation-5 pt-3 pr-3">
    <v-col cols="12">
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
    <v-sparkline :value="values" :labels="labels" show-labels :type="type" label-size="4" :gradient="['#00c6ff', '#F0F', '#FF0']" />
    </v-col>
    <v-col cols="4">
    </v-col>
    <v-slide-group>
      <v-slide-item v-for="(item) in stat" :key="item.id">
       
        <v-card hover elevation="3" class="ma-3" width="300">
          <v-card-text>
            <v-checkbox label="label" :value="true"></v-checkbox>
             <v-divider></v-divider>
          <statistics :data="item"/>
          </v-card-text>
        </v-card>        
        
      </v-slide-item>
    </v-slide-group>
  </v-row>
</template>

<script>
export default {
  data:()=>({
    type: null,
    dialog: false
  }),
    async asyncData({ $axios }) {
    const stat = await $axios.$get('students/stat/student');
    return { stat };
  },
  computed:{
    
    values() {
   return this.stat.map(x=>x[`students.count`]);
 },
 
labels() {
  return this.stat.map(x=>`${x.name} - ` +x[`students.count`]);
}

  }
}
</script>