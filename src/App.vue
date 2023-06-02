<template>
  
  <p>Google Calendar API Quickstart</p>

    <button id="authorize_button" v-if="flagAutorizedBtn" :onclick="handleAuthClick">Authorize</button>
    <button id="signout_button" :onclick="handleSignoutClick">Sign Out</button>
    <button id="grabar" :onclick="grabar">grabar</button>
    <button id="grabar" :onclick="execute">execute</button>
    <button :onclick="getById">GET by ID</button>

    <pre id="content" style="white-space: pre-wrap;"></pre>

</template>

<script>

import GoogleCalendarAPI from './api/GoogleCalendarAPI';


export default {
  data() {
    return {
      apiKey: process.env.VUE_APP_API_KEY,
      clientId: process.env.VUE_APP_CLIENT_ID,
      discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
      scopes: 'https://www.googleapis.com/auth/calendar.readonly',
      isAuthorized: false,
      events: [],
      googleAuth: null,
      flagAutorizedBtn:false
    };
  },
  async created() {
    this.googleAuth = new GoogleCalendarAPI(process.env.VUE_APP_CLIENT_ID,process.env.VUE_APP_API_KEY);
      //console.log("created")
      
      var inicioLoaded = await this.googleAuth.gisLoaded();
      //console.log("inicioLoaded: ",inicioLoaded);
      var iniciGapi = await this.googleAuth.gapiLoaded();
      //console.log("iniciGapi: ",iniciGapi);
      if(inicioLoaded && iniciGapi) this.flagAutorizedBtn=true;
      //this.googleAuth.iniciar()
      
    },
  methods: {
    async handleAuthClick() {
      var cogerToken = await this.googleAuth.handleAuthClick();
      console.log("cogerToken",cogerToken);
    },
    handleSignoutClick() {
      this.googleAuth.handleSignoutClick();
    },

    async grabar(){

    },
    async getById(){
      //this.googleAuth.getEventById();
      //this.googleAuth.getToken()
      await this.googleAuth.authenticate().then(()=>{
        var bb = this.googleAuth.loadClient();
        console.log("bb",bb)
      })
    },
    async execute(){
      this.googleAuth.execute()
    }
  },
};
</script>