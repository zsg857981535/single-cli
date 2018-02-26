// 交互问题
const inquirer = require('inquirer')
const files    = require('./files')

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
    const argv = require('minimist')(process.argv.slice(2)) // parse argument options

    const questions = [
      {
        name: 'name',
        type: 'input',
        message: 'Enter a name for the repository:',
        default: argv._[0] || files.getCurrentDirectoryBase(),
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
        default: argv._[1] || null,
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
    const questions = [
      {
        name: 'template',
        type: 'list',
        message: 'Select template type will be generated',
        choices: [ 'h5', 'server', 'web' ],
        default: 'h5'
      }
    ]
    return inquirer.prompt(questions)
  }
}