import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import CreateItemForm from '@/components/dashboard/CreateItemForm';
import type { ItemFormData } from '@/lib/zodSchemas';
import { createItem as createItemService } from '@/services/itemService';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';


const CreateItemPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreateItem = async (data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      const newItem = await createItemService(data);
      toast.success(`Item "${newItem.name}" created successfully!`);
      // Revalidate SWR caches for item lists
      mutate((key) => typeof key === 'string' && key.startsWith('/items/cards'), undefined, { revalidate: true });
      mutate((key) => typeof key === 'string' && key.startsWith('/items/table'), undefined, { revalidate: true });
      navigate(`/dashboard/items/${newItem.id}`);
    } catch (error) {
      toast.error('Failed to create item. Please try again.');
      console.error("Create item error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
       <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <CreateItemForm onSubmit={handleCreateItem} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreateItemPage;
