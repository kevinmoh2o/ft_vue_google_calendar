/* eslint-disable no-unused-vars, no-undef */

class GoogleCalendarAPI {
  constructor() {
    this.CLIENT_ID = process.env.VUE_APP_CLIENT_ID;
    this.API_KEY = process.env.VUE_APP_API_KEY;
    this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    this.SCOPES = 'https://www.googleapis.com/auth/calendar';
    this.tokenClient = null;
    this.gapiInited = false;
    this.gisInited = false;
  }

  async gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '',
    });
    console.log("this.tokenClient",this.tokenClient);
    console.log("this.tokenClient",google);
    this.gisInited = true;
    //this.maybeEnableButtons();
    return true;
  }

  /* maybeEnableButtons() {
    if (this.gapiInited && this.gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  } */

  async gapiLoaded() {
    gapi.load('client', await this.initializeGapiClient.bind(this));
    return true;
  }

  async initializeGapiClient() {
    await gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });
    this.gapiInited = true;
    //this.maybeEnableButtons();
  }

  async handleAuthClick() {
    this.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      ////document.getElementById('signout_button').style.visibility = 'visible';
      ////document.getElementById('authorize_button').innerText = 'Refresh';
      await this.listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
    return this.tokenClient;
  }

  handleSignoutClick() {
    const token = gapi.client.getToken();
    console.log("Sing out token: ",token);
    if (token !== null) {
      var verSalida = google.accounts.oauth2.revoke(token.access_token);
      console.log("Sing out token: ",verSalida);

      gapi.client.setToken('');
      //document.getElementById('content').innerText = '';
      //document.getElementById('authorize_button').innerText = 'Authorize';
      //document.getElementById('signout_button').style.visibility = 'hidden';
    }
  }

  async listUpcomingEvents() {
    let response;

    try {
      const request = {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
      console.log('response GET', response);
    } catch (err) {
      //document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      //document.getElementById('content').innerText = 'No events found.';
      return;
    }
    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n'
    );
    //document.getElementById('content').innerText = output;
  }

  async grabar() {
    const event = {
      summary: 'Google I/O 2023',
      location: '800 Howard St., San Francisco, CA 94103',
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: '2023-05-31T11:00:00-05:00',
        timeZone: 'America/Lima',
        },
        end: {
        dateTime: '2023-05-31T19:00:00-05:00',
        timeZone: 'America/Lima',
      },
      recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
      attendees: [
        { email: 'lpage@example.com' },
        { email: 'sbrin@example.com' },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    const request = gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    request.execute(function (event) {
      console.log('event', event);
    });
  }
}


export default GoogleCalendarAPI;