setInterval(timeHandler, 1000);

function timeHandler() {
  const clock = document.getElementById("clock");
  const timeArray = getTime();
  clock.innerHTML = `${timeArray[0]} ${timeArray[1]}:${timeArray[2]}:${timeArray[3]}`;
}

function getTime() {
  const date = new Date();
  let hours = date.getHours();
  const dayTimeParser = parseDayTime(hours);
  const dayTime = dayTimeParser.daytime;
  hours = dayTimeParser.hours;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return [dayTime, hours, minutes, seconds];
}

function parseDayTime(hours) {
  if (hours < 12) return { daytime: "AM", hours: hours };
  else return { daytime: "PM", hours: hours % 12 };
}
