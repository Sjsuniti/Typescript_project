import React from 'react'

const CanvasPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Canvas Editor</h1>
          <p className="text-secondary-600 mt-1">Create and edit your knowledge maps</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-secondary-200 p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎨</span>
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">Canvas Editor Coming Soon</h3>
        <p className="text-secondary-600">
          The interactive mind mapping interface is under development. 
          This will include React Flow integration for creating visual knowledge networks.
        </p>
      </div>
    </div>
  )
}

export default CanvasPage
