import AllocateItems from "@/components/allocate-items"

export default function AllocateItemsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Allocate Items</h1>
      <AllocateItems receiptId={params.id} />
    </div>
  )
} 