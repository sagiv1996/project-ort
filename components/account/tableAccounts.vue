<template>
    <v-data-table :headers="headers" :items="data" item-key="accountId" :search="search" sort-by="type"
    :group-by="$auth.user.type==='worker' || $auth.user.type==='boss'?'type':null"
    class="elevation-1"
    height="60vh"
    multi-sort
    show-expand
    single-expand
    >
      <template v-slot:top>        
        <v-layout row wrap align-center justify-center>
        <v-flex xs2>
          <v-tooltip top v-if="$auth.user.type === 'worker'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn fab v-bind="attrs" v-on="on" @click="dialog = !dialog">
              <v-icon> mdi-table-large-plus</v-icon>
            </v-btn>
          </template>
          <span>הוסף</span>
        </v-tooltip>
        <v-dialog v-model="dialog" max-width="450" transition="dialog-transition" @click:outside="resetAccount">
      <create-account :account.sync="account" :edit="edit" @close="dialog = false" @update="update"/>
    </v-dialog>
        </v-flex>
        <v-flex xs8>
          <v-text-field
            :label="`חפש בכל ה${data.length} חשבונות `"
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
      </v-layout>      
      </template>
      <template v-slot:[`group.header`]="{ group, headers, toggle, isOpen, items }">
        <td :colspan="headers.length"> 
           <v-tooltip top v-if="isOpen">
            <template v-slot:activator="{ on, attrs }" >
            <v-btn icon v-bind="attrs" v-on="on" @click="toggle" x-small>
              <v-icon> mdi-minus</v-icon>
            </v-btn>
          </template>
          <span>סגור הכל</span>
        </v-tooltip>
        <v-tooltip top v-else>
          <template v-slot:activator="{ on, attrs }" >
            <v-btn icon v-bind="attrs" v-on="on" @click="toggle" x-small>
              <v-icon> mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>פתח הכל</span>
        </v-tooltip>
     <span class="mx-5 font-weight-bold">{{ translateType(group) }} ({{items.length}} סה"כ)</span>
  </td>
</template>
      <template v-slot:[`item.fullName`]="{ item }">
        <v-badge :icon="item.sex === 'זכר' ? 'mdi-gender-male' : 'mdi-gender-female'" left>
          {{ item.firstName }} {{ item.lastName }}
        </v-badge>
      </template>
      <template v-slot:[`item.type`]="{ item }">
        {{ translateType(item.type) }}
      </template>
      <template v-slot:[`item.contactUs`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon :href="`tel:${item.phone}`" v-bind="attrs" v-on="on">
              <v-icon> mdi-phone-forward-outline mdi-flip-h</v-icon>
            </v-btn>
          </template>
          <span>חייג למספר</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon :href="`mailto:${item.email}`">
              <v-icon>mdi-email-send-outline mdi-flip-h</v-icon>
            </v-btn>
          </template>
          <span>שלח מייל</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.edit`]="{ item }" v-if="$auth.user.type === 'worker'">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="[(dialog = !dialog), (account = item), edit = true]"
            >
              <v-icon> mdi-account-edit-outline</v-icon>
            </v-btn>
          </template>
          <span>ערוך</span>
        </v-tooltip>
        <!--
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="deleteAccount(item)">
              <v-icon> mdi-delete-alert-outline</v-icon>
            </v-btn>
          </template>
          <span>מחק</span>
        </v-tooltip>
        --->
      </template>
      <template v-slot:expanded-item="{ item, headers }">        
      <td :colspan="headers.length">
        <template v-if="item.student != null">
          <more-info-student :student.sync="item.student" />    
          <v-divider inset></v-divider>
          <v-alert type="info" outlined>
            ע"מ לערוך פרטים הקשורים לפרויקט עליך להיכנס לטבלת פרויקטים
          </v-alert>
        </template>
        <template v-else-if="item.mentor">
<more-info-to-mentor :mentor.sync="item.mentor"/>
        </template>
      </td>
    </template>
    <template v-slot:[`item.data-table-expand`]="{ item, expand, isExpanded }">
      <v-tooltip top v-if="item.type === 'student' || item.type === 'mentor'"> 
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="expand(!isExpanded)" v-bind="attrs" v-on="on">
            <v-icon
              v-text="!isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            />
          </v-btn>
        </template>
        <span
          v-text="!isExpanded ? 'פתח פרטי סטודנט' : 'סגור פרטי סטודנט'"
          v-if="item.type === 'student'"
        />
        <span
          v-text="!isExpanded ? 'פתח פרטי מנחה' : 'סגור פרטי מנחה'"
          v-else
        />
      </v-tooltip>
    </template>
    </v-data-table>    
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    }
  },
  fetch(){
    if (this.$auth.user.type === 'boss')this.headers.shift();
    else
    if(this.$auth.user.type != 'worker'){
      this.headers.pop();
    this.headers.shift();
    }
  },
  data: () => ({
    search: null,
    edit: false,
    account: {
      accountId: null,
      firstName: null,
      lastName: null,
      phone: null,
      email: null,
      sex: null,
      type: null,
      student: {
        facultyId: null,
            accountId: null,
      },
      mentor: {
        WorkLocation: null,
        Education: null,
        accountId: null,
      }
    },
    dialog: false,
    headers: [
      {
        text: "סוג חשבון",
        value: "type",
        aligen: "start"
      },
      {
        text: "מספר זהות",
        value: "accountId",
        groupable: false,
      },

      {
        text: "שם מלא",
        value: "fullName",
        groupable: false,
      },
      {
        text: "כתובת מייל",
        value: "email",
        groupable: false,
      },
      {
        text: "מספר טלפון",
        value: "phone",
        groupable: false,
      },
      {
        text: "כתובת",
        value: "addres",
        groupable: false,
      },
      {
        text: "צור קשר",
        value: "contactUs",
        sortable: false,
        groupable: false,
      },
      {
       // text: "ערוך / מחק",
       text: "ערוך",
        value: "edit",
        sortable: false,
        groupable: false,
      },
    ],
  }),
  methods: {    
    update(account){
      this.data.push(account);
      this.dialog = false;
    },
    resetAccount() {
      this.account = {
        accountId: null,
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        sex: null,
        type: null,
        student: {
        facultyID: null
      },
       mentor: {
        WorkLocation: null,
        Education: null,
        accountId: null
      }
      };
      this.edit = false
    },
    translateType(type) {
      switch (type) {
        case "student":
          return "סטודנט";
          break;
        case "mentor":
          return "מרצה";
          break;
        case "headFaculty":
          return "ראש מגמה";
          break;
        case "worker":
          return "עובד";
          break;
        case "boss":
          return "ראש מכללה";
          break;
        default:
          return "שגיאה";
          break;
      }
    },
    /*
    deleteAccount(account) {
      this.$swal({
        title: `מחיקת חשבון ${account.accountId}`,
        text: `האם אתה משוכנע שברצונך למחוק את החשבון של ${account.firstName} ${account.lastName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "מחק חשבון",
        cancelButtonText: "בטל",
        footer:
          "שים לב! החשבון והדברים המיושכים אליו ימחקו, לא ניתן לבטל פעולה זו",
      }).then(async (res) => {
        if (res.value) {
          //delete account
          const resultDelete = await this.$axios.delete(
            `accounts/${account.accountId}`
          );
          if (resultDelete.status === 200) {
            this.$swal(
              `פעולה בוצעת בהצלחה!`,
              `משתמש ${account.accountId} נמחק בהצלחה!`,
              `success`
            );
            const index = this.data.indexOf(account);
            this.data.splice(index, 1);
          }
          else 
            this.$swal(
              "כישלון במחיקת חשבון",
              `משתמש ${account.accountId} מקושר לשדות אחרים ולכן לא ניתן למוחקו. מחק את הקישורים ונסה שנית`,
              'error'
            )
        }
      });
      
    },*/
  },
};
</script>