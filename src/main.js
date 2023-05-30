import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/styles.scss'

//import VueGapi from 'vue-gapi'
//import vue3GoogleLogin from 'vue3-google-login'
import GAuth from 'vue3-google-oauth2'


var CLIENT_ID = process.env.VUE_APP_CLIENT_ID;
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

  const gAuthOptions = { clientId: CLIENT_ID, scope: SCOPES, prompt: 'consent', fetch_basic_profile: false }
createApp(App)
    .use(GAuth,gAuthOptions)
    .mount('#app')
