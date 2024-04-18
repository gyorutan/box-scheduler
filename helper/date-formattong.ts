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
