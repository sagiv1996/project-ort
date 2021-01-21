<template>
  <v-data-table
    :headers="headers"
    :items="faculties"
    item-key="id"
    :search="search"
    show-expand
    :single-expand="singleExpand"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-layout row wrap align-center justify-center>
        <v-flex xs2>
          <v-tooltip top v-if="$auth.user.type === 'worker'">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                v-bind="attrs"
                v-on="on"
                @click="[loadHeadFaculrties(false), (dialog = true)]"
              >
                <v-icon> mdi-table-large-plus</v-icon>
              </v-btn>
            </template>
            <span>הוסף</span>
          </v-tooltip>
          <v-dialog v-model="dialog" max-width="500">
            <v-card>
              <v-card-title class="text-center justify-center">
                הוספת מגמה
              </v-card-title>
              <v-card-text>
                <v-form ref="formAddFaculty" @submit="submit">
                  <v-text-field
                    label="שם מגמה"
                    single-line
                    counter="50"
                    :rules="[emptyRules, uniqueFacultie]"
                    v-model="create.name"
                    prepend-icon="mdi-account-group-outline"
                  ></v-text-field>
                  <v-autocomplete
                    :loading="!listHeadFaculties[0]"
                    label="בחר מנחה"
                    single-line
                    :items="listHeadFaculties"
                    item-id="accountId"
                    item-text="firstName"
                    v-model="create.accountId"
                    :filter="filterObject"
                    :rules="[emptyRules]"
                    hint="ניתן לבחור רק משתמשים שהוגדרו כראשימגמה. לעדכון משתמשים היכנס לטבלת חשבונות"
                    menu-props="auth"
                    append-icon="mdi-teach"
                  >
                    <template v-slot:item="{ item }">
                      {{ item.firstName }} {{ item.lastName }}
                      <v-divider />
                      {{ item.accountId }}
                    </template>
                    <template v-slot:selection="{ item }">
                      {{ item.firstName }} {{ item.lastName }}
                    </template>
                  </v-autocomplete>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-alert type="info" outlined>
                  יש להוסיף ראש מגמה פנוי
                </v-alert>
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" x-large icon>
                      <v-icon>mdi-restart</v-icon>
                    </v-btn>
                  </template>
                  <span>אפס טופס</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      x-large
                      icon
                      @click="submit"
                    >
                      <v-icon>mdi-send mdi-flip-h</v-icon>
                    </v-btn>
                  </template>
                  <span>שלח טופס</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex xs7>
          <v-text-field
            :label="`חפש בכל ה${faculties.length} מגמות `"
            v-model="search"
            prepend-icon="mdi-account-search"
            clearable
            filled
            solo
            single-line
            outlined
            hide-details
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-switch
            label="מקסימום 1 פתוח"
            v-model="singleExpand"
            persistent-hint
            hint="פתח כל פעם מקסימום מנחה אחד בטבלה"
          />
        </v-flex>
      </v-layout>
    </template>
    <template v-slot:[`item.name`]="{ item }">
      <v-edit-dialog
        v-if="$auth.user.type === 'worker'"
        large
        cancel-text="בטל"
        save-text="עדכן"
        @open="temp = item.name"
        @save="updateFacultyName(item, temp)"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              :absolute="!$vuetify.breakpoint.mobile"
              class="mr-n16"
            >
              <v-icon>mdi-table-edit</v-icon>
            </v-btn>
          </template>
          <span>ערוך</span>
        </v-tooltip>

        <v-text-field
          slot="input"
          label="שם מגמה"
          single-line
          counter="50"
          :rules="[emptyRules, uniqueFacultie(temp, item)]"
          v-model="temp"
        ></v-text-field>
      </v-edit-dialog>

      {{ item.name }}
    </template>
    <template v-slot:[`item.account`]="{ item }">
      <v-edit-dialog
        v-if="$auth.user.type === 'worker'"
        large
        cancel-text="בטל"
        save-text="עדכן"
        @open="loadHeadFaculrties(item)"
        @save="updateFacultydAccountId(item, temp)"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              :absolute="!$vuetify.breakpoint.mobile"
              class="mr-n16"
            >
              <v-icon>mdi-table-edit</v-icon>
            </v-btn>
          </template>
          <span>ערוך</span>
        </v-tooltip>
        <v-autocomplete
          :loading="!listHeadFaculties[0]"
          slot="input"
          label="בחר מנחה"
          single-line
          :items="listHeadFaculties"
          item-id="accountId"
          item-text="firstName"
          v-model="temp"
          :filter="filterObject"
          :rules="[emptyRules]"
          return-object
          hint="ניתן לבחור רק משתמשים שהוגדרו כראשימגמה. לעדכון משתמשים היכנס לטבלת חשבונות"
        >
          <template v-slot:item="{ item }">
            {{ item.firstName }} {{ item.lastName }}
            <v-divider />
            {{ item.accountId }}
          </template>
          <template v-slot:selection="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>
        </v-autocomplete>
      </v-edit-dialog>

      {{ item.account.firstName }} {{ item.account.lastName }}
    </template>
    <template v-slot:[`item.data-table-expand`]="{ expand, isExpanded }">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="expand(!isExpanded)" v-bind="attrs" v-on="on">
            <v-icon
              v-text="!isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            />
          </v-btn>
        </template>
        <span
          v-text="!isExpanded ? 'פתח פרטי ראש מגמה' : 'סגור פרטי ראש מגמה'"
        />
      </v-tooltip>
    </template>
    <template v-slot:expanded-item="{ item, headers }">
      <td :colspan="headers.length">
        <account :account="item.account" :location="true" />
      </td>
    </template>

    <template v-slot:[`header.data-table-expand`]> פרטי ראש המגמה </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    faculties: {
      type: Array,
    },
  },
  data: () => ({
    create: {
      accountId: null,
      name: null,
    },
    dialog: false,
    singleExpand: false,
    search: null,
    temp: null,
    emptyRules: (v) => !!v || "שדה חובה",
    headers: [
      { text: "מספר מגמה", value: "id" },
      { text: "שם מגמה", value: "name" },
      { text: "שם מנחה", value: "account" },
    ],
    listHeadFaculties: [],
  }),
  methods: {
    /**
     * פונקציה מקבלת מגמה + משתנה ומעדכנת את המשתנה החדש במגמה הישנה
     * לאחר הצלחת הפעולה בשרת הפונקציה תציג הודעה למסך
     */
    async updateFacultydAccountId(faculty, temp) {
      if (this.emptyRules(temp) === true) { 
        const update = await this.$axios.put(`faculties/${faculty.id}`, {
          accountId: temp.accountId,
        });
        if (update.status === 200) {
          faculty.account = temp; //update in the client
          this.$swal("עודכן בהצלחה", "המגמה עודכנה בהצלחה", "success");
        }

        // alert
        else
          this.$swal(
            "עדכון נכשל",
            "העדכון לא פעל. נסה מאוחר יותר שנית",
            "error"
          ); // alert
      }
    },
    /**
     * הגדרת המסנן לשורת חיפוש בטבלה 
     */
    filterObject(item, queryText, itemText) {
      return (
        item.firstName
          .toLocaleLowerCase()
          .indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.lastName
          .toLocaleLowerCase()
          .indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.accountId.indexOf(queryText) > -1
      );
    },
    /**
     * פונקציה טוענת את ראשי המגמה 
     */
    async loadHeadFaculrties(item) {
      if (!this.listHeadFaculties[0])
        this.listHeadFaculties = await this.$axios.$get("accounts/headFaculty");
      if (item) this.temp = item.account;
    },

    /**
     * פונקציה מקבלת 2 פרמטרים -> מגמה וומשתנה נוסף
     * פונקציה מחזירה האם קיים ערך זהה או לא 
     */
    uniqueFacultie(faculty, item) {
      const ind = this.faculties.findIndex(
        (facultyTemp) => facultyTemp === item
      ); // index item this item
      return this.faculties.find(
        // find uniq value
        (facultyTemp, index) => facultyTemp.name === faculty && index != ind
      )
        ? "קיים ערך זהה"
        : true;
    },

    /*
    *  פונקציה מקבלת שם מגמה ובודקת שהוא ייחודי
    */
    uniqueAddFacultie(faculty) {
      return this.faculties.find(
        // find uniq value
        (facultyTemp) => facultyTemp.name === faculty
      )
        ? "קיים ערך זהה"
        : true;
    },

    /**
     * פונקציה אחראית לעדכן את שם המגמה
     * פונקציה מקבלת 2 משתנים: מה לעדכן ואיפה
     * פונקציה בודקת שהערכים תקניים
     * פונקציה מעכנת בצד לקוח + בשרת את המידע
     * פונקציה מציגה הודעת הצלחה
     */
    async updateFacultyName(item, faculty) {
      if (
        this.emptyRules(faculty) === true &&
        this.uniqueFacultie(faculty, item) === true
      ) {
        item.name = faculty; //update in the client
        const update = await this.$axios.put(`faculties/${item.id}`, {
          name: faculty,
        });
        if (update.status === 200)
          this.$swal("עודכן בהצלחה", "המגמה עודכנה בהצלחה", "success");
        // alert
        else
          this.$swal({
            title: "עדכון נכשל",
            text: "העדכון לא פעל. נסה מאוחר יותר שנית",
            icon: "error",
            footer: "שים לב שניתן להגדיר ראש מגמה אחד לכל מגמה",
          }); // alert
      }
    },
    /*
    * מטרת הפונקציה ליצור מגמה חדשה
     * פונקציה מבררת שהטופס תקין
     * פונקציה מתקשרת עם השרת ליצור מגמה חדש 
     * פונקציה מציגה הודעה רלוונטית
     * פונקציה מוסיפה רשומה בטבלה
     */
    async submit() {
      if (this.$refs.formAddFaculty.validate()) {
        const create = await this.$axios.post("/faculties", this.create);
        if (create.status === 200) {
          this.$swal(
            "מגמה נוצרה בהצלחה",
            "המגמה החדשה שיצרת נוצרה בהצלחה, ניתן להכניס אליה סטודנטים",
            "success"
          );
          this.faculties.push(create.data);
        } else
          this.$swal({
            title: "יצירה נכשלה",
            text: "היצירה לא פעלה. נסא שנית ",
            icon: "error",
            footer: "שים לב שניתן להגדיר ראש מגמה אחד לכל מגמה",
          }); // alert
      }
    },
  },
};
</script>