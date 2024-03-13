import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const weekDayTimes = [
// 	'08:30 ~ 09:00',
// 	'12:10 ~ 13:00',
// 	'18:00 ~ 19:00',
// 	'19:00 ~ 20:00',
// 	'20:00 ~ 21:00'
// ];

export const weekDayTimes = [
  "08:00 ~ 09:00",
  "09:00 ~ 10:00",
  "10:00 ~ 11:00",
  "11:00 ~ 12:00",
  "12:00 ~ 13:00",
  "13:00 ~ 14:00",
  "14:00 ~ 15:00",
  "15:00 ~ 16:00",
  "16:00 ~ 17:00",
  "17:00 ~ 18:00",
  "18:00 ~ 19:00",
  "19:00 ~ 20:00",
  "20:00 ~ 21:00",
];

export const weekEndTimes = [
  "08:00 ~ 09:00",
  "09:00 ~ 10:00",
  "10:00 ~ 11:00",
  "11:00 ~ 12:00",
  "12:00 ~ 13:00",
  "13:00 ~ 14:00",
  "14:00 ~ 15:00",
  "15:00 ~ 16:00",
  "16:00 ~ 17:00",
  "17:00 ~ 18:00",
  "18:00 ~ 19:00",
  "19:00 ~ 20:00",
  "20:00 ~ 21:00",
];

export const getThreeWeeks = (): string[] => {
  const currentDate = new Date();
  const datesInRange = [];

  for (let i = 0; i < 22; i++) {
    const targetDate = new Date(currentDate);
    targetDate.setDate(currentDate.getDate() + i);
    datesInRange.push(targetDate);
  }

  const dateStrings = datesInRange.map((date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    const daysOfWeekInJapanese = ["日", "月", "火", "水", "木", "金", "土"];

    return `${year}年 ${month}月 ${day}日 (${daysOfWeekInJapanese[dayOfWeek]})`;
  });

  return dateStrings;
};

export const dateFormatting = (date: Date | undefined) => {
  const selectedDate = new Date(date!);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  const dayoftheWeek = new Date(year, month - 1, day).getDay();

  const dayoftheWeekJapan = ["日", "月", "火", "水", "木", "金", "土"];

  const formattedDate = `${year}年 ${month}月 ${day}日 (${dayoftheWeekJapan[dayoftheWeek]})`;

  return formattedDate;
};
