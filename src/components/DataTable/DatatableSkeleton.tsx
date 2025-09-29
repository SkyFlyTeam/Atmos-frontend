import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function SkeletonTable() {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex gap-4">
            <Skeleton className="h-3 w-[100px]" />
            <Skeleton className="h-3 w-[100px]" />
        </div>
        <div className="border rounded-lg">
        <Table className="w-full">
            <TableHeader>
            <TableRow>
                <TableHead>
                <Skeleton className="h-3 w-[100px]" />
                </TableHead>
                <TableHead>
                <Skeleton className="h-3 w-[100px]" />
                </TableHead>
                <TableHead>
                <Skeleton className="h-3 w-[100px]" />
                </TableHead>
                <TableHead>
                <Skeleton className="h-3 w-[100px]" />
                </TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}