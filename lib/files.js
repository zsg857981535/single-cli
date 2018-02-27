// 操作文件夹
'use strict'

const fs        = require('fs')
const path      = require('path')
const rimraf    = require('rimraf')
const chalk     = require('chalk')

module.exports = {
  getCurrentDirectoryBase : () => {
    return path.basename(process.cwd())
  },

  directoryExists : function (filePath) {
    try {
      return fs.statSync(filePath).isDirectory()
    } catch (err) {
      return false
    }
  },

  createDirectory: (filePath) => {

  },

  removeDirectory: function (filePath) {
    try {
      if (this.directoryExists(filePath)) {
        rimraf(filePath, (err) => {
          if (err) {
            console.log(
              chalk.red(err)
            )
            process.exit()
          } else {
            // console.log(
            //   chalk.green('Delete .git successfully\n')
            // )
          }
        })
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }
}