"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { cn, dateFormatting } from "@/lib/utils";

import { ChevronLeft } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const ReservationForm = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [screen, setScreen] = useState(1);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");

  const [availableWeekDayTimes, setAvailableWeekDayTimes] = useState([]);
  const [availableWeekEndTimes, setAvailableWeekEndTimes] = useState([]);

  const today = new Date();

  const [checked, setChecked] = useState(true);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    bandName: "",
    password: "",
  });

  const threeWeeksLater = new Date();

  threeWeeksLater.setDate(threeWeeksLater.getDate() + 21);

  const showScreen1 = () => {
    setReservationData({ ...reservationData, time: "" });
    setScreen(1);
  };

  const showScreen2 = async () => {
    if (await checkReservation()) {
      setScreen(2);
    }
    return;
  };

  const showScreen3 = () => {
    setScreen(3);
  };

  const checkReservation = async () => {
    try {
      setIsLoading(true);
      const data = await fetch("/api/reservation/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData.date),
      }).then((res) => res.json());

      if (data.success) {
        setAvailableWeekDayTimes(data.availableTimes.availableWeekDayTimes);
        setAvailableWeekEndTimes(data.availableTimes.availableWeekEndTimes);

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTime = (time: string) => {
    setReservationData({ ...reservationData, time });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const data = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      }).then((res) => res.json());

      if (data.success) {
        toast.success("予約しました");
        router.push("/");
      } else {
        toast.error("予約失敗");
      }
    } catch (error) {
      console.log(error);
      toast.error("予約失敗");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setReservationData({ ...reservationData, date: dateFormatting(date) });
  }, [date]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {/* カレンダー */}
      {screen === 1 ? (
        <div className="flex flex-col gap-y-4">
          <div>
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => {
                router.push("/");
              }}
              className="flex gap-x-2"
            >
              <ChevronLeft size={20} color="#3b82f6" />
              <span className="mb-[2px] text-blue-500">戻る</span>
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center gap-y-4">
            <p className="text-destructive">⚠ 予約は一日最大2時間まで</p>
            <div
              className={cn(
                "w-[280px] font-semibold flex justify-center",
                !date && "text-muted-foreground"
              )}
            >
              {date ? reservationData.date : <span>日付選択</span>}
            </div>
            <div className="flex flex-col gap-y-4">
              <Calendar
                className="border rounded-md"
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                  date > new Date(threeWeeksLater)
                }
              />
              <Button
                type="button"
                className="w-full"
                disabled={!!!date}
                onClick={showScreen2}
              >
                次へ
              </Button>
            </div>
          </div>
        </div>
      ) : // <div className="flex flex-col gap-y-4">
      //   <div>
      //     <Button
      //       variant={"ghost"}
      //       onClick={() => {
      //         router.push("/");
      //       }}
      //       className="flex gap-x-2"
      //     >
      //       <ChevronLeft size={20} color="#3b82f6" />
      //       <span className="mb-[2px] text-blue-500">戻る</span>
      //     </Button>
      //   </div>
      //   <div className="flex flex-col justify-center items-center gap-y-4">
      //     <div
      //       className={cn(
      //         "w-[280px] font-semibold flex justify-center",
      //         !date && "text-muted-foreground"
      //       )}
      //     >
      //       {date ? reservationData.date : <span>日付選択</span>}
      //     </div>
      //     <Calendar
      //       className="border rounded-md"
      //       mode="single"
      //       selected={date}
      //       onSelect={setDate}
      //       initialFocus
      //       disabled={(date) =>
      //         date < new Date(new Date().setHours(0, 0, 0, 0)) ||
      //         date > new Date(threeWeeksLater)
      //       }
      //     />
      //   </div>
      //   <Button
      //     type="button"
      //     disabled={!!!date}
      //     onClick={showScreen2}
      //   >
      //     次へ
      //   </Button>
      // </div>
      null}

      {/* 時間 */}
      {screen === 2 ? (
        <div className="w-full">
          <div>
            <Button
              variant={"ghost"}
              onClick={showScreen1}
              className="flex gap-x-2"
            >
              <ChevronLeft size={20} color="#3b82f6" />
              <span className="mb-[2px] text-blue-500">戻る</span>
            </Button>
          </div>
          <p className="font-semibold mt-4 text-center">
            {reservationData.date}
          </p>
          {today !== null && today.getDay() !== 0 && today.getDay() !== 6 ? (
            <div className="grid grid-cols-2 gap-2 w-full mt-6">
              {availableWeekDayTimes.map((time, index) => (
                <Button
                  type="button"
                  onClick={() => {
                    handleTime(time);
                  }}
                  key={index}
                  variant={
                    reservationData.time === time ? "default" : "outline"
                  }
                >
                  {time}
                </Button>
              ))}
            </div>
          ) : null}
          {today !== null && (today.getDay() === 0 || today.getDay() === 6) ? (
            <div className="grid grid-cols-2 gap-2 w-full mt-6">
              {availableWeekDayTimes.map((time, index) => (
                <Button
                  type="button"
                  onClick={() => {
                    handleTime(time);
                  }}
                  key={index}
                  variant={
                    reservationData.time === time ? "default" : "outline"
                  }
                >
                  {time}
                </Button>
              ))}
            </div>
          ) : null}
          <Button
            type="button"
            disabled={!reservationData.time}
            onClick={showScreen3}
            className="mt-4 w-full"
          >
            次へ
          </Button>
        </div>
      ) : null}

      {/* バンド情報 */}
      {screen === 3 ? (
        <div className="w-full">
          <div>
            <Button
              type="button"
              variant={"ghost"}
              onClick={showScreen2}
              className="flex gap-x-2"
            >
              <ChevronLeft size={20} color="#3b82f6" />
              <span className="mb-[2px] text-blue-500">戻る</span>
            </Button>
          </div>
          <div className="flex justify-center gap-x-8">
            <p className="font-semibold mt-4 text-center">
              {reservationData.date}
            </p>
            <p className="font-semibold mt-4 text-center">
              {reservationData.time}
            </p>
          </div>
          <div className="w-full flex flex-col gap-y-3 mt-6">
            <Input
              type="text"
              placeholder="バンド名"
              value={reservationData.bandName}
              onChange={(e) => {
                setReservationData({
                  ...reservationData,
                  bandName: e.target.value,
                });
              }}
            />
            <Input
              type={checked ? "password" : "text"}
              placeholder="パスワード"
              value={reservationData.password}
              onChange={(e) => {
                setReservationData({
                  ...reservationData,
                  password: e.target.value,
                });
              }}
            />
            <div className="flex items-center gap-x-2">
              <input
                className="ml-1"
                id="password-visible"
                type="checkbox"
                onChange={() => {
                  setChecked((checked) => !checked);
                }}
              />
              <Label className="text-xs" htmlFor="password-visible">
                パスワード表示
              </Label>
            </div>
          </div>
          <Button
            disabled={!reservationData.bandName || !reservationData.password}
            type="submit"
            className="mt-6 w-full"
          >
            予約
          </Button>
        </div>
      ) : null}
    </form>
  );
};
