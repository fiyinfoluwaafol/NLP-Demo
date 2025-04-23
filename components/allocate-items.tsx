"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { getReceipt, members, allocateItems } from "@/lib/mockData"
import LoadingSpinner from "@/components/loading-spinner"

interface AllocateItemsProps {
  receiptId: string
}

type Item = {
  id: string
  description: string
  amount: number
  checked: boolean
  assignedTo: string[]
}

type Member = {
  id: string
  name: string
  avatarUrl: string
}

type Receipt = {
  id: string
  vendor: string
  date: string
  total: number
  items: Array<{id: string, description: string, amount: number}>
  allocations: Record<string, string[]>
}

export default function AllocateItems({ receiptId }: AllocateItemsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  useEffect(() => {
    async function loadReceipt() {
      try {
        const data: any = await getReceipt(receiptId)
        setReceipt(data as unknown as Receipt)
        
        // Transform receipt items to include UI-specific fields
        const transformedItems = data.items.map((item: any) => {
          const itemId = item.id as string;
          return {
            id: itemId,
            description: item.description,
            amount: item.amount,
            checked: false,
            assignedTo: data.allocations && itemId in data.allocations ? data.allocations[itemId] : []
          };
        });
        
        setItems(transformedItems)
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

  const handleCheckItem = (itemId: string, checked: boolean) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, checked } : item)))

    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  const assignItemToMember = (itemId: string, memberId: string) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const isAlreadyAssigned = item.assignedTo.includes(memberId)

          return {
            ...item,
            assignedTo: isAlreadyAssigned
              ? item.assignedTo.filter((id) => id !== memberId)
              : [...item.assignedTo, memberId],
          }
        }
        return item
      }),
    )
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const memberId = destination.droppableId.replace("member-", "")

    // Handle dropping on a member
    if (destination.droppableId.startsWith("member-")) {
      selectedItems.forEach((itemId) => {
        assignItemToMember(itemId, memberId)
      })

      toast({
        title: "Items assigned",
        description: `${selectedItems.length} item(s) assigned to ${members.find((m) => m.id === memberId)?.name}`,
      })
    }
  }

  const handleSubmit = async () => {
    if (!receipt) return
    
    setIsLoading(true)

    try {
      // Prepare allocations object from items
      const allocationsData: Record<string, string[]> = {}
      items.forEach(item => {
        if (item.assignedTo.length > 0) {
          allocationsData[item.id] = item.assignedTo
        }
      })
      
      // Save allocations
      await allocateItems(receipt.id, allocationsData)

      toast({
        title: "Allocation saved",
        description: "Your expense allocation has been saved successfully.",
      })

      // Redirect to summary page
      router.push(`/summary/${receipt.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your allocation.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  const hasAssignments = items.some((item) => item.assignedTo.length > 0)

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border rounded-md p-4">
          <h2 className="text-lg font-medium mb-4">Receipt Items</h2>
          <Droppable droppableId="items">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center justify-between p-3 rounded-md border ${
                          item.checked ? "bg-gray-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`item-${item.id}`}
                            checked={item.checked}
                            onCheckedChange={(checked) => handleCheckItem(item.id, checked as boolean)}
                          />
                          <label htmlFor={`item-${item.id}`} className="text-sm font-medium cursor-pointer">
                            {item.description}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">${item.amount.toFixed(2)}</span>
                          {item.assignedTo.length > 0 && (
                            <div className="ml-3 flex -space-x-1">
                              {item.assignedTo.map((memberId) => {
                                const member = members.find((m) => m.id === memberId)
                                return (
                                  <Avatar key={memberId} className="h-6 w-6 border-2 border-white">
                                    <AvatarImage src={member?.avatarUrl || "/placeholder.svg"} alt={member?.name} />
                                    <AvatarFallback className="text-xs">{member?.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="mt-4 text-sm text-gray-500">
            <p>Drag items to assign them to group members, or click on a member after selecting items.</p>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h2 className="text-lg font-medium mb-4">Group Members</h2>
          <div className="space-y-4">
            {members.map((member) => (
              <Droppable key={member.id} droppableId={`member-${member.id}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 rounded-md border transition-colors ${
                      snapshot.isDraggingOver ? "bg-[#2DD4BF]/10 border-[#2DD4BF]" : ""
                    }`}
                    onClick={() => {
                      if (selectedItems.length > 0) {
                        selectedItems.forEach((itemId) => {
                          assignItemToMember(itemId, member.id)
                        })

                        toast({
                          title: "Items assigned",
                          description: `${selectedItems.length} item(s) assigned to ${member.name}`,
                        })
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatarUrl || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">
                          {items.filter((item) => item.assignedTo.includes(member.id)).length} items
                        </p>
                      </div>
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90"
          disabled={!hasAssignments || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Saving..." : "Confirm Splits"}
        </Button>
      </div>
    </DragDropContext>
  )
}
