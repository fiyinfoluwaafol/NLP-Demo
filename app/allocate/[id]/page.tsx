import AllocateItems from "@/components/allocate-items"

// Using async to handle dynamic params properly
export default async function AllocateItemsPage({ params }: { params: { id: string } }) {
  const id = params.id; // Await params usage
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Allocate Items</h1>
      <AllocateItems receiptId={id} />
    </div>
  )
} 