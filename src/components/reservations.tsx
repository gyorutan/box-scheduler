"use client";

import { useEffect, useState } from "react";
import { getThreeWeeks } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CalendarPlus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import toast from "react-hot-toast";

interface Reservations {
  id: string;
  bandName: string;
  date: string;
  time: string;
}

export const Reservations = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [threeWeeks, setThreeWeeks] = useState<string[]>([]);
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [reservationId, setReservationId] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);

  const handleDelete = async () => {
    if (!password) {
      toast.error("パスワードを入力してください");
      return;
    }
    try {
      setIsLoading(true);
      const data = await fetch(`/api/reservation/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(password),
      }).then((res) => res.json());

      if (data.success) {
        toast.success("削除しました");
        setPassword("");
      } else {
        toast.error("パスワードが一致しません");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setThreeWeeks(getThreeWeeks() as string[]);
    const getReservations = async () => {
      const response = await fetch("/api/reservation");
      const data = await response.json();
      setReservations(data);
    };
    getReservations();
  }, [isLoading]);

  return (
    <>
      <div className="p-4">
        <div className="mb-4 border flex flex-row justify-between items-center bg-white text-black rounded-md px-4 py-2">
          <p className="text-xl font-bold">予約状況</p>
          <Button
            className="flex flex-row gap-2 bg-blue-500 hover:bg-blue-500/90"
            onClick={() => {
              router.push("/reserve");
            }}
          >
            <CalendarPlus />
            <span>予約する</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2.5 w-full">
          {threeWeeks.map((threeWeek, index) => (
            <div
              key={index}
              className="border-[1px] border-gray-400 rounded-md shadow-sm"
            >
              <p className="bg-slate-100 text-center font-medium py-1 text-black rounded-t-md border-b border-slate-300">
                {threeWeek}
              </p>
              <div className="py-1 px-2">
                {reservations
                  .filter((reservation) => reservation.date === threeWeek)
                  .map((reservation, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center px-2 py-0.5"
                    >
                      <div className="font-bold">{reservation.time}</div>
                      <div className="font-black text-blue-500 pr-16 text-base">
                        {reservation.bandName}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setShow(true);
                              setReservationId(reservation.id);
                            }}
                          >
                            <Trash2 size={20} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <Input
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                              }}
                              placeholder="パスワード"
                              type={checked ? "password" : "text"}
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
                              <Label
                                className="text-xs mb-[2px]"
                                htmlFor="password-visible"
                              >
                                パスワード表示
                              </Label>
                            </div>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>閉じる</AlertDialogCancel>
                            <AlertDialogCancel
                              asChild
                              className="bg-red-500 hover:bg-red-500/90 hover:text-white"
                            >
                              <Button
                                onClick={() => {
                                  handleDelete();
                                }}
                              >
                                削除
                              </Button>
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
