<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      right
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar
            color="info"
            >
              {{$auth.user.firstName[0]}}{{$auth.user.lastName[0]}}
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{$auth.user.firstName}} {{$auth.user.lastName}}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{$auth.user.accountId}}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          v-show="accessesAllowed(item.watch)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider class="my-5" />
      <v-switch label="מצב מוחשך" v-model="$vuetify.theme.dark" prepend-icon="mdi-theme-light-dark" hint="בחר מצב עיצוב"></v-switch>
    </v-navigation-drawer>
    <v-app-bar
      app
      hide-on-scroll
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-avatar tile>
        <v-img :src="$icon(512)" alt="לוגו אורט" />
      </v-avatar>
     <v-spacer></v-spacer>
     מחובר בתור 
     {{$auth.user.firstName}} {{$auth.user.lastName}} 
     <v-divider vertical class="mr-3"/>
     <v-btn text @click="clear">התנתק</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-banner sticky app icon="mdi-wifi-off" single-line class="text-center white--text" color="red" icon-color="white" v-if="$nuxt.isOffline"> 
          אין חיבור אינטרנט 
          <v-progress-circular indeterminate color="white"></v-progress-circular>
        </v-banner>
        <nuxt v-else/>
      </v-container>
    </v-main>
    <v-navigation-drawer
    right
    >
    </v-navigation-drawer>
    <v-footer
    inset
    absolute
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: null,
      items: [
        {
          icon: 'mdi-account-reactivate-outline',
          title: 'פרטי החשבון',
          to: '/account',
          watch: '*'
        },
        {
          icon: 'mdi-school-outline',
          title: 'פרטי מכללה',
          to: "/college",
          watch: '*'
        },
        {
          icon: "mdi-folder-multiple-plus-outline",
          title: "פרויקט",
          to: "/project",
          watch: ['student']
        },
        {
          icon: "mdi-folder-multiple-plus-outline",
          title: "פרויקטים",
          to: "/projects",
          watch:['worker', 'headFaculty', 'mentor']
        },
        {
          icon: "mdi-comment-account-outline",
          title: "חשבונות",
          to: "/accounts",
          watch:['worker', 'headFaculty', 'boss']
        },
        {
          icon: "mdi-account-group-outline",
          title: "מגמות",
          to: "/faculties",
          watch:['worker', 'boss']
        },
         {
          icon: "mdi-file-outline",
          title: "קורות חיים ואישור השכלה",
          to: "/files",
          watch:['mentor']
        },
        {
          icon: "mdi-chart-line",
          title: "סטיסטיקה",
          to: "/general-statistics",
          watch:['worker', 'boss']
        },
        {
          icon: "mdi-chart-line",
          title: "סטיסטיקה",
          to: "/statistics",
          watch:['headFaculty']
        },
      ],

    }
  },
  methods:{
    /**
     * פונקציה מנקה מידע ששמור בדפדפן ולאחר מכאן מתנתקת מהמשתמש
     */
    clear(){
      localStorage.clear();
      this.$auth.logout()
    },
    /**
     *  הפונקציה מחזירה את התפריט הרלוונטי עבור כל אחד מהחשבונות
     */
    accessesAllowed(item){
      if (item === '*') return true;
      return item.find(value=> value === this.$auth.user.type)? true: false;
    }
  }
}
</script>
