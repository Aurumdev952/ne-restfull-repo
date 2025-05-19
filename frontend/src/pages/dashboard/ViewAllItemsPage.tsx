import ItemCard from "@/components/dashboard/ItemCard";
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
import { Button } from "@/components/ui/button";
import {
  deleteItem as deleteItemService,
  getItems,
} from "@/services/itemService";
import type { Item } from "@/types/item";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

const ITEMS_PER_PAGE = 8; // Number of items per page for card view

const ViewAllItemsPage = () => {
  const [page, setPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetcher = ([key, currentPage]: [string, number]) =>
    getItems(currentPage, ITEMS_PER_PAGE);
  const { data, error, isLoading } = useSWR(["/items/cards", page], fetcher, {
    keepPreviousData: true,
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteItemService(id);
      toast.success("Item deleted successfully");
      mutate(["/items/cards", page]); // Revalidate current page
      // Also revalidate table view if it's using a similar key structure
      mutate(
        (key) => typeof key === "string" && key.startsWith("/items/table"),
        undefined,
        { revalidate: true }
      );
      setItemToDelete(null);
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  if (error) return <div className="text-red-500">Failed to load items.</div>;
  if (isLoading && !data)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    );

  const items = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          All Items (Card View)
        </h1>
        <Button
          asChild
          className="bg-brand-secondary hover:bg-brand-secondary/90"
        >
          <Link to="/dashboard/items/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Item
          </Link>
        </Button>
      </div>

      {items.length === 0 && !isLoading ? (
        <p className="text-slate-500 text-center py-10">
          No items found. Start by creating one!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item: Item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={() => setItemToDelete(item.id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-slate-600">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewAllItemsPage;
