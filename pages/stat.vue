<template>
  <v-row class="pt-3 pr-3" justify="center" align="center">
    <v-col cols="12" class="elevation-5">
      <v-btn-toggle mandatory v-model="type">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon value="bars" v-bind="attrs" v-on="on"
              ><v-icon>mdi-chart-bar</v-icon></v-btn
            >
          </template>
          <span>גרף עמודות</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon value="trend" v-bind="attrs" v-on="on">
              <v-icon>mdi-trending-up</v-icon></v-btn
            >
          </template>
          <span>גרף שורות</span>
        </v-tooltip>
      </v-btn-toggle>
      <v-sparkline
        :value="values"
        :labels="labels"
        show-labels
        :type="type"
        label-size="4"
        :gradient="['#00c6ff', '#F0F', '#FF0']"
      />
    </v-col>
    <v-col cols="12" class="elevation-5">
      <v-slide-group>
        <v-slide-item v-for="item in stat" :key="item.id">
          <v-card hover elevation="3" class="ma-3" width="300">
            <v-card-text class="justify">
              <v-checkbox
                label="הצג בסטיסטיקה כללית"
                v-model="item.select"
                persistent-hint
                hint=" ניתן לבחור כמה מגמות בשביל לראות את הסטסטיקה שלהם "
              ></v-checkbox>
              <v-divider />
            </v-card-text>
            <v-expansion-panels mandatory>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  מידע על מגמה
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <statistics :data="item" />
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  פרטי ראש מגמה
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <load-account :accountId="item.accountId" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-col>

    <v-col v-if="result">
      <statistics :data.sync="result" /> </v-col
    ><v-col>
      <v-img src="statics.gif" height="300"/>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    type: null,
  }),
  async asyncData({ $axios }) {
    const stat = await $axios.$get("students/stat/student");
    return { stat };
  },
  fetch() {
    for (let index = 0; index < this.stat.length; index++) {
      this.stat[index].select = true;
    }
  },
  
  computed: {
    values() {
      return this.stat.map((x) => x[`students.count`]);
    },

    labels() {
      return this.stat.map((x) => `${x.name} - ` + x[`students.count`]);
    },
    

    result() {
      let object = {
        name: "המגמות שנבחרו",
        "students.avg": 0,
        "students.count": 0,
        "students.studentWithProject": 0,
        "students.studentWithGrade": 0,
        "students.minGrade": 0,
        "students.maxGrade": 0,
      };
      var min = 100, max = 0;
      var index = 0;
      this.stat.forEach((element) => {
        if (element.select) {
          index++;
          object["students.count"] += element["students.count"];
          object["students.studentWithProject"] +=
            element["students.studentWithProject"];
          object["students.studentWithGrade"] +=
            element["students.studentWithGrade"];
            max = Math.max(max, parseInt(element["students.maxGrade"]));
            min = Math.min(min, parseInt(element["students.minGrade"]));
            object["students.avg"] += parseFloat(element["students.avg"])
        }
      });
      object["students.avg"] /= index;
      object["students.minGrade"] = min
      object["students.maxGrade"] = max
      if(!index) return null;
      return object;
    },
  },
};
</script>