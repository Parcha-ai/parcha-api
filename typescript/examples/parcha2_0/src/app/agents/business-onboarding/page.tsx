import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftIcon,
  BuildingIcon,
  FileTextIcon,
  GlobeIcon,
  ClipboardCheckIcon,
  ShieldIcon,
  UserIcon,
  CheckIcon,
  XIcon,
  AlertCircleIcon,
  SparklesIcon,
  UploadIcon,
  PencilIcon,
  CodeIcon,
  PlayIcon,
  ZapIcon,
  ChevronRightIcon,
  HomeIcon,
  Check,
  Shield,
  AlertTriangle,
  Globe,
  Ban,
  CheckCircle,
  Circle,
  AlertCircle,
  BotIcon
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

// Sample data for Business Onboarding compliance checks
const businessOnboardingChecks = [
  {
    id: "sanctions",
    name: "Sanctions Screening",
    type: "Automated",
    status: "passed",
    lastRun: "2 hours ago",
    icon: <Ban className="h-4 w-4 text-destructive" />
  },
  {
    id: "aml",
    name: "AML Check",
    type: "Automated",
    status: "pending",
    lastRun: "Pending",
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
  },
  {
    id: "kyc",
    name: "KYC Verification",
    type: "Manual",
    status: "passed",
    lastRun: "1 day ago",
    icon: <Check className="h-4 w-4 text-emerald-500" />
  },
  {
    id: "pep",
    name: "PEP Screening",
    type: "Automated",
    status: "failed",
    lastRun: "2 hours ago",
    icon: <Shield className="h-4 w-4 text-red-500" />
  },
  {
    id: "geo",
    name: "Geographic Risk",
    type: "Automated",
    status: "passed",
    lastRun: "2 hours ago",
    icon: <Globe className="h-4 w-4 text-blue-500" />
  }
]

// Scenarios with descriptions
const scenarios = [
  { id: "random", name: "Random Data", description: "Generic test data with a mix of different profiles" },
  { id: "sanctioned", name: "Sanctioned Countries", description: "Individuals from countries with sanctions or restrictive measures" },
  { id: "pep", name: "PEP Risk", description: "Politically Exposed Persons with varying levels of influence" },
  { id: "adverseMedia", name: "Adverse Media", description: "Individuals with negative news coverage or reputation issues" },
  { id: "highRisk", name: "High Risk Jurisdictions", description: "Individuals from regions known for compliance concerns" },
  { id: "sdnList", name: "SDN List", description: "Specially Designated Nationals with restricted access" },
  { id: "terrorismFinancing", name: "Terrorism Financing", description: "Profiles with patterns matching terrorism financing risks" },
  { id: "moneyLaundering", name: "Money Laundering", description: "Individuals with characteristics matching money laundering risks" },
  { id: "fraudRisk", name: "Fraud Risk", description: "Profiles showing patterns consistent with fraud activities" },
  { id: "taxEvasion", name: "Tax Evasion", description: "Cases showing indicators of potential tax evasion" },
  { id: "shellCompanies", name: "Shell Companies", description: "Business associations with shell company indicators" },
  { id: "cryptoRisk", name: "Crypto Risk", description: "Profiles with high-risk cryptocurrency activities" }
]

// Update TestResult interface
interface TestResult {
  entityName: string;
  entityDetails: Record<string, string>;
  checkResults: {
    checkId: string;
    checkName: string;
    status: "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info";
    details?: string;
  }[];
}

