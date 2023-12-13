"use client";

import { useEffect, useState } from "react";
import { getThreeWeeks } from "@/libs/getThreeWeeks";
import toast from "react-hot-toast";
import Image from "next/image";

interface Reservations {
  id: string;
  name: string;
  date: string;
  time: string;
}

interface Store {
  threeWeeks: string[];
  isLoading: boolean;
}

const HomePage = () => {
  const [store, setStore] = useState<Store>({
    threeWeeks: [],
    isLoading: false,
  });
  const [password, setPassword] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [reservations, setReservations] = useState<Reservations[]>([]);
  console.log(reservations);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getReservations();
    setStore({ ...store, threeWeeks: getThreeWeeks() });
  }, []);

  const getReservations = async () => {
    const response = await fetch("/api/reservation");
    const data = await response.json();
    console.log(data);
    setReservations(data);
  };

  const handleDelete = async () => {
    if (!password) {
      toast.error("パスワードを入力してください", {
        duration: 3000,
        position: "top-right",
      });
    }
    setStore({ ...store, isLoading: true });
    try {
      const response = await fetch(`/api/reservation/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(password),
      });
      const data = await response.json();

      console.log(data);

      if (data.success) {
        toast.success("削除しました", {
          duration: 3000,
          position: "top-right",
        });
        setOpenModal(false);
        setPassword("");
        getReservations();
      } else {
        toast.error("パスワードが一致しません", {
          duration: 3000,
          position: "top-right",
        });
        setPassword("");
      }

      setStore({ ...store, isLoading: false });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center py-6 px-5">
        <div className="grid grid-cols-1 gap-2.5 w-full">
          {store.threeWeeks.map((threeWeek, index) => (
            <div
              key={index}
              className="border-[1px] border-gray-400 rounded-md shadow-sm"
            >
              <p className="text-center font-medium py-1 text-black border-b border-slate-300">
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
                        {reservation.name}
                      </div>
                      <button
                        className="hover:bg-red-200 p-2 rounded-full"
                        type="button"
                        onClick={() => {
                          if (openModal) {
                            setOpenModal(false);
                          } else {
                            setOpenModal(true);
                          }
                          setReservationId(reservation.id);
                        }}
                      >
                        <Image
                          src="/delete1.png"
                          alt="delete"
                          height="20"
                          width="20"
                        />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {openModal ? (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 text-center items-center">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-2 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        予約削除
                      </h3>
                      <div className="relative w-full mt-4">
                        <label
                          htmlFor="password"
                          className="absolute left-3 top-2 font-base text-black text-sm"
                        >
                          パスワード
                        </label>
                        <input
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          name="password"
                          required
                          type="password"
                          className="tracking-[5px] hover:border-slate-400 rounded-md transition bg-white border border-slate-300 focus:border-blue-600 w-full outline-none pt-9 pb-3 px-3 text-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={() => {
                      handleDelete();
                    }}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    {store.isLoading ? "削除中。。。" : "削除"}
                  </button>
                  <button
                    onClick={() => {
                      if (openModal) {
                        setOpenModal(false);
                      } else {
                        setOpenModal(true);
                      }
                      setPassword("");
                    }}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    戻る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default HomePage;
