import { DocsPlayground } from "./components/docs-playground";
import { useState } from "react";
import { FlashLoaderType } from "./types/flash";

function App() {
  const [selectedTab, setSelectedTab] = useState<FlashLoaderType>(
    "business_proof_of_address"
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <main className="flex-1 h-full max-w-[90%] mx-auto px-4 py-6 w-full">
        <div className="flex items-center mb-6">
          <div className="inline-flex rounded-md bg-gray-100 p-1">
            <button
              onClick={() => setSelectedTab("business_proof_of_address")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "business_proof_of_address"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Business Proof of Address
            </button>
            <button
              onClick={() => setSelectedTab("individual_proof_of_address")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "individual_proof_of_address"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Individual Proof of Address
            </button>
            <button
              onClick={() => setSelectedTab("incorporation")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "incorporation"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Incorporation Document
            </button>
            <button
              onClick={() => setSelectedTab("ein")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "ein"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              EIN Document
            </button>
          </div>
        </div>
        <DocsPlayground type={selectedTab} playgroundMode={false} />
      </main>
    </div>
  );
}

export default App;
