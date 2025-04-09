import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUpDownIcon, 
  BotIcon, 
  CheckIcon, 
  ChevronRightIcon, 
  ExternalLinkIcon, 
  FileTextIcon, 
  AlertTriangleIcon,
  UserIcon,
  ShieldIcon,
  XIcon,
  AlertCircleIcon,
  MapPinIcon,
  BuildingIcon,
  ShieldAlertIcon,
  ClockIcon,
  HomeIcon,
  BanknoteIcon,
  FlagIcon,
  MoreHorizontalIcon,
  ArrowLeftIcon,
  NewspaperIcon,
  ClipboardListIcon
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Interface for test result
interface TestResult {
  id: string;
  subjectName: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  matchCount: number;
  testDate: string;
  status: "approved" | "rejected" | "review";
  
  // Additional profile details
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  governmentId?: string;
  aliases?: string;
  occupation?: string;
  politicalAffiliations?: string;
  address?: string;
  businessAssociations?: string;
  
  // Match details
  pepMatch?: boolean;
  
  // Document verification
  proofOfResidence?: {
    documentType: string;
    issueDate: string;
    address: string;
  };
  
  incomeSource?: {
    documentType: string;
    period: string;
    source: string;
    averageMonthly: string;
  };
}

export default function AgentTestResultsListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  
  // Hardcoded test results as a fallback
  const hardcodedResults: TestResult[] = [
    {
      id: "1",
      subjectName: "John Smith",
      riskScore: 18,
      riskLevel: "low",
      matchCount: 0,
      testDate: new Date('2025-04-01T12:58:00').toISOString(),
      status: "review"
    },
    {
      id: "2",
      subjectName: "Sarah Johnson",
      riskScore: 16,
      riskLevel: "low",
      matchCount: 0,
      testDate: new Date('2025-03-29T12:58:00').toISOString(),
      status: "review"
    },
    {
      id: "3",
      subjectName: "Michael Williams",
      riskScore: 13,
      riskLevel: "low",
      matchCount: 0,
      testDate: new Date('2025-03-31T12:58:00').toISOString(),
      status: "approved"
    },
    {
      id: "4",
      subjectName: "Emma Brown",
      riskScore: 48,
      riskLevel: "medium",
      matchCount: 3,
      testDate: new Date('2025-03-31T12:58:00').toISOString(),
      status: "review"
    },
    {
      id: "5",
      subjectName: "David Jones",
      riskScore: 58,
      riskLevel: "medium",
      matchCount: 5,
      testDate: new Date('2025-03-29T12:58:00').toISOString(),
      status: "approved"
    },
    {
      id: "6",
      subjectName: "Sophia Miller",
      riskScore: 94,
      riskLevel: "high",
      matchCount: 12,
      testDate: new Date('2025-03-31T12:58:00').toISOString(),
      status: "review"
    },
    {
      id: "7",
      subjectName: "James Davis",
      riskScore: 14,
      riskLevel: "low",
      matchCount: 1,
      testDate: new Date('2025-03-31T12:58:00').toISOString(),
      status: "rejected"
    },
    {
      id: "8",
      subjectName: "Olivia Garcia",
      riskScore: 71,
      riskLevel: "high",
      matchCount: 6,
      testDate: new Date('2025-04-01T12:58:00').toISOString(),
      status: "review"
    }
  ];
  
  const [results, setResults] = useState<TestResult[]>(hardcodedResults);
  
  // Generate 10 mock test results
  const generateMockResults = () => {
    console.log("Generating mock results...");
    const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Sophia", "James", "Olivia", "Robert", "Emily"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];
    const statuses = ["approved", "rejected", "review"] as const;
    const riskLevels = ["low", "medium", "high"] as const;
    
    const mockResults: TestResult[] = [];
    
    for (let i = 0; i < 10; i++) {
      const firstName = firstNames[i];
      const lastName = lastNames[i];
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      const riskScore = riskLevel === "low" 
        ? Math.floor(Math.random() * 30) + 1
        : riskLevel === "medium"
          ? Math.floor(Math.random() * 40) + 31
          : Math.floor(Math.random() * 29) + 71;
      
      const matchCount = riskLevel === "low" 
        ? Math.floor(Math.random() * 2)
        : riskLevel === "medium"
          ? Math.floor(Math.random() * 5) + 1
          : Math.floor(Math.random() * 10) + 5;
      
      // Create a random date within the last week
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - Math.floor(Math.random() * 7));
      
      mockResults.push({
        id: (i + 1).toString(),
        subjectName: `${firstName} ${lastName}`,
        riskScore,
        riskLevel,
        matchCount,
        testDate: testDate.toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    console.log("Generated results:", mockResults);
    return mockResults;
  };
  
  // Debug logging for loading state and results
  useEffect(() => {
    console.log("Current loading state:", isLoading);
    console.log("Current results:", results);
  }, [isLoading, results]);
  
  useEffect(() => {
    // Simulate API call with a delay
    console.log("Starting loading timer...");
    const timer = setTimeout(() => {
      const generatedResults = generateMockResults();
      console.log("Setting results and ending loading...");
      setResults(generatedResults);
      setIsLoading(false);
    }, 500); // Reduced from 1500 to 500ms
    
    return () => clearTimeout(timer);
  }, []);
  
  // Generate results immediately as well
  useEffect(() => {
    // Initialize with data right away
    console.log("Immediately initializing results...");
    setResults(generateMockResults());
  }, []);
  
  // Filter results based on search query
  const filteredResults = results.filter(result => 
    result.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Helper function to render status badge
  const renderStatusBadge = (status: TestResult["status"]) => {
    switch(status) {
      case "approved":
        return <Badge className="w-full py-1 bg-green-100 text-green-700 flex justify-center">Approved</Badge>;
      case "rejected":
        return <Badge className="w-full py-1 bg-red-100 text-red-700 flex justify-center">Rejected</Badge>;
      case "review":
        return <Badge className="w-full py-1 bg-yellow-100 text-yellow-700 flex justify-center">Review Required</Badge>;
      default:
        return null;
    }
  };
  
  // Helper function to render risk badge
  const renderRiskBadge = (riskLevel: TestResult["riskLevel"]) => {
    switch(riskLevel) {
      case "high":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium Risk</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Low Risk</Badge>;
      default:
        return null;
    }
  };
  
  // Format date to human-readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Helper function to render risk level
  const renderRiskLevel = (riskLevel: TestResult["riskLevel"], score: number) => {
    switch(riskLevel) {
      case "high":
        return (
          <div className="flex items-center gap-3">
            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
            <div className="w-full">
              <div className="font-medium text-red-700">{score}% - High</div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        );
      case "medium":
        return (
          <div className="flex items-center gap-3">
            <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
            <div className="w-full">
              <div className="font-medium text-yellow-700">{score}% - Medium</div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        );
      case "low":
        return (
          <div className="flex items-center gap-3">
            <CheckIcon className="h-5 w-5 text-green-500" />
            <div className="w-full">
              <div className="font-medium text-green-700">{score}% - Low</div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Function to handle row click
  const handleRowClick = (result: TestResult) => {
    // Create expanded test result data with mock detailed information
    const expandedResult = {
      ...result,
      // Add additional mock data that would come from a real API
      dateOfBirth: "1993-04-14",
      nationality: result.riskLevel === "high" ? "Indian" : "United States",
      countryOfResidence: result.riskLevel === "high" ? "Australia" : "United States",
      governmentId: `ID-${Math.floor(Math.random() * 9000000) + 1000000}`,
      aliases: `${result.subjectName.split(' ')[1]}, ${result.subjectName.split(' ')[0]}`,
      occupation: result.riskLevel === "high" ? "Consultant" : "Business Executive",
      politicalAffiliations: result.riskLevel === "high" ? "None" : "Local Government",
      address: result.riskLevel === "high" ? "1459 Main St, Sydney" : "123 Business Ave, New York",
      businessAssociations: result.riskLevel === "high" ? "Tech Innovations" : "Global Enterprises Inc.",
      
      // Match details based on risk level
      pepMatch: result.riskLevel === "high" || result.riskLevel === "medium",
      
      // Document verification
      proofOfResidence: {
        documentType: "Utility Bill",
        issueDate: "2023-01-15",
        address: result.riskLevel === "high" ? "1459 Main St, Sydney" : "123 Business Ave, New York"
      },
      
      incomeSource: {
        documentType: "Bank Statements",
        period: "Last 6 months",
        source: result.riskLevel === "high" ? "Employment at Tech Innovations" : "Employment at Global Enterprises",
        averageMonthly: result.riskLevel === "high" ? "$12,500" : "$8,500"
      }
    };
    
    setSelectedResult(expandedResult);
    setIsSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BotIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Agent Test Results</h1>
              <p className="text-sm text-muted-foreground">
                View and analyze compliance screening results
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/agents?step=6">
                Return to Your Agent Setup
              </Link>
            </Button>
            <Button>
              <FileTextIcon className="h-4 w-4 mr-2" />
              Export All Results
            </Button>
          </div>
        </div>
        
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Test Results</CardTitle>
              <div className="relative w-72">
                <Input
                  type="search"
                  placeholder="Search by name..."
                  className="pl-10 py-2 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <CardDescription>
              Results from your recent compliance checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShieldIcon className="h-12 w-12 text-primary/20 mb-4" />
                <h3 className="text-lg font-medium mb-2">Loading test results</h3>
                <p className="text-sm text-muted-foreground mb-4">Retrieving your compliance screening data...</p>
                <Progress value={65} className="w-64 h-2" />
              </div>
            ) : (
              <div className="rounded-md border w-full">
                <Table className="[&_tr:nth-child(even)]:bg-slate-50">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">
                        <div className="flex items-center">
                          Subject Name
                          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[20%]">
                        <div className="flex items-center">
                          Risk Score
                          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[15%]">Matches</TableHead>
                      <TableHead className="w-[20%]">
                        <div className="flex items-center">
                          Test Date
                          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[15%]">Status</TableHead>
                      <TableHead className="w-[10%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                          No test results found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredResults.map((result) => (
                        <TableRow 
                          key={result.id}
                          className="cursor-pointer hover:bg-slate-100"
                          onClick={() => handleRowClick(result)}
                        >
                          <TableCell className="font-medium">
                            {result.subjectName}
                          </TableCell>
                          <TableCell>
                            {renderRiskLevel(result.riskLevel, result.riskScore)}
                          </TableCell>
                          <TableCell>
                            {result.matchCount > 0 ? (
                              <Badge variant="outline" className="w-full py-1 flex justify-center text-red-600 border-red-200 bg-red-50">
                                {result.matchCount} {result.matchCount === 1 ? 'match' : 'matches'}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="w-full py-1 flex justify-center text-green-600 border-green-200 bg-green-50">
                                No matches
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(result.testDate)}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(result.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Details Sheet/Panel */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[95%] sm:w-[1000px] md:max-w-[1200px] lg:max-w-[1400px] overflow-y-auto p-0 [&>button]:hidden">
          {selectedResult && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-white p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileTextIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">AML Screening Results</h2>
                    <p className="text-sm text-muted-foreground">Completed on {formatDate(selectedResult.testDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Actions <ChevronRightIcon className="h-4 w-4 rotate-90" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <CheckIcon className="h-4 w-4" /> Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer">
                        <XIcon className="h-4 w-4" /> Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <FlagIcon className="h-4 w-4" /> Flag for Review
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                        <Link to="/agents?step=6" className="flex items-center w-full">
                          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Return to Your Agent Setup
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <FileTextIcon className="h-4 w-4" /> Export Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full ml-1">
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 bg-slate-50">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Subject Information */}
                  <div className="bg-white rounded-md border lg:col-span-2">
                    <div className="p-5 border-b">
                      <h3 className="text-lg font-semibold">Subject Information</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p className="font-medium">{selectedResult.subjectName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date of Birth</p>
                          <p className="font-medium">{selectedResult.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Nationality</p>
                          <p className="font-medium">{selectedResult.nationality}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Country of Residence</p>
                          <p className="font-medium">{selectedResult.countryOfResidence}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Government ID</p>
                          <p className="font-medium">{selectedResult.governmentId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Aliases</p>
                          <p className="font-medium">{selectedResult.aliases}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Occupation</p>
                          <p className="font-medium">{selectedResult.occupation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Political Affiliations</p>
                          <p className="font-medium">{selectedResult.politicalAffiliations}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium">{selectedResult.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Business Associations</p>
                          <p className="font-medium">{selectedResult.businessAssociations}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className={selectedResult.riskLevel === "high" ? "bg-red-50 border border-red-100 rounded-md" : 
                      selectedResult.riskLevel === "medium" ? "bg-amber-50 border border-amber-100 rounded-md" : 
                      "bg-green-50 border border-green-100 rounded-md"}>
                    <div className="p-5 border-b border-inherit">
                      <h3 className="text-lg font-semibold">Risk Assessment</h3>
                    </div>
                    <div className="p-5">
                      <div className="space-y-5">
                        <div>
                          <p className="text-sm text-muted-foreground">Overall Risk</p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="font-semibold text-lg">{selectedResult.riskScore}/100</div>
                          </div>
                          <div className="w-full h-2 bg-white rounded-full mt-2">
                            <div 
                              className={selectedResult.riskLevel === "high" ? "h-full bg-red-500 rounded-full" : 
                                selectedResult.riskLevel === "medium" ? "h-full bg-amber-500 rounded-full" :
                                "h-full bg-green-500 rounded-full"} 
                              style={{ width: `${selectedResult.riskScore}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 pt-4">
                          <h4 className="flex items-center gap-2 font-medium">
                            {selectedResult.riskLevel === "high" ? (
                              <>
                                <AlertTriangleIcon className="h-4 w-4 text-red-700" /> 
                                <span className="text-red-700">High Risk</span>
                              </>
                            ) : selectedResult.riskLevel === "medium" ? (
                              <>
                                <AlertTriangleIcon className="h-4 w-4 text-amber-700" /> 
                                <span className="text-amber-700">Medium Risk</span>
                              </>
                            ) : (
                              <>
                                <CheckIcon className="h-4 w-4 text-green-700" /> 
                                <span className="text-green-700">Low Risk</span>
                              </>
                            )}
                          </h4>
                          <ul className="space-y-2">
                            {/* High Risk Factors */}
                            {selectedResult.riskLevel === "high" && selectedResult.matchCount > 0 && (
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-red-500">⬤</div>
                                <p>Multiple sanctions list matches</p>
                              </li>
                            )}
                            {selectedResult.riskLevel === "high" && selectedResult.pepMatch && (
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-red-500">⬤</div>
                                <p>PEP status identified</p>
                              </li>
                            )}
                            {selectedResult.riskLevel === "high" && (
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-red-500">⬤</div>
                                <p>Income source verified but exceeds typical range for stated occupation</p>
                              </li>
                            )}
                            
                            {/* Medium Risk Factors */}
                            {selectedResult.riskLevel === "medium" && selectedResult.matchCount > 0 && (
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-amber-500">⬤</div>
                                <p>Potential sanctions list match requires review</p>
                              </li>
                            )}
                            {selectedResult.riskLevel === "medium" && selectedResult.pepMatch && (
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-amber-500">⬤</div>
                                <p>Politically exposed person status</p>
                              </li>
                            )}
                            {selectedResult.riskLevel === "medium" && (
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-amber-500">⬤</div>
                                <p>High-risk jurisdiction connections</p>
                              </li>
                            )}
                            
                            {/* Low Risk Factors */}
                            {selectedResult.riskLevel === "low" && (
                              <>
                                <li className="flex items-start gap-2">
                                  <div className="mt-0.5 text-green-500">⬤</div>
                                  <p>No sanctions list matches</p>
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="mt-0.5 text-green-500">⬤</div>
                                  <p>No PEP status identified</p>
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="mt-0.5 text-green-500">⬤</div>
                                  <p>Income verification successful</p>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>

                        <div className="pt-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Decision</p>
                            {selectedResult.riskLevel === "high" ? (
                              <Badge className="bg-red-100 text-red-700">Refer</Badge>
                            ) : selectedResult.riskLevel === "medium" ? (
                              <Badge className="bg-amber-100 text-amber-700">Review</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-700">Approve</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screening Steps */}
                <div className="bg-white rounded-md border">
                  <div className="p-5 border-b">
                    <h3 className="text-lg font-semibold">Screening Steps</h3>
                    <p className="text-sm text-muted-foreground mt-1">Results from all verification and research steps performed on this subject</p>
                  </div>
                  <div className="p-5">
                    <div className="flex space-x-2 mb-6">
                      <Button variant="secondary" size="sm" className="rounded-full">All Steps</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Matches Only</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Verification</Button>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Sanctions Screening */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="flex items-center p-4 bg-slate-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-red-500">
                              <AlertCircleIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">Sanctions Screening</h4>
                              <p className={`text-sm ${selectedResult.matchCount > 0 ? "text-red-600" : "text-green-600"}`}>
                                {selectedResult.matchCount > 0 ? `${selectedResult.matchCount} matches found` : "No matches found"}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${
                            selectedResult.matchCount > 0 
                              ? "bg-red-100 text-red-700" 
                              : "bg-green-100 text-green-700"
                            }`}>
                            {selectedResult.matchCount > 0 ? "High Risk" : "Low Risk"}
                          </Badge>
                        </div>

                        {selectedResult.matchCount > 0 && (
                          <div className="divide-y border-t">
                            {Array.from({length: Math.min(selectedResult.matchCount, 2)}).map((_, i) => (
                              <div key={i} className="p-4 hover:bg-slate-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="text-red-500">
                                      <AlertTriangleIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {i === 0 ? selectedResult.subjectName : `${selectedResult.subjectName.split(' ')[0]} Andrew ${selectedResult.subjectName.split(' ')[1]}`}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {i === 0 ? "OFAC SDN List" : "EU Sanctions List"}
                                      </div>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                                    <ExternalLinkIcon className="h-3 w-3" /> View Details
                                  </Button>
                                </div>
                                <div className="mt-3 bg-slate-50 p-3 rounded-md text-sm">
                                  <div className="font-medium mb-1">Match Details</div>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                      <span className="text-muted-foreground">Match Score:</span> {70 + Math.floor(Math.random() * 25)}%
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Entity Type:</span> {i === 0 ? "Individual" : i === 1 ? "Individual" : "Entity"}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Country:</span> {i === 0 ? "Afghanistan" : "Iran"}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Listed Since:</span> {i === 0 ? "Sep 15, 2019" : "Mar 22, 2021"}
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <span className="text-muted-foreground">Reason:</span> {
                                      i === 0 
                                        ? "Listed for financial fraud and involvement in money laundering schemes across multiple jurisdictions." 
                                        : "Money laundering concerns related to offshore accounts and suspicious transaction patterns."
                                    }
                                  </div>
                                </div>
                                <div className="mt-3 text-xs text-muted-foreground border-t pt-2">
                                  <div className="flex items-center gap-1">
                                    <ClockIcon className="h-3 w-3" />
                                    <span>Screening performed on {formatDate(selectedResult.testDate)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* PEP Screening */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="flex items-center p-4 bg-slate-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-blue-500">
                              <UserIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">PEP Screening</h4>
                              <p className={`text-sm ${selectedResult.pepMatch ? "text-red-600" : "text-green-600"}`}>
                                {selectedResult.pepMatch ? "1 match found" : "No matches found"}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${
                            selectedResult.pepMatch 
                              ? "bg-yellow-100 text-yellow-700" 
                              : "bg-green-100 text-green-700"
                            }`}>
                            {selectedResult.pepMatch ? "Medium Risk" : "Low Risk"}
                          </Badge>
                        </div>

                        {selectedResult.pepMatch && (
                          <div className="p-4 hover:bg-slate-50 border-t">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-blue-500">
                                  <UserIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium">{selectedResult.subjectName}</div>
                                  <div className="text-sm text-muted-foreground">Global PEP Database</div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                                <ExternalLinkIcon className="h-3 w-3" /> View Details
                              </Button>
                            </div>
                            <div className="mt-3 bg-slate-50 p-3 rounded-md text-sm">
                              <div className="font-medium mb-1">PEP Details</div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                  <span className="text-muted-foreground">Position:</span> {selectedResult.riskLevel === "high" ? "Former Minister" : "Local Official"}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Country:</span> {selectedResult.nationality}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Risk Level:</span> {selectedResult.riskLevel === "high" ? "High" : "Medium"}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Years Active:</span> 2018 - Present
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground border-t pt-2">
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>Screening performed on {formatDate(selectedResult.testDate)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Proof of Residence */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="flex items-center p-4 bg-slate-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-indigo-500">
                              <HomeIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">Proof of Residence</h4>
                              <p className="text-sm text-green-600">Verification successful</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Low Risk</Badge>
                        </div>

                        <div className="p-4 border-t">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">Document Verification</h4>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              <FileTextIcon className="h-3 w-3 mr-1" /> View Document
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm">
                            <div>
                              <p className="text-sm text-muted-foreground">Document Type</p>
                              <p className="font-medium">{selectedResult.proofOfResidence?.documentType || "Utility Bill"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Issue Date</p>
                              <p className="font-medium">{selectedResult.proofOfResidence?.issueDate || "2023-01-15"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Address</p>
                              <p className="font-medium">{selectedResult.proofOfResidence?.address || selectedResult.address || "1459 Main St, Sydney"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Verification Method</p>
                              <p className="font-medium">OCR + Manual Review</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-md mb-3 text-sm">
                            <h5 className="font-medium mb-1">Verification Notes</h5>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-green-500">⬤</div>
                                <p>Document authenticity verified using digital watermark check</p>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-green-500">⬤</div>
                                <p>Address matches declared address on application</p>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="mt-0.5 text-green-500">⬤</div>
                                <p>Document is current and valid (less than 3 months old)</p>
                              </li>
                            </ul>
                          </div>
                          <div className="text-xs text-muted-foreground border-t pt-2">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>Verification completed on {formatDate(selectedResult.testDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Source of Income */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="flex items-center p-4 bg-slate-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-emerald-500">
                              <BanknoteIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">Source of Income</h4>
                              <p className="text-sm text-green-600">Verification successful</p>
                            </div>
                          </div>
                          <Badge className={`${selectedResult.riskLevel === "high" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                            {selectedResult.riskLevel === "high" ? "Medium Risk" : "Low Risk"}
                          </Badge>
                        </div>

                        <div className="p-4 border-t">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">Financial Documentation</h4>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              <FileTextIcon className="h-3 w-3 mr-1" /> View Documents
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm">
                            <div>
                              <p className="text-sm text-muted-foreground">Document Type</p>
                              <p className="font-medium">{selectedResult.incomeSource?.documentType || "Bank Statements"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Period</p>
                              <p className="font-medium">{selectedResult.incomeSource?.period || "Last 6 months"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Income Source</p>
                              <p className="font-medium">{selectedResult.incomeSource?.source || `Employment at ${selectedResult.businessAssociations || "Tech Innovations"}`}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Average Monthly Income</p>
                              <p className="font-medium">{selectedResult.incomeSource?.averageMonthly || "$12,500"}</p>
                            </div>
                          </div>
                          
                          {selectedResult.riskLevel === "high" && (
                            <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md mb-3 text-sm">
                              <h5 className="font-medium text-yellow-800 mb-1">Risk Factors</h5>
                              <ul className="space-y-1 text-sm">
                                <li className="flex items-start gap-2">
                                  <div className="mt-0.5 text-yellow-500">⬤</div>
                                  <p>Declared income exceeds average for stated occupation by 35%</p>
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="mt-0.5 text-yellow-500">⬤</div>
                                  <p>Multiple large deposits from international sources</p>
                                </li>
                              </ul>
                            </div>
                          )}
                          
                          <div className="bg-slate-50 p-3 rounded-md mb-3 text-sm">
                            <h5 className="font-medium mb-1">Transaction Analysis</h5>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Regular Income Pattern</span>
                                  <span className="font-medium">85%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full">
                                  <div className="bg-green-500 h-full rounded-full" style={{width: "85%"}} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Source Consistency</span>
                                  <span className="font-medium">92%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full">
                                  <div className="bg-green-500 h-full rounded-full" style={{width: "92%"}} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Unusual Activity</span>
                                  <span className="font-medium">{selectedResult.riskLevel === "high" ? "38%" : "12%"}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full">
                                  <div className={`${selectedResult.riskLevel === "high" ? "bg-yellow-500" : "bg-green-500"} h-full rounded-full`} 
                                       style={{width: selectedResult.riskLevel === "high" ? "38%" : "12%"}} />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground border-t pt-2">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>Analysis completed on {formatDate(selectedResult.testDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Adverse Media Screening */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="flex items-center p-4 bg-slate-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-orange-500">
                              <NewspaperIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">Adverse Media Screening</h4>
                              <p className="text-sm text-green-600">No matches found</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Low Risk</Badge>
                        </div>
                        
                        <div className="p-4 border-t">
                          <div className="bg-slate-50 p-3 rounded-md mb-3 text-sm">
                            <h5 className="font-medium mb-2">Search Parameters</h5>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Name Variations:</span> 4
                              </div>
                              <div>
                                <span className="text-muted-foreground">Sources:</span> 18 News Sources
                              </div>
                              <div>
                                <span className="text-muted-foreground">Time Period:</span> Last 10 years
                              </div>
                              <div>
                                <span className="text-muted-foreground">Search Depth:</span> Comprehensive
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground border-t pt-2">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>Screening completed on {formatDate(selectedResult.testDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Audit Log */}
                      <div className="border rounded-md overflow-hidden">
                        <div className="flex items-center p-4 bg-slate-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-gray-500">
                              <ClipboardListIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">Audit Log</h4>
                              <p className="text-sm text-muted-foreground">Complete activity history</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border-t">
                          <div className="space-y-3">
                            <div className="flex gap-3">
                              <div className="w-5 flex justify-center">
                                <div className="h-full w-px bg-slate-200"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">System</span>
                                  <span className="text-xs text-muted-foreground ml-2">{formatDate(selectedResult.testDate)}</span>
                                </div>
                                <p className="text-sm">Screening initiated via API</p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-5 flex justify-center">
                                <div className="h-full w-px bg-slate-200"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verification</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {formatDate(new Date(new Date(selectedResult.testDate).getTime() + 60000).toISOString())}
                                  </span>
                                </div>
                                <p className="text-sm">Identity verification completed successfully</p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-5 flex justify-center">
                                <div className="h-full w-px bg-slate-200"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Screening</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {formatDate(new Date(new Date(selectedResult.testDate).getTime() + 120000).toISOString())}
                                  </span>
                                </div>
                                <p className="text-sm">Sanctions screening completed with {selectedResult.matchCount} matches</p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-5 flex justify-center">
                                <div className="h-full w-px bg-slate-200"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Screening</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {formatDate(new Date(new Date(selectedResult.testDate).getTime() + 180000).toISOString())}
                                  </span>
                                </div>
                                <p className="text-sm">PEP screening completed with {selectedResult.pepMatch ? "1 match" : "no matches"}</p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-5 flex justify-center">
                                <div className="rounded-full w-2 h-2 bg-slate-300 mt-1"></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Risk Analysis</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {formatDate(new Date(new Date(selectedResult.testDate).getTime() + 240000).toISOString())}
                                  </span>
                                </div>
                                <p className="text-sm">Risk score calculated: {selectedResult.riskScore}/100 ({selectedResult.riskLevel})</p>
                                <p className="text-xs text-muted-foreground mt-1">Agent: Compliance-Bot-451</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
} 