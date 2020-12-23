<template>
  <v-card elevation="5">
    <v-card-title class="justify-center text-h1 text-center indigo--text">
      שלום לך {{$auth.user.firstName}} {{$auth.user.lastName}} וברוך שובך!
    </v-card-title>
    <v-card-text>
      <account :account="$auth.user" :location="true" />
      <update-password />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    
}
</script>