import { addDays, getDay, startOfWeek, endOfWeek } from "date-fns";
import styles from "../../components/class/styles.module.css";
export const longWord = (word) => {
  if (word.length > 25) {
    return word.slice(0, 24) + "...";
  } else {
    return word;
  }
};

export const shortWord = (word) => {
  if (word.length > 12) {
    return word.slice(0, 11) + "...";
  } else {
    return word;
  }
};

export const longTitle = (word) => {
  if (word.length > 40) {
    return word.slice(0, 40) + "...";
  } else {
    return word;
  }
};

export const longAuthor = (word) => {
  if (word.length > 15) {
    return word.slice(0, 15) + "...";
  } else {
    return word;
  }
};

export const addComma = (number) => {
  if (number === null || undefined) {
    return undefined;
  }

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const dateToString = (date) => {
  // if (date.getUTCHours() + 9 > 24) {
  //   return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${
  //     date.getUTCDate() + 1
  //   }일`;
  // } else {
  //   return `${date.getUTCFullYear()}년 ${
  //     date.getUTCMonth() + 1
  //   }월 ${date.getUTCDate()}일`;
  // }
  const newDate = new Date(date);
  newDate.setTime(date.getTime() + 9 * 1000 * 60 * 60);
  return `${newDate.getUTCFullYear()}년 ${
    newDate.getUTCMonth() + 1
  }월 ${newDate.getUTCDate()}일`;
  // const newDate = new Date(date);
  // newDate.setDate(date.getDate() + 1);
  // if (date.getTime() > 15) {
  //   if (date.getDate() === date.getUTCDate()) {
  //     return `${newDate.getFullYear()}년 ${
  //       newDate.getMonth() + 1
  //     }월 ${newDate.getDate()}일`;
  //   } else {
  //     return `${date.getFullYear()}년 ${
  //       date.getMonth() + 1
  //     }월 ${date.getDate()}일`;
  //   }
  // } else {
  //   return `${date.getFullYear()}년 ${
  //     date.getMonth() + 1
  //   }월 ${date.getDate()}일`;
  // }
};

export const dateChange = (date) => {
  return date.slice(0, 4) + "-" + date.slice(5, 7) + "-" + date.slice(8, 10);
};

export const dateToTime = (date) => {
  return `${date.getHours()}시 ${date.getMinutes()}분`;
};

export const timeCal = (alarm, date) => {
  return alarm.getTime() - date.getTime();
};

export const tileClassName = ({ date, view }) => {
  if (view === "month" && date.getDay() === 6) {
    return styles.saturday;
  }
  if (view === "month" && date.getDay() === 0) {
    return styles.sunday;
  }
  return null;
};

export const dateCalculator = (date1, date2) => {
  return date1.getTime() < date2.getTime();
};

export const dateToInput = (date) => {
  let year = String(date.getFullYear());
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());

  if (Number(month) < 10) {
    month = "0" + month;
  }
  if (Number(day) < 10) {
    day = "0" + day;
  }

  return year + "-" + month + "-" + day;
};

export const dateToMonth = (date) => {
  let year = String(date.getFullYear());
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());

  if (Number(month) < 10) {
    month = "0" + month;
  }
  if (Number(day) < 10) {
    day = "0" + day;
  }

  return year + "-" + month;
};

export const dateToKoreanTime = (date) => {
  if (date === undefined || date === null) {
    return;
  }
  let koreanDate = new Date(date);
  koreanDate.setHours(koreanDate.getHours());
  return koreanDate;
};

export const customAlarm = (date, start, end) => {
  if (date === undefined || date === null) {
    return;
  }
  let customDate = new Date(date);
  customDate.setHours(
    customDate.getHours() + Number(end.slice(0, 2)) - Number(start.slice(0, 2)),
    customDate.getMinutes() +
      Number(end.slice(3, 5)) -
      Number(start.slice(3, 5))
  );
  return customDate;
};

export const dateToClock = (date) => {
  if (date === undefined || date === null) {
    return;
  }
  let result = ":";
  if (date.getHours() < 10) {
    result = "0" + date.getHours() + result;
  } else {
    result = date.getHours() + result;
  }
  if (date.getMinutes() < 10) {
    result = result + "0" + date.getMinutes();
  } else {
    result = result + date.getMinutes();
  }
  return result;
};

export const dateToClockOneHour = (date) => {
  let result = ":";
  if (date.getHours() + 1 < 10) {
    result = "0" + String((date.getHours() + 1) % 24) + result;
  } else {
    result = String((date.getHours() + 1) % 24) + result;
  }
  if (date.getMinutes() < 10) {
    result = result + "0" + date.getMinutes();
  } else {
    result = result + date.getMinutes();
  }
  return result;
};

export const timeToHour = (string) => {
  if (string !== undefined) {
    return string.slice(0, 2) + "시 " + string.slice(3, 5) + "분";
  }
};

export const kplbnFrame = (int) => {
  if (Number(int)) {
    let result = String(int);
    while (result.length < 7) {
      result = "0" + result;
    }
    return "PE" + result;
  }
};

export const lexileFrame = (int) => {
  if (int === undefined || int === null) {
    return null;
  }
  let result = String(int);
  if (int < 0) {
    result = String(int * -1);
    result = "BR" + result;
  }
  return result + "L";
};

