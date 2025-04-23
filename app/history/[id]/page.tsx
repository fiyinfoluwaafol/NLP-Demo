import { redirect } from "next/navigation"

// Using async to handle dynamic params properly
export default async function HistoryReceiptPage({ params }: { params: { id: string } }) {
  const id = params.id; // Await params usage
  
  // Simply redirect to the review page with the same ID
  redirect(`/review/${id}`)
} 