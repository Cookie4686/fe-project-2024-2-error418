import { getReservation } from "@/db/reservations";
import EditReservationForm from "./form";

export default async function EditReservation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reservation = await getReservation(id);

  if (!reservation.success) {
    return <main>Cannot fetch data</main>;
  }
  return (
    <main>
      <EditReservationForm reservation={reservation.data} />
    </main>
  );
}
