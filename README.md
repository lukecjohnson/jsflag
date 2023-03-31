# @lukecjohnson/flags

A quick, lightweight command-line argument with type checking,
shorthand flags, default values, and help text generation.


## Installation

```
npm install @lukecjohnson/flags
```

*Note: `@lukecjohnson/flags` is an ESM-only package*


## Usage

### Options

`parse` accepts an `options` object that can be used to define flags and 
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
- `args`: An array of raw arguments to be parsed (Default: `process.argv.slice(2)`)
- `usage`: The general usage pattern of the program or command to be included
  in the generated help text
- `disableHelp`: When `true`, the built-in `--help` and `-h` flags are
  disabled (Default: `false`)
- `stopAtPositional`: When `true`, all arguments after the first positional,
  non-flag argument are pushed to `result.args` (Default: `false`)


### Result

`parse` returns an object containing `args` and `flags`:

- `args`: An array of non-flag arguments provided by the end-user
- `flags`: An object containing the values of flags provided by the end-user or 
  their default values


### Example

```js
import parse from '@lukecjohnson/flags';

const { args, flags } = parse({
  flags: {
    host: {
      type: 'string',
      shorthand: 'H',
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
  -H, --host            Hostname to bind (Default: "localhost")
  -p, --port            Port to bind (Default: 3000)
  -d, --debug           Show debugging information (Default: false)

```


## Benchmarks

```
yargs-parser          24,706 ops/sec ±0.62% (92 runs sampled)
minimist              209,497 ops/sec ±0.54% (92 runs sampled)
mri                   505,183 ops/sec ±0.34% (91 runs sampled)
arg                   1,020,208 ops/sec ±0.75% (93 runs sampled)
@lukecjohnson/flags   2,085,279 ops/sec ±0.40% (94 runs sampled)
```

See [`/benchmark`](benchmark) for benchmark details
