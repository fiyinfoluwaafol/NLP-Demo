"use client"

import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type ReceiptItem = {
  id: string
  description: string
  amount: number
}

interface MemberItem extends ReceiptItem {
  amountShare: number
  totalParticipants: number
}

interface PersonDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: {
    id: string
    name: string
    avatarUrl: string
    amountDue: number
  } | null
  memberItems: MemberItem[]
}

export default function PersonDetailModal({
  open,
  onOpenChange,
  member,
  memberItems,
}: PersonDetailModalProps) {
  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <DialogTitle className="text-xl">{member.name}</DialogTitle>
            <DialogDescription>
              Total amount: <span className="font-medium text-[#2DD4BF]">${member.amountDue.toFixed(2)}</span>
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </DialogHeader>

        <div className="py-4">
          <h3 className="font-medium mb-3">Expense Breakdown</h3>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3">
              {memberItems.length > 0 ? (
                memberItems.map((item) => (
                  <div key={item.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{item.description}</div>
                        {item.totalParticipants > 1 && (
                          <div className="text-xs text-gray-500">
                            Split {item.totalParticipants} ways (${item.amount.toFixed(2)} total)
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#2DD4BF]">${item.amountShare.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No items assigned to this member
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
} 