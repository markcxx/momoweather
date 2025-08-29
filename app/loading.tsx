export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-12 h-12">
        <div 
          className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"
          style={{
            animation: 'spin 1s linear infinite'
          }}
        />
      </div>
    </div>
  )
}
