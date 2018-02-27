// 交互问题
const inquirer     = require('inquirer')
const files        = require('./files')
const template     = require('../config/template.json')

module.exports = {

  askGithubCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your Github username or e-mail address:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter your username or e-mail address:'
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter your password:'
          }
        }
      }
    ]
    return inquirer.prompt(questions)
  },

  askRegeneratedToken: () => {
    const questions = [
      {
        name: 'token',
        type: 'input',
        message: 'Enter your new regenerated token:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter your new regenerated token:'
          }
        }
      }
    ]
    return inquirer.prompt(questions)
  },

  askRepoDetails: () => {
    // const argv = require('minimist')(process.argv.slice(2)) // parse argument options
    const questions = [
      {
        name: 'name',
        type: 'input',
        message: 'Enter a name for the repository:',
        default: files.getCurrentDirectoryBase(),
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter a name for the repository:'
          }
        }
      },
      {
        name: 'description',
        type: 'input',
        default: null,
        message: 'Optionally enter a description of the repository:'
      }
    ]
    return inquirer.prompt(questions)
  },

  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components']
      }
    ]
    return inquirer.prompt(questions)
  },

  askTemplateType: () => {
    const list = template.list
    const names = list.map(t => t.name)
    const questions = [
      {
        name: 'template',
        type: 'list',
        message: 'Select template type will be generated',
        choices: names,
        default: names[0]
      }
    ]
    return inquirer.prompt(questions)
  }
}