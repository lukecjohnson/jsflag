# @lukecjohnson/args

A fast command-line argument parser with type checking, 
shorthand flags, default values, and help text generation


## Installation

```
npm install @lukecjohnson/args
```

*Note: `@lukecjohnson/args` is an ESM-only package*


## Usage

### Options

`parseArgs` accepts an `options` object that can be used to define flags and 
customize its behavior. The following options are available:

- `flags`: An object defining the flags the program or command accepts. Each 
  entry's key is a flag name that can be used with a double hyphen on the 
  command line (`--example`) and its value is an object further describing the 
  flag with the following properties:
  - `type`: A string indicating the expected type of the flag's value 
    ("string", "number", or "boolean")
  - `default`: The default value assigned to the flag if no value is provided by
    the end-user
  - `shorthand`: A single-letter alias that can be used with a single hyphen on
    the command line
  - `description`: A short description of the flag to be included in the
    generated help text
- `argv`: An array of raw arguments to be parsed (Default: `process.argv.slice(2)`)
- `usage`: The general usage pattern of the program or command to be included
  in the generated help text
- `disableHelp`: When `true`, the built-in `--help` and `-h` flags are
  disabled (Default: `false`)
- `stopAtPositional`: When `true`, all arguments after the first positional,
  non-flag argument are pushed to `result.args` (Default: `false`)


### Result

`parseArgs` returns an object containing `args` and `flags`:

- `args`: An array of non-flag arguments provided by the end-user
- `flags`: An object containing the values of flags provided by the end-user or 
  their default values


### Example

```js
import parseArgs from '@lukecjohnson/args';

const { args, flags } = parseArgs({
  flags: {
    host: {
      type: 'string',
      description: 'Hostname to bind',
      default: 'localhost',
    },
    port: {
      type: 'number',
      shorthand: 'p',
      description: 'Port to bind',
      default: 3000,
    },
    debug: {
      type: 'boolean',
      shorthand: 'd',
      description: 'Show debugging information',
      default: false,
    }
  },
  usage: 'node serve.js [directory] [flags]'
});

console.log({ args, flags });
```

```console
$ node serve.js public --host 0.0.0.0 --port=8080 -d

{
  args: ['public'],
  flags: {
    host: '0.0.0.0',
    port: 8080,
    debug: true
  }
}
```

```console
$ node serve.js --help

Usage:
  node serve.js [directory] [flags]

Flags:
  --host                Hostname to bind (Default: "localhost")
  -p, --port            Port to bind (Default: 3000)
  -d, --debug           Show debugging information (Default: false)
```


## Benchmarks

```
@lukecjohnson/args  4,693,263 ops/sec ±0.31% (98 runs sampled)
arg                 2,484,276 ops/sec ±0.38% (98 runs sampled)
mri                 1,547,159 ops/sec ±0.35% (99 runs sampled)
minimist            629,555 ops/sec ±0.31% (99 runs sampled)
command-line-args   158,831 ops/sec ±0.34% (97 runs sampled)
yargs-parser        73,104 ops/sec ±0.34% (96 runs sampled)
```

See [`/benchmark`](benchmark) for benchmark details
