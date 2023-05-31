<template>
  
  <p>Google Calendar API Quickstart</p>

    <button id="authorize_button" :onclick="handleAuthClick">Authorize</button>
    <button id="signout_button" :onclick="handleSignoutClick">Sign Out</button>
    <button id="grabar" :onclick="grabar">grabar</button>

    <pre id="content" style="white-space: pre-wrap;"></pre>

</template>

<script>
/* eslint-disable no-unused-vars, no-undef */
  const CLIENT_ID = process.env.VUE_APP_CLIENT_ID;
  const API_KEY = process.env.VUE_APP_API_KEY;
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';
  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

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
    };
  },
  async created() {
      console.log("created")
      /* this.gisLoaded();
      this.gapiLoaded() */
      this.googleAuth = new GoogleCalendarAPI();
      await this.googleAuth.gisLoaded();
      await this.googleAuth.gapiLoaded();
    },
  methods: {
    handleAuthClick() {
      this.googleAuth.handleAuthClick();
    },
    /* gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '',
        });
        console.log("tokenClient",tokenClient);
        gisInited = true;
        this.maybeEnableButtons();
      },
    maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById('authorize_button').style.visibility = 'visible';
        }
      },
      gapiLoaded() {
        gapi.load('client', this.initializeGapiClient);
      },
      async initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        this.maybeEnableButtons();
      }, */
      /* handleAuthClick() {
                  console.log("handleAuthClick")
        tokenClient.callback = async (resp) => {
          console.log("resp",resp)

          if (resp.error !== undefined) {
            throw (resp);
          }
          console.log("tokenClient handleAuthClick",tokenClient)
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
          await this.listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          tokenClient.requestAccessToken({prompt: ''});
        }
      }, */
      handleSignoutClick() {
        this.googleAuth.handleSignoutClick();
        /* const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('content').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        } */
      },
      async listUpcomingEvents() {
        let response;

        try {
          const request = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
          };
          response = await gapi.client.calendar.events.list(request);
          console.log("response GET",response);
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }

        const events = response.result.items;
        if (!events || events.length == 0) {
          document.getElementById('content').innerText = 'No events found.';
          return;
        }
        const output = events.reduce(
            (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n');
        document.getElementById('content').innerText = output;
      },
      async grabar(){

        const event = {
          'summary': 'Google I/O 2023',
          'location': '800 Howard St., San Francisco, CA 94103',
          'description': 'A chance to hear more about Google\'s developer products.',
          'start': {
            'dateTime': '2023-05-31T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': '2023-05-31T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'attendees': [
            {'email': 'lpage@example.com'},
            {'email': 'sbrin@example.com'}
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        };

        const request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event
        });

        request.execute(function(event) {
          console.log("event",event)
        });


      }
  },
};
</script>