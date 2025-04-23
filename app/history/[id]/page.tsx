import { redirect } from "next/navigation"

// This page redirects to the review page with the same ID
export default function HistoryReceiptPage({ params }: { params: { id: string } }) {
  // Simply redirect to the review page with the same ID
  redirect(`/review/${params.id}`)
} 