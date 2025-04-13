import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
  subtextHighlight?: string;
  iconColor?: string;
}

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  subtext, 
  subtextHighlight,
  iconColor = 'bg-primary/10 text-primary'
}: MetricCardProps) => {
  return (
    <Card className="bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-gray-500 font-medium text-sm uppercase">{title}</h3>
            <p className="text-3xl font-bold font-header mt-2">{value}</p>
          </div>
          <div className={`p-2 rounded-md ${iconColor}`}>
            {icon}
          </div>
        </div>
        {subtext && (
          <div className="mt-4 text-sm text-gray-500">
            {subtextHighlight && <span className="text-[#007AFF] font-medium">{subtextHighlight}</span>}{" "}
            {subtext}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
