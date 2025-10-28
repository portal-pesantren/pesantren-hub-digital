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
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{title}</p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">{value}</h3>
            {trend && (
              <p className={cn(
                "text-xs mt-1 sm:mt-2 font-medium flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-danger"
              )}>
                <span className={cn(
                  "inline-flex items-center justify-center w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent",
                  trend.isPositive
                    ? "border-b-[10px] border-b-success"
                    : "border-t-[10px] border-t-danger"
                )}></span>
                <span className="hidden xs:inline">
                  {trend.isPositive ? "+" : ""}{trend.value}% dari bulan lalu
                </span>
                <span className="xs:hidden">
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              </p>
            )}
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant flex-shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
