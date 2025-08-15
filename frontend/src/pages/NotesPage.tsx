import React from 'react'

const NotesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Notes</h1>
          <p className="text-secondary-600 mt-1">Manage your knowledge and ideas</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-secondary-200 p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">Notes Management Coming Soon</h3>
        <p className="text-secondary-600">
          The notes management interface is under development. 
          This will include creating, editing, and organizing your notes with AI assistance.
        </p>
      </div>
    </div>
  )
}

export default NotesPage
