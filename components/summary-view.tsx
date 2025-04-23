"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ClipboardEdit } from "lucide-react"
import { getReceipt, members } from "@/lib/mockData"
import LoadingSpinner from "@/components/loading-spinner"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

interface MemberShare {
  id: string
  name: string
  avatarUrl: string
  amountDue: number
}

interface SummaryViewProps {
  receiptId: string
}

export default function SummaryView({ receiptId }: SummaryViewProps) {
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [memberShares, setMemberShares] = useState<MemberShare[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReceipt() {
      try {
        const data = await getReceipt(receiptId)
        const receiptData = data as unknown as Receipt
        setReceipt(receiptData)
        
        // Calculate each member's share
        calculateMemberShares(receiptData)
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

  const calculateMemberShares = (receiptData: Receipt) => {
    const shares: MemberShare[] = members.map(member => ({
      id: member.id,
      name: member.name,
      avatarUrl: member.avatarUrl,
      amountDue: 0
    }))

    // For each item in the receipt
    receiptData.items.forEach(item => {
      const allocatedMembers = receiptData.allocations[item.id] || []
      
      if (allocatedMembers.length > 0) {
        // Calculate the split amount per member
        const amountPerMember = item.amount / allocatedMembers.length
        
        // Add the split amount to each member's total
        allocatedMembers.forEach(memberId => {
          const memberIndex = shares.findIndex(member => member.id === memberId)
          if (memberIndex !== -1) {
            shares[memberIndex].amountDue += amountPerMember
          }
        })
      }
    })

    setMemberShares(shares)
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!receipt) {
    return <div className="p-8 text-center">Receipt not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => router.push('/history')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>

        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => router.push(`/review/${receipt.id}`)}
        >
          <ClipboardEdit className="h-4 w-4" />
          Review Details
        </Button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Expense Summary</h1>
        <div className="text-lg text-gray-600 mt-2">{receipt.vendor}</div>
        <div className="text-sm text-gray-500">{new Date(receipt.date).toLocaleDateString()}</div>
        <div className="text-xl font-semibold mt-2">${receipt.total.toFixed(2)}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {memberShares.map(member => (
          <Card key={member.id} className={`${member.amountDue > 0 ? 'border-[#2DD4BF]' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500">
                    {member.amountDue > 0 ? 'Owes' : 'Not participating'}
                  </div>
                </div>
              </div>
              <div className={`text-xl font-semibold ${member.amountDue > 0 ? 'text-[#2DD4BF]' : 'text-gray-400'}`}>
                ${member.amountDue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 