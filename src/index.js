const glob = require('glob');
const yargs = require('yargs');
const ncp = require('ncp').ncp;


const getArgs = () => {
  return yargs(process.argv.slice(2))
    .option('create', {
      alias: 'c',
      type: 'string',
      description: 'Create a specific day'
    }).option('run', {
      alias: 'r',
      type: 'string',
      description: 'Run a specific day'
    }).option('all', {
      alias: 'a',
      type: 'boolean',
      description: 'Run all days'
    }).argv;
};

const loadDays = () => {
  return glob.sync(`${__dirname}/day*/*.js`).reduce((days, file) => {
    const {part1, part2} = require(file);
    const dayNum = file.match(/day(\d+)\/run\.js/)[1];

    days[dayNum] = {
      part1,
      part2
    };

    return days;
  }, {});
};

const runDay = (day, days) => {
  console.log(`Day ${day}`);
  console.log(`  Part 1: ${days[day].part1()}`);
  console.log(`  Part 2: ${days[day].part2()}`);
};

const runLatest = days => {
  const dayKeys = Object.keys(days).sort((a, b) => parseInt(a) - parseInt(b));
  const latestDay = dayKeys[dayKeys.length-1];

  runDay(latestDay, days);
}

const runAllDays = days => {
  Object.keys(days).sort((a, b) => parseInt(a) - parseInt(b)).forEach(day => runDay(day, days));
}

const main = () => {
  const args = getArgs();
  const days = loadDays();

  if(args.run) {
    if(args.run in days) {
      runDay(args.run, days)
    } else {
      console.log(`Day ${args.run} not found!!`);
    }
  } else if(args.all) {
    runAllDays(days);
  } else if(args.create) {
    if(!(args.create in days)) {
      ncp(`${__dirname}/template`, `${__dirname}/day${args.create}`);
    } else {
      console.log('That day has already been made!');
    }
  } else {
    runLatest(days);
  }
};

main();
