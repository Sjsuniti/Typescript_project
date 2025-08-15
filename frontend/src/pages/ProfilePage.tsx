import React from 'react'

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="text-secondary-600 mt-1">Manage your account settings</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-secondary-200 p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">Profile Management Coming Soon</h3>
        <p className="text-secondary-600">
          The profile management interface is under development. 
          This will include updating your personal information and preferences.
        </p>
      </div>
    </div>
  )
}

export default ProfilePage
