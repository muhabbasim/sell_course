import PriceFormat from "@/components/PriceFormat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
}

export default function DataCard({ value, label, shouldFormat }: DataCardProps) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">
          {label}
        </CardTitle>
        <CardContent>
          <p className="text-center text-2xl font-bold">
            {shouldFormat ? PriceFormat(value) : value}
          </p>
        </CardContent>
      </CardHeader>
    </Card>
  )
}
