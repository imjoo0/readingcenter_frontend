import styles from "../../components/class/styles.module.css";
export const longWord = (word) => {
  if (word.length > 25) {
    return word.slice(0, 24) + "...";
  } else {
    return word;
  }
};

export const addComma = (number) => {
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
  return date.slice(0, 4) + ". " + date.slice(5, 7) + ". " + date.slice(8, 10);
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

export const dateToKoreanTime = (date) => {
  let koreanDate = new Date(date);
  koreanDate.setHours(koreanDate.getHours() + 9 * 1000 * 60 * 60);
  return koreanDate;
};
