#!/usr/bin/env node

/*
  todo list
  github鉴权
  选择生成项目类型:  h5, server, web
  填写仓库名称
  填写仓库描述
  创建本地文件夹, 拉取模板
  创建远程仓库, 添加本地init commit
  push init commit到远程仓库
*/

const chalk     = require('chalk')
const clear     = require('clear')
const figlet    = require('figlet')

const github    = require('./lib/github')
const repo      = require('./lib/repo')
const files     = require('./lib/files')
const template  = require('./lib/template')


clear()
console.log(
  chalk.yellow(
    figlet.textSync('single', { horizontalLayout: 'full' })
  )
)

if (files.directoryExists('.git')) {
  console.log(chalk.red('Already a git repository!'))
  process.exit()
}

const getGithubToken = async () => {
  // Fetch token from config store
  let token = github.getStoredGithubToken()
  if (token) {
    return token
  }
  // No token found, use credentials to access github account
  await github.setGithubCredentials()

  // Check if access token for single-cli was registered
  const accessToken = await github.hasAccessToken()
  if (accessToken) {
    console.log(chalk.yellow('An existing access token has been found!'))
    // ask user to regenerate a new token
    token = await github.regenerateNewToken(accessToken.id)
    return token
  }
  // No access token found, register one now
  token = await github.registerNewToken()
  return token
}

const run = async () => {
  try {
    // Retrieve & Set Authentication token
    const token = await getGithubToken()
    github.githubAuth(token)
    console.log(
      chalk.green('Sucessfully authenticated!')
    )
    // TODO git clone remote template repository to local
    const clone_done = await template.fetchRemoteTempalte()
    if (clone_done) {
      console.log(chalk.green('Template clone sucessfully'))
    }

    // Create remote repository
    const url = await repo.createRemoteRepo()

    // Setup local repository and push to remote
    const done = await repo.setupRepo(url)
    if (done) {
      console.log(chalk.green('All done'))
    }
  } catch (err) {
    if (err) {
      switch (err.code) {
        case 401:
          console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'))
          break
        case 422:
          console.log(chalk.red('There already exists a remote repository with the same name'))
          break
        default:
          console.log(err)
      }
    }
  }
}

run()