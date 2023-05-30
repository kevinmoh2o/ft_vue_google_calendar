<template>
  <!-- <div>
    <p>Google Calendar API Quickstart</p>

    <button v-if="isAuthorized" @click="handleSignoutClick">Sign Out</button>
    <button v-else @click="handleAuthClick">Authorize</button>

    <pre>{{ events }}</pre>
  </div> -->
  <p>Google Calendar API Quickstart</p>

    <!--Add buttons to initiate auth sequence and sign out-->
    <button id="authorize_button" :onclick="handleAuthClick">Authorize</button>
    <button id="signout_button" :onclick="handleSignoutClick">Sign Out</button>
    <button id="grabar" :onclick="grabar">grabar</button>

    <pre id="content" style="white-space: pre-wrap;"></pre>

</template>

<script>
/* eslint-disable no-unused-vars, no-undef */
  const CLIENT_ID = '934035905155-j0pebpfv7esjsr3o4e317srudfc9ges5.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyAXl2LlmWdFv7X3-scLBw_-IccJtDaUjI0';

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;


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
  created() {
      console.log("created")
      this.gisLoaded();
      this.gapiLoaded()
      /* loadScript('https://apis.google.com/js/api.js', gapiLoaded);
      loadScript('https://accounts.google.com/gsi/client', gisLoaded); */
    },
  mounted() {
    //this.loadGoogleAPI();
  },
  methods: {
    gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
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
      },
      handleAuthClick() {
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
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      },
      handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('content').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        }
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
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }

        const events = response.result.items;
        if (!events || events.length == 0) {
          document.getElementById('content').innerText = 'No events found.';
          return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n');
        document.getElementById('content').innerText = output;
      },
      async grabar(){
        // Refer to the JavaScript quickstart on how to setup the environment:
        // https://developers.google.com/calendar/quickstart/js
        // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
        // stored credentials.

        const event = {
          'summary': 'Google I/O 2023',
          'location': '800 Howard St., San Francisco, CA 94103',
          'description': 'A chance to hear more about Google\'s developer products.',
          'start': {
            'dateTime': '2023-05-28T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': '2023-05-28T17:00:00-07:00',
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
          //appendPre('Event created: ' + event.htmlLink);
        });


      }







    /* loadGoogleAPI() {
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
    }, */
  },
};
</script>
