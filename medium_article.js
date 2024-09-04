import { google } from "googleapis";

console.log(">>> initting client");
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage",
);
console.log(">>> client initted, gettings tokens");

const { tokens } = await oAuth2Client.getToken(
  // code after granting consent on web
  "",
);
console.log(">>> got tokens:", tokens);

console.log(">>> setting credentials");
oAuth2Client.setCredentials({
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
});
console.log(">>> credentials set");

console.log(">>> cerating calendar with oauth client");
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
console.log(">>> calendar created");

var now = new Date();
var dateStr = now.toISOString().split("T")[0];

// Set timeMin to start of the day and timeMax to end of the day in ISO format
var timeMin = dateStr + "T00:00:00Z";
var timeMax = dateStr + "T23:59:59Z";
console.log(">>> listing events");
const res = await calendar.events.list({
  calendarId: "primary",
  timeMin,
  timeMax,
  maxResults: 10,
  singleEvents: true,
  orderBy: "startTime",
});
// now you have events in res.data.items
console.log("res:", res.data.items);
