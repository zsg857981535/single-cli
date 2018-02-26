// 操作github
const octokit     = require('@octokit/rest')() // github REST API
const Configstore = require('configstore') // Easily load and persist config without having to think about where and how
const pkg         = require('../package.json')
const _           = require('lodash')
const CLI         = require('clui') // Command Line UI toolkit for Node.js
const Spinner     = CLI.Spinner
const chalk       = require('chalk') // Terminal string styling done right

const inquirer    = require('./inquirer')

const conf = new Configstore(pkg.name)

module.exports = {

  getInstance: () => {
    return octokit
  },

  setGithubCredentials: async () => {
    const credentials = await inquirer.askGithubCredentials()
    octokit.authenticate(
      _.extend(
        {
          type: 'basic'
        },
        credentials
      )
    )
  },

  registerNewToken: async () => {
    const status = new Spinner('Authenticating you, please wait...')
    status.start()

    try {
      const response = await octokit.authorization.create({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'single-cli, the command-line tool for initalizing Git repos'
      })
      const token = response.data.token
      if (token) {
        conf.set('github.token', token)
        return token
      } else {
        throw new Error('Missing Token', 'Github token was not found in response')
      }
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  },

  githubAuth: (token) => {
    octokit.authenticate({
      type: 'oauth',
      token: token
    })
  },

  getStoredGithubToken: () => {
    return conf.get('github.token')
  },

  hasAccessToken: async () => {
    const status = new Spinner('Authenticating you, please wait...')
    status.start()

    try {
      const response = await octokit.authorization.getAll()
      const accessToken = _.find(response.data, (row) => {
        if (row.note) {
          return row.note.indexOf('single-cli') !== -1
        }
      })
      return accessToken
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  },

  regeneratedNewToken: async (id) => {
    const tokenUrl = 'https://github.com/settings/tokens/' + id
    console.log('Please visit ' + chalk.underline.blue.bold(tokenUrl) + ' and click the ' + chalk.red.bold('Regenerate Token Button.\n'))
    const input = await inquirer.askRegeneratedToken()
    if (input) {
      conf.set('github.token', input.token)
      return input.token
    }
  }

}
