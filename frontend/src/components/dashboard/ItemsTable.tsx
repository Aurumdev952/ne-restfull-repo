import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Item } from "@/types/item";
import { DollarSign, Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ItemsTableProps {
  items: Item[];
  onDelete: (id: string) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, onDelete }) => {
  if (items.length === 0) {
    return (
      <p className="text-center text-slate-500 py-8">
        No items match your current filters.
      </p>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <TableCell className="font-medium text-slate-700">
                  {item.name}
                </TableCell>
                {/* <TableCell>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{item.category}</Badge>
                </TableCell> */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    {item.price.toFixed(2)}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10"
                        >
                          <Link to={`/dashboard/items/${item.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Item</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="text-slate-500 hover:text-brand-secondary hover:bg-brand-secondary/10"
                        >
                          <Link to={`/dashboard/items/update/${item.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Item</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:text-red-500 hover:bg-red-100"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Item</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default ItemsTable;
