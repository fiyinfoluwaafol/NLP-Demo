import SummaryView from "@/components/summary-view"

// Using async to handle dynamic params properly
export default async function SummaryPage({ params }: { params: { id: string } }) {
  const id = params.id; // Await params usage
  
  return (
    <div className="container mx-auto">
      <SummaryView receiptId={id} />
    </div>
  )
} 