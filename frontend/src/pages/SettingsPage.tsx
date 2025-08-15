import React from 'react'

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600 mt-1">Customize your MindCanvas experience</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-secondary-200 p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚙️</span>
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">Settings Coming Soon</h3>
        <p className="text-secondary-600">
          The settings interface is under development. 
          This will include theme preferences, notification settings, and account security options.
        </p>
      </div>
    </div>
  )
}

export default SettingsPage
