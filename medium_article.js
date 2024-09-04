import { calendar_v3, google } from "googleapis";
import http from "http";

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage",
);

const { tokens } = await oAuth2Client.getToken(
  // code after granting consent on web
  "",
);

oAuth2Client.setCredentials({
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
});

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
calendar.events.watch({
  calendarId: "primary",
  requestBody: {
    id: "unique-channel-id-" + new Date().getTime(),
    type: "web_hook",
    address: "https://96ed-46-118-187-83.ngrok-free.app",
    params: {
      ttl: 120, // seconds to live
    },
  },
});

/** @param {calendar_v3.Calendar} calendar */
async function getEventsList(calendar) {
  let now = new Date();
  let dateStr = now.toISOString().split("T")[0];
  let timeMin = dateStr + "T00:00:00Z";
  let timeMax = dateStr + "T23:59:59Z";
  return calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
    maxResults: 5,
    singleEvents: true,
    orderBy: "startTime",
  });
}

http
  .createServer(async function (_, res) {
    // get new list after detecting change
    const list = await getEventsList(calendar);
    console.log("list:", list.data.items);

    res.write("OK");
    res.end();
  })
  .listen(8080);
