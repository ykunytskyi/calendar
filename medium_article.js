const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  "YOUR_CLIENT_ID",
  "YOUR_CLIENT_SECRET",
);
const { tokens } = await oAuth2Client.getToken(code);
oAuth2Client.setCredentials({
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
});

// access all of todays events
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

var now = new Date();
var dateStr = now.toISOString().split("T")[0];

// Set timeMin to start of the day and timeMax to end of the day in ISO format
var timeMin = dateStr + "T00:00:00Z";
var timeMax = dateStr + "T23:59:59Z";
const res = await calendar.events.list({
  calendarId: "primary",
  timeMin,
  timeMax,
  maxResults: 20,
  singleEvents: true,
  orderBy: "startTime",
});
// now you have events in res.data.items
