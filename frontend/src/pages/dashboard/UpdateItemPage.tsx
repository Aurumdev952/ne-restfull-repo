import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import UpdateItemForm from '@/components/dashboard/UpdateItemForm';
import type { ItemFormData } from '@/lib/zodSchemas';
import { getItemById, updateItem as updateItemService } from '@/services/itemService';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpdateItemPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetcher = (id: string | undefined) => id ? getItemById(id) : Promise.resolve(undefined);
  const { data: item, error, isLoading: itemLoading } = useSWR(itemId, fetcher);

  const handleUpdateItem = async (data: ItemFormData) => {
    if (!itemId) return;
    setIsSubmitting(true);
    try {
      const updatedItem = await updateItemService(itemId, data);
      if (updatedItem) {
        toast.success(`Item "${updatedItem.name}" updated successfully!`);
        // Revalidate SWR cache for this item and lists
        mutate(itemId, updatedItem, false); // Update local cache immediately
        mutate((key) => typeof key === 'string' && key.startsWith('/items/cards'), undefined, { revalidate: true });
        mutate((key) => typeof key === 'string' && key.startsWith('/items/table'), undefined, { revalidate: true });
        navigate(`/dashboard/items/${updatedItem.id}`);
      } else {
        toast.error('Failed to update item: Item not found after update.');
      }
    } catch (error) {
      toast.error('Failed to update item. Please try again.');
      console.error("Update item error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (itemLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
    </div>
  );

  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-md">Error loading item details for update.</div>;
  if (!item) return <div className="text-slate-500 p-4 bg-yellow-50 rounded-md">Item not found for update.</div>;

  return (
    <div className="space-y-6">
       <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <UpdateItemForm item={item} onSubmit={handleUpdateItem} isSubmitting={isSubmitting} />
    </div>
  );
};

export default UpdateItemPage;
