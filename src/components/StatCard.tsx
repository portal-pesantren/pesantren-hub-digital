import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, className }: StatCardProps) => {
  return (
    <Card className={cn("shadow-card hover:shadow-elegant transition-shadow duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {trend && (
              <p className={cn(
                "text-xs mt-2 font-medium flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-danger"
              )}>
                <span className={cn(
                  "inline-flex items-center justify-center w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent",
                  trend.isPositive
                    ? "border-b-8 border-b-success"
                    : "border-t-8 border-t-danger"
                )}></span>
                {trend.isPositive ? "+" : ""}{trend.value}% dari bulan lalu
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
