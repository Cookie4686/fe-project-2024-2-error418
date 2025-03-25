import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { getPopulatedRestaurant, getRestaurant } from "@/db/restaurants";
import { Button } from "@mui/material";
import { getTranslations } from "next-intl/server";
import EditRestaurantForm from "./form";

export default async function Restaurant({ params }: { params: Promise<{ id: string }> }) {
  const user = (await auth())?.user;

  
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  const popRestaurant = await getPopulatedRestaurant(id);
  
  if (!restaurant.success || !popRestaurant.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gray-700">Cannot fetch data</div>
      </main>
    );
  }
  const { data } = restaurant;
  
  const text = await getTranslations("RestaurantCard");

  if (!user || user.id != data.owner) {
    return (
      <h1>You are not allowed to edit this restaurant</h1>
    )
  }

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
          <EditRestaurantForm restaurant={popRestaurant.data} userId={user.id}/>
        </div>
      </div>
    </main>
  );
}