"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)

    try {
      // TODO: fetch('/api/upload', { method: 'POST', body: formData })
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Receipt uploaded",
        description: "Your receipt has been processed successfully.",
      })

      // Redirect to review page
      window.location.href = "/review"
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your receipt.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Upload Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging ? "border-[#2DD4BF] bg-[#2DD4BF]/5" : "border-gray-300 hover:border-[#2DD4BF]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p className="mb-2 text-sm">Drag and drop your receipt here</p>
            <p className="text-xs text-gray-500">or</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>

          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="relative h-48 w-full rounded-md overflow-hidden">
                <Image src={preview || "/placeholder.svg"} alt="Receipt preview" fill className="object-contain" />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-4 bg-[#2DD4BF] hover:bg-[#2DD4BF]/90"
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <FileUp className="mr-2 h-4 w-4 animate-bounce" />
                Processing...
              </>
            ) : (
              "Process"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
