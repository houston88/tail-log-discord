## Simple Log Tailer to Discord Webhook

Tails a file and sends newlines to discord webhook POST.<br>
I'm using to tail minecraft server to get notifications on activity.

## .env Contents

    LOG_TO_TAIL=/path/to/file/my.log
    DISCORD_WEBHOOK_HOST=discord.com
    DISCORD_WEBHOOK_PATH=/api/webhooks/<webhook id>/<webhook token>

## Running

     npm i
     npm start
       or
     node index.js

### About discord webhooks

https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks<br>
https://discord.com/developers/docs/resources/webhook

### Libraries

- @logdna/tail-file
- dotenv
