import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  Map, 
  TrendingUp, 
  Lightbulb, 
  Clock,
  Search,
  Filter
} from 'lucide-react'

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - replace with real data from API
  const recentNotes = [
    { id: 1, title: 'React Performance Tips', summary: 'Key strategies for optimizing React applications...', category: 'Development', updatedAt: '2 hours ago' },
    { id: 2, title: 'Machine Learning Basics', summary: 'Introduction to ML concepts and algorithms...', category: 'AI/ML', updatedAt: '1 day ago' },
    { id: 3, title: 'Project Management Notes', summary: 'Best practices for team collaboration...', category: 'Business', updatedAt: '3 days ago' },
  ]

  const recentCanvases = [
    { id: 1, name: 'Web Development Roadmap', noteCount: 12, updatedAt: '1 day ago' },
    { id: 2, name: 'Product Strategy', noteCount: 8, updatedAt: '2 days ago' },
    { id: 3, name: 'Learning Path', noteCount: 15, updatedAt: '1 week ago' },
  ]

  const stats = [
    { label: 'Total Notes', value: '47', icon: FileText, color: 'text-blue-600' },
    { label: 'Knowledge Maps', value: '12', icon: Map, color: 'text-green-600' },
    { label: 'AI Insights', value: '23', icon: Lightbulb, color: 'text-purple-600' },
    { label: 'This Week', value: '+8', icon: TrendingUp, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">Welcome back! Here's what's happening with your knowledge.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link to="/app/notes" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Link>
          <Link to="/app/canvas" className="btn btn-outline">
            <Map className="w-4 h-4 mr-2" />
            New Canvas
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search your notes, ideas, and knowledge maps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button className="btn btn-outline px-4">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white p-6 rounded-lg border border-secondary-200 shadow-soft">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-secondary-100 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="bg-white rounded-lg border border-secondary-200 shadow-soft">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Notes</h3>
              <Link to="/app/notes" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <div key={note.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-secondary-900 truncate">{note.title}</h4>
                    <p className="text-xs text-secondary-600 mt-1 line-clamp-2">{note.summary}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                        {note.category}
                      </span>
                      <span className="text-xs text-secondary-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {note.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Canvases */}
        <div className="bg-white rounded-lg border border-secondary-200 shadow-soft">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Canvases</h3>
              <Link to="/app/canvas" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCanvases.map((canvas) => (
                <div key={canvas.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                      <Map className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-900">{canvas.name}</h4>
                      <p className="text-xs text-secondary-600">{canvas.noteCount} notes</p>
                    </div>
                  </div>
                  <span className="text-xs text-secondary-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {canvas.updatedAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-secondary-900">Write Note</p>
              <p className="text-sm text-secondary-600">Capture your thoughts</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
              <Map className="w-5 h-5 text-accent-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-secondary-900">Create Map</p>
              <p className="text-sm text-secondary-600">Visualize connections</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white rounded-lg border border-secondary-200 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Lightbulb className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-secondary-900">AI Insights</p>
              <p className="text-sm text-secondary-600">Discover patterns</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
