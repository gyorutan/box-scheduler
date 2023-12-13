"use client";

import { addDays } from "date-fns";
import ja from "date-fns/locale/ja";
import { ChangeEvent, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { dateFormatting } from "@/libs/dateFormatting";
import { useRouter } from "next/navigation";

registerLocale("ja", ja);

interface StoreType {
  screenNumber: number;
  availableWeekDayTimes: string[];
  availableWeekEndTimes: string[];
  isLoading: boolean;
  minDate: string;
  maxDate: string;
  oneMore: boolean;
}

interface ReservationDataType {
  writer: string;
  password: string;
  date: string;
  time: string;
}

const ReservationPage = () => {
  const router = useRouter();
  const [store, setStore] = useState<StoreType>({
    screenNumber: 1,
    availableWeekDayTimes: [],
    availableWeekEndTimes: [],
    isLoading: false,
    minDate: "",
    maxDate: "",
    oneMore: false,
  });
  const [reservationData, setReservationData] = useState<ReservationDataType>({
    writer: "",
    password: "",
    date: "",
    time: "",
  });
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  // eslint-disable-next-line react/display-name
  useEffect(() => {
    handleDate();
    // checkingReservation(reservationData.date);
  }, [startDate]);

  const handleDate = () => {
    const formattedDate = dateFormatting(startDate);

    setReservationData({ ...reservationData, date: formattedDate });

    checkingReservation(formattedDate);
  };

  const checkingReservation = async (date: string) => {
    if (date === "") {
      return;
    }
    try {
      const response = await fetch(`api/reservation/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(date),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        store.availableWeekDayTimes = data.availableTimes.availableWeekDayTimes;
        store.availableWeekEndTimes = data.availableTimes.availableWeekEndTimes;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTime = (time: string) => {
    setReservationData({ ...reservationData, time: time });
  };

  const handleNextScreen = () => {
    setStore({ ...store, screenNumber: store.screenNumber + 1 });
  };

  const handleBeforeScreen = () => {
    setStore({ ...store, screenNumber: store.screenNumber - 1 });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStore({ ...store, isLoading: true });
    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });
      const data = await response.json();

      if (data.success && store.oneMore === true) {
        setStore({
          ...store,
          isLoading: false,
          oneMore: false,
          screenNumber: 1,
        });
        setReservationData({
          ...reservationData,
          writer: reservationData.writer,
        });
        return;
      } else if (data.success && !store.oneMore) {
        toast.success("予約しました！", {
          duration: 3000,
          position: "top-right",
        });
        router.push("/");
      } else {
        toast.error("予約に失敗しました！", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setStore({ ...store, isLoading: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-[82vh] flex justify-center items-center p-8">
        {/* 첫번째 화면 */}
        {store.screenNumber === 1 ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 bg-blue-100 rounded-md p-5">
              <p className="font-bold text-center text-red-500">
                ⚠ 予約は一日最大2時間まで！
              </p>
              <p className="text-lg font-black text-center">
                次のライブは
                <span className="text-blue-600">「12月 24日」</span>
                です。
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <label
                  htmlFor="writer"
                  className="absolute left-3 top-2 font-base text-black text-sm"
                >
                  名前 / バンド名
                </label>
                <input
                  value={reservationData.writer}
                  onChange={(e) => {
                    setReservationData({
                      ...reservationData,
                      writer: e.target.value,
                    });
                  }}
                  name="writer"
                  required
                  type="text"
                  className="shadow hover:border-slate-400 rounded-md transition bg-white border border-slate-300 focus:border-blue-600 w-full outline-none pt-9 pb-3 px-3 text-lg font-bold"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="absolute left-3 top-2 font-base text-black text-sm"
                >
                  パスワード設定
                </label>
                <input
                  value={reservationData.password}
                  onChange={(e) => {
                    setReservationData({
                      ...reservationData,
                      password: e.target.value,
                    });
                  }}
                  name="password"
                  required
                  type="password"
                  className="shadow tracking-[5px] hover:border-slate-400 rounded-md transition bg-white border border-slate-300 focus:border-blue-600 w-full outline-none pt-9 pb-3 px-3 text-lg font-bold"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold">日付指定</p>
              <DatePicker
                className="w-full border border-slate-300 shadow cursor-pointer outline-none rounded-md py-2.5 text-center"
                dateFormat="yyyy年 MM月 dd日"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                maxDate={addDays(new Date(), 21)}
                locale={"ja"}
                dateFormatCalendar="yyyy年 MM月"
                popperPlacement="top"
                customInput={
                  <button type="button">{reservationData.date}</button>
                }
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (reservationData.writer === "") {
                    toast.error("名前 / バンド名を入力してください！", {
                      duration: 3000,
                      position: "top-right",
                    });
                    return;
                  } else if (reservationData.password === "") {
                    toast.error("パスワードを入力してください！", {
                      duration: 3000,
                      position: "top-right",
                    });
                    return;
                  } else if (reservationData.date === "") {
                    toast.error("日付を指定してください！", {
                      duration: 3000,
                      position: "top-right",
                    });
                    return;
                  }
                  handleNextScreen();
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-md"
              >
                次へ
              </button>
            </div>
          </div>
        ) : null}
        {/* 두번째 화면 */}
        {store.screenNumber === 2 ? (
          <div className="flex flex-col gap-10 w-full">
            <p className="font-bold bg-blue-100 text-center p-2 text-lg border shadow rounded-md">
              {reservationData.date}の予約可能時間帯
            </p>
            {startDate !== null &&
            startDate.getDay() !== 0 &&
            startDate.getDay() !== 6 ? (
              <div className="w-full grid grid-rows-3 grid-cols-2 gap-2">
                {store.availableWeekDayTimes.map((time, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      handleTime(time);
                    }}
                    className={
                      reservationData.time === time
                        ? "w-full font-medium py-2 rounded-md text-sm transition bg-blue-500 text-white shadow-sm"
                        : "w-full font-medium py-2 rounded-md text-sm transition hover:bg-blue-500 hover:text-white shadow border border-slate-300"
                    }
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : null}
            {startDate !== null &&
            (startDate.getDay() === 0 || startDate.getDay() === 6) ? (
              <div className="w-full grid grid-rows-3 grid-cols-2 gap-2">
                {store.availableWeekEndTimes.map((time, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      handleTime(time);
                    }}
                    className={
                      reservationData.time === time
                        ? "w-full font-medium py-2 rounded-md text-sm transition bg-blue-500 text-white shadow-sm"
                        : "w-full font-medium py-2 rounded-md text-sm transition hover:bg-blue-500 hover:text-white shadow border border-slate-300"
                    }
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  handleBeforeScreen();
                }}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 px-5 rounded-md"
              >
                前へ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (reservationData.time === "") {
                    toast.error("時間帯を指定してください！", {
                      duration: 3000,
                      position: "top-right",
                    });
                    return;
                  }
                  handleNextScreen();
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-md"
              >
                次へ
              </button>
            </div>
          </div>
        ) : null}
        {/* 세번째 화면 */}
        {store.screenNumber === 3 ? (
          <div className="flex flex-col justify-center items-center gap-3 w-full">
            <p className="text-xl font-black">予約内容確認</p>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-col gap-1 w-full border border-slate-400 rounded-md py-3 px-4">
                <p className="font-medium text-sm">名前 / バンド名</p>
                <p className="font-bold text-lg text-blue-500">
                  {reservationData.writer}
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full border border-slate-400 rounded-md py-3 px-4">
                <p className="font-medium text-sm">日付</p>
                <p className="font-bold text-lg text-blue-500">
                  {reservationData.date}
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full border border-slate-400 rounded-md py-3 px-4">
                <p className="font-medium text-sm">時間帯</p>
                <p className="font-bold text-lg text-blue-500">
                  {reservationData.time}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  handleBeforeScreen();
                }}
                type="button"
                className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 px-5 rounded-md"
              >
                前へ
              </button>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-md"
              >
                {store.isLoading ? "提出中。。。" : "提出"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
};

export default ReservationPage;
