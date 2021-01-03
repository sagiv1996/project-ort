<template>
  <v-row>
    <v-col v-if="$auth.user.type != 'worker'">
      <v-img src="account.png" alt="תמונה של חשבון" height="200" contain>
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
      <v-subheader v-if="title">{{ title }}</v-subheader>
      <v-list>
        <v-list-item two-line>
          <v-list-item-icon>
            <v-badge
              :icon="
                account.sex === 'זכר' ? 'mdi-gender-male' : 'mdi-gender-female'
              "
              left
              bordered
              origin
              color="#424242"
            >
              <v-icon x-large> mdi-account </v-icon>
            </v-badge>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ account.firstName }} {{ account.lastName }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ account.accountId }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-icon>
            <v-icon> mdi-card-account-mail-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ account.email }}
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :href="`mailto:${account.email}`"
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
          <v-list-item-content>
            {{ account.phone }}
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  :href="`tel:${account.phone}`"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> mdi-phone-forward-outline mdi-flip-h</v-icon>
                </v-btn>
              </template>
              <span>חייג למספר</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>

        <v-list-item v-if="location && account.addres">
          <v-list-item-icon>
            <v-icon> mdi-home-city-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ account.addres }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <more-info-to-mentor :mentor.sync="account.mentor" v-if="account.type === 'mentor' && $auth.user.type != 'student'"/>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
      required: true,
    },
    location: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
  },
};
</script>

<style>
</style>