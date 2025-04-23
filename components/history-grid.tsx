"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

// Mock data
const initialReceipts = [
  { id: 1, vendor: "Grocery Store", date: "2025-04-15", total: 24.99, items: 3 },
  { id: 2, vendor: "Restaurant", date: "2025-04-14", total: 45.5, items: 2 },
  { id: 3, vendor: "Gas Station", date: "2025-04-13", total: 35.75, items: 1 },
  { id: 4, vendor: "Pharmacy", date: "2025-04-10", total: 12.99, items: 2 },
  { id: 5, vendor: "Coffee Shop", date: "2025-04-08", total: 8.75, items: 3 },
  { id: 6, vendor: "Electronics Store", date: "2025-04-05", total: 129.99, items: 1 },
  { id: 7, vendor: "Bookstore", date: "2025-04-01", total: 42.5, items: 4 },
  { id: 8, vendor: "Hardware Store", date: "2025-03-28", total: 67.25, items: 5 },
]

type Receipt = {
  id: number
  vendor: string
  date: string
  total: number
  items: number
}

export default function HistoryGrid() {
  const [receipts] = useState<Receipt[]>(initialReceipts)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

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
                  <p className="text-sm text-gray-500">{receipt.items} items</p>
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
                <Link href={`/history/${receipt.id}`}>
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
