export const checkReservation = async (date: string) => {
  const data = await fetch("/api/reservations/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(date),
  }).then((res) => res.json());

  console.log({ data });

  if (data.success) {
    return data;
  } else {
    return null;
  }
};

export const createReservation = async (reservationData: {
  date: string;
  time: string;
  bandName: string;
  password: string;
}) => {
  const data = await fetch("/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservationData),
  }).then((res) => res.json());

  console.log({ data });

  if (data.success) {
    return data;
  } else {
    return null;
  }
};
