/* eslint-disable no-unused-vars, no-undef */

class GoogleCalendarAPI {
  constructor(clientId,apiKey) {
    this.CLIENT_ID = clientId;
    this.API_KEY = apiKey;
    this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    this.SCOPES = 'https://www.googleapis.com/auth/calendar';
    this.tokenClient = null;
    this.gapiInited = false;
    this.gisInited = false;
    this.accessTokenKey = 'google_access_token';
    this.access_token="";
  }

  async gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: this.tokenCallback.bind(this),
    });
    /* const storedToken = localStorage.getItem(this.accessTokenKey);
    console.log("storedToken",storedToken)
    if (storedToken!=='undefined' && storedToken!==null) {
      this.tokenClient.setToken(JSON.parse(storedToken));
    } */
    console.log("this.tokenClient",this.tokenClient);
    //console.log("this.tokenClient",google);
    //this.gisInited = true;
    //this.maybeEnableButtons();
    return true;
  }

  tokenCallback(credentials) {
    // Implementa tu lógica aquí
    console.log("credentials",credentials)
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
  getToken() {
    this.tokenClient.requestAccessToken();
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
    console.log("this.tokenClient: ",this.tokenClient);

    if (gapi.client.getToken() === null) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
      console.log("Con consentimieto")

    } else {
      //this.tokenClient.requestAccessToken({ prompt: '' });
      this.tokenClient.requestAccessToken();
      console.log("Sin consentimieto")
    }
    localStorage.setItem(this.accessTokenKey, JSON.stringify(gapi.client.getToken()));

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
    localStorage.removeItem(this.accessTokenKey);
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


  async getEventById() {
    return await gapi.client.calendar.events.get({
      "calendarId": "primary",
      "eventId": "7ju1lp5j4ssq4i8vnhntou8k7r"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
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

  async authenticate() {
    console.log('gapi.auth2', gapi.auth2);    
    return await gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  async iniciar(){
    
    console.log("iniciar")
    gapi.load("client", await this.initializeGapiClient.bind(this));
  }

  loadClient() {

    gapi.client.setApiKey(this.API_KEY);
    console.log("loadclient")
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); console.log("gapi.client",gapi.client);},
              function(err) { console.error("Error loading GAPI client for API", err); });
  }

  execute() {
    return gapi.client.calendar.events.get({
      "calendarId": "primary",
      "eventId": "7ju1lp5j4ssq4i8vnhntou8k7r"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }


}




//gapi.load('client', await this.initializeGapiClient.bind(this));


export default GoogleCalendarAPI;