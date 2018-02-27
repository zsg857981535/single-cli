// 拉取远程仓库模板
const git      = require('simple-git')()
const fs       = require('fs')
const _        = require('lodash')
const CLI      = require('clui')
const chalk    = require('chalk')
const Spinner  = CLI.Spinner

const template = require('../config/template.json')
const inquirer = require('./inquirer')
const files    = require('./files')

module.exports = {

  fetchRemoteTempalte: async () => {
    const answer = await inquirer.askTemplateType()
    const clone_url = _.find(template.list, t => t.name === answer.template).clone_url
    // Using single-cli -n workingDirectory
    const argv = require('minimist')(process.argv.slice(1)) // parse argument options
    const workingDirectory = argv.n
    // git clone -> delete .git
    const status = new Spinner('Cloning remote template repository, wait...')
    try {
      status.start()
      await git
        .clone(clone_url, workingDirectory)
      // console.log(`New directory: ${process.cwd()}`)
      process.chdir(workingDirectory)
      files.removeDirectory('.git')
      return true
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  }
}