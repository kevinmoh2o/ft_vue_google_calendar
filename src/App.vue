<template>
  <div>
    <p>Google Calendar API Quickstart</p>

    <button v-if="isAuthorized" @click="handleSignoutClick">Sign Out</button>
    <button v-else @click="handleAuthClick">Authorize</button>

    <pre>{{ events }}</pre>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiKey: process.env.VUE_APP_API_KEY,
      clientId: process.env.VUE_APP_CLIENT_ID,
      discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
      scopes: 'https://www.googleapis.com/auth/calendar.readonly',
      isAuthorized: false,
      events: [],
    };
  },
  mounted() {
    this.loadGoogleAPI();
  },
  methods: {
    loadGoogleAPI() {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = this.handleGoogleAPILoaded;
      document.body.appendChild(script);
    },
    handleGoogleAPILoaded() {
      window.gapi.load('client:auth2', this.initGoogleClient);
    },
    initGoogleClient() {
      window.gapi.client
        .init({
          apiKey: this.apiKey,
          clientId: this.clientId,
          discoveryDocs: [this.discoveryDoc],
          scope: this.scopes,
        })
        .then(() => {
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
          this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    },
    updateSigninStatus(isSignedIn) {
      this.isAuthorized = isSignedIn;
      if (isSignedIn) {
        this.listUpcomingEvents();
      }
    },
    handleAuthClick() {
      window.gapi.auth2.getAuthInstance().signIn();
    },
    handleSignoutClick() {
      window.gapi.auth2.getAuthInstance().signOut();
    },
    listUpcomingEvents() {
      window.gapi.client.calendar.events
        .list({
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        })
        .then(response => {
          const events = response.result.items;
          if (events.length > 0) {
            this.events = events.map(event => `${event.summary} (${event.start.dateTime || event.start.date})`);
          } else {
            this.events = 'No events found.';
          }
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    },
  },
};
</script>
