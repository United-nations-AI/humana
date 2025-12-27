"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-rights-primary/20 to-rights-accent/20 border border-rights-primary/30 text-white/90 text-sm backdrop-blur-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-rights-accent animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-rights-primary-light animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-rights-secondary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span>Multilingual • Voice & Text • Real-time AI</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block text-white">Artificial Intelligence</span>
                <span className="block bg-gradient-to-r from-rights-primary-light via-rights-secondary to-rights-accent bg-clip-text text-transparent">
                  for Human Rights
                </span>
                <span className="block text-white text-4xl md:text-5xl mt-2">
                  Advocacy & Analysis
                </span>
              </h1>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-12 h-px bg-gradient-to-r from-rights-primary to-transparent"></div>
                <span className="text-sm font-medium">
                  <span className="font-bold text-rights-primary-light">HUMANA</span> • AIHRP Program
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl">
              <span className="font-semibold text-rights-primary-light">HUMANA</span> - A transformative platform empowering Human Rights organizations and advocates worldwide through cutting-edge AI technology. Facilitate real-time interaction, historical analysis, and actionable insights to preserve human rights and address violations.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
              <div className="text-center p-4 rounded-xl bg-rights-primary/10 border border-rights-primary/20">
                <div className="text-2xl font-bold text-rights-primary-light mb-1">2000+</div>
                <div className="text-xs text-white/70">Years of Data</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-rights-accent/10 border border-rights-accent/20">
                <div className="text-2xl font-bold text-rights-accent-light mb-1">Global</div>
                <div className="text-xs text-white/70">Platform</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-rights-secondary/10 border border-rights-secondary/20">
                <div className="text-2xl font-bold text-rights-secondary-light mb-1">Real-time</div>
                <div className="text-xs text-white/70">Analytics</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-rights-primary/10 border border-rights-primary/20">
                <div className="text-2xl font-bold text-rights-primary-light mb-1">10+</div>
                <div className="text-xs text-white/70">Languages</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/login" className="btn btn-primary px-8 py-4 text-lg">
                Get Started
              </Link>
              <Link href="/about" className="btn btn-secondary px-8 py-4 text-lg">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column - Avatar */}
          <div className="relative">
            <div className="glass rounded-3xl p-8 shadow-2xl">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-rights-primary/30 to-rights-accent/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-gradient-to-br from-rights-secondary/30 to-rights-primary/30 rounded-full blur-3xl"></div>
              
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gradient-to-br from-rights-primary/40 via-rights-accent/40 to-rights-secondary/40 bg-gradient-to-br from-rights-primary/20 via-rights-accent/20 to-rights-secondary/20 flex items-center justify-center">
                {!imageError ? (
                  <img 
                    src="/humana-avatar.png" 
                    alt="AIHRP AI Avatar" 
                    className="w-full h-full object-contain relative z-10"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="text-center px-4 relative z-10">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-rights-primary to-rights-accent flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-white/60 text-sm">
                      AIHRP Avatar<br />
                      <span className="text-xs">Place humana-avatar.png in /public</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rights-primary-light to-rights-accent bg-clip-text text-transparent">
            Key Capabilities
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Empowering advocates with powerful tools for human rights protection and analysis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform border border-rights-primary/20 hover:border-rights-primary/40">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rights-primary to-rights-primary-light flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive AI Assistant</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Real-time conversational AI offering personalized guidance on advocacy, legal measures, and policy development.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform border border-rights-accent/20 hover:border-rights-accent/40">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rights-accent to-rights-accent-light flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Predictive Analytics</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              AI-powered risk assessment and trend analysis to identify early warning signs and prioritize interventions.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform border border-rights-secondary/20 hover:border-rights-secondary/40">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rights-secondary to-rights-secondary-light flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Historical Database</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Comprehensive repository of human rights violations spanning 2000 years for pattern analysis and insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
