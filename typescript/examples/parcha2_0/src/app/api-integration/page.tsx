"use client"

import React, { useState } from "react";
import { 
  ArrowLeftIcon, 
  CodeIcon,
  CopyIcon, 
  CheckIcon,
  BookIcon,
  TerminalIcon,
  PlayIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ExternalLinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ApiIntegrationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Function to go back to agent wizard test step
  const navigateToAgentWizardTestStep = () => {
    window.location.href = "/agents?step=6"; // Navigate back to the test step
  };

  // Function to copy code to clipboard
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    nodejs: `// Install SDK: npm install parcha-api-sdk
const Parcha = require('parcha-api-sdk');

// Initialize client with your API key
const parchaClient = new Parcha.Client({
  apiKey: 'YOUR_API_KEY',
  environment: 'sandbox' // 'production' for live environment
});

// Perform screening
async function screenIndividual() {
  try {
    const result = await parchaClient.screening.individuals.create({
      fullName: "John Smith",
      dateOfBirth: "1985-07-15",
      nationality: "United States",
      countryOfResidence: "United Kingdom",
      governmentId: "123-45-6789" // optional
    });
    
    console.log('Screening ID:', result.id);
    console.log('Risk Score:', result.riskScore);
    console.log('Matches:', result.matches);
  } catch (error) {
    console.error('Error screening individual:', error);
  }
}

screenIndividual();`,
    python: `# Install SDK: pip install parcha-api-sdk
import parcha

# Initialize client with your API key
parcha_client = parcha.Client(
    api_key="YOUR_API_KEY",
    environment="sandbox"  # 'production' for live environment
)

# Perform screening
def screen_individual():
    try:
        result = parcha_client.screening.individuals.create(
            full_name="John Smith",
            date_of_birth="1985-07-15",
            nationality="United States",
            country_of_residence="United Kingdom",
            government_id="123-45-6789"  # optional
        )
        
        print(f"Screening ID: {result.id}")
        print(f"Risk Score: {result.risk_score}")
        print(f"Matches: {result.matches}")
    except Exception as e:
        print(f"Error screening individual: {e}")

screen_individual()`,
    curl: `# Authentication
curl -X POST https://api.parcha.com/v1/screening/individuals \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "fullName": "John Smith",
    "dateOfBirth": "1985-07-15",
    "nationality": "United States",
    "countryOfResidence": "United Kingdom",
    "governmentId": "123-45-6789"
  }'`
  };

  const endpointList = [
    {
      name: "List Screenings",
      endpoint: "GET /v1/screenings",
      description: "Returns a list of all screening results"
    },
    {
      name: "Create Individual Screening",
      endpoint: "POST /v1/screening/individuals",
      description: "Create a new screening for an individual"
    },
    {
      name: "Create Business Screening",
      endpoint: "POST /v1/screening/businesses",
      description: "Create a new screening for a business entity"
    },
    {
      name: "Get Screening Result",
      endpoint: "GET /v1/screenings/{id}",
      description: "Retrieve detailed screening results"
    },
    {
      name: "Update Screening",
      endpoint: "PATCH /v1/screenings/{id}",
      description: "Update screening information"
    },
    {
      name: "Delete Screening",
      endpoint: "DELETE /v1/screenings/{id}",
      description: "Delete a screening record"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" className="gap-2" onClick={navigateToAgentWizardTestStep}>
              <ArrowLeftIcon className="h-4 w-4" />
              Back to your agent
            </Button>
          </div>
          
          <div className="flex items-center mt-8 mb-4">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <CodeIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold">Integrate with Parcha API</h1>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Connect your systems with the Parcha API to automate compliance screening workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <TerminalIcon className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">Quick Start</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Get up and running with the Parcha API in minutes. Follow our step-by-step guide to integrate and test your first request.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-1">
                <PlayIcon className="h-4 w-4" />
                Try the API
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <CodeIcon className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">API Reference</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Explore our comprehensive API documentation with detailed endpoint references, request parameters, and response schemas.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-1">
                <ExternalLinkIcon className="h-4 w-4" />
                View API Docs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <BookIcon className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">SDKs & Libraries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Download client libraries for your preferred programming language to simplify API integration in your applications.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-1">
                <ChevronRightIcon className="h-4 w-4" />
                Browse SDKs
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Integration Examples</CardTitle>
            <CardDescription>
              Copy and paste these examples to quickly get started with the Parcha API in your preferred language.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="nodejs" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="nodejs" className="relative">
                <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-auto">
                  <div className="absolute right-2 top-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-50"
                      onClick={() => copyToClipboard(codeExamples.nodejs, 'nodejs')}
                    >
                      {copiedCode === 'nodejs' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-sm font-mono whitespace-pre-wrap">{codeExamples.nodejs}</pre>
                </div>
              </TabsContent>
              
              <TabsContent value="python" className="relative">
                <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-auto">
                  <div className="absolute right-2 top-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-50"
                      onClick={() => copyToClipboard(codeExamples.python, 'python')}
                    >
                      {copiedCode === 'python' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-sm font-mono whitespace-pre-wrap">{codeExamples.python}</pre>
                </div>
              </TabsContent>
              
              <TabsContent value="curl" className="relative">
                <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-auto">
                  <div className="absolute right-2 top-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-50"
                      onClick={() => copyToClipboard(codeExamples.curl, 'curl')}
                    >
                      {copiedCode === 'curl' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="text-sm font-mono whitespace-pre-wrap">{codeExamples.curl}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Available Endpoints</CardTitle>
            <CardDescription>
              The Parcha API provides the following endpoints for compliance screening operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpointList.map((item, index) => (
                <div key={index} className="border rounded-md p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <code className="px-2 py-1 bg-slate-100 rounded text-sm">{item.endpoint}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Authentication</CardTitle>
            <CardDescription>
              Secure your API requests with API keys and learn about rate limits and security best practices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Authentication</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  All API requests must include your API key in the Authorization header:
                </p>
                <div className="bg-slate-100 p-3 rounded-md font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Rate Limits</h3>
                <p className="text-sm text-muted-foreground">
                  The Parcha API has the following rate limits based on your plan:
                </p>
                <ul className="text-sm list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                  <li>Free tier: 100 requests per day</li>
                  <li>Standard tier: 1,000 requests per hour</li>
                  <li>Enterprise tier: Custom limits</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">API Keys</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Manage your API keys through the Parcha dashboard. For security, never share your API keys in client-side code.
                </p>
                <Button variant="outline" size="sm" className="gap-1 mt-2">
                  <ChevronRightIcon className="h-4 w-4" />
                  Manage API Keys
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 