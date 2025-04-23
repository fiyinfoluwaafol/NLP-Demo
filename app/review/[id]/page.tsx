import ReviewTable from "@/components/review-table"

// Using async to handle dynamic params properly
export default async function ReviewReceiptPage({ params }: { params: { id: string } }) {
  const id = params.id; // Await params usage
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Review Receipt</h1>
      <ReviewTable receiptId={id} />
    </div>
  )
} 