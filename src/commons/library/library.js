import styles from "../../components/class/styles.module.css";
export const longWord = (word) => {
  if (word.length > 17) {
    return word.slice(0, 15) + "...";
  } else {
    return word;
  }
};

export const addComma = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const dateToString = (date) => {
  if (date.getUTCHours() + 9 > 24) {
    return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${
      date.getUTCDate() + 1
    }일`;
  } else {
    return `${date.getUTCFullYear()}년 ${
      date.getUTCMonth() + 1
    }월 ${date.getUTCDate()}일`;
  }
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
