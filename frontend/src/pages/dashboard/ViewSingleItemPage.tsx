import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  deleteItem as deleteItemService,
  getItemById,
} from "@/services/itemService";
import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  Edit,
  Layers,
  Loader2,
  Package,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

const ViewSingleItemPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetcher = (id: string | undefined) =>
    id ? getItemById(id) : Promise.resolve(undefined);
  const { data: item, error, isLoading } = useSWR(itemId, fetcher);

  const handleDelete = async () => {
    if (!item) return;
    try {
      await deleteItemService(item.id);
      toast.success(`Item "${item.name}" deleted successfully.`);
      navigate("/dashboard/items/table");
    } catch (err) {
      toast.error("Failed to delete item.");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        Error loading item details.
      </div>
    );
  if (!item)
    return (
      <div className="text-slate-500 p-4 bg-yellow-50 rounded-md">
        Item not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>

      <Card className="overflow-hidden shadow-xl">
        {item.imageUrl && (
          <div className="h-64 w-full overflow-hidden bg-slate-200">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="object-contain w-full h-full"
            />
          </div>
        )}
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-3xl font-bold text-slate-800">
            {item.name}
          </CardTitle>
          <CardDescription className="text-md text-slate-600">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Layers className="h-5 w-5 mr-3 text-brand-secondary" />
              <div>
                <p className="text-sm text-slate-500">Category</p>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800"
                >
                  {item.category}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-3 text-brand-primary" />
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="text-lg font-semibold text-slate-700">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-3 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Stock</p>
                <p className="text-lg font-semibold text-slate-700">
                  {item.stock} units
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-3 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Created At</p>
                <p className="text-md text-slate-700">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-3 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Last Updated</p>
                <p className="text-md text-slate-700">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            asChild
            className="border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10"
          >
            <Link to={`/dashboard/items/update/${item.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete "{item.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewSingleItemPage;
