import benchmark from 'benchmark';
import arg from 'arg';
import commandLineArgs from 'command-line-args';
import minimist from 'minimist';
import mri from 'mri';
import yargs from 'yargs-parser';
import parseArgs from '../index.js';

const argv = ['public', '--host=0.0.0.0', '--port', '8080', '-d'];

new benchmark.Suite()
  .add('arg', () => {
    arg(
      {
        '--host': String,
        '--port': Number,
        '--debug': Boolean,
        '-d': '--debug',
        '-p': '--port'
      },
      { argv }
    );
  })
  .add('command-line-args', () => {
    commandLineArgs(
      [
        { name: 'host', type: String },
        { name: 'port', alias: 'p', type: Number },
        { name: 'debug', alias: 'd', type: Boolean }
      ],
      { argv, partial: true }
    );
  })
  .add('minimist', () => {
    minimist(argv, { alias: { d: 'debug', p: 'port' } });
  })
  .add('mri', () => {
    mri(argv, { alias: { d: 'debug', p: 'port' } });
  })
  .add('yargs-parser', () => {
    yargs(argv, { alias: { d: 'debug', p: 'port' } });
  })
  .add('@lukecjohnson/args', () => {
    parseArgs({
      argv,
      flags: {
        host: {
          type: 'string'
        },
        port: {
          type: 'number',
          shorthand: 'p'
        },
        debug: {
          type: 'boolean',
          shorthand: 'd'
        }
      }
    });
  })
  .on('cycle', (e) => console.log(String(e.target)))
  .run();