export const arFrame = (int) => {
  if (int === undefined) {
    return;
  }
  if (int == Math.floor(int)) {
    return int + ".0";
  } else {
    return int;
  }
};

export const getMonthInfo = (year, month) => {
  const startDay = new Date(year, month - 1, 1).getDay();
  const endDate = new Date(year, month, 0).getDate();
  const weekNumber = Math.ceil((startDay + endDate) / 7);

  return { startDay, endDate, weekNumber };
};

export const getMonthZero = (date) => {
  if (date.getMonth() + 1 < 10) {
    return "0" + (date.getMonth() + 1);
  } else {
    return String(date.getMonth() + 1);
  }
};

export const getDateZero = (date) => {
  if (date.getDate() < 10) {
    return "0" + date.getDate();
  } else {
    return String(date.getDate());
  }
};

export const getNumberZero = (number) => {
  if (number < 10) {
    return "0" + number;
  } else {
    return String(number);
  }
};

export const dateInputToNumber = (dateInput) => {
  return Number(dateInput.replaceAll("-", ""));
};

export const startDate = (dateInput, weekDays) => {
  let currentDate = new Date(dateInput);
  let startDay = currentDate.getDay();
  let jsWeekDays = weekDays
    .map((el) => (el + 1) % 7)
    .sort((a, b) => {
      return a - b;
    });
  let after = jsWeekDays.filter((el) => {
    return el >= startDay;
  });
  let before = jsWeekDays.filter((el) => {
    return el < startDay;
  });

  let targetDay = [...after, ...before][0];
  let dates = currentDate.getDate() - startDay + targetDay;
  if (after.length === 0) {
    console.log(after, "after");
    dates = dates + 7;
  }
  currentDate.setDate(dates);
  return dateToInput(currentDate);
};

export const lastDate = (dateInput, weeks, weekDays) => {
  if (weekDays.length === 0) {
    return false;
  }
  let currentDate = new Date(dateInput);
  let jsWeekDays = weekDays
    .map((el) => (el + 1) % 7)
    .sort((a, b) => {
      return a - b;
    });
  let startDay = currentDate.getDay();
  let after = jsWeekDays.filter((el) => {
    return el > startDay;
  });
  let now = jsWeekDays.includes(startDay) ? [startDay] : [];
  let before = jsWeekDays.filter((el) => {
    return el < startDay;
  });
  const targetDate = [...now, ...after, ...before];

  const targetDay = targetDate[targetDate.length - 1];

  let dates = currentDate.getDate() + (weeks - 1) * 7 - startDay + targetDay;
  if (targetDate[targetDate.length - 1] < startDay) {
    dates = dates + 7;
  }
  console.log(jsWeekDays, startDay, dates, "day");
  currentDate.setDate(dates);
  return dateToInput(currentDate);
};

export const lastCount = (dateInput, count, weekDays) => {
  const result = [];
  let currentDate = new Date(dateInput);
  let jsWeekDays = weekDays
    .map((el) => (el + 1) % 7)
    .sort((a, b) => {
      return a - b;
    });

  if (jsWeekDays.includes(currentDate.getDay())) {
    result.push(new Date(currentDate));
  }
  while (result.length < count) {
    currentDate = addDays(currentDate, 1);
    if (jsWeekDays.includes(currentDate.getDay())) {
      result.push(new Date(currentDate));
    }
  }

  // const k = new Date(
  //   result[result.length - 1].setDate(result[result.length - 1].getDate() + 1)
  // );
  return dateToInput(result[result.length - 1]);

  // let startDay = currentDate.getDay();

  // let after = jsWeekDays.filter((el) => {
  //   return el > startDay;
  // });
  // let now = jsWeekDays.includes(startDay) ? [startDay] : [];
  // let before = jsWeekDays.filter((el) => {
  //   return el < startDay;
  // });

  // let newWeek = [...now, ...after, ...before];
  // let week = Math.floor(count / weekDays.length);
  // let k = count % weekDays.length;

  // let targetDate =
  //   currentDate.getDate() +
  //   week * 7 +
  //   newWeek[(k - 1 + weekDays.length) % weekDays.length] -
  //   startDay;

  // if (before.length === 0 && now.length !== 0 && after.length === 0) {
  //   targetDate = targetDate - 7;
  // }
  // // if (after.length !== 0 &&) {
  // //   targetDate = targetDate + 7;
  // // }
  // currentDate.setDate(targetDate);

  // return dateToInput(currentDate);
};

export const calculateLectureDate = (dateInput) => {
  let currentDate = new Date(dateInput);

  let currentDayOfWeek = currentDate.getDay();

  let oneWeekAgoMonday = new Date(currentDate);
  oneWeekAgoMonday.setDate(currentDate.getDate() - currentDayOfWeek - 6);

  let fourWeeksLaterSunday = new Date(currentDate);
  fourWeeksLaterSunday.setDate(currentDate.getDate() - currentDayOfWeek + 28);

  return [
    oneWeekAgoMonday.toISOString().slice(0, 10),
    fourWeeksLaterSunday.toISOString().slice(0, 10),
  ];
};
