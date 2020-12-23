<template>
  <v-list>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-cast-education</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> השכלה </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title v-if="mentor.Education">
          {{ mentor.Education }}
        </v-list-item-title>
        <v-list-item-title v-else> מכללה טרם עדכנה </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-format-list-bulleted-type</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> מקום עבודה </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title v-if="mentor.WorkLocation">
          {{ mentor.WorkLocation }}
        </v-list-item-title>
        <v-list-item-title v-else> מכללה טרם עדכנה </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-file-account-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> קורות חיים</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title v-if="mentor.resumeName">
          {{ mentor.resumeName }}
        </v-list-item-title>
        <v-list-item-title v-else>
          טרם הועלאו קורות חיים ע"י המנחה
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action v-if="mentor.resumeName">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="download('getResume', mentor.resumeName)">
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>הורד קובץ</span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-file-cloud-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle> אישור השכלה</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title v-if="mentor.certificateName">
          {{ mentor.certificateName }}
        </v-list-item-title>
        <v-list-item-title v-else>
          טרם הועלאו קורות חיים ע"י המנחה
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action v-if="mentor.certificateName">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="download('getCertificate', mentor.certificateName)">
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>הורד קובץ</span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    mentor: {
      type: Object,
    },
  },
  methods:{
      async download(func, name){
           let res = await this.$axios.$get(`mentors/${func}/${this.$auth.user.accountId}`, {
        responseType: "blob",
      });

var fileURL = window.URL.createObjectURL(res);
      var fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", name);
      document.body.appendChild(fileLink);
      fileLink.click();

      }
  }
};
</script>