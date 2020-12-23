<template>
  <v-row align="center">
    <v-col>
      <v-img src="ort.jpg" alt="מכללת אורט" height="200" contain>
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>

    <v-col>
      <v-list>
        <v-list-item two-line>
          <v-list-item-icon>
            <v-icon x-large> mdi-google-maps </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title> מכללת אורט ירושלים </v-list-item-title>

            <v-list-item-subtitle> הנביאים 42 ירושלים </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon> mdi-card-account-mail-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content> joc@ort.org.il </v-list-item-content>
          <v-list-item-action>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  href="mailto:joc@ort.org.il"
                >
                  <v-icon>mdi-email-send-outline mdi-flip-h</v-icon>
                </v-btn>
              </template>
              <span>שלח מייל</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon> mdi-card-account-phone-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content> 1-700-70-11-11 </v-list-item-content>
          <v-list-item-action>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon href="tel:1-700-70-11-11" v-bind="attrs" v-on="on">
                  <v-icon> mdi-phone-forward-outline mdi-flip-h</v-icon>
                </v-btn>
              </template>
              <span>חייג למספר</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-whatsapp</v-icon>
          </v-list-item-icon>
          <v-list-item-content> 0504726312 </v-list-item-content>
          <v-list-item-action>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  href="http://wa.me/972504726312"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-link</v-icon>
                </v-btn>
              </template>
              <span> שלח וואטסאפ </span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-waze</v-icon>
          </v-list-item-icon>
          <v-list-item-content> פתיחה בוויז </v-list-item-content>
          <v-list-item-action>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  href="https://ul.waze.com/ul?place=EiBIYS1OZXZpJ2ltIFN0LCBKZXJ1c2FsZW0sIElzcmFlbCIuKiwKFAoSCfnvQHDaKQMVEcDM2Ku-T4fREhQKEglL_ME01tcCFRHL4W5FPmJv2Q&ll=31.78372970%2C35.22225960&navigate=yes"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-location-exit mdi-flip-h</v-icon>
                </v-btn>
              </template>
              <span> פתחיחה בוויז </span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="12" class="elevation-5">
      <v-card-title class="justify-center"> מפת האיזור </v-card-title>
      <v-card-text>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3391.8015044796257!2d35.19717208510192!3d31.775899381285857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502d7c99a8e5d69%3A0x9140d65956e66867!2z157Xm9ec15zXqiDXkNeV16jXmA!5e0!3m2!1siw!2sil!4v1605805369286!5m2!1siw!2sil"
          width="100%"
          height="450"
          frameborder="0"
          style="border: 0"
          allowfullscreen=""
          aria-hidden="false"
          tabindex="0"
        ></iframe>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script>
export default {};
</script>