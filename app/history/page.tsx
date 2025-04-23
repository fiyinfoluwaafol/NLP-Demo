import HistoryGrid from "@/components/history-grid"

export default function HistoryPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Receipt History</h1>
      <HistoryGrid />
    </div>
  )
}
