import { getAnalytics } from "@/components/actions/getAnalytics";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";


export default async function analytics() {

  const { userId } = auth();
  if(!userId) return redirect('/');

  const {
    data, 
    totalRevenue,
    totalSales
  } = await getAnalytics(userId);

  // console.log(data, totalRevenue, totalSales);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          value={totalSales}
          label="Total Sales"
        />
        <DataCard
          value={totalRevenue}
          label="Total Revenue"
          shouldFormat
        />
      </div>
      <Chart 
        data={data}
      />
    </div>
  )
}
