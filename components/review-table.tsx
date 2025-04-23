"use client"

import type React from "react"

import { useState } from "react"
import { Check, X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

// Mock data
const initialItems = [
  { id: 1, vendor: "Grocery Store", date: "2025-04-15", amount: 24.99, items: "Milk, Bread, Eggs" },
  { id: 2, vendor: "Restaurant", date: "2025-04-14", amount: 45.5, items: "Dinner, Drinks" },
  { id: 3, vendor: "Gas Station", date: "2025-04-13", amount: 35.75, items: "Fuel" },
]

type Item = {
  id: number
  vendor: string
  date: string
  amount: number
  items: string
}

export default function ReviewTable() {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [editingCell, setEditingCell] = useState<{ id: number; field: keyof Item } | null>(null)
  const [editValue, setEditValue] = useState<string>("")

  const startEditing = (id: number, field: keyof Item, value: string | number) => {
    setEditingCell({ id, field })
    setEditValue(String(value))
  }

  const cancelEditing = () => {
    setEditingCell(null)
  }

  const saveEdit = (id: number, field: keyof Item) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === "amount" ? Number.parseFloat(editValue) : editValue,
          }
        }
        return item
      }),
    )

    setEditingCell(null)

    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully.",
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: number, field: keyof Item) => {
    if (e.key === "Enter") {
      saveEdit(id, field)
    } else if (e.key === "Escape") {
      cancelEditing()
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="uppercase text-xs font-semibold">Vendor</TableHead>
            <TableHead className="uppercase text-xs font-semibold">Date</TableHead>
            <TableHead className="uppercase text-xs font-semibold">Amount</TableHead>
            <TableHead className="uppercase text-xs font-semibold">Items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell onClick={() => startEditing(item.id, "vendor", item.vendor)} className="cursor-pointer">
                {editingCell?.id === item.id && editingCell?.field === "vendor" ? (
                  <div className="flex items-center">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id, "vendor")}
                      autoFocus
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-1"
                      onClick={() => saveEdit(item.id, "vendor")}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center group">
                    <span>{item.vendor}</span>
                    <Edit2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 text-gray-400" />
                  </div>
                )}
              </TableCell>
              <TableCell onClick={() => startEditing(item.id, "date", item.date)} className="cursor-pointer">
                {editingCell?.id === item.id && editingCell?.field === "date" ? (
                  <div className="flex items-center">
                    <Input
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id, "date")}
                      autoFocus
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-1"
                      onClick={() => saveEdit(item.id, "date")}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center group">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <Edit2 className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 text-gray-400" />
                  </div>
                )}
              </TableCell>
              <TableCell onClick={() => startEditing(item.id, "amount", item.amount)} className="cursor-pointer">
                {editingCell?.id === item.id && editingCell?.field === "amount" ? (
                  <div className="flex items-center">
                    <Input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id, "amount")}
                      autoFocus
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-1"
                      onClick={() => saveEdit(item.id, "amount")}
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
              <TableCell onClick={() => startEditing(item.id, "items", item.items)} className="cursor-pointer">
                {editingCell?.id === item.id && editingCell?.field === "items" ? (
                  <div className="flex items-center">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id, "items")}
                      autoFocus
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 ml-1"
                      onClick={() => saveEdit(item.id, "items")}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center group">
                    <span>{item.items}</span>
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
            // TODO: fetch('/api/review/save', { method: 'POST', body: JSON.stringify(items) })
            toast({
              title: "Review completed",
              description: "Moving to allocation page.",
            })
            window.location.href = "/allocate"
          }}
        >
          Continue to Allocation
        </Button>
      </div>
    </div>
  )
}
