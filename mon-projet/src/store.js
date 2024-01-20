// store.js
import { reactive } from 'vue';

export const store = reactive({
  isLoggedIn: false,
  errorMessage: {
    visible: false,
    message: ''
  },
  fieldMap: {
    "MEP Name": "mep_name",
    "MEP nationalPoliticalGroup": "national_political_group",
    "MEP politicalGroup": "political_group",
    "Title": "title",
    "Place": "place",
    "Date": "date",
    "Meeting With": "meeting_with",
    "Meeting Related to Procedure": "meeting_related_to_procedure",
  }
});
