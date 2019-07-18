# sending-mail

script to send mails with generated messages from templates

## Prerequirements

- install Node.js v10.16.0
  - see .node-version
- install yarn latest version
  - https://yarnpkg.com/ja/docs/install

## Getting Started

- clone this repo
- cd your working directory
- `yarn`
- open the displayed URL and issue token as sender if this script requests

## Before Sending Mails

Check your quota units: https://developers.google.com/gmail/api/v1/reference/quota

In 2019/06/24, take notice of the following limits.

> - Daily Usage: 1,000,000,000 quota units per day
> - Per User Rate Limit: 250 quota units per user per second, moving average (allows short bursts)
> - Per-method quota usage messages.send: 100

And GMail has the limit to send messages: https://support.google.com/a/answer/166852

> - Messages per day Daily sending limit: 2,000 (500 for trial accounts)

## Check List To Send Mails

- check credentials.json
  - issue from: https://developers.google.com/gmail/api/quickstart/nodejs
- check sender: token.json
  - skip this step if token.json does not exist
- check list.csv
  - see list.csv.sample for the format
- check mail-template.yml
  - check subject
  - check from
  - check replyTo
  - check body
  - syntax `${thisIsExpanded}` expands to values from program
    - available variables
      - familyName
      - personalName
      - mailAddress
  - see mail-template.yml.sample for the format
- check / delete sent-list
  - skip sending mails if mail addresses are listed in sent-list
- tell team members to be getting sending mails
- `yarn start`
- check error-log
  - error information are redirected to this file
- check your mail box
  - undelivered mails are sent to your mail box

## Refer

https://developers.google.com/gmail/api/quickstart/nodejs?hl=JA
