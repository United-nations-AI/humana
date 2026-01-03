export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rights-primary to-rights-accent mb-6 shadow-2xl shadow-rights-primary/30">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-rights-primary-light via-rights-secondary to-rights-accent bg-clip-text text-transparent">
          AIHRP
        </h1>
        <p className="text-xl text-white/90 font-semibold mb-2">
          Artificial Intelligence for Human Rights Advocacy and Analysis Program
        </p>
        <p className="text-white/70 text-lg max-w-3xl mx-auto">
          A transformative platform designed to empower Human Rights organizations and advocates worldwide through cutting-edge AI technology.
        </p>
      </div>

      {/* Overview Section */}
      <div className="glass rounded-2xl p-8 md:p-10 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <span className="w-1 h-8 bg-gradient-to-b from-rights-primary to-rights-accent rounded-full"></span>
          Overview
        </h2>
        <p className="text-white/80 mb-6 leading-relaxed text-lg">
          The <strong className="text-rights-primary-light">Artificial Intelligence for Human Rights Advocacy and Analysis Program (AIHRP)</strong> facilitates real-time interaction, historical analysis, and actionable insights to support the preservation of human rights and address violations. By combining historical and current data, predictive analytics, and advanced engagement tools, we foster a global network of advocacy and awareness.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 rounded-xl bg-rights-primary/10 border border-rights-primary/30">
            <div className="text-rights-primary-light text-3xl font-bold mb-2">2000+</div>
            <div className="text-white/80">Years of Historical Data</div>
          </div>
          <div className="p-6 rounded-xl bg-rights-accent/10 border border-rights-accent/30">
            <div className="text-rights-accent-light text-3xl font-bold mb-2">Global</div>
            <div className="text-white/80">Platform Network</div>
          </div>
          <div className="p-6 rounded-xl bg-rights-secondary/10 border border-rights-secondary/30">
            <div className="text-rights-secondary-light text-3xl font-bold mb-2">Real-time</div>
            <div className="text-white/80">AI Assistance</div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="glass rounded-2xl p-8 md:p-10 mb-8">
        <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
          <span className="w-1 h-8 bg-gradient-to-b from-rights-secondary to-rights-primary-light rounded-full"></span>
          Key Features & Functionalities
        </h2>
        
        <div className="space-y-8">
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-rights-primary to-rights-primary-light flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-3 text-white">Interactive AI for Human Rights Advocacy</h3>
              <p className="text-white/80 leading-relaxed mb-3">
                A conversational AI assistant capable of engaging with Human Rights Advocates in real-time, offering recommendations on best practices for advocacy, legal measures, and policy development to address violations.
              </p>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Personalized guidance based on user input, including drafting reports, petitions, or legal briefs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Educational resources: case studies, legal precedents, and training materials tailored to various regions and contexts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-rights-accent to-rights-accent-light flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-3 text-white">Global Platform for Human Rights Advocates</h3>
              <p className="text-white/80 leading-relaxed mb-3">
                A centralized platform to connect Human Rights organizations, advocates, and researchers worldwide.
              </p>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Discussion forums and event coordination</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Collaborative project management tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Dedicated space for sharing best practices, success stories, and strategies</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-rights-secondary to-rights-secondary-light flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-3 text-white">Historical Database of Human Rights Violations</h3>
              <p className="text-white/80 leading-relaxed mb-3">
                A comprehensive repository of human rights violations over the past 2000 years, sourced from historical records, archives, and scholarly research.
              </p>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Case details, timelines, locations, involved parties, and outcomes of major incidents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Enables researchers to explore patterns and gain insights into causes and consequences of human rights abuses</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-rights-primary-light to-rights-accent flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-3 text-white">Trend and Trigger Analysis</h3>
              <p className="text-white/80 leading-relaxed mb-3">
                AI-powered algorithms analyze historical and contemporary data to identify trends, triggers, and early warning signs of human rights violations.
              </p>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Generates actionable insights into recurring factors: political instability, economic inequality, or societal discrimination</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Identifies early warning signs to enable proactive responses</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-rights-accent to-rights-primary flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-3 text-white">Predictive Analytics for Violation Risk Assessment</h3>
              <p className="text-white/80 leading-relaxed mb-3">
                Uses data interpolation and machine learning to assess the level of human rights violations in each country.
              </p>
              <ul className="space-y-2 text-white/70 text-sm">
          <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Produces risk scores and visual dashboards to help stakeholders prioritize regions and issues requiring urgent attention</span>
          </li>
          <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Forecasts potential violations and provides actionable recommendations for preventive measures</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-rights-secondary to-rights-primary-light flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-3 text-white">Accountability and Reporting Tools</h3>
              <p className="text-white/80 leading-relaxed mb-3">
                Allows organizations to document violations in a structured, secure, and transparent manner.
              </p>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Automates the generation of reports, infographics, and visualizations for advocacy campaigns or policy discussions</span>
          </li>
          <li className="flex items-start">
                  <span className="text-rights-accent mr-2">✓</span>
                  <span>Provides tools to track the progress of investigations and interventions</span>
          </li>
        </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="glass rounded-2xl p-8 md:p-10 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <span className="w-1 h-8 bg-gradient-to-b from-rights-accent to-rights-secondary rounded-full"></span>
          Advantages of the AIHRP
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-rights-primary/5 border-l-4 border-rights-primary">
            <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
              <span className="text-rights-primary-light">🌐</span>
              Enhanced Collaboration
            </h3>
            <p className="text-white/70">By providing a global platform, the program fosters a unified approach among advocates, bridging gaps between organizations and regions.</p>
          </div>
          <div className="p-6 rounded-xl bg-rights-accent/5 border-l-4 border-rights-accent">
            <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
              <span className="text-rights-accent-light">📊</span>
              Data-Driven Insights
            </h3>
            <p className="text-white/70">Historical analysis and trend prediction offer evidence-based solutions to address the root causes of violations.</p>
          </div>
          <div className="p-6 rounded-xl bg-rights-secondary/5 border-l-4 border-rights-secondary">
            <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
              <span className="text-rights-secondary-light">⚡</span>
              Scalable and Inclusive
            </h3>
            <p className="text-white/70">The system adapts to varying levels of expertise, from grassroots activists to international organizations.</p>
          </div>
          <div className="p-6 rounded-xl bg-rights-primary/5 border-l-4 border-rights-primary-light">
            <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
              <span className="text-rights-primary-light">📚</span>
              Educational Empowerment
            </h3>
            <p className="text-white/70">Advocates gain access to a vast repository of resources, ensuring informed decision-making and effective advocacy.</p>
          </div>
          <div className="p-6 rounded-xl bg-rights-accent/5 border-l-4 border-rights-accent md:col-span-2">
            <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
              <span className="text-rights-accent-light">🛡️</span>
              Proactive Prevention
            </h3>
            <p className="text-white/70">Predictive analytics help prevent violations by identifying risks early and guiding timely interventions.</p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="glass rounded-2xl p-8 md:p-10 bg-gradient-to-br from-rights-primary/10 to-rights-accent/10 border border-rights-primary/30">
        <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <span className="text-rights-secondary-light text-4xl">🌟</span>
          Long-Term Vision
        </h2>
        <p className="text-white/90 text-lg leading-relaxed mb-4">
          The AIHRP will revolutionize how human rights organizations operate by providing a unified, data-driven approach to advocacy and analysis. Its ability to record, analyze, and predict human rights violations will create a more informed and empowered global advocacy community, ultimately contributing to a fairer and more just world.
        </p>
        <p className="text-white/80 text-lg leading-relaxed italic">
          This innovative platform will not only preserve and protect human rights but also ensure that humanity learns from its past to build a better future.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm italic">
          This is an active development platform. While we strive for accuracy, always verify critical information with official sources and consult qualified professionals for legal matters.
        </p>
      </div>
    </div>
  );
}
