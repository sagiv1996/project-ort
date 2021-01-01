<template>
  <v-app>
    <v-main >
      <v-container fluid fill-height class="text-center" justify-center> 
        <v-banner sticky app icon="mdi-wifi-off" single-line class="text-center white--text" color="red" icon-color="white" v-if="$nuxt.isOffline"> 
          אין חיבור אינטרנט 
          <v-progress-circular indeterminate color="white"></v-progress-circular>
        </v-banner>
        <nuxt v-else/>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  middleware: ({$vuetify})=>{
    $vuetify.theme.dark = false;
  },
}
</script>