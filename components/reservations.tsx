"use client";

import { useEffect, useState } from "react";
import { getThreeWeeks } from "@/helper/get-three-weeks";
import { Trash2 } from "lucide-react";
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
// import toast from "react-hot-toast";

interface Reservations {
  id: string;
  bandName: string;
  date: string;
  time: string;
}

export const Reservations = ({
  data,
  mutate,
}: {
  data: any;
  mutate: () => void;
}) => {
  console.log({ data });
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const [threeWeeks, setThreeWeeks] = useState<string[]>([]);
  const [reservationId, setReservationId] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);

  const handleDelete = async () => {
    if (!password) {
      alert("パスワードを入力してください");
      //   toast.error("パスワードを入力してください");
      return;
    }
    try {
      setIsLoading(true);
      const data = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(password),
      }).then((res) => res.json());

      if (data.success) {
        mutate();
        alert("削除しました");

        // toast.success("削除しました");
        setPassword("");
      } else {
        alert("パスワードが一致しません");

        // toast.error("パスワードが一致しません");
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
  }, []);

  return (
    <div className="p-4 w-full">
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
              {data.reservations &&
                data.reservations
                  .filter(
                    (reservation: Reservations) =>
                      reservation.date === threeWeek
                  )
                  .map((reservation: Reservations, index: number) => (
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
  );
};
