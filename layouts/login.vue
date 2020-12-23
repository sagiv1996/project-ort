<template>
  <v-app>
    <v-main >
      <v-container fluid fill-height class="text-center" justify-center> 
        <nuxt />
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