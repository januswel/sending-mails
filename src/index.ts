import parse from 'csv-parse/lib/sync'
import yaml from 'js-yaml'
import fs from 'fs'

import { authorize, sendMail } from './google'
import buildMessage from './rfc2822'
import generateBody from './util/template'
import loadFile from './util/file'
import doTasksUnderRateLimitPerTime from './util/rate-limit'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send']
const TEMPLATE_PATH = './mail-template.yml'
const DESTINATION_LIST_PATH = './list.csv'
const SENT_LIST_PATH = './sent-list'
const RATE_LIMIT = 1

interface Destination {
  familyName: string
  personalName: string
  mailAddress: string
}

const loadTemplate = () => {
  const template = yaml.safeLoad(loadFile(TEMPLATE_PATH))
  if (!template.from) {
    throw new Error(`Specify From in ${TEMPLATE_PATH}`)
  }
  if (!template.subject) {
    throw new Error(`Specify Subject in ${TEMPLATE_PATH}`)
  }
  if (!template.body) {
    throw new Error(`Specify Body in ${TEMPLATE_PATH}`)
  }

  return template
}

const main = () => {
  const template = loadTemplate()
  const allDestinations = parse(loadFile(DESTINATION_LIST_PATH), {
    columns: true,
  })
  const sentList = new Set(loadFile(SENT_LIST_PATH).split(/\n/))
  let skipped = 0

  const destinations = allDestinations.filter((destination: Destination) => {
    const { mailAddress } = destination
    if (sentList.has(mailAddress)) {
      process.stderr.write(`skipping ${mailAddress}\n`)
      ++skipped
      return false
    }
    return true
  })

  authorize(SCOPES).then(client =>
    doTasksUnderRateLimitPerTime(
      (destination: Destination, index: number) => {
        const { familyName, personalName, mailAddress } = destination

        process.stdout.write(`\rsending ${index + 1} / ${destinations.length}: ${mailAddress}`)

        const body = generateBody(template.body, { familyName, personalName, mailAddress })
        const message = buildMessage({
          headers: {
            from: template.from,
            to: [
              {
                displayName: `${familyName} ${personalName}`,
                mailAddress: mailAddress,
              },
            ],
            replyTo: Array.isArray(template.replyTo) ? template.replyTo : [template.replyTo],
            subject: template.subject,
          },
          body,
        })

        return sendMail(client, message)
          .then(res => {
            fs.appendFileSync(SENT_LIST_PATH, `${mailAddress}\n`)
            return res
          })
          .catch(err => {
            console.error(err)
            console.error(destination)
          })
      },
      RATE_LIMIT,
      destinations,
    )
      .then(responses => {
        process.stdout.write(`\n${responses.length} mails are sent: ${skipped} mails are skipped\n`)
      })
      .catch(() => {
        process.stdout.write('\nsome destinations are not sent mails: see error-log\n')
      })
      .finally(() => {
        process.stdout.write('finished!!\n')
      }),
  )
}

try {
  main()
} catch (e) {
  process.stderr.write(e.message)
}
