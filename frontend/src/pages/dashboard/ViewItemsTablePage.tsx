import ItemsTable from "@/components/dashboard/ItemsTable";
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
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import {
  deleteItem as deleteItemService,
  getItemCategories,
  getItems,
} from "@/services/itemService";
import { FilterX, Loader2, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

const ITEMS_PER_PAGE = 10;

const ViewItemsTablePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: categoriesData, isLoading: categoriesLoading } = useSWR(
    "/items/categories",
    getItemCategories
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetcher = ([_, page, search, category]: [
    string,
    number,
    string,
    string
  ]) => getItems(page, ITEMS_PER_PAGE, { name: search, category });

  const { data, error, isLoading, isValidating } = useSWR(
    ["/items/table", currentPage, debouncedSearchTerm, categoryFilter],
    fetcher,
    { keepPreviousData: true }
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteItemService(id);
      toast.success("Item deleted successfully");
      mutate([
        "/items/table",
        currentPage,
        debouncedSearchTerm,
        categoryFilter,
      ]);

      mutate(
        (key) => typeof key === "string" && key.startsWith("/items/cards"),
        undefined,
        { revalidate: true }
      );
      setItemToDelete(null);
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const items = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const paginationItems = [];
    const maxVisiblePages = 5; // Show current page, 2 before, 2 after

    if (totalPages <= 1) return null;

    paginationItems.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(currentPage - 1);
          }}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage - 1 <= 2) {
      // Near the beginning
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (totalPages - currentPage <= 2) {
      // Near the end
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      paginationItems.push(
        <PaginationItem key="1">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        paginationItems.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationItems.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    paginationItems.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(currentPage + 1);
          }}
          className={
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    );

    return paginationItems;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setCurrentPage(1);
  };

  if (error)
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        Failed to load items. Please try again later.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          Items (Paginated Table)
        </h1>
        <Button
          asChild
          className="bg-brand-secondary hover:bg-brand-secondary/90 w-full sm:w-auto"
        >
          <Link to="/dashboard/items/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Item
          </Link>
        </Button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value === "all" ? "" : value);
            setCurrentPage(1);
          }}
          disabled={categoriesLoading}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesData?.map((cat: string) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(searchTerm || categoryFilter) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full md:w-auto"
          >
            <FilterX className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>

      {(isLoading && !data) || (isValidating && items.length === 0) ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
        </div>
      ) : (
        <ItemsTable items={items} onDelete={(id) => setItemToDelete(id)} />
      )}

      {totalPages > 0 && (
        <Pagination>
          <PaginationContent>{renderPaginationItems()}</PaginationContent>
        </Pagination>
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

export default ViewItemsTablePage;
