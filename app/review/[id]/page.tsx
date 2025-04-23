import ReviewTable from "@/components/review-table"

export default function ReviewReceiptPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Review Receipt</h1>
      <ReviewTable receiptId={params.id} />
    </div>
  )
} 