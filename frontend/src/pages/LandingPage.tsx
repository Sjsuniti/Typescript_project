import { Link } from 'react-router-dom'
import { Brain, Lightbulb, Network, Zap, ArrowRight, CheckCircle } from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Automatically extract keywords, generate summaries, and discover connections between your ideas.'
    },
    {
      icon: Network,
      title: 'Visual Knowledge Maps',
      description: 'Transform your notes into interactive mind maps that reveal relationships and patterns.'
    },
    {
      icon: Zap,
      title: 'Smart Organization',
      description: 'Let AI categorize and tag your content for effortless retrieval and organization.'
    },
    {
      icon: Lightbulb,
      title: 'Creative Discovery',
      description: 'Uncover new insights and connections you never knew existed in your knowledge base.'
    }
  ]

  const benefits = [
    'Organize scattered thoughts into coherent knowledge structures',
    'Discover hidden connections between different topics',
    'Generate AI-powered summaries of long documents',
    'Create shareable visual knowledge maps',
    'Access your knowledge from anywhere, anytime',
    'Collaborate with others on knowledge projects'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">MindCanvas</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 mb-6">
          Transform Your
          <span className="block gradient-text">Knowledge</span>
          Into Visual Maps
        </h1>
        <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
          MindCanvas combines the power of AI with intuitive visualization to turn your scattered notes, 
          research, and ideas into interconnected knowledge networks that spark new insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Building Your Knowledge Map
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            Try Demo
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Why Choose MindCanvas?
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Our AI-powered platform helps you organize, connect, and visualize your knowledge like never before.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-secondary-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Unlock Your Knowledge Potential
            </h2>
            <p className="text-xl text-secondary-600">
              Join thousands of researchers, students, and professionals who are already using MindCanvas 
              to organize their thoughts and discover new insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-secondary-900 mb-6">
                What You'll Get
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-secondary-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-secondary-600 mb-6">
                Create your first knowledge map in minutes. No credit card required.
              </p>
              <Link to="/register" className="btn btn-primary w-full">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Knowledge?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the revolution in knowledge management and discovery.
          </p>
          <Link to="/register" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-secondary-200">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MindCanvas</span>
          </div>
          <div className="text-secondary-600 text-sm">
            © 2024 MindCanvas. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
