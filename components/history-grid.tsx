"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { getReceipts } from "@/lib/mockData"
import LoadingSpinner from "@/components/loading-spinner"
import { toast } from "@/hooks/use-toast"

type Receipt = {
  id: string
  vendor: string
  date: string
  total: number
  items: Array<{ id: string; description: string; amount: number }>
}

export default function HistoryGrid() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    async function loadReceipts() {
      try {
        const data = await getReceipts()
        setReceipts(data as unknown as Receipt[])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load receipt history.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadReceipts()
  }, [])

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  const totalPages = Math.ceil(receipts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReceipts = receipts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedReceipts.map((receipt) => (
          <Card key={receipt.id} className="transition-all duration-200 hover:shadow-md hover:border-[#2DD4BF] group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{receipt.vendor}</h3>
                  <p className="text-sm text-gray-500">{new Date(receipt.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${receipt.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{receipt.items.length} items</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#2DD4BF] hover:text-[#2DD4BF]/90 hover:bg-[#2DD4BF]/10"
                asChild
              >
                <Link href={`/review/${receipt.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={currentPage === page ? "bg-[#2DD4BF] hover:bg-[#2DD4BF]/90" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
