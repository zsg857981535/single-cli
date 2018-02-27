// 远程仓库管理
const _           = require('lodash')
const fs          = require('fs')
const git         = require('simple-git')() // A light weight interface for running git commands in any node.js application.
const CLI         = require('clui')
const Spinner     = CLI.Spinner
const touch       = require('touch')

const inquirer    = require('./inquirer')
const gh          = require('./github')
const files       = require('./files')

module.exports = {

  createRemoteRepo: async () => {
    const github = gh.getInstance()
    const answers = await inquirer.askRepoDetails()

    const data = {
      name: answers.name,
      description: answers.description,
      private: (answers.visibility === 'private')
    }

    const status = new Spinner('Creating remote respository...')
    status.start()

    try {
      const response = await github.repos.create(data)
      // return response.data.ssh_url
      return response.data.clone_url
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  },

  createGitignore: async () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore')

    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist)
      if (answers.ignore.length) {
        fs.writeFileSync( '.gitignore', answers.ignore.join( '\n' ) )
      } else {
        touch( '.gitignore' )
      }
    } else {
      touch('.gitignore')
    }
  },

  setupRepo: async (url) => {
    const status = new Spinner('Initializing local repository and pushing to remote...')
    status.start()
    // console.log('===now===', process.cwd())
    // Changing git work directory
    const now = require('simple-git')(process.cwd())
    try {
      await now
        .init()
        .add('./*')
        .commit('Initial commit')
        .addRemote('origin', url)
        .push('origin', 'master')
      return true
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  }

}