export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="h-16 w-16 relative">
        <div className="h-16 w-16 rounded-full border-4 border-t-[#2DD4BF] border-b-[#2DD4BF] border-l-transparent border-r-transparent animate-spin absolute"></div>
        <div className="h-10 w-10 rounded-full border-4 border-t-[#2DD4BF] border-b-[#2DD4BF] border-l-transparent border-r-transparent animate-spin absolute top-3 left-3"></div>
      </div>
    </div>
  )
}
