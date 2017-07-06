#!/usr/bin/env node

import yargs from 'yargs'

import {promisify} from 'util'
import fs from 'fs'

import {bootstrap} from '../index'
import * as hash from '../helpers/hash'

const readFile = promisify(fs.readFile)

export const argv = yargs
  .command('start', 'start IoT', (yargs) => {
    yargs.option('config', {
      alias: 'c',
      describe: 'configuration file to use'
    })
  }, async (argv) => {
    const params = {}

    if (argv.config) {
      try {
        const content = await readFile(argv.config)
        const parsed = JSON.parse(content)
        params.config = parsed
      } catch (err) {
        console.log('invalid configuration file')
        process.exit(1)
      }
    }

    bootstrap(params)
  })
  .command('hash <password>', 'hash the password', (yargs) => {
  }, async (argv) => {
    const hashed = await hash.hash(argv.password)
    console.log(hashed)
  })
  .demandCommand(1, 'must provide a valid command')
  .help()
  .argv
