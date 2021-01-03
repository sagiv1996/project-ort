import he from "vuetify/es5/locale/he";
export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - ort-project',
    title: 'ort-project',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/icon.png' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/axios',
    {
      src: '~plugins/vue-js-xlsx.js',
    }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/auth',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'vue-sweetalert2/nuxt'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 
      "http://localhost:801/api/"  
     // "http://umbrella.myddns.me:3000/api/"
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    rtl: true,
    lang: {
      locales: { he },
      current: "he"
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },
  auth: {
    redirect:{
      login: '/',
      callback: '/',
      home: '/account'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: 'accounts/login', method: 'post' },
          logout: false,
          user: { url: 'accounts/user/me', method: 'get', property: "token" }
        }
      }
    }
  },

  pwa:{
    manifest: {
      name: 'מערכת העלאת קבצים מכללת אורט',
      lang: 'he',
      short_name: "פרויקטים אורט",
      start_url: "/",
      dir: 'rtl',
    }
  },
  router: {
    middleware: ['auth']
  }
}
