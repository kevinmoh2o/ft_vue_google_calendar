<template>

<div v-if="loggedIn">
  <div>
    <h2>{{usuario.name}}</h2>
    <h2>{{usuario.email}}</h2>
    <button @click="logout">logout</button>
  </div>
</div>
<div v-else>
  <GoogleLogin :callback="callback" :scope="yourScopes"/>
</div>


</template>

<script>
//import SocialVue from './components/SocialVue.vue'
import { gapi } from 'vue-gapi'
let tokenClient;
/* let gapiInited = false;
let gisInited = false; */
import {decodeCredential, googleLogout} from 'vue3-google-login';

export default {
  name: 'App',
  components: {
   // SocialVue
  },
  data(){
    return {
      loggedIn:null,
      yourScopes:"openid email profile https://www.googleapis.com/auth/calendar",
      usuario:{},
    }
  },
  setup() {
    
   /*  const gapi = useGapi()

    function login() {
      gapi.login().then(({ currentUser, gapi, hasGrantedScopes }) => {
        console.log({ currentUser, gapi, hasGrantedScopes })
      })
    }
    console.log("login",login)

    return { login } */
  },
  methods: {
    callback (response) {
      var pp = decodeCredential(response.credential);
      console.log("pp",pp);
      this.usuario = pp;
      console.log("this.usuario ",this.usuario );
      this.handleAuthClick()
      if( this.usuario){
        this.loggedIn = true
      }
    },
    logout(){
      googleLogout(),
      this.loggedIn=false
    },
    handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          /* document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh'; */
          //await listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }

  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
