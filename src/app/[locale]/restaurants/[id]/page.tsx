import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { getRestaurant } from "@/db/restaurants";
import { Button } from "@mui/material";
import { getTranslations } from "next-intl/server";

export default async function Restaurant({ params }: { params: Promise<{ id: string }> }) {
  const user = (await auth())?.user;
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  if (!restaurant.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gray-700">Cannot fetch data</div>
      </main>
    );
  }
  const { data } = restaurant;

  const text = await getTranslations("RestaurantCard");
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-row gap-8">
          <div className="w-[50%]">
            <Image
              className="rounded shadow-md"
              src="/img/restaurant.jpg"
              alt={data.name}
              width={600}
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl font-bold text-yellow-600">{data.name}</h1>
            <div className="text-xl">
              <span>{text("address")}: {data.address}</span>
              <br />
              <span>{text("district")}: {data.district}</span>
              <br />
              <span>{text("postal-code")}: {data.postalcode}</span>
              <br />
              <span>{text("tel")}: {data.phone}</span>
            </div>
            <div className="mt-6 flex gap-4">
              {user && (
                <Link href={`/restaurants/${data.id}/reserve`}>
                  <Button variant="contained">{text("reserve")}</Button>
                </Link>
              )}
              {user && user.id == data.owner && (
                <Link href={`/restaurants/${data.id}/edit`}>
                  <Button variant="contained">{text("edit")}</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
