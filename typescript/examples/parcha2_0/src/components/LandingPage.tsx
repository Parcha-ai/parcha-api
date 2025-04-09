import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronRightIcon, CheckIcon, GlobeIcon } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b bg-white sticky top-0 z-40">
        <div className="flex items-center">
          <span className="text-xl font-bold text-indigo-600">Parcha</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#compliance" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Compliance</a>
          <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#company" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Company</a>
          <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">Log in</Button>
          <Link to="/agents">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
          </Link>
        </nav>
        <Button className="md:hidden" variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </Button>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Don't let<br />
                compliance<br />
                become your<br />
                bottleneck
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Follow compliance checks with efficient workflows. Check individuals and businesses in just minutes, and get your global compliance handled in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/agents">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 rounded-md">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl"></div>
              
              {/* Risk Analysis Card */}
              <div className="absolute top-[5%] left-[8%] h-16 w-64 bg-white rounded-md shadow-lg flex flex-col p-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs font-medium text-gray-700">Risk Analysis</span>
                </div>
                <div className="mt-2 h-2 w-3/4 bg-green-200 rounded-full"></div>
                <div className="mt-1 h-2 w-1/2 bg-green-100 rounded-full"></div>
              </div>
              
              {/* PEP Screening Card */}
              <div className="absolute top-[25%] right-[5%] h-20 w-56 bg-white rounded-md shadow-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-700">PEP Screening</span>
                  <div className="h-4 w-4 rounded-full bg-indigo-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded bg-indigo-100 mr-2"></div>
                  <div className="flex-1">
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div className="h-2 w-[30%] bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <div className="h-3 w-3 rounded-full bg-gray-200 mr-1"></div>
                  <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                </div>
              </div>
              
              {/* Sanctions Check Card */}
              <div className="absolute bottom-[10%] left-[6%] h-20 w-52 bg-white rounded-md shadow-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Sanctions Check</span>
                  <div className="px-2 py-0.5 bg-green-100 rounded text-xs text-green-700">Passed</div>
                </div>
                <div className="flex space-x-1">
                  <div className="h-3 w-8 bg-green-500 rounded-sm"></div>
                  <div className="h-3 w-6 bg-green-400 rounded-sm"></div>
                  <div className="h-3 w-10 bg-green-300 rounded-sm"></div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-[10px] text-gray-500">No matches found</span>
                </div>
              </div>
              
              {/* Compliance Score Card */}
              <div className="absolute bottom-[15%] right-[7%] h-24 w-48 bg-white rounded-md shadow-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-700">Compliance Score</span>
                  <span className="text-xs font-bold text-indigo-600">95%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full mb-2">
                  <div className="h-2 w-[95%] bg-indigo-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="h-3 w-full bg-green-100 rounded-sm"></div>
                  <div className="h-3 w-full bg-green-100 rounded-sm"></div>
                  <div className="h-3 w-full bg-green-100 rounded-sm"></div>
                  <div className="h-3 w-full bg-green-100 rounded-sm"></div>
                  <div className="h-3 w-full bg-green-100 rounded-sm"></div>
                  <div className="h-3 w-full bg-yellow-100 rounded-sm"></div>
                </div>
              </div>
              
              {/* AML Screening Card */}
              <div className="absolute top-[10%] right-[35%] h-16 w-52 bg-white rounded-md shadow-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-700">AML Screening</span>
                  <div className="px-2 py-0.5 bg-green-100 rounded text-xs text-green-700">Clear</div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div className="h-2 w-full bg-green-500 rounded-full"></div>
                </div>
                <div className="mt-1 flex items-center">
                  <span className="text-[10px] text-gray-500">Last updated: Today</span>
                </div>
              </div>
              
              {/* Adverse Media Card */}
              <div className="absolute top-[55%] left-[10%] h-20 w-56 bg-white rounded-md shadow-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-700">Adverse Media</span>
                  <div className="h-4 w-4 rounded-full bg-yellow-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  </div>
                </div>
                <div className="flex space-x-1 mb-1">
                  <div className="h-2 w-12 bg-yellow-200 rounded-sm"></div>
                  <div className="h-2 w-8 bg-yellow-200 rounded-sm"></div>
                  <div className="h-2 w-10 bg-yellow-200 rounded-sm"></div>
                </div>
                <div className="text-[10px] text-yellow-600">2 potential matches found</div>
                <div className="mt-1 text-[8px] text-gray-500">Review required</div>
              </div>
              
              {/* Identity Verification Card */}
              <div className="absolute bottom-[42%] right-[15%] h-16 w-54 bg-white rounded-md shadow-lg p-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs font-medium text-gray-700">Identity Verification</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex">
                    <div className="h-4 w-4 bg-green-100 rounded-sm flex items-center justify-center mr-1">
                      <div className="h-2 w-2 bg-green-500 rounded-sm"></div>
                    </div>
                    <div className="h-4 w-4 bg-green-100 rounded-sm flex items-center justify-center mr-1">
                      <div className="h-2 w-2 bg-green-500 rounded-sm"></div>
                    </div>
                    <div className="h-4 w-4 bg-green-100 rounded-sm flex items-center justify-center">
                      <div className="h-2 w-2 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-green-600">Verified</span>
                </div>
              </div>
              
              {/* Transaction Monitoring Alert */}
              <div className="absolute top-[40%] left-[40%] h-14 w-48 bg-white rounded-md shadow-lg p-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs font-medium text-gray-700">Transaction Alert</span>
                </div>
                <div className="mt-1 text-[10px] text-red-600 flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Unusual activity detected
                </div>
              </div>
              
              {/* Indicator Dots */}
              <div className="absolute top-[5%] right-[8%] flex space-x-1">
                <div className="h-5 w-5 rounded-full bg-white shadow-md flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-500"></div>
                </div>
                <div className="h-5 w-5 rounded-full bg-white shadow-md flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="h-5 w-5 rounded-full bg-white shadow-md flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
                </div>
              </div>
              
              {/* Small Status Badges */}
              <div className="absolute bottom-[5%] right-[35%] flex space-x-2">
                <div className="px-2 py-0.5 bg-white rounded-full shadow-sm text-[10px] font-medium text-green-600">KYC ✓</div>
                <div className="px-2 py-0.5 bg-white rounded-full shadow-sm text-[10px] font-medium text-green-600">KYB ✓</div>
                <div className="px-2 py-0.5 bg-white rounded-full shadow-sm text-[10px] font-medium text-green-600">AML ✓</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Trust badges section */}
        <section className="py-8 border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">
                trusted by global compliance teams.
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-8 md:gap-16">
              {/* Replace with actual company logos */}
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </section>

        {/* Automate your manual compliance reviews */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Automate your manual compliance reviews</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">PEP Screening</h3>
              <p className="text-gray-600 text-sm">
                Automatically screen individuals against global politically exposed persons databases.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sanctions Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Keep track of changes in global sanctions lists and receive alerts for matches.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Adverse Media</h3>
              <p className="text-gray-600 text-sm">
                Identify negative news and reputational risks with advanced media screening.
              </p>
            </div>
          </div>
          
          {/* Feature highlight with image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Streamlined compliance workflows</h3>
              <p className="text-gray-600 mb-6">
                Our platform provides end-to-end compliance solutions with intuitive workflows and automated checks.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Automated screening</p>
                    <p className="text-sm text-gray-600">Screen individuals and businesses with a single click</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Simple case management</p>
                    <p className="text-sm text-gray-600">Easily track and manage all compliance cases</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Comprehensive audit trails</p>
                    <p className="text-sm text-gray-600">Maintain detailed records for regulatory compliance</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Screenshot placeholder */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-80"></div>
          </div>
        </section>
        
        {/* 10x faster and cheaper section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Parcha makes compliance reviews 10x faster and cheaper</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - blue box */}
            <div className="bg-blue-600 rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Before</h3>
              <p className="mb-4">Manual compliance checks require hours of research and endless documentation, causing delays and bottlenecks.</p>
              <div className="h-48 bg-blue-500 rounded-lg"></div>
            </div>
            
            {/* Right side - white box */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">After</h3>
              <p className="mb-4 text-gray-700">Parcha automates the entire process, delivering accurate results in minutes with comprehensive documentation.</p>
              <div className="h-48 bg-gray-50 rounded-lg border border-gray-200"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-card px-4 sm:px-6 lg:px-8 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                <span className="mr-2">✨</span>
                Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-card-foreground">Powerful Features</h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to get things done efficiently and effortlessly.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow transition-shadow border group hover:border-accent/50">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <svg className="h-7 w-7 text-accent group-hover:text-accent-foreground transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">Lightning Fast Performance</h3>
                <p className="text-muted-foreground">Get your work done in record time with our optimized performance. Our app is built with speed in mind, ensuring a smooth experience.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow transition-shadow border group hover:border-accent/50">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <svg className="h-7 w-7 text-accent group-hover:text-accent-foreground transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">Enhanced Security</h3>
                <p className="text-muted-foreground">Your data is protected with enterprise-grade security measures. We employ the latest technology to keep your information safe.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow transition-shadow border group hover:border-accent/50">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <svg className="h-7 w-7 text-accent group-hover:text-accent-foreground transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">Intuitive Design</h3>
                <p className="text-muted-foreground">A beautiful interface designed for maximum productivity and ease of use. Every element is thoughtfully crafted for a seamless experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent text-accent-foreground">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
              Join thousands of satisfied users and experience the future of productivity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/agents">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Launch Application
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full bg-transparent border-accent-foreground/20 hover:bg-accent-foreground/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* System intelligence section */}
        <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">The system of <span className="text-indigo-600">focused</span> intelligence for compliance</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Our platform leverages advanced AI and machine learning to deliver precise compliance insights while minimizing false positives.
            </p>
            
            {/* Image placeholder */}
            <div className="h-64 bg-white rounded-lg border border-gray-200 max-w-4xl mx-auto"></div>
          </div>
        </section>
        
        {/* Onboard customers section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Onboard customers in real-time</h2>
              <p className="text-gray-600 mb-8">
                Conduct thorough compliance checks without delaying your customer onboarding process. Get instant results and make informed decisions.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">Seamless integration with your existing systems</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">Automated risk assessment and scoring</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">Comprehensive report generation</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Learn more
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            
            {/* Screenshot placeholder */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-96"></div>
          </div>
        </section>
        
        {/* Deep research section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Screenshot placeholder */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-96 order-2 md:order-1"></div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Deep research for businesses & individuals</h2>
              <p className="text-gray-600 mb-8">
                Access comprehensive data on individuals and businesses from around the world. Our platform aggregates information from thousands of sources.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">Business structure and beneficial ownership</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">Individual profiles with relationship mapping</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">Historical compliance and regulatory data</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Learn more
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Continuous monitoring section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Continuous monitoring of every entity</h2>
              <p className="text-gray-600 mb-8">
                Stay compliant with real-time alerts when changes occur. Our system continuously monitors all entities for regulatory changes and new risks.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">24/7 monitoring of all compliance factors</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">Instant notifications for critical changes</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-indigo-600" />
                  </div>
                  <p className="text-gray-700">Detailed change logs and audit trails</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Learn more
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            
            {/* Screenshot placeholder */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-96"></div>
          </div>
        </section>

        {/* Global coverage map */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Borders aren't boundaries for compliance reporting</h2>
          
          {/* World map placeholder */}
          <div className="bg-indigo-50 rounded-lg p-8 h-96 max-w-5xl mx-auto mb-8 flex items-center justify-center">
            <GlobeIcon className="h-24 w-24 text-indigo-200" />
          </div>
          
          {/* Country badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {['US', 'UK', 'EU', 'CA', 'AU', 'SG', 'HK', 'JP', 'BR', 'AE'].map((country) => (
              <div key={country} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                {country}
              </div>
            ))}
            <div className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
              +100 more
            </div>
          </div>
        </section>
        
        {/* Compliance agents section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Agents for all of your compliance needs</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Tailor your compliance processes with our specialized agents, each designed for specific compliance requirements.
          </p>
          
          {/* Agent selector */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between mb-6">
                <p className="font-medium">Select an agent:</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create agent
                </Button>
              </div>
              
              {/* Agent cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Agent 1 */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-300 cursor-pointer">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm">KYC Agent</p>
                      <p className="text-xs text-green-600">Active</p>
                    </div>
                  </div>
                </div>
                
                {/* Agent 2 */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-300 cursor-pointer">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2h9zm-3-3h2v2h-2v-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Business Screening</p>
                      <p className="text-xs text-green-600">Active</p>
                    </div>
                  </div>
                </div>
                
                {/* Agent 3 */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-300 cursor-pointer">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm">AML Screening</p>
                      <p className="text-xs text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Agent types */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-3 bg-white hover:border-indigo-300 cursor-pointer">
                  <p className="text-sm font-medium">KYC</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 bg-white hover:border-indigo-300 cursor-pointer">
                  <p className="text-sm font-medium">KYB</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 bg-white hover:border-indigo-300 cursor-pointer">
                  <p className="text-sm font-medium">AML</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 bg-white hover:border-indigo-300 cursor-pointer">
                  <p className="text-sm font-medium">Custom</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Trust and security section */}
        <section className="py-20 bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3">Trust and security is our highest priority</h2>
            <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto">
              We deploy enterprise-grade security measures to ensure your data is always protected.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Security feature 1 */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold mb-3">ISO 27001</h3>
                <p className="text-sm text-gray-400">
                  Our platform is certified with ISO 27001, ensuring the highest standards of information security management.
                </p>
              </div>
              
              {/* Security feature 2 */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold mb-3">General</h3>
                <p className="text-sm text-gray-400">
                  We employ end-to-end encryption, regular security audits, and follow industry best practices to protect your data.
                </p>
              </div>
              
              {/* Security feature 3 */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold mb-3">Security</h3>
                <p className="text-sm text-gray-400">
                  Our dedicated security team continuously monitors our systems to identify and address potential vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">Parcha</span>
            </div>
            
            <div className="flex space-x-8">
              <a href="#" className="text-sm text-gray-300 hover:text-white">Privacy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white">Terms</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white">Cookies</a>
            </div>
          </div>
          
          <div className="border-t border-indigo-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-sm text-gray-400">&copy; 2025 Parcha. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-400">All systems operational</span>
              </div>
              <a href="#" className="text-xs text-indigo-400 hover:text-white">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 