import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Item } from "@/types/item";
import { DollarSign, Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
  return (
    <Card className="flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-slate-800">
          {item.name}
        </CardTitle>
        {/* <CardDescription className="text-sm text-slate-500 h-10 overflow-hidden text-ellipsis">
          {item.description}
        </CardDescription> */}
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {/* <div className="flex items-center text-sm text-slate-600">
          <Package className="h-4 w-4 mr-2 text-brand-secondary" />
          Category: <Badge variant="outline" className="ml-1 bg-emerald-50 text-emerald-700 border-emerald-200">{item.category}</Badge>
        </div> */}
        <div className="flex items-center text-sm text-slate-600">
          <DollarSign className="h-4 w-4 mr-2 text-brand-primary" />
          Price:{" "}
          <span className="font-semibold ml-1">${item.price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t mt-auto">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="text-brand-primary border-brand-primary hover:bg-brand-primary/10"
        >
          <Link to={`/dashboard/items/${item.id}`}>
            <Eye className="mr-1 h-4 w-4" /> View
          </Link>
        </Button>
        <div className="space-x-2">
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
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-red-500 hover:bg-red-100"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
