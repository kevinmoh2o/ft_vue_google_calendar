import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/styles.scss'

//import VueGapi from 'vue-gapi'
import vue3GoogleLogin from 'vue3-google-login'


var fox = process.env.VUE_APP_CLIENT_ID;
console.log("fox",process.env);
console.log("fox",process.env.VUE_APP_CLIENT_ID);
/* const API_KEY = "AIzaSyAXl2LlmWdFv7X3-scLBw_-IccJtDaUjI0";
 */
 const elementos = {
    clientId: fox
  }
createApp(App)
    .use(vue3GoogleLogin,elementos)
    .mount('#app')


    /*
    const CLIENT_ID = "934035905155-j0pebpfv7esjsr3o4e317srudfc9ges5.apps.googleusercontent.com";
const API_KEY = "AIzaSyAXl2LlmWdFv7X3-scLBw_-IccJtDaUjI0";

 const elementos = {
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  }
    
    */

  