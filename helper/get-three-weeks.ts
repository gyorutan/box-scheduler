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
