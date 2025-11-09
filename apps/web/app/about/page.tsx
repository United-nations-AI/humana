export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 pb-10">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-6 text-white">About Humana</h1>
        <p className="text-white/80 mb-6 leading-relaxed">
          Humana is an AI avatar chatbot focused on human rights awareness and assistance. It supports multilingual interaction via voice and text, enabling more inclusive access to information.
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-white">What it does</h2>
        <ul className="space-y-3 mb-6 text-white/80">
          <li className="flex items-start">
            <span className="text-brand-400 mr-2">•</span>
            <span>Answers questions about human rights topics</span>
          </li>
          <li className="flex items-start">
            <span className="text-brand-400 mr-2">•</span>
            <span>Provides resources and guidance</span>
          </li>
          <li className="flex items-start">
            <span className="text-brand-400 mr-2">•</span>
            <span>Speaks and listens in your language</span>
          </li>
        </ul>
        <p className="text-white/60 text-sm italic">This is an early prototype. Accuracy may vary, always verify critical information with official sources.</p>
      </div>
    </div>
  );
}
