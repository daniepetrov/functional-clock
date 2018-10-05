document.getElementById("app").innerHTML = `
<h1>Hello Functional clock!</h1>
<div id='clock' style='font-size: 30px'>
</div>
`;

// Helper functions

const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = message => console.log(message);

const toDom = message =>
  (document.getElementById("clock").innerHTML = `<div>${message}</div>`);

// Transform function

const serializeClockTime = date => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds()
});

const civilianHours = clockTime => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours
});
const appendAMPM = clockTime => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? "PM" : "AM"
});

// High order functions

const display = target => time => target(time);
const formatClock = format => time =>
  format
    .replace("hh", time.hours)
    .replace("mm", time.minutes)
    .replace("ss", time.seconds)
    .replace("tt", time.ampm);

const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key]
});

// Functions composition

const compose = (...fns) => arg => fns.reduce((comp, f) => f(comp), arg);

// Clock

const convertToCivilianTime = clockTime =>
  compose(
    appendAMPM,
    civilianHours
  )(clockTime);

const doubleDigits = civilianTime =>
  compose(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(civilianTime);

const startTracking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock("hh:mm:ss tt"),
      display(toDom)
    ),
    oneSecond()
  );
startTracking();
