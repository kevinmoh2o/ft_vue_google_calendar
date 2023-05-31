/* eslint-disable no-unused-vars, no-undef */
/* class GoogleAuth {
  constructor(clientId, scopes) {
    this.clientId = clientId;
    this.scopes = scopes;
    this.tokenClient = null;
    this.isAuthorized = false;
    this.gisInited = 
  }

  async initTokenClient() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: this.scopes,
      callback: '',
    });
    console.log("tokenClient",tokenClient);
    gisInited = true;
    this.maybeEnableButtons();
  }

  async handleTokenResponse(resp) {
    if (resp.error !== undefined) {
      throw resp;
    }

    this.isAuthorized = true;
    // Realiza las acciones necesarias después de la autorización exitosa
    // ...

    await this.listUpcomingEvents();
  }

  async requestAccessToken(prompt = '') {
    if (gapi.client.getToken() === null) {
      this.tokenClient.requestAccessToken({ prompt });
    } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
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
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }

    const output = events.reduce(
      (str, event) =>
        `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n'
    );
    document.getElementById('content').innerText = output;
  }

  // Otros métodos y funciones necesarios
  // ...
}

export default GoogleAuth;
 */


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

  gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '',
    });
    console.log("this.tokenClient",this.tokenClient);
    this.gisInited = true;
    this.maybeEnableButtons();
  }

  maybeEnableButtons() {
    if (this.gapiInited && this.gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  }

  gapiLoaded() {
    gapi.load('client', this.initializeGapiClient.bind(this));
  }

  async initializeGapiClient() {
    await gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });
    this.gapiInited = true;
    this.maybeEnableButtons();
  }

  handleAuthClick() {
    this.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      await this.listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
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
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }
    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n'
    );
    document.getElementById('content').innerText = output;
  }

  async grabar() {
    const event = {
      summary: 'Google I/O 2023',
      location: '800 Howard St., San Francisco, CA 94103',
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: '2023-05-31T09:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: '2023-05-31T17:00:00-07:00',
        timeZone: 'America/Los_Angeles',
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