<template>
  <v-data-iterator
    :items="projects"
    :search="search"
    :sort-by="sortBy"
    :sort-desc="sortDesc"
  >
    <template v-slot:header>
      <v-toolbar class="mb-1">
        <v-text-field
          v-model="search"
          clearable
          hide-details
          prepend-icon="mdi-magnify"
          :label="`חפש בכל ה${projects.length} פרויקטים `"
          outlined
          single-line
          solo
          filled
        ></v-text-field>
        <template v-if="$vuetify.breakpoint.mdAndUp">
          <v-spacer></v-spacer>
          <v-select
            v-model="sortBy"
            hide-details
            :items="keys"
            prepend-icon="mdi-magnify"
            label="מיין לפי"
            menu-props="auto"
            filled
            solo
            single-line
            outlined
            clearable
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn-toggle v-model="sortDesc" mandatory>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn large depressed :value="false" v-bind="attrs" v-on="on">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
              </template>
              <span>מיון בסדר עולה</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn large depressed :value="true" v-bind="attrs" v-on="on">
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </template>
              <span>מיון בסדר יורד</span>
            </v-tooltip>
          </v-btn-toggle>
        </template>
      </v-toolbar>
    </template>
    <template v-slot:default="{ items }">
      <v-row justify="center">
        <v-col
          v-for="project in items"
          :key="project.id"
          cols="12"
          sm="6"
          md="4"
        >
          <project :project="project" />
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>



<script>
export default {
  data: () => ({
    sortBy: null,
    search: null,
    sortDesc: false,
    keys: [
      {
        text: "מזהה",
        value: "accountId",
      },
      {
        text: "מועד שינוי אחרון",
        value: "dataUpdate",
      },
      {
        text: "שם פרויקט",
        value: "name",
      },
      {
        text: "מועד הגנה",
        value: "ProtectionDate",
      },
      {
        text: "תעודת זהות מנחה",
        value: "mentorAccountId",
      },
      {
        text: "הצעת פרויקט - מנחה",
        value: "files[0].ApprovalMentorDate"
      },
      {
        text: "הצעת פרויקט - ראש מגמה",
        value: "files[0].ApprovalHeadDate"
      },
      {
        text: "ספר פרויקט - מנחה",
        value: "files[1].ApprovalMentorDate"
      },
      {
        text: "ספר פרויקט - ראש מגמה",
        value: "files[1].ApprovalHeadDate"
      }
    ],
  }),
  props: {
    projects: {
      type: Array,
      required: true,
    },
  },
  methods: {
    update(oldProject, newProject) {
      const project = this.projects.find((project) => project === oldProject);
    },
  }
};
</script>