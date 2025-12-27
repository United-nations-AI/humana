export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      <div className="glass rounded-2xl p-8">
        <div className="mb-8 pb-6 border-b border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rights-primary to-rights-accent mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-rights-primary-light to-rights-accent bg-clip-text text-transparent">Terms and Conditions</h1>
          <p className="text-white/60 text-sm">Last updated: December 2024</p>
        </div>

        <div className="space-y-8 text-white/80">
          <section className="p-6 rounded-xl bg-rights-primary/5 border-l-4 border-rights-primary">
            <h2 className="text-2xl font-semibold mb-3 text-white flex items-center gap-2">
              <span className="text-rights-primary-light">1.</span>
              Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using <strong className="text-white">AIHRP (Artificial Intelligence for Human Rights Advocacy and Analysis Program)</strong> ("the Service"), you accept and agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-rights-accent/5 border-l-4 border-rights-accent">
            <h2 className="text-2xl font-semibold mb-3 text-white flex items-center gap-2">
              <span className="text-rights-accent-light">2.</span>
              Description of Service
            </h2>
            <p className="leading-relaxed">
              AIHRP is a transformative platform designed to empower Human Rights organizations and advocates worldwide through cutting-edge AI technology. 
              The Service uses artificial intelligence to facilitate real-time interaction, historical analysis, and actionable insights related to human rights, 
              and should not be considered a substitute for professional legal advice or official government resources.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">3. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You must provide accurate and truthful information when using the Service</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree not to use the Service for any illegal or unauthorized purpose</li>
              <li>You will not attempt to harm, disrupt, or interfere with the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">4. Limitations and Disclaimers</h2>
            <p className="leading-relaxed mb-3">
              The information provided by Humana AI Avatar is for informational purposes only and should not be considered as:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Legal advice or legal representation</li>
              <li>Official government guidance or policy</li>
              <li>A substitute for professional consultation</li>
              <li>Guaranteed to be accurate, complete, or up-to-date</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Always verify critical information with official sources and consult qualified professionals for legal matters.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">5. Privacy and Data</h2>
            <p className="leading-relaxed">
              Your use of the Service is subject to our Privacy Policy. We collect and process your data in accordance with 
              applicable privacy laws. By using the Service, you consent to the collection and use of information as described 
              in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">6. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, features, and functionality of the Service, including but not limited to text, graphics, logos, 
              and software, are the property of AIHRP and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">7. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, AIHRP shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
              or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">8. Modifications to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes 
              by updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance 
              of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">9. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your access to the Service at any time, with or without cause or notice, 
              for any reason including, but not limited to, breach of these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">10. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us through the appropriate channels 
              provided in the Service.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-white/60 text-sm">
            By using AIHRP, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

