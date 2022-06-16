# Setup Guide

1. Open your Line and add our Line BOT (line_id: `@723zglee`) as your friend :) 
2. Type `!id: $YOUR_LINE_ID` to register our service.
3. Login by any account in our web app (https://nmlab-securitycam-web.vercel.app/). When first time login, it will ask you to input your LINE_ID to link account to database. Please type EXACT the same LINE_ID as you type in the second step.
4. Finish! Browse your historical snapshots or alert photo in dashboard page!

# Usage

Here are all the commands you can type in chat room to our Line Bot.

| COMMAND                        | Description                                       | 
| ------------------------------ | ------------------------------------------------- | 
| `!id: $YOUR_LINE_ID`           | Initialize our service                            | 
| `!snapshot`                    | Get a snapshot                                    | 
| `!alert: 1/0`               | Type 1 to enable alert feature, 0 for disable        | 
| `!whitelist: 1/0`           | Type 1 to enable whitelist feature, 0 for disable    | 
| `!whitelist`+ Send image     | Add target (image) to whitelist                     | 
| `!streaming_key: $YOUR_KEY` | Enable private youtube stream feature for you to watch                    |
| `!stream: 1/0`      | Type 1 to start streaming, 0 for disable | 
