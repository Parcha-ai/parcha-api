"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertCircleIcon, 
  AlertTriangleIcon, 
  BotIcon, 
  CheckCircleIcon, 
  CheckIcon, 
  ClockIcon, 
  FileTextIcon, 
  ListIcon, 
  RotateCwIcon, 
  SearchIcon, 
  ShieldIcon, 
  Loader2Icon, 
  InfoIcon, 
  XCircleIcon, 
  UserIcon, 
  ZapIcon, 
  HomeIcon, 
  FlagIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

// Simple Progress component since we can't import the one from the UI kit
function Progress({ value = 0, className = "" }) {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-primary/20 ${className}`}>
      <div 
        className="h-full bg-primary transition-all" 
        style={{ width: `${value}%` }} 
      />
    </div>
  );
}

// Type definitions for sanctions and PEP matches
type SanctionsMatch = {
  source: string;
  entityName: string;
  entityId: string;
  entityType: string;
  matchScore: number;
  details: string;
};

type PepMatch = {
  source: string;
  entityName: string;
  entityType: string;
  position: string;
  country: string;
  matchScore: number;
  yearActive: string;
};

// Type guard to check if a match is a sanctions match
const isSanctionsMatch = (match: SanctionsMatch | PepMatch): match is SanctionsMatch => {
  return 'entityId' in match && 'details' in match;
};

// Type guard to check if a match is a PEP match
const isPepMatch = (match: SanctionsMatch | PepMatch): match is PepMatch => {
  return 'position' in match && 'country' in match && 'yearActive' in match;
};

export default function AgentTestResultsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedMatches, setExpandedMatches] = useState<Record<string, boolean>>({});
  const { id } = useParams();
  
  // Simulate loading and step-by-step execution
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleMatchExpanded = (id: string) => {
    setExpandedMatches(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Helper function to render status icon
  const renderStatusIcon = (status: string, result: string) => {
    if (status === "in_progress") return <Loader2Icon className="h-5 w-5 text-blue-500 animate-spin" />;
    if (result === "match" && status === "completed") return <AlertTriangleIcon className="h-5 w-5 text-red-500" />;
    if (result === "no_match" && status === "completed") return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    if (result === "verified" && status === "completed") return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    return <ClockIcon className="h-5 w-5 text-slate-400" />;
  };
  
  // Helper function to render risk badge
  const renderRiskBadge = (level: string) => {
    switch(level) {
      case "high":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium Risk</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Low Risk</Badge>;
    }
  };
  
  // Mock test subject (in a real app, this would be fetched based on the id parameter)
  const testSubject = {
    name: "John Smith",
    dob: "1985-07-15",
    nationality: "United States",
    countryOfResidence: "United States",
    governmentId: "SSN-123-45-6789",
    aliases: "Johnny Smith, J. Smith",
    occupation: "Business Executive",
    politicalAffiliations: "None",
    address: "123 Main Street, New York, NY 10001",
    businessAssociations: "Smith Enterprises, Global Trading Corp"
  };

  const mockScreeningSteps = [
    {
      id: "sanctions",
      name: "Sanctions Screening",
      icon: <AlertCircleIcon className="h-5 w-5 text-red-500" />,
      status: "completed",
      result: "match",
      riskLevel: "high",
      matches: [
        {
          source: "OFAC SDN List",
          entityName: "James Brown",
          entityId: "OFAC-SDN-29557",
          entityType: "Individual",
          matchScore: 92,
          details: "Listed for involvement in narcotics trafficking in South America"
        },
        {
          source: "EU Sanctions List",
          entityName: "James Andrew Brown",
          entityId: "EU-SANC-87763",
          entityType: "Individual",
          matchScore: 85,
          details: "Listed for fraud and financial misconduct"
        }
      ]
    },
    {
      id: "pep",
      name: "PEP Screening",
      icon: <UserIcon className="h-5 w-5 text-blue-500" />,
      status: "completed",
      result: "match",
      riskLevel: "medium",
      matches: [
        {
          source: "Global PEP Database",
          entityName: "James Brown",
          entityType: "Individual",
          position: "Former Regional Governor",
          country: "Australia",
          matchScore: 78,
          yearActive: "2017-2020"
        }
      ]
    },
    {
      id: "adverse-media",
      name: "Adverse Media",
      icon: <FileTextIcon className="h-5 w-5 text-orange-500" />,
      status: "completed",
      result: "no_match",
      riskLevel: "low",
      matches: []
    },
    {
      id: "proof-residence",
      name: "Proof of Residence",
      icon: <HomeIcon className="h-5 w-5 text-indigo-600" />,
      status: "completed",
      result: "verified",
      riskLevel: "low",
      verification: {
        documentType: "Utility Bill",
        issueDate: "2023-01-15",
        verified: true,
        address: "1459 Main St, Sydney"
      }
    },
    {
      id: "source-income",
      name: "Source of Income",
      icon: <ZapIcon className="h-5 w-5 text-green-600" />,
      status: "completed",
      result: "verified",
      riskLevel: "medium",
      verification: {
        documentType: "Bank Statements",
        period: "Last 6 months",
        verified: true,
        incomeSource: "Employment at Tech Innovations",
        averageMonthlyIncome: "$12,500"
      }
    },
  ];

  const overallRiskAssessment = {
    level: "High",
    score: 78,
    factors: [
      "Multiple sanctions list matches",
      "PEP status identified",
      "Income source verified but exceeds typical range for stated occupation"
    ],
    recommendation: "Manual review required",
    autoDecision: "Refer"
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-screen-lg mx-auto py-6 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[600px]">
            <div className="mb-6">
              <Loader2Icon className="h-16 w-16 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Running Compliance Check</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Screening subject against watchlists, verifying documentation, and analyzing risk factors...
            </p>
            <Progress value={45} className="w-64 h-2" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BotIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">AML Screening Results</h1>
                  <p className="text-sm text-muted-foreground">
                    Completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/agent-test-results-list">Return to Results List</Link>
                </Button>
                <Button size="sm" className="gap-1">
                  <FileTextIcon className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Subject Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{testSubject.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{testSubject.dob}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nationality</p>
                      <p className="font-medium">{testSubject.nationality}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Country of Residence</p>
                      <p className="font-medium">{testSubject.countryOfResidence}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Government ID</p>
                      <p className="font-medium">{testSubject.governmentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Aliases</p>
                      <p className="font-medium">{testSubject.aliases || "None"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Occupation</p>
                      <p className="font-medium">{testSubject.occupation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Political Affiliations</p>
                      <p className="font-medium">{testSubject.politicalAffiliations}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{testSubject.address}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Business Associations</p>
                      <p className="font-medium">{testSubject.businessAssociations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium">Overall Risk</h3>
                      <span className="text-sm font-medium text-red-700">{overallRiskAssessment.score}/100</span>
                    </div>
                    <div className="h-2 w-full bg-red-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${overallRiskAssessment.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold text-red-700">
                        {overallRiskAssessment.level} Risk
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {overallRiskAssessment.factors.map((factor, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <FlagIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{factor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-red-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Decision</span>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                        {overallRiskAssessment.autoDecision}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Screening Steps</CardTitle>
                <CardDescription>
                  Results from all verification and research steps performed on this subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Steps</TabsTrigger>
                    <TabsTrigger value="matches">Matches Only</TabsTrigger>
                    <TabsTrigger value="verification">Verification</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4">
                    {mockScreeningSteps.map((step) => (
                      <div key={step.id} className="border rounded-md overflow-hidden">
                        <div className="bg-slate-50 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {step.icon}
                            <div>
                              <h3 className="font-medium">{step.name}</h3>
                              {step.result === "match" && (
                                <p className="text-sm text-red-600">
                                  {step.matches?.length} {step.matches?.length === 1 ? 'match' : 'matches'} found
                                </p>
                              )}
                              {step.result === "no_match" && (
                                <p className="text-sm text-green-600">No matches found</p>
                              )}
                              {step.result === "verified" && (
                                <p className="text-sm text-green-600">Verification successful</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderRiskBadge(step.riskLevel)}
                            {renderStatusIcon(step.status, step.result)}
                          </div>
                        </div>
                        
                        {/* Match details for steps with matches */}
                        {step.result === "match" && step.matches && step.matches.length > 0 && (
                          <div className="p-4 border-t">
                            <div className="space-y-3">
                              {step.matches.map((match, idx) => (
                                <div key={idx} className="rounded-md border p-3">
                                  <div 
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleMatchExpanded(`${step.id}-${idx}`)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <AlertTriangleIcon className="h-4 w-4 text-red-500" />
                                      <div>
                                        <h4 className="font-medium text-sm">{match.entityName}</h4>
                                        <p className="text-xs text-muted-foreground">{match.source}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-slate-100">Match Score: {match.matchScore}%</Badge>
                                      {expandedMatches[`${step.id}-${idx}`] ? 
                                        <ChevronDownIcon className="h-4 w-4" /> : 
                                        <ChevronRightIcon className="h-4 w-4" />
                                      }
                                    </div>
                                  </div>
                                  
                                  {expandedMatches[`${step.id}-${idx}`] && (
                                    <div className="mt-3 pt-3 border-t text-sm">
                                      <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(match).map(([key, value]) => {
                                          // Skip certain keys we don't want to display
                                          if (['entityName', 'source', 'matchScore'].includes(key)) {
                                            return null;
                                          }
                                          
                                          // Determine if this should be full width
                                          const isFullWidth = ['details'].includes(key);
                                          
                                          return (
                                            <div key={key} className={isFullWidth ? "col-span-2" : ""}>
                                              <p className="text-xs text-muted-foreground capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                              </p>
                                              <p>{String(value)}</p>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Verification details for steps with verification */}
                        {step.result === "verified" && step.verification && (
                          <div className="p-4 border-t">
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(step.verification || {}).map(([key, value]) => (
                                key !== "verified" && (
                                  <div key={key}>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-sm">{String(value)}</p>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="matches" className="space-y-4">
                    {mockScreeningSteps
                      .filter(step => step.result === "match")
                      .map((step) => (
                        <div key={step.id} className="border rounded-md overflow-hidden">
                          <div className="bg-slate-50 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {step.icon}
                              <div>
                                <h3 className="font-medium">{step.name}</h3>
                                <p className="text-sm text-red-600">
                                  {step.matches?.length} {step.matches?.length === 1 ? 'match' : 'matches'} found
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderRiskBadge(step.riskLevel)}
                              {renderStatusIcon(step.status, step.result)}
                            </div>
                          </div>
                          
                          <div className="p-4 border-t">
                            <div className="space-y-3">
                              {step.matches?.map((match, idx) => (
                                <div key={idx} className="rounded-md border p-3">
                                  <div 
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleMatchExpanded(`${step.id}-${idx}-matches`)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <AlertTriangleIcon className="h-4 w-4 text-red-500" />
                                      <div>
                                        <h4 className="font-medium text-sm">{match.entityName}</h4>
                                        <p className="text-xs text-muted-foreground">{match.source}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-slate-100">Match Score: {match.matchScore}%</Badge>
                                      {expandedMatches[`${step.id}-${idx}-matches`] ? 
                                        <ChevronDownIcon className="h-4 w-4" /> : 
                                        <ChevronRightIcon className="h-4 w-4" />
                                      }
                                    </div>
                                  </div>
                                  
                                  {expandedMatches[`${step.id}-${idx}-matches`] && (
                                    <div className="mt-3 pt-3 border-t text-sm">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <p className="text-xs text-muted-foreground">Entity Type</p>
                                          <p>{match.entityType}</p>
                                        </div>
                                        
                                        {/* Type-specific fields */}
                                        {isSanctionsMatch(match) && (
                                          <>
                                            <div>
                                              <p className="text-xs text-muted-foreground">Entity ID</p>
                                              <p>{match.entityId || "N/A"}</p>
                                            </div>
                                            <div className="col-span-2">
                                              <p className="text-xs text-muted-foreground">Details</p>
                                              <p>{match.details}</p>
                                            </div>
                                          </>
                                        )}
                                        
                                        {isPepMatch(match) && (
                                          <>
                                            <div>
                                              <p className="text-xs text-muted-foreground">Position</p>
                                              <p>{match.position}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-muted-foreground">Country</p>
                                              <p>{match.country}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-muted-foreground">Years Active</p>
                                              <p>{match.yearActive}</p>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                  
                  <TabsContent value="verification" className="space-y-4">
                    {mockScreeningSteps
                      .filter(step => step.result === "verified")
                      .map((step) => (
                        <div key={step.id} className="border rounded-md overflow-hidden">
                          <div className="bg-slate-50 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {step.icon}
                              <div>
                                <h3 className="font-medium">{step.name}</h3>
                                <p className="text-sm text-green-600">Verification successful</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderRiskBadge(step.riskLevel)}
                              {renderStatusIcon(step.status, step.result)}
                            </div>
                          </div>
                          
                          <div className="p-4 border-t">
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(step.verification || {}).map(([key, value]) => (
                                key !== "verified" && (
                                  <div key={key}>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                    <p className="text-sm">{String(value)}</p>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link to="/agent-test-results-list">Return to Results List</Link>
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ShieldIcon className="h-4 w-4" />
                  Flag for Review
                </Button>
                <Button size="sm" className="gap-1">
                  <CheckIcon className="h-4 w-4" />
                  Approve
                </Button>
                <Button variant="destructive" size="sm" className="gap-1">
                  <XCircleIcon className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 