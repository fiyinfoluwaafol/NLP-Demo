"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { getReceipt, updateReceipt } from "@/lib/mockData"
import LoadingSpinner from "@/components/loading-spinner"

interface ReviewTableProps {
  receiptId: string
}

type ReceiptItem = {
  id: string
  description: string
  amount: number
}

interface Receipt {
  id: string
  vendor: string
  date: string
  total: number
  items: ReceiptItem[]
  allocations: Record<string, string[]>
}

export default function ReviewTable({ receiptId }: ReviewTableProps) {
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingCell, setEditingCell] = useState<{ itemId: string; field: keyof ReceiptItem } | null>(null)
  const [editingReceipt, setEditingReceipt] = useState<{ field: keyof Receipt } | null>(null)
  const [editValue, setEditValue] = useState<string>("")

  useEffect(() => {
    async function loadReceipt() {
      try {
        const data = await getReceipt(receiptId)
        // Using unknown first to avoid TypeScript error
        setReceipt(data as unknown as Receipt)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load receipt details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadReceipt()
  }, [receiptId])

  const startEditingItem = (itemId: string, field: keyof ReceiptItem, value: string | number) => {
    setEditingCell({ itemId, field })
    setEditValue(String(value))
  }

  const startEditingReceipt = (field: keyof Receipt, value: string | number) => {
    setEditingReceipt({ field })
    setEditValue(String(value))
  }

  const cancelEditing = () => {
    setEditingCell(null)
    setEditingReceipt(null)
  }

  const saveItemEdit = async (itemId: string, field: keyof ReceiptItem) => {
    if (!receipt) return

    // Find the item and update it
    const updatedItems = receipt.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          [field]: field === "amount" ? Number.parseFloat(editValue) : editValue,
        }
      }
      return item
    })

    // Recalculate total if amount was changed
    let newTotal = receipt.total
    if (field === "amount") {
      const oldAmount = receipt.items.find(item => item.id === itemId)?.amount || 0
      const newAmount = Number.parseFloat(editValue)
      newTotal = receipt.total - oldAmount + newAmount
    }

    try {
      // Update the receipt
      const updatedReceipt = await updateReceipt(receipt.id, { 
        items: updatedItems,
        total: newTotal
      })
      
      // Using unknown first to avoid TypeScript error
      setReceipt(updatedReceipt as unknown as Receipt)
      setEditingCell(null)

      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update the receipt.",
        variant: "destructive",
      })
    }
  }

  const saveReceiptEdit = async (field: keyof Receipt) => {
    if (!receipt) return

    const updatedValue = field === "total" ? Number.parseFloat(editValue) : editValue

    try {
      // Update the receipt
      const updatedReceipt = await updateReceipt(receipt.id, { 
        [field]: updatedValue
      })
      
      // Using unknown first to avoid TypeScript error
      setReceipt(updatedReceipt as unknown as Receipt)
      setEditingReceipt(null)

      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update the receipt.",
        variant: "destructive",
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter") {
      callback()
    } else if (e.key === "Escape") {
      cancelEditing()
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!receipt) {
    return <div className="p-8 text-center">Receipt not found</div>
  }

  return (
    <div className="rounded-md border">
      <div className="p-4 border-b grid grid-cols-3 gap-4">
        <div onClick={() => startEditingReceipt("vendor", receipt.vendor)} className="cursor-pointer">
          {editingReceipt?.field === "vendor" ? (
            <div className="flex items-center">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => saveReceiptEdit("vendor"))}
                autoFocus
                className="h-8"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 ml-1"
                onClick={() => saveReceiptEdit("vendor")}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center group">
              <div>
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="font-medium">{receipt.vendor}</p>
              </div>
              <Edit2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 text-gray-400" />
            </div>
          )}
        </div>
        
        <div onClick={() => startEditingReceipt("date", receipt.date)} className="cursor-pointer">
          {editingReceipt?.field === "date" ? (
            <div className="flex items-center">
              <Input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => saveReceiptEdit("date"))}
                autoFocus
                className="h-8"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 ml-1"
                onClick={() => saveReceiptEdit("date")}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center group">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(receipt.date).toLocaleDateString()}</p>
              </div>
              <Edit2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 text-gray-400" />
            </div>
          )}
        </div>
        
        <div onClick={() => startEditingReceipt("total", receipt.total)} className="cursor-pointer">
          {editingReceipt?.field === "total" ? (
            <div className="flex items-center">
              <Input
                type="number"
                step="0.01"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => saveReceiptEdit("total"))}
                autoFocus
                className="h-8"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 ml-1"
                onClick={() => saveReceiptEdit("total")}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center group">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium">${receipt.total.toFixed(2)}</p>
              </div>
              <Edit2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="uppercase text-xs font-semibold">Item</TableHead>
            <TableHead className="uppercase text-xs font-semibold">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipt.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell onClick={() => startEditingItem(item.id, "description", item.description)} className="cursor-pointer">
                {editingCell?.itemId === item.id && editingCell?.field === "description" ? (
                  <div className="flex items-center">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, () => saveItemEdit(item.id, "description"))}
                      autoFocus
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-1"
                      onClick={() => saveItemEdit(item.id, "description")}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center group">
                    <span>{item.description}</span>
                    <Edit2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 text-gray-400" />
                  </div>
                )}
              </TableCell>
              <TableCell onClick={() => startEditingItem(item.id, "amount", item.amount)} className="cursor-pointer">
                {editingCell?.itemId === item.id && editingCell?.field === "amount" ? (
                  <div className="flex items-center">
                    <Input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, () => saveItemEdit(item.id, "amount"))}
                      autoFocus
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-1"
                      onClick={() => saveItemEdit(item.id, "amount")}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center group">
                    <span>${item.amount.toFixed(2)}</span>
                    <Edit2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 text-gray-400" />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 flex justify-end">
        <Button
          className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90"
          onClick={() => {
            router.push(`/allocate/${receipt.id}`)
          }}
        >
          Continue to Allocation
        </Button>
      </div>
    </div>
  )
}
