import { Skeleton } from "@/components/ui/skeleton"

export default function JobListSkeleton() {
  return (
    <div className="space-y-4 m-2 p-2">
        {Array.from({length: 10}).map((_: any,i: any) => (
            <div key={i} className="space-y-4 m-2 p-2 border-2">
                <Skeleton key={i} className="m-1 p-1 border-2"/>
                <Skeleton className="font-bold text-2xl max-h-2"/>
                <Skeleton className="border-2 h-6"/>
                <Skeleton className="border-2 h-6"/>
            </div>
        ))}
    </div>
  );
}