export default function BusinessOnboardingPage() {
  const location = useLocation();
  const [showTestComponent, setShowTestComponent] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showTestDataModal, setShowTestDataModal] = useState(false);
  const [showCsvImportModal, setShowCsvImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState("random");
  const [generatedTestData, setGeneratedTestData] = useState<any[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [scenarioSearch, setScenarioSearch] = useState("");
  const [testResults, setTestResults] = useState<{
    status: "idle" | "running" | "complete",
    alerts: number,
    flags: number,
    passed: number,
    data: TestResult[]
  }>({ status: "idle", alerts: 0, flags: 0, passed: 0, data: [] });
  
  // Check URL parameters for show=test
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const showTestParam = searchParams.get('show');
    console.log("URL parameters:", location.search);
    console.log("show parameter:", showTestParam);
    
    if (showTestParam === 'test') {
      console.log("Setting showTestComponent to true");
      setShowTestComponent(true);
    } else {
      console.log("showTestParam did not match 'test':", showTestParam);
    }
  }, [location]);
  
  // Toggle agent status between Active and Draft
  const toggleAgentStatus = () => {
    setIsActive(!isActive);
  };

  // Handler for opening the test data modal
  const handleOpenTestDataModal = () => {
    setShowTestDataModal(true);
    // Generate initial test data with the default scenario
    setGeneratedTestData(generateTestData(selectedScenario));
  };
  
  // Handler for closing the test data modal
  const handleCloseTestDataModal = () => {
    setShowTestDataModal(false);
  };
  
  // Handler for selecting a scenario
  const handleSelectScenario = (scenario: string) => {
    setSelectedScenario(scenario);
    // Generate test data based on selected scenario
    setGeneratedTestData(generateTestData(scenario));
  };
  
  // Function to handle running the test with generated data
  const handleRunTest = () => {
    setIsRunningTest(true);
    setTestResults({ ...testResults, status: "running" });
    
    // Simulate a test run with setTimeout
    setTimeout(() => {
      // Calculate results based on the scenario
      let alerts = 0;
      let flags = 0;
      let passed = 0;
      
      // Process test results based on scenario
      const testData = [];
      
      // Generate test results for the first 5 entities in generatedTestData
      for (let i = 0; i < Math.min(5, generatedTestData.length); i++) {
        const entityData = generatedTestData[i];
        
        // Determine risk level based on scenario
        let entityRisk = "Low";
        if (selectedScenario === "sanctioned" || selectedScenario === "sdnList" || 
            selectedScenario === "terrorismFinancing") {
          entityRisk = "High";
          alerts += 1;
        } else if (selectedScenario === "pep" || selectedScenario === "adverseMedia" || 
                   selectedScenario === "highRisk" || selectedScenario === "moneyLaundering") {
          entityRisk = "Medium";
          flags += 1;
        } else {
          passed += 1;
        }
        
        // Create check results for this entity
        const checkResults = [
          {
            checkId: "sanctions",
            checkName: "Sanctions Screening",
            status: (selectedScenario === "sanctioned" || selectedScenario === "sdnList" ? 
                    "Fail" : "Pass") as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: selectedScenario === "sanctioned" ? 
                    "Entity found on OFAC sanctions list" : undefined
          },
          {
            checkId: "aml",
            checkName: "AML Check",
            status: (selectedScenario === "moneyLaundering" || selectedScenario === "terrorismFinancing" ? 
                    "Fail with info" : "Pass") as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: selectedScenario === "moneyLaundering" ? 
                    "Suspicious transaction patterns detected" : undefined
          },
          {
            checkId: "kyc",
            checkName: "KYC Verification",
            status: (selectedScenario === "fraudRisk" ? 
                    "Fail" : (selectedScenario === "shellCompanies" ? "Findings" : "Pass")) as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: selectedScenario === "shellCompanies" ? 
                    "Unable to verify ultimate beneficial owner" : undefined
          },
          {
            checkId: "pep",
            checkName: "PEP Screening",
            status: (selectedScenario === "pep" ? 
                    "Findings" : "Pass") as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: selectedScenario === "pep" ? 
                    "Politically exposed person identified - additional review required" : undefined
          },
          {
            checkId: "geo",
            checkName: "Geographic Risk",
            status: (selectedScenario === "highRisk" ? 
                    "Pass with info" : "Pass") as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: selectedScenario === "highRisk" ? 
                    "Entity operates in high-risk jurisdiction but has appropriate controls" : undefined
          }
        ];
        
        testData.push({
          entityName: entityData["Full Name"],
          entityDetails: entityData,
          checkResults: checkResults
        });
      }
      
      setTestResults({
        status: "complete",
        alerts,
        flags,
        passed,
        data: testData
      });
      
      setIsRunningTest(false);
      setShowTestDataModal(false);
      
      // Activate the agent automatically
      setIsActive(true);
    }, 2000);
  };
  
  // Handler for opening the CSV import modal
  const handleOpenCsvImportModal = () => {
    setShowCsvImportModal(true);
    setCsvPreviewData([]);
    setSelectedFile(null);
  };
  
  // Handler for closing the CSV import modal
  const handleCloseCsvImportModal = () => {
    setShowCsvImportModal(false);
  };
  
  // Handler for when a file is selected
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        const data = [];
        for (let i = 1; i < Math.min(11, lines.length); i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',').map(value => value.trim());
          const row: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          data.push(row);
        }
        
        setCsvPreviewData(data);
      };
      
      reader.readAsText(file);
    }
  };
  
  // Handler for importing the CSV data and running the test
  const handleImportCsv = () => {
    if (!selectedFile || csvPreviewData.length === 0) return;
    
    setIsImporting(true);
    setTestResults({ ...testResults, status: "running" });
    
    // Simulate importing and testing with setTimeout
    setTimeout(() => {
      // Process sample results
      const alerts = Math.floor(Math.random() * 3);
      const flags = Math.floor(Math.random() * 4);
      const passed = csvPreviewData.length - alerts - flags;
      
      // Generate test results based on the imported data
      const testData = csvPreviewData.map((row, index) => {
        // Determine check results by index (for demo purposes)
        const risk = index < alerts ? "High" : index < alerts + flags ? "Medium" : "Low";
        
        // Create check results for this entity
        const checkResults = [
          {
            checkId: "sanctions",
            checkName: "Sanctions Screening",
            status: (index === 0 && alerts > 0) ? "Fail" : "Pass" as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: (index === 0 && alerts > 0) ? "Entity found on sanctions list" : undefined
          },
          {
            checkId: "aml",
            checkName: "AML Check",
            status: (index === 1 && alerts > 0) ? "Fail with info" : "Pass" as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: (index === 1 && alerts > 0) ? "Suspicious transaction patterns detected" : undefined
          },
          {
            checkId: "kyc",
            checkName: "KYC Verification",
            status: (index === 2 && flags > 0) ? "Findings" : "Pass" as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: (index === 2 && flags > 0) ? "Additional documentation required" : undefined
          },
          {
            checkId: "pep",
            checkName: "PEP Screening",
            status: (index === 3 && flags > 0) ? "Pass with info" : "Pass" as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: (index === 3 && flags > 0) ? "Politically exposed person identified - low risk" : undefined
          },
          {
            checkId: "geo",
            checkName: "Geographic Risk",
            status: "Pass" as "Pass" | "Fail" | "Findings" | "Pass with info" | "Fail with info",
            details: undefined
          }
        ];
        
        return {
          entityName: row["Full Name"] || row["Name"] || Object.values(row)[0],
          entityDetails: row,
          checkResults: checkResults
        };
      });
      
      setTestResults({
        status: "complete",
        alerts,
        flags,
        passed,
        data: testData
      });
      
      setIsImporting(false);
      setShowCsvImportModal(false);
      
      // Activate the agent automatically
      setIsActive(true);
    }, 2000);
  };
  
  // Function to generate test data based on selected scenario
  const generateTestData = (scenario: string) => {
    // Sample data for testing
    const testData = [];
    
    // Fields from the Business Onboarding form
    const fields = [
      "Full Name", 
      "Date of Birth", 
      "Country of Residence", 
      "Nationality", 
      "Government ID",
      "Occupation",
      "Business Association",
      "Address",
      "Political Affiliation"
    ];
    
    // Scenario-specific data
    const scenarioData: Record<string, Record<string, string[]>> = {
      random: {
        "Full Name": ["John Smith", "Jane Doe", "Robert Johnson", "Emily Davis", "Michael Brown"],
        "Country of Residence": ["United States", "United Kingdom", "Canada", "Australia", "Germany"],
        "Nationality": ["American", "British", "Canadian", "Australian", "German"],
        "Occupation": ["Software Engineer", "Doctor", "Teacher", "Accountant", "Lawyer"],
        "Business Association": ["Tech Corp", "Health Services", "Education Inc", "Finance Co", "Legal Associates"],
        "Political Affiliation": ["None", "Local Party Member", "Regional Representative", "National Committee", "None"]
      },
      sanctioned: {
        "Full Name": ["Ali Hassan", "Mei Lin", "Victor Petrov", "Fatima Al-Farsi", "Kim Sung"],
        "Country of Residence": ["Iran", "North Korea", "Syria", "Sudan", "Cuba"],
        "Nationality": ["Iranian", "North Korean", "Syrian", "Sudanese", "Cuban"],
        "Occupation": ["Import/Export Agent", "Banking Official", "Government Official", "Military Officer", "Trade Representative"],
        "Business Association": ["National Trade Co.", "State Banking Corp.", "Government Ministry", "Defense Contractor", "State Energy Corp."],
        "Political Affiliation": ["Government Party Member", "Military Commander", "Regional Governor", "Party Official", "Sanctioned Entity Director"]
      },
      pep: {
        "Full Name": ["Elena Romanov", "Carlos Rodriguez", "Ibrahim Al-Saud", "Margaret Wellington", "Hiroshi Tanaka"],
        "Country of Residence": ["Russia", "Mexico", "Saudi Arabia", "United Kingdom", "Japan"],
        "Nationality": ["Russian", "Mexican", "Saudi", "British", "Japanese"],
        "Occupation": ["Minister of Finance", "Regional Governor", "Royal Family Member", "Senator", "Vice President"],
        "Business Association": ["National Bank", "Government Office", "Royal Holdings", "Parliament", "Ministry of Trade"],
        "Political Affiliation": ["Ruling Party", "Opposition Leader", "Royal Family", "Conservative Party", "Liberal Democratic Party"]
      },
      adverseMedia: {
        "Full Name": ["Richard Maxwell", "Sarah Johnson", "Thomas Wright", "Olivia Chen", "David Rodriguez"],
        "Country of Residence": ["United States", "Canada", "Australia", "Singapore", "Spain"],
        "Nationality": ["American", "Canadian", "Australian", "Singaporean", "Spanish"],
        "Occupation": ["CEO", "Investment Banker", "Real Estate Developer", "Corporate Executive", "Fund Manager"],
        "Business Association": ["Maxwell Industries", "Global Investments Ltd", "Wright Properties", "Chen Holdings", "Rodriguez Enterprises"],
        "Political Affiliation": ["Campaign Donor", "Industry Lobbyist", "Political Fundraiser", "None", "Party Supporter"]
      },
      highRisk: {
        "Full Name": ["Andrei Volkov", "Camilla Martinez", "Raj Patel", "Zara Karimi", "Ling Wei"],
        "Country of Residence": ["Ukraine", "Colombia", "Pakistan", "Afghanistan", "Myanmar"],
        "Nationality": ["Ukrainian", "Colombian", "Pakistani", "Afghan", "Burmese"],
        "Occupation": ["Currency Exchanger", "Precious Metals Dealer", "Real Estate Agent", "Cash-Intensive Business Owner", "Cross-Border Merchant"],
        "Business Association": ["Cash Transfer Services", "Gold & Jewelry Trading", "International Properties", "Import/Export Company", "Multi-National Trading Co."],
        "Political Affiliation": ["Local Official", "Former Regime Associate", "Regional Power Broker", "Tribal Leader", "None"]
      },
      sdnList: {
        "Full Name": ["Mohammad Rahman", "Vladimir Sokolov", "Jing Zhao", "Alejandro Diaz", "Osama Khalid"],
        "Country of Residence": ["Yemen", "Belarus", "China", "Venezuela", "Somalia"],
        "Nationality": ["Yemeni", "Belarusian", "Chinese", "Venezuelan", "Somali"],
        "Occupation": ["Shipping Manager", "Defense Contractor", "Bank Executive", "Mining Executive", "Telecom Director"],
        "Business Association": ["Global Shipping LLC", "Defense Systems Int.", "National Banking Group", "Mineral Resources Corp", "Communication Networks"],
        "Political Affiliation": ["Militia Leader", "Government Ally", "Party Official", "Regime Associate", "Regional Commander"]
      },
      terrorismFinancing: {
        "Full Name": ["Abdul Qadir", "Farhan Ahmed", "Ibrahim Nur", "Mahmoud Hassan", "Samir Ghazi"],
        "Country of Residence": ["Pakistan", "Somalia", "Yemen", "Iraq", "Libya"],
        "Nationality": ["Pakistani", "Somali", "Yemeni", "Iraqi", "Libyan"],
        "Occupation": ["Charity Director", "Religious Leader", "Import/Export", "Money Exchange Operator", "NGO Coordinator"],
        "Business Association": ["Global Relief Foundation", "Religious Education Center", "Border Trade Company", "Currency Exchange Network", "Humanitarian Aid Org"],
        "Political Affiliation": ["Religious Group Leader", "Tribal Elder", "Militia Affiliate", "Regional Commander", "None"]
      },
      moneyLaundering: {
        "Full Name": ["Sergei Kuznetsov", "Maria Gonzalez", "Zhang Wei", "Antonio Rossi", "Dimitri Petrov"],
        "Country of Residence": ["Cyprus", "Panama", "Hong Kong", "Luxembourg", "Malta"],
        "Nationality": ["Russian", "Colombian", "Chinese", "Italian", "Ukrainian"],
        "Occupation": ["Investment Advisor", "Real Estate Developer", "Art Dealer", "Casino Operator", "Lawyer"],
        "Business Association": ["Offshore Investments Ltd", "Real Estate Holdings", "Fine Art Imports", "Entertainment Group", "Legal Services International"],
        "Political Affiliation": ["None", "Former Government Consultant", "None", "Local Business Association", "None"]
      },
      fraudRisk: {
        "Full Name": ["Daniel Morgan", "Lisa Chen", "Robert Williams", "Sophie Martin", "James Anderson"],
        "Country of Residence": ["United States", "Singapore", "Canada", "France", "Australia"],
        "Nationality": ["American", "Singaporean", "Canadian", "French", "Australian"],
        "Occupation": ["Investment Advisor", "Tech Entrepreneur", "Insurance Broker", "Financial Consultant", "Business Developer"],
        "Business Association": ["Global Investment Strategies", "Innovative Tech Solutions", "Premium Insurance Services", "Financial Advisory Group", "Business Development Partners"],
        "Political Affiliation": ["None", "Industry Association Member", "None", "None", "Local Business Council"]
      },
      taxEvasion: {
        "Full Name": ["Jonathan Price", "Isabella Romano", "Alexander Schmidt", "Emma Thompson", "William Chen"],
        "Country of Residence": ["Cayman Islands", "Monaco", "Switzerland", "Bermuda", "Gibraltar"],
        "Nationality": ["British", "Italian", "German", "Canadian", "American"],
        "Occupation": ["Financial Advisor", "Private Banker", "Asset Manager", "Property Developer", "Consultant"],
        "Business Association": ["Wealth Management Partners", "Private Banking Services", "Global Asset Management", "International Real Estate", "Strategic Consulting Group"],
        "Political Affiliation": ["None", "None", "Finance Industry Association", "None", "Economic Forum Member"]
      },
      shellCompanies: {
        "Full Name": ["George Wilson", "Ana Martinez", "Henry Zhang", "Olivia Johnson", "Marcus Andersen"],
        "Country of Residence": ["British Virgin Islands", "Seychelles", "Delaware", "Belize", "Jersey"],
        "Nationality": ["British", "Spanish", "Chinese-American", "American", "Danish"],
        "Occupation": ["Director", "Corporate Secretary", "Trustee", "Nominee Director", "Business Agent"],
        "Business Association": ["Global Holdings Ltd", "International Business Corp", "Asset Management Trust", "Enterprise Services Inc", "Strategic Investments Group"],
        "Political Affiliation": ["None", "None", "None", "None", "None"]
      },
      cryptoRisk: {
        "Full Name": ["Alex Nakamoto", "Sophia Lee", "Raj Mehta", "Elena Kuznetsova", "Michael Zhang"],
        "Country of Residence": ["Estonia", "Singapore", "UAE", "Russia", "Hong Kong"],
        "Nationality": ["American", "Korean", "Indian", "Russian", "Chinese"],
        "Occupation": ["Crypto Trader", "Exchange Operator", "DeFi Developer", "OTC Broker", "Mining Farm Operator"],
        "Business Association": ["Digital Asset Trading", "Crypto Exchange Services", "DeFi Protocol", "OTC Trading Desk", "Mining Operations LLC"],
        "Political Affiliation": ["Crypto Advocacy Group", "None", "Industry Alliance Member", "None", "Blockchain Association"]
      }
    };
    
    // Generate 10 rows of test data
    for (let i = 0; i < 10; i++) {
      const rowData: Record<string, string> = {};
      
      // Fill each field with mock data based on scenario
      fields.forEach(field => {
        if (field === "Full Name") {
          const names = scenarioData[scenario]?.[field] || scenarioData.random[field];
          rowData[field] = names[i % names.length];
        } else if (field === "Date of Birth") {
          // Adjust ages based on scenario (older for PEPs, etc.)
          const baseYear = scenario === "pep" ? 1950 : (scenario === "highRisk" ? 1970 : 1960);
          rowData[field] = `${baseYear + (i * 2)}-${(i % 12) + 1}-${(i % 28) + 1}`;
        } else if (field === "Country of Residence") {
          const countries = scenarioData[scenario]?.[field] || scenarioData.random[field];
          rowData[field] = countries[i % countries.length];
        } else if (field === "Nationality") {
          const nationalities = scenarioData[scenario]?.[field] || scenarioData.random[field];
          rowData[field] = nationalities[i % nationalities.length];
        } else if (field === "Government ID") {
          const prefix = scenario === "sanctioned" ? "SNT-" : (scenario === "pep" ? "PEP-" : "ID-");
          rowData[field] = `${prefix}${10000000 + i * 12345}`;
        } else if (field === "Occupation") {
          const occupations = scenarioData[scenario]?.[field] || scenarioData.random[field];
          rowData[field] = occupations[i % occupations.length];
        } else if (field === "Business Association") {
          const businesses = scenarioData[scenario]?.[field] || scenarioData.random[field];
          rowData[field] = businesses[i % businesses.length];
        } else if (field === "Address") {
          const streetNumber = 100 + i;
          const cityName = scenario === "sanctioned" ? "Capital City" : (scenario === "pep" ? "Government District" : `City ${i}`);
          const streetType = scenario === "highRisk" ? "Boulevard" : "Street";
          rowData[field] = `${streetNumber} Main ${streetType}, ${cityName}`;
        } else if (field === "Political Affiliation") {
          const affiliations = scenarioData[scenario]?.[field] || scenarioData.random[field];
          rowData[field] = affiliations[i % affiliations.length];
        } else {
          rowData[field] = `Sample data ${i}`;
        }
      });
      
      testData.push(rowData);
    }
    
    return testData;
  };
  
  // Add renderStatus function before renderChecksTable
  const renderStatus = (status: string) => {
    switch (status) {
      case "passing":
        return (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span>Passing</span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Warning</span>
          </div>
        );
      case "flagged":
        return (
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
            <span>Flagged</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Circle className="mr-2 h-4 w-4 text-gray-400" />
            <span>Not Run</span>
          </div>
        );
    }
  };

  const renderChecksTable = () => {
  return (
              <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-1">Compliance Checks</h2>
              <p className="text-sm text-muted-foreground">
                The following checks are included in the Business Onboarding compliance process.
              </p>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">Check Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessOnboardingChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {check.icon}
                          {check.name}
                        </div>
                      </TableCell>
                      <TableCell>{check.type}</TableCell>
                      <TableCell>{renderStatus(check.status)}</TableCell>
                      <TableCell>{check.lastRun}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View Results</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </div>
      </div>
    );
  };

  // Test Your Agent component
  const renderTestYourAgent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-xl font-semibold">Test Your Agent</h2>
          <p className="text-sm text-muted-foreground">
            Choose a method to test your agent before deploying it to production.
          </p>
        </div>
        
        <div className="flex flex-row gap-4 overflow-x-auto pb-2">
          <div 
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-primary min-w-[280px] flex-1"
            onClick={handleOpenTestDataModal}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">Auto-Generate Sample Data</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Create realistic synthetic test data based on your configured inputs. Fastest way to verify your agent works.
            </p>
          </div>
          
          <div 
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-primary min-w-[280px] flex-1"
            onClick={handleOpenCsvImportModal}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                <UploadIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">Import Data from CSV</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Use your existing data by uploading a CSV file. Best for testing real-world scenarios with actual data.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-primary min-w-[280px] flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                <PencilIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">Manually Create Test Cases</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Create specific test cases by hand. Ideal for edge cases, high-risk scenarios, or targeted testing.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-primary min-w-[280px] flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                <CodeIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">Test API Integration</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Validate API connectivity and test your agent directly through Parcha's API. For developers integrating with your systems.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Filtered scenarios based on search
  const filteredScenarios = scenarios.filter(scenario => 
    scenario.name.toLowerCase().includes(scenarioSearch.toLowerCase()) || 
    scenario.description.toLowerCase().includes(scenarioSearch.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar className="shrink-0 border-r" />
        <div className="flex-1 flex flex-col max-w-full overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Breadcrumb and top bar */}
            <header className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Link to="/agents" className="text-muted-foreground hover:text-foreground">
                    <BotIcon className="h-4 w-4 inline mr-1" />
                    Compliance Agents
                  </Link>
                  <ChevronRightIcon className="h-4 w-4 mx-1 text-muted-foreground" />
                  <span className="font-medium">Business Onboarding</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <ZapIcon className={`h-5 w-5 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
                  <Badge 
                    variant={isActive ? "default" : "outline"}
                    className={isActive ? "bg-green-100 text-green-700 border-green-200" : ""}
                  >
                    {isActive ? "Active" : "Draft"}
                  </Badge>
                  <Switch
                    checked={isActive}
                    onCheckedChange={toggleAgentStatus}
                  />
                </div>
              </div>
            </header>

            {/* Main content */}
            <div className="flex-1 overflow-auto p-6">
              {showTestComponent ? (
                <div className="space-y-8">
                  {renderTestYourAgent()}
                  {testResults.status === "complete" && renderTestResults(testResults)}
                </div>
              ) : (
                <div className="space-y-8">
                  {renderChecksTable()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test data modal */}
        <Dialog open={showTestDataModal} onOpenChange={setShowTestDataModal}>
          <DialogContent className="max-w-6xl p-0">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            
            <div className="p-6 pb-3">
              <DialogHeader>
                <DialogTitle>Generate Test Data</DialogTitle>
                <DialogDescription>
                  Select a scenario to generate test data based on your agent's configuration.
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="h-px bg-border w-full"></div>
            
            <div className="grid grid-cols-4">
              {/* Scenario Selection Panel */}
              <div className="col-span-1 border-r">
                <div className="sticky top-0 bg-white p-6 pb-2 z-10 border-b">
                  <h3 className="font-medium text-sm mb-2">Choose a Scenario</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search scenarios..."
                      value={scenarioSearch}
                      onChange={(e) => setScenarioSearch(e.target.value)}
                      className="w-full py-1.5 px-3 text-sm border rounded-md pr-8 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    {filteredScenarios.length > 0 ? (
                      filteredScenarios.map(scenario => (
                        <div 
                          key={scenario.id}
                          className={`p-2 rounded-md cursor-pointer text-sm ${
                            selectedScenario === scenario.id
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-slate-100'
                          }`}
                          onClick={() => handleSelectScenario(scenario.id)}
                        >
                          <div className="font-medium">{scenario.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{scenario.description}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground py-4 text-center">
                        No scenarios match your search
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Test Data Table */}
              <div className="col-span-3 p-6">
                <h3 className="font-medium mb-2 text-sm">Generated Test Data</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b">
                          {generatedTestData.length > 0 && 
                            Object.keys(generatedTestData[0]).map(header => (
                              <th key={header} className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap border-r last:border-r-0">
                                {header}
                              </th>
                            ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {generatedTestData.map((row, rowIndex) => (
                          <tr key={rowIndex} className="bg-white border-b last:border-b-0">
                            {Object.values(row).map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2 text-sm border-r last:border-r-0 whitespace-nowrap">
                                {cell as string}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-border w-full"></div>
            
            <div className="flex justify-between p-6 pt-4">
              <Button variant="outline" onClick={handleCloseTestDataModal} disabled={isRunningTest}>
                Cancel
              </Button>
              <Button onClick={handleRunTest} disabled={isRunningTest}>
                {isRunningTest ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Running Test...
                  </>
                ) : (
                  <>
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Run Test
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* CSV Import modal */}
        <Dialog open={showCsvImportModal} onOpenChange={setShowCsvImportModal}>
          <DialogContent className="max-w-6xl p-0">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            
            <div className="p-6 pb-3">
              <DialogHeader>
                <DialogTitle>Import Data from CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with test data to evaluate your agent's performance with real-world scenarios.
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="h-px bg-border w-full"></div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                  <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedFile ? `Selected: ${selectedFile.name}` : "Drag and drop your CSV file, or click to browse"}
                  </p>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="max-w-xs"
                  />
                  <div className="text-xs text-muted-foreground mt-4">
                    The CSV should include columns for Full Name, Date of Birth, Country, and other relevant fields.
                  </div>
                </div>
                
                {csvPreviewData.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium mb-2 text-sm">CSV Preview</h3>
                    <div className="border rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b">
                              {Object.keys(csvPreviewData[0]).map(header => (
                                <th key={header} className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap border-r last:border-r-0">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {csvPreviewData.map((row, rowIndex) => (
                              <tr key={rowIndex} className="bg-white border-b last:border-b-0">
                                {Object.values(row).map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-4 py-2 text-sm border-r last:border-r-0 whitespace-nowrap">
                                    {cell as string}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="h-px bg-border w-full"></div>
            
            <div className="flex justify-between p-6 pt-4">
              <Button variant="outline" onClick={handleCloseCsvImportModal} disabled={isImporting}>
                Cancel
              </Button>
              <Button onClick={handleImportCsv} disabled={isImporting || !selectedFile || csvPreviewData.length === 0}>
                {isImporting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Importing Data...
                  </>
                ) : (
                  <>
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Run Test with CSV Data
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}

function renderTestResults(testResults: any) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Test Results</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-700 border-red-200">
              {testResults.alerts} Alerts
            </Badge>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
              {testResults.flags} Flags
            </Badge>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {testResults.passed} Passed
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Results from running your agent against the test data
        </p>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap border-r">Entity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap border-r">Sanctions</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap border-r">AML</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap border-r">KYC</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap border-r">PEP</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Geographic Risk</th>
              </tr>
            </thead>
            <tbody>
              {testResults.data.map((result: any, index: number) => (
                <tr key={index} className="bg-white border-b last:border-b-0">
                  <td className="px-4 py-2 text-sm border-r whitespace-nowrap font-medium">
                    <div className="font-medium">{result.entityName}</div>
                    <div className="text-xs text-slate-500">
                      {result.entityDetails["Nationality"] || "—"} · {result.entityDetails["Occupation"] || "—"}
                    </div>
                  </td>
                  {result.checkResults.map((check: any, checkIndex: number) => (
                    <td key={checkIndex} className="px-4 py-2 text-sm border-r last:border-r-0">
                      {renderCheckStatus(check.status, check.details)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper function to render check status with appropriate styling
function renderCheckStatus(status: string, details?: string) {
  let badge;
  
  switch(status) {
    case "Pass":
      badge = <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pass</Badge>;
      break;
    case "Fail":
      badge = <Badge variant="destructive">Fail</Badge>;
      break;
    case "Findings":
      badge = <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Findings</Badge>;
      break;
    case "Pass with info":
      badge = <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pass with Info</Badge>;
      break;
    case "Fail with info":
      badge = <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">Fail with Info</Badge>;
      break;
    default:
      badge = <Badge variant="outline">Unknown</Badge>;
  }
  
  return (
    <div>
      <div>{badge}</div>
      {details && <div className="text-xs mt-1 text-slate-600">{details}</div>}
    </div>
  );
} 