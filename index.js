export default function parseArgs({
  argv = process.argv.slice(2),
  flags = {},
  disableHelp = false,
  stopAtPositional = false,
  usage
} = {}) {
  const result = { args: [], flags: {} };
  const shorthands = {};

  for (const key in flags) {
    const flag = flags[key];

    if (!disableHelp && (key === 'help' || flag.shorthand === 'h')) {
      throw new Error(
        '--help and -h are built-in flags; set the `disableHelp` option to disable them'
      );
    }

    if (
      flag.type !== 'boolean' &&
      flag.type !== 'number' &&
      flag.type !== 'string'
    ) {
      throw new Error(
        `type for "${key}" flag must be "boolean", "number", or "string`
      );
    }

    if (flag.shorthand) {
      if (flag.shorthand.length !== 1) {
        throw new Error(`shorthand for "${key}" flag must be 1 character`);
      }
      shorthands[flag.shorthand] = key;
    }

    if (flag.default !== undefined) {
      if (typeof flag.default !== flag.type) {
        throw new Error(
          `default value for "${key}" flag must be of type \`${flag.type}\``
        );
      }
      result.flags[key] = flag.default;
    }
  }

  if (!disableHelp) {
    flags.help = { type: 'boolean' };
    shorthands.h = 'help';
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg[0] !== '-') {
      if (stopAtPositional) {
        result.args.push(...argv.slice(i));
        break;
      }
      result.args.push(arg);
      continue;
    }

    let nameOffset = 1;

    if (arg[1] === '-') {
      if (arg.length === 2) {
        result.args.push(...argv.slice(i + 1));
        break;
      }
      nameOffset = 2;
    }

    const valueOffset = arg.indexOf('=');
    let name, value;

    if (valueOffset > -1) {
      name = arg.substring(nameOffset, valueOffset);
      value = arg.substring(valueOffset + 1);
    } else {
      name = arg.substring(nameOffset);
    }

    if (nameOffset === 1) {
      if (name.length === 1) {
        if (!shorthands[name]) {
          throw new Error(`unknown flag: -${name}`);
        }
        name = shorthands[name];
      } else {
        for (let j = 1; j < arg.length; j++) {
          const shorthand = arg[j];
          const mappedFlagName = shorthands[shorthand];

          if (!mappedFlagName) {
            throw new Error(`unknown flag: -${shorthand}`);
          }

          if (flags[mappedFlagName].type !== 'boolean') {
            throw new Error(
              `-${shorthand} requires a value of type \`${flags[mappedFlagName].type}\``
            );
          }

          result.flags[mappedFlagName] = true;
        }
        continue;
      }
    }

    const flag = flags[name];
    if (!flag) {
      throw new Error(`unknown flag: --${name}`);
    }

    if (flag.type === 'boolean') {
      if (!value) {
        result.flags[name] = true;
        continue;
      }

      if (value !== 'true' && value !== 'false') {
        throw new Error(`--${name} requires a value of type \`boolean\``);
      }

      result.flags[name] = value === 'true';
      continue;
    }

    if (!value) {
      value = argv[i + 1];
      if (!value || (value[0] === '-' && flag.type !== 'number')) {
        throw new Error(
          (nameOffset === 1 ? `-${flag.shorthand}` : `--${name}`) +
            ` requires a value of type \`${flag.type}\``
        );
      }
      i++;
    }

    if (flag.type === 'number') {
      value = +value;
      if (isNaN(value)) {
        throw new Error(`--${name} requires a value of type \`number\``);
      }
    }

    result.flags[name] = value;
  }

  if (!disableHelp && result.flags.help) {
    let output = '\n';

    if (usage) {
      output += `Usage:\n  ${usage}\n\n`;
    }

    output += 'Flags:\n';

    for (const key in flags) {
      const flag = flags[key];

      output += '  ';

      if (flag.shorthand) {
        output += `-${flag.shorthand}, `;
      }

      output += `--${key}`;

      if (flag.description) {
        output += `\t\t${flag.description}`;
      }

      if (flag.default !== undefined) {
        output += ` (Default: ${
          flag.type === 'string' ? `"${flag.default}"` : flag.default
        })`;
      }

      output += '\n';
    }

    console.log(output);
    process.exit();
  }

  return result;
}
