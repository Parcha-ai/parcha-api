import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertCircleIcon, 
  CheckIcon, 
  FlagIcon, 
  PlusIcon, 
  SearchIcon,
  Settings2Icon, 
  ShieldIcon, 
  UserIcon,
  BuildingIcon,
  GlobeIcon,
  FileTextIcon,
  ClockIcon,
  DollarSignIcon,
  HomeIcon,
  SparklesIcon,
  BotIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
  ZapIcon,
  LockIcon,
  UploadIcon,
  PencilIcon,
  CodeIcon,
  DownloadIcon,
  PlayIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  InfoIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import React from "react"

// Define local interfaces instead of importing
interface AgentTemplate {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CheckItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'verification' | 'research' | 'both';
}

// Define the type for scenario data
type ScenarioData = {
  title: string;
  description: string;
  countries: string[];
  nationalities: string[];
  occupations: string[];
  politicalAffiliations: string[];
  businessAssociations: string[];
}

export default function AgentsPage() {
  // State for the agent creation wizard
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedEntityTypes, setSelectedEntityTypes] = useState({
    individuals: false,
    businesses: false
  });
  const [expandedChecks, setExpandedChecks] = useState({
    sanctions: false,
    pep: false,
    adverseMedia: false
  });
  // State for additional checks
  const [additionalChecks, setAdditionalChecks] = useState<CheckItem[]>([]);
  const [expandedAdditionalChecks, setExpandedAdditionalChecks] = useState<Record<string, boolean>>({});
  const [addCheckDialogOpen, setAddCheckDialogOpen] = useState(false);
  // State for test data
  const [showGeneratedTestData, setShowGeneratedTestData] = useState(false);
  const [showManualDataEntry, setShowManualDataEntry] = useState(false);
  const [generatedTestData, setGeneratedTestData] = useState<Record<string, string>[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>("random"); // New state for selected scenario
  
  // State for data input toggles
  type InputToggleState = {
    "Full Name": boolean;
    "Date of Birth": boolean;
    "Country of Residence": boolean;
    "Nationality": boolean;
    "Government ID": boolean;
    "Aliases": boolean;
    "Occupation": boolean;
    "Political Affiliations": boolean;
    "Address": boolean;
    "Business Associations": boolean;
  };
  
  const [enabledInputs, setEnabledInputs] = useState<InputToggleState>({
    "Full Name": true,
    "Date of Birth": true,
    "Country of Residence": true,
    "Nationality": true,
    "Government ID": true,
    "Aliases": false,
    "Occupation": true,
    "Political Affiliations": false,
    "Address": true,
    "Business Associations": true
  });
  
  // State for removal confirmation
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [checkToRemove, setCheckToRemove] = useState<{ id: string, type: 'default' | 'additional' } | null>(null);
  
  // State for syncing profile matching settings across checks
  const [syncProfileMatching, setSyncProfileMatching] = useState(true);
  
  // Profile matching settings for each check
  const [profileMatchingSettings, setProfileMatchingSettings] = useState({
    sanctions: {
      nameMatch: 80,
      dobMatch: true,
      countryMatch: false,
      idMatch: false
    },
    pep: {
      nameMatch: 85,
      dobMatch: true,
      countryMatch: true,
      idMatch: true
    },
    adverseMedia: {
      nameMatch: 75,
      dobMatch: false,
      countryMatch: false,
      idMatch: false
    }
  });
  
  // Add sample/mock input fields based on what might have been configured in the Data Inputs step
  const configuredInputs = [
    { name: "Full Name", type: "text" },
    { name: "Aliases", type: "text" },
    { name: "Date of Birth", type: "date" },
    { name: "Country of Residence", type: "text" },
    { name: "Nationality", type: "text" },
    { name: "Government ID", type: "text" },
    { name: "Occupation", type: "text" },
    { name: "Political Affiliations", type: "text" },
    { name: "Address", type: "text" },
    { name: "Business Associations", type: "text" }
  ];
  
  // Define scenario-specific data
  const scenarios: Record<string, ScenarioData> = {
    random: {
      title: "Random Data",
      description: "General random test data",
      countries: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Brazil", "India", "China"],
      nationalities: ["American", "British", "Canadian", "Australian", "German", "French", "Japanese", "Brazilian", "Indian", "Chinese"],
      occupations: ["Doctor", "Engineer", "Teacher", "Lawyer", "Accountant", "Manager", "Consultant", "Researcher", "Entrepreneur", "Analyst"],
      politicalAffiliations: ["None", "Liberal Party", "Conservative Party", "Labor Party", "Democratic Party", "Republican Party", "Green Party", "Independent", "", "Socialist Party"],
      businessAssociations: ["ABC Corporation", "XYZ Holdings", "123 Enterprises", "Global Solutions", "Tech Innovations", "Finance Partners", "Retail Group", "Education Alliance", "Media Group", "None"]
    },
    sanctionedCountries: {
      title: "Sanctioned Countries",
      description: "High-risk sanctions matches",
      countries: ["Iran", "North Korea", "Russia", "Syria", "Belarus", "Venezuela", "Myanmar", "Cuba", "Eritrea", "Zimbabwe"],
      nationalities: ["Iranian", "North Korean", "Russian", "Syrian", "Belarusian", "Venezuelan", "Burmese", "Cuban", "Eritrean", "Zimbabwean"],
      occupations: ["Government Official", "Banker", "Oil Executive", "Military Officer", "Trade Representative", "Shipping Magnate", "Mining Executive", "Telecommunications Director", "Financial Advisor", "Import/Export Manager"],
      politicalAffiliations: ["Workers' Party", "United Russia", "Ba'ath Party", "Communist Party", "PSUV", "Military Council", "Communist Party", "ZANU-PF", "PFDJ", "State Administration Council"],
      businessAssociations: ["National Oil Company", "State Banking Group", "Defense Industries Organization", "Government Trade Agency", "National Resource Corporation", "Central Bank", "Military Industries", "State Shipping Company", "Minerals Trading Corp", "Government Import/Export"]
    },
    pepRisk: {
      title: "PEP Risk",
      description: "Political exposure testing",
      countries: ["United States", "United Kingdom", "France", "Germany", "Russia", "China", "India", "Brazil", "South Africa", "Mexico"],
      nationalities: ["American", "British", "French", "German", "Russian", "Chinese", "Indian", "Brazilian", "South African", "Mexican"],
      occupations: ["Senator", "Minister", "Diplomat", "Governor", "Mayor", "Judge", "Central Bank Director", "Parliament Member", "Party Secretary", "State Governor"],
      politicalAffiliations: ["Democratic Party", "Republican Party", "Conservative Party", "Labor Party", "United Russia", "Communist Party", "Congress Party", "Workers' Party", "African National Congress", "Institutional Revolutionary Party"],
      businessAssociations: ["Family Foundation", "National Investment Fund", "Public Works Commission", "State Energy Company", "National Development Bank", "Government Holdings", "Sovereign Wealth Fund", "National Resources Agency", "State Media Group", "Central Planning Committee"]
    },
    adverseMedia: {
      title: "Adverse Media",
      description: "Negative news scenarios",
      countries: ["United States", "United Kingdom", "Russia", "China", "Mexico", "Colombia", "Nigeria", "Italy", "Japan", "Brazil"],
      nationalities: ["American", "British", "Russian", "Chinese", "Mexican", "Colombian", "Nigerian", "Italian", "Japanese", "Brazilian"],
      occupations: ["Corporate Executive", "Investment Banker", "Real Estate Developer", "Casino Owner", "Cryptocurrency Trader", "Offshore Consultant", "Art Dealer", "Private Banker", "Wealth Manager", "Shell Company Director"],
      politicalAffiliations: ["None", "Liberal Party", "Conservative Party", "Independent", "Reform Party", "Democratic Party", "Republican Party", "United Russia", "Communist Party", "Workers' Party"],
      businessAssociations: ["Global Investments Ltd", "Oceanic Holdings", "Cayman Financial Group", "Apex Capital", "Monarch Ventures", "Heritage Trust", "Diamond Harbor Assets", "Golden Peak Enterprises", "Silk Road Trading", "Emerald Bay Partners"]
    },
    terrorismFinancing: {
      title: "Terrorism Financing",
      description: "Terror financing red flags",
      countries: ["Afghanistan", "Pakistan", "Somalia", "Yemen", "Iraq", "Syria", "Libya", "Mali", "Philippines", "Nigeria"],
      nationalities: ["Afghan", "Pakistani", "Somali", "Yemeni", "Iraqi", "Syrian", "Libyan", "Malian", "Filipino", "Nigerian"],
      occupations: ["Charity Director", "Money Transfer Operator", "Religious Leader", "Import/Export Manager", "NGO Worker", "Construction Manager", "Telecom Reseller", "Jewelry Trader", "Currency Exchange Operator", "Travel Agent"],
      politicalAffiliations: ["None", "Religious Organization", "Tribal Affiliation", "Local Militia", "", "Community Group", "Activist Organization", "Relief Organization", "Heritage Foundation", "Cultural Association"],
      businessAssociations: ["Overseas Relief Fund", "Global Aid Network", "Heritage Foundation", "Community Support Group", "International Solidarity Movement", "Humanitarian Relief Fund", "Orphan Care International", "Desert Dawn Charity", "Youth Education Fund", "Medical Aid Collective"]
    },
    moneyLaundering: {
      title: "Money Laundering",
      description: "AML risk indicators",
      countries: ["Panama", "Cayman Islands", "Switzerland", "Luxembourg", "Bahamas", "Seychelles", "British Virgin Islands", "Hong Kong", "Singapore", "UAE"],
      nationalities: ["Panamanian", "British", "Swiss", "Luxembourgish", "Bahamian", "Seychellois", "British", "Chinese", "Singaporean", "Emirati"],
      occupations: ["Shell Company Director", "Offshore Service Provider", "Professional Nominee", "Trust Administrator", "Wealth Manager", "Real Estate Developer", "Art Dealer", "Cryptocurrency Trader", "Private Banker", "Luxury Goods Merchant"],
      politicalAffiliations: ["None", "Independent", "", "Business Association", "Finance Committee", "Economic Forum", "Trade Association", "Industry Council", "Development Group", "Commerce Chamber"],
      businessAssociations: ["Offshore Holdings Ltd", "International Trust Services", "Asset Protection Group", "Global Fiduciary Services", "Corporate Services Ltd", "Private Client Solutions", "International Business Consultants", "Wealth Preservation Partners", "Asset Management International", "Nominee Directors Ltd"]
    },
    fraudRisk: {
      title: "Fraud Risk",
      description: "Fraud patterns & schemes",
      countries: ["United States", "Nigeria", "United Kingdom", "China", "Russia", "India", "South Africa", "Mexico", "Brazil", "Canada"],
      nationalities: ["American", "Nigerian", "British", "Chinese", "Russian", "Indian", "South African", "Mexican", "Brazilian", "Canadian"],
      occupations: ["Business Consultant", "Investment Advisor", "Online Marketer", "Tech Company CEO", "Insurance Broker", "Financial Planner", "Real Estate Developer", "Cryptocurrency Expert", "Investment Fund Manager", "Securities Trader"],
      politicalAffiliations: ["None", "Independent", "", "Business Association", "Industry Council", "Reform Party", "Democratic Party", "Republican Party", "Business Forum", "Industry Alliance"],
      businessAssociations: ["Global Investments LLC", "Premier Financial Group", "Apex Ventures", "Elite Wealth Partners", "Strategic Investment Solutions", "Diamond Capital Management", "Platinum Financial Services", "Prime Investment Consultants", "Superior Holdings Group", "Prestige Asset Management"]
    },
    taxEvasion: {
      title: "Tax Evasion",
      description: "Tax evasion indicators",
      countries: ["Switzerland", "Panama", "Cayman Islands", "Cyprus", "Bahamas", "Bermuda", "Ireland", "Luxembourg", "Singapore", "Hong Kong"],
      nationalities: ["Swiss", "Panamanian", "British", "Cypriot", "Bahamian", "Bermudian", "Irish", "Luxembourgish", "Singaporean", "Chinese"],
      occupations: ["Accountant", "Tax Consultant", "Business Owner", "Financial Advisor", "Corporate Services Provider", "Lawyer", "Trust Administrator", "Wealth Manager", "Company Director", "Investment Advisor"],
      politicalAffiliations: ["None", "Independent", "Business Association", "Industry Council", "Finance Committee", "Trade Group", "Business Forum", "Economic Council", "Industry Alliance", "Commerce Association"],
      businessAssociations: ["International Business Solutions", "Offshore Services Group", "Corporate Tax Consultants", "Global Trust Services", "International Holdings Ltd", "Business Registration Services", "Corporate Formation Experts", "International Tax Planners", "Asset Protection Partners", "Global Business Services"]
    },
    virtualAssets: {
      title: "Virtual Assets",
      description: "Crypto & virtual assets",
      countries: ["United States", "Singapore", "Switzerland", "Malta", "Estonia", "Japan", "South Korea", "Germany", "United Kingdom", "Hong Kong"],
      nationalities: ["American", "Singaporean", "Swiss", "Maltese", "Estonian", "Japanese", "South Korean", "German", "British", "Chinese"],
      occupations: ["Cryptocurrency Trader", "Blockchain Developer", "Exchange Owner", "DeFi Protocol Founder", "Mining Operation Manager", "Cryptocurrency Consultant", "Virtual Asset Service Provider", "NFT Creator", "Crypto Hedge Fund Manager", "Digital Asset Advisor"],
      politicalAffiliations: ["None", "Independent", "Blockchain Association", "Digital Asset Council", "Crypto Alliance", "Technology Forum", "Fintech Group", "Digital Currency Coalition", "Blockchain Foundation", "Cryptocurrency Council"],
      businessAssociations: ["Blockchain Ventures", "Crypto Capital Partners", "Digital Asset Fund", "Virtual Currency Exchange", "DeFi Protocol DAO", "Mining Consortium", "Cryptocurrency Investment Group", "Blockchain Development Lab", "Digital Asset Custody Service", "NFT Marketplace"]
    },
    highNetWorth: {
      title: "High Net Worth",
      description: "HNWI client risk profiles",
      countries: ["United States", "United Kingdom", "France", "Germany", "Switzerland", "Singapore", "Hong Kong", "UAE", "Saudi Arabia", "Russia"],
      nationalities: ["American", "British", "French", "German", "Swiss", "Singaporean", "Chinese", "Emirati", "Saudi", "Russian"],
      occupations: ["Business Owner", "CEO", "Investor", "Real Estate Developer", "Hedge Fund Manager", "Private Equity Partner", "Family Office Director", "Tech Entrepreneur", "Oil & Gas Executive", "Venture Capitalist"],
      politicalAffiliations: ["None", "Republican Party", "Democratic Party", "Conservative Party", "Labour Party", "United Russia", "Independent", "Business Forum", "Economic Council", "Royal Family Connection"],
      businessAssociations: ["Family Office", "Private Investment Company", "Personal Holding Group", "Estate Management Corporation", "Private Trust", "Heritage Foundation", "Legacy Group", "Wealth Management Office", "Asset Holdings Ltd", "Personal Investment Vehicle"]
    },
    humanTrafficking: {
      title: "Human Trafficking",
      description: "Human trafficking indicators",
      countries: ["Thailand", "Philippines", "Nigeria", "Ukraine", "Moldova", "Mexico", "Vietnam", "Cambodia", "Bangladesh", "Romania"],
      nationalities: ["Thai", "Filipino", "Nigerian", "Ukrainian", "Moldovan", "Mexican", "Vietnamese", "Cambodian", "Bangladeshi", "Romanian"],
      occupations: ["Employment Agency Owner", "Hospitality Manager", "Construction Contractor", "Massage Parlor Owner", "Model Agency Director", "Recruiter", "Transportation Coordinator", "Visa Consultant", "Property Manager", "Entertainment Promoter"],
      politicalAffiliations: ["None", "Local Official", "Regional Authority", "Independent", "", "Community Organization", "Business Association", "Trade Group", "Industry Council", "Labor Organization"],
      businessAssociations: ["International Staffing Agency", "Global Recruitment Services", "Overseas Employment Group", "Cross-Border Labor Solutions", "International Placement Experts", "Work Abroad Program", "Domestic Staff Placement", "International Modeling Agency", "Entertainment Promotions", "Hospitality Staff Solutions"]
    },
    wildlifeTrafficking: {
      title: "Wildlife Trafficking",
      description: "Wildlife trade red flags",
      countries: ["Vietnam", "China", "Thailand", "Malaysia", "Indonesia", "Congo", "Kenya", "South Africa", "Brazil", "Myanmar"],
      nationalities: ["Vietnamese", "Chinese", "Thai", "Malaysian", "Indonesian", "Congolese", "Kenyan", "South African", "Brazilian", "Burmese"],
      occupations: ["Import/Export Business Owner", "Shipping Agent", "Art Dealer", "Antiques Trader", "Pet Shop Owner", "Wildlife Collector", "Traditional Medicine Practitioner", "Taxidermist", "Safari Operator", "Customs Broker"],
      politicalAffiliations: ["None", "Independent", "Regional Official", "Local Authority", "Conservation Group", "Trade Association", "Industry Council", "Business Forum", "Cultural Organization", "Heritage Foundation"],
      businessAssociations: ["International Trading Company", "Import/Export Business", "Natural Products Supplier", "Traditional Medicine Shop", "Art & Antiquities Gallery", "Exotic Pets Store", "Wildlife Collection", "Safari Experience Company", "Natural Remedies Shop", "Cultural Artifacts Dealer"]
    },
    defenseSector: {
      title: "Defense Sector",
      description: "Defense industry risks",
      countries: ["United States", "Russia", "China", "Israel", "United Kingdom", "France", "Germany", "India", "Pakistan", "South Korea"],
      nationalities: ["American", "Russian", "Chinese", "Israeli", "British", "French", "German", "Indian", "Pakistani", "South Korean"],
      occupations: ["Defense Contractor Executive", "Military Equipment Supplier", "Security Consultant", "Aerospace Engineer", "Intelligence Consultant", "Military Procurement Officer", "Defense Industry Lobbyist", "Arms Dealer", "Military Technology Developer", "Security Systems Provider"],
      politicalAffiliations: ["None", "Republican Party", "Democratic Party", "United Russia", "Communist Party", "Conservative Party", "Labor Party", "Military Association", "Defense Industry Council", "Security Alliance"],
      businessAssociations: ["Defense Technologies Group", "Global Security Solutions", "Military Systems Provider", "Aerospace & Defense Corporation", "Strategic Defense Partners", "Security Innovations Ltd", "Advanced Military Systems", "Defense Logistics Group", "Military Hardware Suppliers", "Intelligence Technology Solutions"]
    },
    luxuryGoods: {
      title: "Luxury Goods",
      description: "High-value goods trade",
      countries: ["United States", "France", "Italy", "Switzerland", "United Kingdom", "Hong Kong", "UAE", "Singapore", "Japan", "China"],
      nationalities: ["American", "French", "Italian", "Swiss", "British", "Chinese", "Emirati", "Singaporean", "Japanese", "Chinese"],
      occupations: ["Jewelry Dealer", "Art Dealer", "Luxury Real Estate Agent", "High-End Watch Retailer", "Luxury Car Dealer", "Auction House Director", "Private Collection Manager", "Luxury Brand Executive", "Gallery Owner", "Yacht Broker"],
      politicalAffiliations: ["None", "Independent", "Business Association", "Arts Council", "Cultural Foundation", "Industry Group", "Business Forum", "Trade Association", "Chamber of Commerce", "Luxury Goods Council"],
      businessAssociations: ["Luxury Boutique", "Fine Art Gallery", "Premium Real Estate Agency", "Watch & Jewelry Salon", "Exotic Automobile Dealership", "Private Auction House", "International Art Collection", "Designer Brand Franchise", "High Jewelry Atelier", "Luxury Asset Management"]
    },
    nonprofitOrgs: {
      title: "Nonprofit Orgs",
      description: "NGO & charity risks",
      countries: ["United States", "United Kingdom", "Switzerland", "Kenya", "India", "Bangladesh", "Jordan", "Lebanon", "Haiti", "Somalia"],
      nationalities: ["American", "British", "Swiss", "Kenyan", "Indian", "Bangladeshi", "Jordanian", "Lebanese", "Haitian", "Somali"],
      occupations: ["NGO Director", "Charity Executive", "Relief Program Coordinator", "Foundation Manager", "Humanitarian Aid Worker", "International Development Consultant", "Grant Administrator", "Donor Relations Manager", "Program Officer", "Field Operations Manager"],
      politicalAffiliations: ["None", "Independent", "Human Rights Group", "Religious Organization", "Environmental Alliance", "Social Justice Coalition", "International Aid Association", "Refugee Support Network", "Global Development Initiative", "Peace Building Association"],
      businessAssociations: ["International Aid Organization", "Global Relief Foundation", "Children's Welfare Fund", "Humanitarian Response Team", "International Development Agency", "Global Health Initiative", "Refugee Assistance Program", "Disaster Relief Network", "Community Empowerment Group", "International Education Fund"]
    },
    politicalCampaigns: {
      title: "Political Campaigns",
      description: "Campaign finance risks",
      countries: ["United States", "United Kingdom", "Canada", "Australia", "France", "Germany", "Brazil", "India", "Japan", "South Africa"],
      nationalities: ["American", "British", "Canadian", "Australian", "French", "German", "Brazilian", "Indian", "Japanese", "South African"],
      occupations: ["Political Consultant", "Campaign Manager", "Political Party Official", "Lobbyist", "PAC Director", "Political Fundraiser", "Campaign Treasurer", "Political Action Committee Executive", "Campaign Finance Director", "Political Strategy Advisor"],
      politicalAffiliations: ["Democratic Party", "Republican Party", "Conservative Party", "Labor Party", "Liberal Party", "Green Party", "Progressive Alliance", "Social Democratic Party", "National Party", "People's Party"],
      businessAssociations: ["Political Consulting Group", "Campaign Strategy Firm", "Political Advisory Services", "Public Affairs Consultancy", "Government Relations Group", "Political Communication Agency", "Advocacy Group", "Policy Institute", "Think Tank", "Grassroots Organization"]
    }
  };
  
  // Generate mock test data based on configured inputs and selected scenario
  const generateTestData = (scenario = 'random') => {
    const testData = [];
    const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Sophia", "James", "Olivia", "Robert", "Emily"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];
    
    // Get data for selected scenario
    const scenarioData = scenarios[scenario as keyof typeof scenarios] || scenarios.random;
    
    for (let i = 0; i < 10; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const country = scenarioData.countries[Math.floor(Math.random() * scenarioData.countries.length)];
      const nationality = scenarioData.nationalities[Math.floor(Math.random() * scenarioData.nationalities.length)];
      const occupation = scenarioData.occupations[Math.floor(Math.random() * scenarioData.occupations.length)];
      const politicalAffiliation = scenarioData.politicalAffiliations[Math.floor(Math.random() * scenarioData.politicalAffiliations.length)];
      const businessAssociation = scenarioData.businessAssociations[Math.floor(Math.random() * scenarioData.businessAssociations.length)];
      
      // Random date between 1950 and 2000
      const year = 1950 + Math.floor(Math.random() * 50);
      const month = 1 + Math.floor(Math.random() * 12);
      const day = 1 + Math.floor(Math.random() * 28);
      const dob = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      // Create an alias for some entries based on scenario
      let alias = "";
      if (scenario === 'sanctionedCountries' && Math.random() > 0.4) {
        // Higher chance of aliases in sanctioned countries
        alias = `${lastName}, ${firstName}`;
      } else if (scenario === 'pepRisk' && Math.random() > 0.6) {
        // Some PEPs might have formal names/titles
        alias = `${lastName}, ${firstName} (Hon.)`;
      } else if (scenario === 'adverseMedia' && Math.random() > 0.5) {
        // People in adverse media might use alternative names
        alias = `${firstName.charAt(0)}. ${lastName}`;
      } else if (Math.random() > 0.7) {
        // Regular random aliases
        alias = `${lastName}, ${firstName}`;
      }
      
      testData.push({
        "Full Name": `${firstName} ${lastName}`,
        "Date of Birth": dob,
        "Country of Residence": country,
        "Nationality": nationality,
        "Government ID": `ID-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        "Aliases": alias,
        "Occupation": occupation,
        "Political Affiliations": politicalAffiliation,
        "Address": `${Math.floor(Math.random() * 9999) + 1} Main St, ${country.split(',')[0]}`,
        "Business Associations": businessAssociation
      });
    }
    
    return testData;
  };
  
  // Initialize test data on component mount
  useEffect(() => {
    setGeneratedTestData(generateTestData('random'));
  }, []);

  // Function to handle regenerating test data
  const handleRegenerateTestData = () => {
    setGeneratedTestData(generateTestData(selectedScenario));
  };
  
  // Function to handle scenario selection
  const handleScenarioSelect = (scenario: string) => {
    setSelectedScenario(scenario);
    setGeneratedTestData(generateTestData(scenario));
  };
  
  // Available checks for individuals
  const availableChecks = [
    {
      id: 'proof-of-residence',
      title: 'Proof of Residence',
      icon: <HomeIcon className="h-5 w-5 text-indigo-600" />,
      description: 'Verify residence through utility bills, bank statements, or official documents',
      type: 'verification' as const
    },
    {
      id: 'source-of-income',
      title: 'Source of Income',
      icon: <DollarSignIcon className="h-5 w-5 text-green-600" />,
      description: 'Validate income sources through payslips, tax returns, or bank statements',
      type: 'both' as const
    },
    {
      id: 'identity-verification',
      title: 'Identity Verification',
      icon: <UserIcon className="h-5 w-5 text-purple-600" />,
      description: 'Verify identity using government-issued ID or biometric verification',
      type: 'verification' as const
    },
    {
      id: 'credit-check',
      title: 'Credit Check',
      icon: <FileTextIcon className="h-5 w-5 text-blue-600" />,
      description: 'Evaluate credit history and financial reliability',
      type: 'research' as const
    },
    {
      id: 'employment-verification',
      title: 'Employment Verification',
      icon: <BuildingIcon className="h-5 w-5 text-orange-600" />,
      description: 'Confirm employment status and history',
      type: 'research' as const
    },
  ];
  
  // Function to add a check
  const handleAddCheck = (check: CheckItem) => {
    setAdditionalChecks([...additionalChecks, check]);
    setExpandedAdditionalChecks(prev => ({
      ...prev,
      [check.id]: false
    }));
    setAddCheckDialogOpen(false);
  };
  
  // Function to update profile matching settings
  const updateProfileMatchingSettings = (
    check: 'sanctions' | 'pep' | 'adverseMedia', 
    setting: 'nameMatch' | 'dobMatch' | 'countryMatch' | 'idMatch', 
    value: number | boolean
  ) => {
    setProfileMatchingSettings(prev => {
      // Create a copy of the current settings
      const newSettings = { ...prev };
      
      // Update the specific setting for the specified check
      newSettings[check] = {
        ...newSettings[check],
        [setting]: value
      };
      
      // If sync is enabled, update this setting for all checks
      if (syncProfileMatching && (setting === 'nameMatch' || setting === 'dobMatch' || setting === 'countryMatch' || setting === 'idMatch')) {
        newSettings.sanctions = { ...newSettings.sanctions, [setting]: value };
        newSettings.pep = { ...newSettings.pep, [setting]: value };
        newSettings.adverseMedia = { ...newSettings.adverseMedia, [setting]: value };
      }
      
      return newSettings;
    });
  };

  // Handler for entity type selection
  const handleEntityTypeSelect = (entityType: 'individuals' | 'businesses') => {
    setSelectedEntityTypes({
      individuals: entityType === 'individuals',
      businesses: entityType === 'businesses'
    });
  };

  // Function to handle template selection
  const handleTemplateSelect = (template: AgentTemplate) => {
    setSelectedTemplate(template);
    setWizardStep(1); // Reset to first step
    setShowWizard(true);
  };

  // Function to close the wizard
  const handleCloseWizard = () => {
    setShowWizard(false);
    setWizardStep(1); // Reset to first step
    setSelectedTemplate(null);
  };

  // Function to determine if the selected template is the blank template
  const isBlankTemplate = () => {
    return selectedTemplate?.id === 0; // Assuming the blank template has id 0
  };

  // Handler for moving to next step in wizard
  const handleNextStep = () => {
    if (wizardStep < 5) {  // Now only 5 steps instead of 6
      setWizardStep(wizardStep + 1);
    }
  };

  // Handler for moving to previous step in wizard
  const handlePrevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  // Define the wizard steps
  const wizardSteps = [
    { number: 1, title: "Entity Selection" },
    { number: 2, title: "Basic Details" },
    { number: 3, title: "Configure Steps" },
    { number: 4, title: "Overall Risk Criteria" },
    { number: 5, title: "Data Inputs Setup" }
  ];

  // Function to render the correct wizard step content
  const renderWizardStep = () => {
    switch(wizardStep) {
      case 1: // Entity Selection
        return (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex flex-col space-y-1.5 text-center">
              <h2 className="text-2xl font-semibold">Select Entity Types</h2>
              <p className="text-sm text-muted-foreground">
                Choose which type of entities this compliance agent will screen.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card 
                className={`cursor-pointer ${selectedEntityTypes.individuals ? 'border-2 border-primary' : ''}`}
                onClick={() => handleEntityTypeSelect('individuals')}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className={`h-5 w-5 ${selectedEntityTypes.individuals ? 'text-primary' : ''}`} />
                    <CardTitle className="text-base">Individuals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    Screen individual persons against watchlists and PEP data.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer ${selectedEntityTypes.businesses ? 'border-2 border-primary' : ''}`}
                onClick={() => handleEntityTypeSelect('businesses')}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-2">
                    <BuildingIcon className={`h-5 w-5 ${selectedEntityTypes.businesses ? 'text-primary' : ''}`} />
                    <CardTitle className="text-base">Businesses</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    Screen business entities against watchlists and SOE data.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 2: // Basic Details
        return (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex flex-col space-y-1.5 text-center">
              <h2 className="text-2xl font-semibold">Configure Basic Details</h2>
              <p className="text-sm text-muted-foreground">
                Edit the name and description of your {selectedTemplate?.title || "Compliance Agent"}.
              </p>
            </div>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label htmlFor="agent-name" className="text-sm font-medium">Compliance Agent Name</label>
                <Input id="agent-name" defaultValue={selectedTemplate?.title || "New Compliance Agent"} />
              </div>
              <div className="space-y-2">
                <label htmlFor="agent-description" className="text-sm font-medium">Description</label>
                <textarea 
                  id="agent-description" 
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={selectedTemplate?.description || "Configure your custom compliance agent with the exact specifications you need."}
                />
              </div>
            </div>
          </div>
        );
      
      case 3: // Configure Steps
        return (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex flex-col space-y-1.5 text-center">
              <h2 className="text-2xl font-semibold">Configure Steps</h2>
              <p className="text-sm text-muted-foreground">
                Select and configure the steps that this compliance agent will perform.
              </p>
            </div>
            <div className="space-y-3 mt-6">
              {/* Sanctions Screening Card */}
              {enabledDefaultChecks.sanctions && (
                <Card className="border overflow-hidden">
                  <div 
                    className="cursor-pointer" 
                    onClick={() => toggleCheckExpanded('sanctions')}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedChecks.sanctions ? 
                            <ChevronUpIcon className="h-5 w-5" /> : 
                            <ChevronDownIcon className="h-5 w-5" />
                          }
                          <AlertCircleIcon className="h-5 w-5 text-red-500" />
                          <CardTitle className="text-base">Sanctions Screening</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Verification</Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmRemoveCheck('sanctions', 'default');
                            }}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="ml-[30px]">
                        Check against global sanctions lists including OFAC, UN, EU, UK, and more.
                      </CardDescription>
                    </CardContent>
                  </div>
                  
                  {expandedChecks.sanctions && (
                    <div className="border-t bg-slate-50 p-4">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Data Sources</h4>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="ofac" defaultChecked />
                                <label htmlFor="ofac" className="text-sm">OFAC (US)</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated daily</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="un" defaultChecked />
                                <label htmlFor="un" className="text-sm">UN Sanctions</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated daily</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="eu" defaultChecked />
                                <label htmlFor="eu" className="text-sm">EU Sanctions</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated daily</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="uk" defaultChecked />
                                <label htmlFor="uk" className="text-sm">UK Sanctions</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated daily</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Profile Matching Criteria Section */}
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Profile Matching</h4>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground">Sync across all steps</span>
                              <div 
                                className={`flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${syncProfileMatching ? 'bg-primary' : 'bg-muted'} px-0.5`}
                                onClick={() => setSyncProfileMatching(!syncProfileMatching)}
                              >
                                <div 
                                  className={`h-4 w-4 rounded-full bg-white transition-transform ${syncProfileMatching ? 'translate-x-4' : ''}`} 
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="sanctions-name-match" className="text-xs text-muted-foreground">Name Match Threshold</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  type="range" 
                                  id="sanctions-name-match" 
                                  min="70" 
                                  max="100" 
                                  value={profileMatchingSettings.sanctions.nameMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('sanctions', 'nameMatch', parseInt(e.target.value))}
                                  className="w-full" 
                                />
                                <span className="text-xs font-medium">{profileMatchingSettings.sanctions.nameMatch}%</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="sanctions-dob-match" 
                                  checked={profileMatchingSettings.sanctions.dobMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('sanctions', 'dobMatch', e.target.checked)}
                                />
                                <label htmlFor="sanctions-dob-match" className="text-sm">Require DOB match</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="sanctions-country-match" 
                                  checked={profileMatchingSettings.sanctions.countryMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('sanctions', 'countryMatch', e.target.checked)}
                                />
                                <label htmlFor="sanctions-country-match" className="text-sm">Require country match</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="sanctions-id-match" 
                                  checked={profileMatchingSettings.sanctions.idMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('sanctions', 'idMatch', e.target.checked)}
                                />
                                <label htmlFor="sanctions-id-match" className="text-sm">Match by ID number</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-medium">Match Criteria</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="sanctions-threshold" className="text-xs text-muted-foreground">Match Threshold</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  type="range" 
                                  id="sanctions-threshold" 
                                  min="70" 
                                  max="100" 
                                  defaultValue="90" 
                                  className="w-full" 
                                />
                                <span className="text-xs font-medium">90%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="sanctions-fuzzy" defaultChecked />
                              <label htmlFor="sanctions-fuzzy" className="text-sm">Enable fuzzy matching</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="sanctions-exact" defaultChecked />
                              <label htmlFor="sanctions-exact" className="text-sm">Require exact match on watch lists</label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-medium">Risk Assessment</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="sanctions-risk" className="text-xs text-muted-foreground">Risk Level</label>
                              <select id="sanctions-risk" className="w-full text-sm mt-1 h-8 rounded-md border border-input px-2">
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="sanctions-always-high" defaultChecked />
                              <label htmlFor="sanctions-always-high" className="text-sm">Always mark as high risk on match</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )}
              
              {/* PEP Screening Card */}
              {enabledDefaultChecks.pep && (
                <Card className="border overflow-hidden">
                  <div 
                    className="cursor-pointer" 
                    onClick={() => toggleCheckExpanded('pep')}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedChecks.pep ? 
                            <ChevronUpIcon className="h-5 w-5" /> : 
                            <ChevronDownIcon className="h-5 w-5" />
                          }
                          <UserIcon className="h-5 w-5 text-blue-500" />
                          <CardTitle className="text-base">PEP Screening</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Verification</Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmRemoveCheck('pep', 'default');
                            }}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="ml-[30px]">
                        Check against Politically Exposed Persons databases.
                      </CardDescription>
                    </CardContent>
                  </div>
                  
                  {expandedChecks.pep && (
                    <div className="border-t bg-slate-50 p-4">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Data Sources</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="global-pep" defaultChecked />
                                <label htmlFor="global-pep" className="text-sm">Global PEP Database</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated daily</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="regional-pep" defaultChecked />
                                <label htmlFor="regional-pep" className="text-sm">Regional PEP Lists</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated weekly</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="family-pep" defaultChecked />
                                <label htmlFor="family-pep" className="text-sm">PEP Family & Associates</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated weekly</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Profile Matching Criteria Section */}
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Profile Matching</h4>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground">Sync across all steps</span>
                              <div 
                                className={`flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${syncProfileMatching ? 'bg-primary' : 'bg-muted'} px-0.5`}
                                onClick={() => setSyncProfileMatching(!syncProfileMatching)}
                              >
                                <div 
                                  className={`h-4 w-4 rounded-full bg-white transition-transform ${syncProfileMatching ? 'translate-x-4' : ''}`} 
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="pep-name-match" className="text-xs text-muted-foreground">Name Match Threshold</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  type="range" 
                                  id="pep-name-match" 
                                  min="70" 
                                  max="100" 
                                  value={profileMatchingSettings.pep.nameMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('pep', 'nameMatch', parseInt(e.target.value))}
                                  className="w-full" 
                                />
                                <span className="text-xs font-medium">{profileMatchingSettings.pep.nameMatch}%</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="pep-dob-match" 
                                  checked={profileMatchingSettings.pep.dobMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('pep', 'dobMatch', e.target.checked)}
                                />
                                <label htmlFor="pep-dob-match" className="text-sm">Require DOB match</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="pep-country-match" 
                                  checked={profileMatchingSettings.pep.countryMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('pep', 'countryMatch', e.target.checked)}
                                />
                                <label htmlFor="pep-country-match" className="text-sm">Require country match</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="pep-id-match" 
                                  checked={profileMatchingSettings.pep.idMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('pep', 'idMatch', e.target.checked)}
                                />
                                <label htmlFor="pep-id-match" className="text-sm">Match by ID number</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-medium">Match Criteria</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="pep-threshold" className="text-xs text-muted-foreground">Match Threshold</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  type="range" 
                                  id="pep-threshold" 
                                  min="70" 
                                  max="100" 
                                  defaultValue="85" 
                                  className="w-full" 
                                />
                                <span className="text-xs font-medium">85%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="pep-fuzzy" defaultChecked />
                              <label htmlFor="pep-fuzzy" className="text-sm">Enable fuzzy matching</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="pep-position" defaultChecked />
                              <label htmlFor="pep-position" className="text-sm">Include position and title matching</label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-medium">Risk Assessment</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="pep-risk" className="text-xs text-muted-foreground">Risk Level</label>
                              <select id="pep-risk" className="w-full text-sm mt-1 h-8 rounded-md border border-input px-2">
                                <option>Medium</option>
                                <option>High</option>
                                <option>Low</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="pep-tier" defaultChecked />
                              <label htmlFor="pep-tier" className="text-sm">Apply risk based on PEP tier</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )}
              
              {/* Adverse Media Card */}
              {enabledDefaultChecks.adverseMedia && (
                <Card className="border overflow-hidden">
                  <div 
                    className="cursor-pointer" 
                    onClick={() => toggleCheckExpanded('adverseMedia')}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedChecks.adverseMedia ? 
                            <ChevronUpIcon className="h-5 w-5" /> : 
                            <ChevronDownIcon className="h-5 w-5" />
                          }
                          <GlobeIcon className="h-5 w-5 text-orange-500" />
                          <CardTitle className="text-base">Adverse Media</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Verification</Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmRemoveCheck('adverseMedia', 'default');
                            }}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="ml-[30px]">
                        Screen against negative news and adverse media sources.
                      </CardDescription>
                    </CardContent>
                  </div>
                  
                  {expandedChecks.adverseMedia && (
                    <div className="border-t bg-slate-50 p-4">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Data Sources</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="global-news" defaultChecked />
                                <label htmlFor="global-news" className="text-sm">Global News Sources</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated hourly</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="local-news" defaultChecked />
                                <label htmlFor="local-news" className="text-sm">Local News Sources</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated daily</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="court-records" defaultChecked />
                                <label htmlFor="court-records" className="text-sm">Court Records</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated weekly</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="regulatory" defaultChecked />
                                <label htmlFor="regulatory" className="text-sm">Regulatory Filings</label>
                              </div>
                              <span className="text-xs text-muted-foreground">Updated weekly</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Profile Matching Criteria Section */}
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Profile Matching</h4>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground">Sync across all steps</span>
                              <div 
                                className={`flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${syncProfileMatching ? 'bg-primary' : 'bg-muted'} px-0.5`}
                                onClick={() => setSyncProfileMatching(!syncProfileMatching)}
                              >
                                <div 
                                  className={`h-4 w-4 rounded-full bg-white transition-transform ${syncProfileMatching ? 'translate-x-4' : ''}`} 
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="adverseMedia-name-match" className="text-xs text-muted-foreground">Name Match Threshold</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  type="range" 
                                  id="adverseMedia-name-match" 
                                  min="70" 
                                  max="100" 
                                  value={profileMatchingSettings.adverseMedia.nameMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('adverseMedia', 'nameMatch', parseInt(e.target.value))}
                                  className="w-full" 
                                />
                                <span className="text-xs font-medium">{profileMatchingSettings.adverseMedia.nameMatch}%</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="adverseMedia-dob-match" 
                                  checked={profileMatchingSettings.adverseMedia.dobMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('adverseMedia', 'dobMatch', e.target.checked)}
                                />
                                <label htmlFor="adverseMedia-dob-match" className="text-sm">Require DOB match</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="adverseMedia-country-match" 
                                  checked={profileMatchingSettings.adverseMedia.countryMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('adverseMedia', 'countryMatch', e.target.checked)}
                                />
                                <label htmlFor="adverseMedia-country-match" className="text-sm">Require country match</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="adverseMedia-id-match" 
                                  checked={profileMatchingSettings.adverseMedia.idMatch} 
                                  onChange={(e) => updateProfileMatchingSettings('adverseMedia', 'idMatch', e.target.checked)}
                                />
                                <label htmlFor="adverseMedia-id-match" className="text-sm">Match by ID number</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-medium">Match Criteria</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="news-threshold" className="text-xs text-muted-foreground">Match Threshold</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  type="range" 
                                  id="news-threshold" 
                                  min="70" 
                                  max="100" 
                                  defaultValue="80" 
                                  className="w-full" 
                                />
                                <span className="text-xs font-medium">80%</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <h5 className="text-xs text-muted-foreground font-medium">News Categories</h5>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" id="financial-crime" defaultChecked />
                                  <label htmlFor="financial-crime" className="text-sm">Financial Crime</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" id="fraud" defaultChecked />
                                  <label htmlFor="fraud" className="text-sm">Fraud</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" id="terrorism" defaultChecked />
                                  <label htmlFor="terrorism" className="text-sm">Terrorism</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" id="money-laundering" defaultChecked />
                                  <label htmlFor="money-laundering" className="text-sm">Money Laundering</label>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="media-fuzzy" defaultChecked />
                              <label htmlFor="media-fuzzy" className="text-sm">Enable fuzzy matching</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="media-context" defaultChecked />
                              <label htmlFor="media-context" className="text-sm">Apply contextual analysis</label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-medium">Risk Assessment</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="media-risk" className="text-xs text-muted-foreground">Risk Level</label>
                              <select id="media-risk" className="w-full text-sm mt-1 h-8 rounded-md border border-input px-2">
                                <option>Medium</option>
                                <option>High</option>
                                <option>Low</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="media-severity" defaultChecked />
                              <label htmlFor="media-severity" className="text-sm">Risk based on news severity</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="media-recency" defaultChecked />
                              <label htmlFor="media-recency" className="text-sm">Consider recency of news</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Add additional checks related to the entity type */}
              {additionalChecks.map((check) => (
                <Card key={check.id} className="border overflow-hidden">
                  <div 
                    className="cursor-pointer"
                    onClick={() => toggleAdditionalCheckExpanded(check.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedAdditionalChecks[check.id] ? 
                            <ChevronUpIcon className="h-5 w-5" /> : 
                            <ChevronDownIcon className="h-5 w-5" />
                          }
                          {check.icon}
                          <CardTitle className="text-base">{check.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {check.type === 'both' ? (
                            <>
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Research</Badge>
                              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Verification</Badge>
                            </>
                          ) : check.type === 'verification' ? (
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Verification</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Research</Badge>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmRemoveCheck(check.id, 'additional');
                            }}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="ml-[30px]">
                        {check.description}
                      </CardDescription>
                    </CardContent>
                  </div>
                  
                  {expandedAdditionalChecks[check.id] && (
                    <div className="border-t bg-slate-50 p-4">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Requirements</h4>
                          <div className="space-y-2">
                            {check.id === 'proof-of-residence' && (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="utility-bills" defaultChecked />
                                    <label htmlFor="utility-bills" className="text-sm">Utility Bills</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Not older than 3 months</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="bank-statements" defaultChecked />
                                    <label htmlFor="bank-statements" className="text-sm">Bank Statements</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Not older than 3 months</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="govt-docs" defaultChecked />
                                    <label htmlFor="govt-docs" className="text-sm">Government Documents</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Official correspondence</span>
                                </div>
                              </>
                            )}
                            
                            {check.id === 'source-of-income' && (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="payslips" defaultChecked />
                                    <label htmlFor="payslips" className="text-sm">Payslips/Salary Statements</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Last 3 months</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="tax-returns" defaultChecked />
                                    <label htmlFor="tax-returns" className="text-sm">Tax Returns</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Most recent filing</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="bank-statements-income" defaultChecked />
                                    <label htmlFor="bank-statements-income" className="text-sm">Bank Statements</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Last 3 months</span>
                                </div>
                              </>
                            )}
                            
                            {check.id === 'identity-verification' && (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="passport" defaultChecked />
                                    <label htmlFor="passport" className="text-sm">Passport</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Valid and not expired</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="drivers-license" defaultChecked />
                                    <label htmlFor="drivers-license" className="text-sm">Driver's License</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Government issued</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="national-id" defaultChecked />
                                    <label htmlFor="national-id" className="text-sm">National ID Card</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Government issued</span>
                                </div>
                              </>
                            )}
                            
                            {check.id === 'credit-check' && (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="credit-score" defaultChecked />
                                    <label htmlFor="credit-score" className="text-sm">Credit Score Check</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">From major bureaus</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="credit-history" defaultChecked />
                                    <label htmlFor="credit-history" className="text-sm">Credit History Report</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Last 7 years</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="debt-obligations" defaultChecked />
                                    <label htmlFor="debt-obligations" className="text-sm">Debt Obligations</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Current outstanding</span>
                                </div>
                              </>
                            )}
                            
                            {check.id === 'employment-verification' && (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="employer-letter" defaultChecked />
                                    <label htmlFor="employer-letter" className="text-sm">Employer Letter</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Signed on letterhead</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="work-contract" defaultChecked />
                                    <label htmlFor="work-contract" className="text-sm">Employment Contract</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Signed by both parties</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="company-registry" defaultChecked />
                                    <label htmlFor="company-registry" className="text-sm">Company Registry Check</label>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Company existence verification</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-medium">Verification Criteria</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor={`${check.id}-threshold`} className="text-xs text-muted-foreground">Match Threshold</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input 
                                  type="range" 
                                  id={`${check.id}-threshold`}
                                  min="70" 
                                  max="100" 
                                  defaultValue="85" 
                                  className="w-full" 
                                />
                                <span className="text-xs font-medium">85%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id={`${check.id}-manual-review`} defaultChecked />
                              <label htmlFor={`${check.id}-manual-review`} className="text-sm">Require manual review on failure</label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id={`${check.id}-auto-accept`} />
                              <label htmlFor={`${check.id}-auto-accept`} className="text-sm">Auto-accept on success</label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-medium">Risk Assessment</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor={`${check.id}-risk`} className="text-xs text-muted-foreground">Risk Impact</label>
                              <select id={`${check.id}-risk`} className="w-full text-sm mt-1 h-8 rounded-md border border-input px-2">
                                <option>Medium</option>
                                <option>High</option>
                                <option>Low</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {/* Add Another Step Button */}
              <Button
                variant="outline"
                className="w-full py-6 border-dashed border-2 border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 gap-2 mt-6"
                onClick={() => setAddCheckDialogOpen(true)}
              >
                <PlusIcon className="h-5 w-5" />
                Add another step
              </Button>
              
              {/* Add Check Dialog */}
              {addCheckDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <Card className="w-full max-w-2xl mx-auto shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>Additional Steps for Individuals</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setAddCheckDialogOpen(false)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        Select additional steps to include in your screening process
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {/* Core steps that have been disabled */}
                        {(!enabledDefaultChecks.sanctions || !enabledDefaultChecks.pep || !enabledDefaultChecks.adverseMedia) && (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium mb-3">Core Steps</h4>
                            <div className="space-y-3">
                              {!enabledDefaultChecks.sanctions && (
                                <div 
                                  className="flex items-center justify-between p-4 rounded-md border cursor-pointer hover:bg-slate-50 transition-colors"
                                  onClick={() => {
                                    setEnabledDefaultChecks(prev => ({...prev, sanctions: true}));
                                    setAddCheckDialogOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Sanctions Screening</h4>
                                      <div className="flex gap-1 mt-1">
                                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700">Verification</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">Check against global sanctions lists</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="gap-1">
                                    <PlusIcon className="h-4 w-4" />
                                    Add
                                  </Button>
                                </div>
                              )}
                              {!enabledDefaultChecks.pep && (
                                <div 
                                  className="flex items-center justify-between p-4 rounded-md border cursor-pointer hover:bg-slate-50 transition-colors"
                                  onClick={() => {
                                    setEnabledDefaultChecks(prev => ({...prev, pep: true}));
                                    setAddCheckDialogOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                      <UserIcon className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">PEP Screening</h4>
                                      <div className="flex gap-1 mt-1">
                                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700">Verification</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">Check against politically exposed persons databases</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="gap-1">
                                    <PlusIcon className="h-4 w-4" />
                                    Add
                                  </Button>
                                </div>
                              )}
                              {!enabledDefaultChecks.adverseMedia && (
                                <div 
                                  className="flex items-center justify-between p-4 rounded-md border cursor-pointer hover:bg-slate-50 transition-colors"
                                  onClick={() => {
                                    setEnabledDefaultChecks(prev => ({...prev, adverseMedia: true}));
                                    setAddCheckDialogOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                                      <GlobeIcon className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">Adverse Media</h4>
                                      <div className="flex gap-1 mt-1">
                                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700">Verification</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">Screen against negative news and adverse media sources</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="gap-1">
                                    <PlusIcon className="h-4 w-4" />
                                    Add
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Additional steps section */}
                        <div>
                          <h4 className="text-sm font-medium mb-3">Additional Steps</h4>
                          <div className="space-y-3">
                            {availableChecks
                              .filter(check => !additionalChecks.some(added => added.id === check.id))
                              .map((check) => (
                                <div 
                                  key={check.id} 
                                  className="flex items-center justify-between p-4 rounded-md border cursor-pointer hover:bg-slate-50 transition-colors"
                                  onClick={() => handleAddCheck(check)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                                      {check.icon}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium">{check.title}</h4>
                                      </div>
                                      <div className="flex gap-1 mt-1">
                                        {check.type === 'both' ? (
                                          <>
                                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-100 text-blue-700">Research</span>
                                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700">Verification</span>
                                          </>
                                        ) : check.type === 'verification' ? (
                                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700">Verification</span>
                                        ) : (
                                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-100 text-blue-700">Research</span>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">{check.description}</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="gap-1">
                                    <PlusIcon className="h-4 w-4" />
                                    Add
                                  </Button>
                                </div>
                              ))}
                          </div>
                              
                          {availableChecks.filter(check => !additionalChecks.some(added => added.id === check.id)).length === 0 && 
                            enabledDefaultChecks.sanctions && 
                            enabledDefaultChecks.pep && 
                            enabledDefaultChecks.adverseMedia && (
                            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                              <CheckIcon className="h-12 w-12 mb-2 text-green-500" />
                              <p>You've added all available steps</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t px-6 py-4">
                      <Button variant="outline" onClick={() => setAddCheckDialogOpen(false)}>
                        Close
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </div>
        );
      
      case 4: // Overall Risk Criteria
        return (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex flex-col space-y-1.5 text-center">
              <h2 className="text-2xl font-semibold">Overall Risk Criteria</h2>
              <p className="text-sm text-muted-foreground">
                Configure what constitutes different risk levels across all steps.
              </p>
            </div>
            
            <div className="mt-6 space-y-6">
              {/* Risk Level Sections */}
              <div className="space-y-6">
                {/* High Risk Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <h3 className="text-lg font-medium">High Risk Criteria</h3>
                  </div>
                  
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Define conditions that will flag a subject as high risk. Any match will trigger this risk level.
                        </p>
                        
                        {/* Display existing criteria */}
                        <div className="space-y-2 mb-4">
                          {highRiskCriteria.map((criteria, index) => (
                            <React.Fragment key={index}>
                              <div className="flex items-center justify-between rounded-md border p-2 bg-white">
                                {editingHighRiskIndex === index ? (
                                  <div className="flex-1 flex gap-2">
                                    <Input 
                                      value={editedCriteria} 
                                      onChange={(e) => setEditedCriteria(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => saveEditedCriteria('high')}
                                    >
                                      Save
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => cancelEditing('high')}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <AlertCircleIcon className="h-4 w-4 text-red-500" />
                                      <span className="text-sm">{criteria}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0"
                                        onClick={() => startEditCriteria('high', index)}
                                      >
                                        <PencilIcon className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 hover:text-red-500"
                                        onClick={() => removeCriteria('high', index)}
                                      >
                                        <XIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                              {index < highRiskCriteria.length - 1 && (
                                <div className="flex items-center justify-center my-1">
                                  <div className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                    OR
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        
                        {/* Add new criteria */}
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="Enter new high risk criteria" 
                            value={newHighRiskCriteria}
                            onChange={(e) => setNewHighRiskCriteria(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => addCriteria('high')} 
                            disabled={!newHighRiskCriteria.trim()}
                            className="shrink-0"
                          >
                            Add Criteria
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Medium Risk Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <h3 className="text-lg font-medium">Medium Risk Criteria</h3>
                  </div>
                  
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Define conditions that will flag a subject as medium risk. Applied if no high risk matches.
                        </p>
                        
                        {/* Display existing criteria */}
                        <div className="space-y-2 mb-4">
                          {mediumRiskCriteria.map((criteria, index) => (
                            <React.Fragment key={index}>
                              <div className="flex items-center justify-between rounded-md border p-2 bg-white">
                                {editingMediumRiskIndex === index ? (
                                  <div className="flex-1 flex gap-2">
                                    <Input 
                                      value={editedCriteria} 
                                      onChange={(e) => setEditedCriteria(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => saveEditedCriteria('medium')}
                                    >
                                      Save
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => cancelEditing('medium')}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
                                      <span className="text-sm">{criteria}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0"
                                        onClick={() => startEditCriteria('medium', index)}
                                      >
                                        <PencilIcon className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 hover:text-red-500"
                                        onClick={() => removeCriteria('medium', index)}
                                      >
                                        <XIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                              {index < mediumRiskCriteria.length - 1 && (
                                <div className="flex items-center justify-center my-1">
                                  <div className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                    OR
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        
                        {/* Add new criteria */}
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="Enter new medium risk criteria" 
                            value={newMediumRiskCriteria}
                            onChange={(e) => setNewMediumRiskCriteria(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => addCriteria('medium')} 
                            disabled={!newMediumRiskCriteria.trim()}
                            className="shrink-0"
                          >
                            Add Criteria
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Low Risk Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h3 className="text-lg font-medium">Low Risk Criteria</h3>
                  </div>
                  
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Define conditions that indicate low risk. Applied if no higher risk matches.
                        </p>
                        
                        {/* Display existing criteria */}
                        <div className="space-y-2 mb-4">
                          {lowRiskCriteria.map((criteria, index) => (
                            <React.Fragment key={index}>
                              <div className="flex items-center justify-between rounded-md border p-2 bg-white">
                                {editingLowRiskIndex === index ? (
                                  <div className="flex-1 flex gap-2">
                                    <Input 
                                      value={editedCriteria} 
                                      onChange={(e) => setEditedCriteria(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => saveEditedCriteria('low')}
                                    >
                                      Save
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => cancelEditing('low')}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <CheckIcon className="h-4 w-4 text-green-500" />
                                      <span className="text-sm">{criteria}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0"
                                        onClick={() => startEditCriteria('low', index)}
                                      >
                                        <PencilIcon className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 hover:text-red-500"
                                        onClick={() => removeCriteria('low', index)}
                                      >
                                        <XIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                              {index < lowRiskCriteria.length - 1 && (
                                <div className="flex items-center justify-center my-1">
                                  <div className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                                    OR
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        
                        {/* Add new criteria */}
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="Enter new low risk criteria" 
                            value={newLowRiskCriteria}
                            onChange={(e) => setNewLowRiskCriteria(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => addCriteria('low')} 
                            disabled={!newLowRiskCriteria.trim()}
                            className="shrink-0"
                          >
                            Add Criteria
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5: // Data Inputs Setup
        return (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-1.5 text-center">
              <h2 className="text-2xl font-semibold">Configure Data Inputs</h2>
              <p className="text-sm text-muted-foreground">
                Manage which data inputs to use with your configured steps.
              </p>
            </div>
            
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-base">Agent Data Inputs</CardTitle>
                  <CardDescription>
                    Manage which data inputs to use with your configured steps.
                  </CardDescription>
                </CardHeader>

                <div className="px-6">
                  <div className="border rounded-md">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 py-3 px-4 bg-muted/50 border-b border-slate-200 text-sm font-medium">
                      <div className="col-span-4">Input Name</div>
                      <div className="col-span-2">Input Type</div>
                      <div className="col-span-4">Used In Steps</div>
                      <div className="col-span-2 text-right">Will Be Used</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y">
                      {/* Required Inputs */}
                      <div className="grid grid-cols-12 gap-2 py-3 px-4 items-center">
                        <div className="col-span-4 font-medium">Full Name</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Required</Badge>
                        </div>
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="bg-slate-100">Sanctions</Badge>
                          <Badge variant="secondary" className="bg-slate-100">PEP</Badge>
                          <Badge variant="secondary" className="bg-slate-100">Adverse Media</Badge>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button className="flex h-6 w-11 items-center rounded-full bg-primary px-1 relative opacity-70 cursor-not-allowed">
                            <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />
                            <div className="h-4 w-4 rounded-full bg-white transform translate-x-5"></div>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-2 py-3 px-4 items-center">
                        <div className="col-span-4 font-medium">Date of Birth</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Required</Badge>
                        </div>
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="bg-slate-100">Sanctions</Badge>
                          <Badge variant="secondary" className="bg-slate-100">PEP</Badge>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button className="flex h-6 w-11 items-center rounded-full bg-primary px-1 relative opacity-70 cursor-not-allowed">
                            <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />
                            <div className="h-4 w-4 rounded-full bg-white transform translate-x-5"></div>
                          </button>
                        </div>
                      </div>

                      {/* Example of a field group - Location Information */}
                      <div className="border-t-2 border-slate-200">
                        <div className={`grid grid-cols-12 gap-2 py-3 px-4 items-center ${!enabledInputs["Country of Residence"] ? 'bg-gray-50/70' : 'bg-white'} border-b border-dashed border-slate-200`}>
                          <div className={`col-span-4 font-medium ${!enabledInputs["Country of Residence"] ? 'text-gray-400' : ''}`}>
                            Country of Residence
                          </div>
                          <div className="col-span-2">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Required</Badge>
                          </div>
                          <div className="col-span-4 flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className={`${!enabledInputs["Country of Residence"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'}`}>Sanctions</Badge>
                            <Badge variant="secondary" className={`${!enabledInputs["Country of Residence"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'}`}>PEP</Badge>
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <button 
                              className={`flex h-6 w-11 items-center rounded-full ${enabledInputs["Country of Residence"] ? 'bg-primary' : 'bg-gray-300'} px-1 relative ${!enabledInputs["Nationality"] && 'cursor-not-allowed opacity-70'} cursor-pointer`}
                              onClick={() => toggleInputEnabled("Country of Residence")}
                              disabled={!enabledInputs["Nationality"]}
                            >
                              {enabledInputs["Country of Residence"] && <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />}
                              <div className={`h-4 w-4 rounded-full bg-white transform ${enabledInputs["Country of Residence"] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute left-8 -top-3 bg-white px-3 text-xs text-slate-500 font-medium">OR</div>
                        </div>
                        
                        <div className={`grid grid-cols-12 gap-2 py-3 px-4 items-center ${!enabledInputs["Nationality"] ? 'bg-gray-50/70' : 'bg-white'} border-b-2 border-slate-200`}>
                          <div className={`col-span-4 font-medium ${!enabledInputs["Nationality"] ? 'text-gray-400' : ''}`}>
                            Nationality
                          </div>
                          <div className="col-span-2">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Required</Badge>
                          </div>
                          <div className="col-span-4 flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className={`${!enabledInputs["Nationality"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'}`}>Sanctions</Badge>
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <button 
                              className={`flex h-6 w-11 items-center rounded-full ${enabledInputs["Nationality"] ? 'bg-primary' : 'bg-gray-300'} px-1 relative ${!enabledInputs["Country of Residence"] && 'cursor-not-allowed opacity-70'} cursor-pointer`}
                              onClick={() => toggleInputEnabled("Nationality")}
                              disabled={!enabledInputs["Country of Residence"]}
                            >
                              {enabledInputs["Nationality"] && <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />}
                              <div className={`h-4 w-4 rounded-full bg-white transform ${enabledInputs["Nationality"] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* End of Location Information group */}

                      <div className="grid grid-cols-12 gap-2 py-3 px-4 items-center">
                        <div className="col-span-4 font-medium">Government ID</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Required</Badge>
                        </div>
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="bg-slate-100">Sanctions</Badge>
                          <Badge variant="secondary" className="bg-slate-100">PEP</Badge>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button className="flex h-6 w-11 items-center rounded-full bg-primary px-1 relative opacity-70 cursor-not-allowed">
                            <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />
                            <div className="h-4 w-4 rounded-full bg-white transform translate-x-5"></div>
                          </button>
                        </div>
                      </div>

                      {/* Ungrouped Occupation field */}
                      <div className={`grid grid-cols-12 gap-2 py-3 px-4 items-center ${!enabledInputs["Occupation"] ? 'bg-gray-50/70' : 'bg-white'}`}>
                        <div className={`col-span-4 font-medium ${!enabledInputs["Occupation"] ? 'text-gray-400' : ''}`}>
                          Occupation
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Optional</Badge>
                        </div>
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className={`${!enabledInputs["Occupation"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'}`}>PEP</Badge>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button 
                            className={`flex h-6 w-11 items-center rounded-full ${enabledInputs["Occupation"] ? 'bg-primary' : 'bg-gray-300'} px-1 relative cursor-pointer`}
                            onClick={() => toggleInputEnabled("Occupation")}
                          >
                            {enabledInputs["Occupation"] && <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />}
                            <div className={`h-4 w-4 rounded-full bg-white transform ${enabledInputs["Occupation"] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </button>
                        </div>
                      </div>
                      
                      {/* Ungrouped Business Associations field */}
                      <div className={`grid grid-cols-12 gap-2 py-3 px-4 items-center ${!enabledInputs["Business Associations"] ? 'bg-gray-50/70' : 'bg-white'}`}>
                        <div className={`col-span-4 font-medium ${!enabledInputs["Business Associations"] ? 'text-gray-400' : ''}`}>
                          Business Associations
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Optional</Badge>
                        </div>
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className={`${!enabledInputs["Business Associations"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'}`}>Adverse Media</Badge>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button 
                            className={`flex h-6 w-11 items-center rounded-full ${enabledInputs["Business Associations"] ? 'bg-primary' : 'bg-gray-300'} px-1 relative cursor-pointer`}
                            onClick={() => toggleInputEnabled("Business Associations")}
                          >
                            {enabledInputs["Business Associations"] && <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />}
                            <div className={`h-4 w-4 rounded-full bg-white transform ${enabledInputs["Business Associations"] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </button>
                        </div>
                      </div>

                      {/* Optional Inputs - Aliases */}
                      <div className={`grid grid-cols-12 gap-2 py-3 px-4 items-center ${!enabledInputs["Aliases"] ? 'bg-gray-50/70' : 'bg-white'}`}>
                        <div className={`col-span-4 font-medium ${!enabledInputs["Aliases"] ? 'text-gray-400' : ''}`}>Aliases</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-blue-50/80 text-blue-700/90 border-blue-200">Optional</Badge>
                        </div>
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className={`${!enabledInputs["Aliases"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'}`}>Sanctions</Badge>
                          <Badge 
                            variant="secondary" 
                            className={`${!enabledInputs["Aliases"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'} cursor-pointer relative group`}
                          >
                            +2
                            <div className="absolute bg-white rounded-md px-3 py-2 text-sm text-gray-700 shadow-md border border-slate-200 hidden group-hover:block -right-2 bottom-full z-10 mb-1 min-w-40">
                              <div className="font-medium mb-1">Additional steps:</div>
                              <div>PEP</div>
                              <div>Adverse Media</div>
                            </div>
                          </Badge>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button 
                            className={`flex h-6 w-11 items-center rounded-full ${enabledInputs["Aliases"] ? 'bg-primary' : 'bg-gray-300'} px-1 relative cursor-pointer`}
                            onClick={() => toggleInputEnabled("Aliases")}
                          >
                            {enabledInputs["Aliases"] && <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />}
                            <div className={`h-4 w-4 rounded-full bg-white transform ${enabledInputs["Aliases"] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </button>
                        </div>
                      </div>

                      <div className={`grid grid-cols-12 gap-2 py-3 px-4 items-center ${!enabledInputs["Political Affiliations"] ? 'bg-gray-50/70' : 'bg-white'}`}>
                        <div className={`col-span-4 font-medium ${!enabledInputs["Political Affiliations"] ? 'text-gray-400' : ''}`}>Political Affiliations</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-blue-50/80 text-blue-700/90 border-blue-200">Optional</Badge>
                        </div>
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className={`${!enabledInputs["Political Affiliations"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'}`}>PEP</Badge>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button 
                            className={`flex h-6 w-11 items-center rounded-full ${enabledInputs["Political Affiliations"] ? 'bg-primary' : 'bg-gray-300'} px-1 relative cursor-pointer`}
                            onClick={() => toggleInputEnabled("Political Affiliations")}
                          >
                            {enabledInputs["Political Affiliations"] && <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />}
                            <div className={`h-4 w-4 rounded-full bg-white transform ${enabledInputs["Political Affiliations"] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </button>
                        </div>
                      </div>

                      <div className={`grid grid-cols-12 gap-2 py-3 px-4 items-center ${!enabledInputs["Address"] ? 'bg-gray-50/70' : 'bg-white'}`}>
                        <div className={`col-span-4 font-medium ${!enabledInputs["Address"] ? 'text-gray-400' : ''}`}>Address</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Optional</Badge>
                        </div>
                        <div className="col-span-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className={`${!enabledInputs["Address"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'}`}>Adverse Media</Badge>
                          <Badge 
                            variant="secondary" 
                            className={`${!enabledInputs["Address"] ? 'bg-slate-100/90 text-gray-600' : 'bg-slate-100'} cursor-pointer relative group`}
                          >
                            +2
                            <div className="absolute bg-white rounded-md px-3 py-2 text-sm text-gray-700 shadow-md border border-slate-200 hidden group-hover:block -right-2 bottom-full z-10 mb-1 min-w-40">
                              <div className="font-medium mb-1">Additional steps:</div>
                              <div>Sanctions</div>
                              <div>PEP</div>
                            </div>
                          </Badge>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button 
                            className={`flex h-6 w-11 items-center rounded-full ${enabledInputs["Address"] ? 'bg-primary' : 'bg-gray-300'} px-1 relative cursor-pointer`}
                            onClick={() => toggleInputEnabled("Address")}
                          >
                            {enabledInputs["Address"] && <CheckIcon className="h-3 w-3 text-white absolute left-1.5" />}
                            <div className={`h-4 w-4 rounded-full bg-white transform ${enabledInputs["Address"] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardFooter className="px-6 pt-3 pb-6">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <InfoIcon className="h-4 w-4 text-blue-500" />
                    Required inputs cannot be disabled as they are essential for your configured steps
                  </p>
                </CardFooter>
              </Card>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start gap-2">
                  <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Data Quality Notice</h4>
                    <p className="text-sm text-muted-foreground">The more optional inputs you enable, the higher quality and more accurate the screening results will be.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold">Step {wizardStep}</h2>
            <p className="text-muted-foreground">Content for step {wizardStep} will be implemented soon.</p>
          </div>
        );
    }
  };

  // Sample data for existing agents
  const existingAgents = [
    {
      id: 1,
      title: "Business Onboarding",
      icon: <BuildingIcon className="h-6 w-6 text-white" />,
      iconBg: "bg-indigo-600",
      status: "Draft",
      stats: {
        thisMonth: 342,
        completed: 298,
        failed: 14,
        flagged: 21
      },
      type: "KYB + KYC Onboarding",
      lastUpdated: "Jan, 15"
    },
    {
      id: 2,
      title: "AML for Individuals",
      icon: <ShieldIcon className="h-6 w-6 text-white" />,
      iconBg: "bg-indigo-600",
      status: "Active",
      stats: {
        thisMonth: 624,
        completed: 589,
        failed: 7,
        flagged: 18
      },
      type: "KYC AML",
      lastUpdated: "Jan, 15"
    },
    {
      id: 3,
      title: "Proof of Residence",
      icon: <HomeIcon className="h-6 w-6 text-white" />,
      iconBg: "bg-indigo-600",
      status: "Active",
      stats: {
        thisMonth: 215,
        completed: 197,
        failed: 5,
        flagged: 8
      },
      type: "Documents",
      lastUpdated: "Jan, 15"
    }
  ]

  // Sample data for agent templates
  const agentTemplates = [
    {
      id: 0,
      title: "Blank Template",
      icon: <PlusIcon className="h-6 w-6 text-indigo-600" />,
      description: "Start from scratch with a completely blank template and build your custom compliance agent with the exact specifications you need."
    },
    {
      id: 1,
      title: "KYB + KYC Onboarding",
      icon: <Settings2Icon className="h-6 w-6 text-indigo-600" />,
      description: "Transforms regulatory requirements into seamless digital verification, cutting onboarding time from weeks to minutes."
    },
    {
      id: 2,
      title: "Business Deep Research",
      icon: <BuildingIcon className="h-6 w-6 text-indigo-600" />,
      description: "Delivers comprehensive business intelligence, uncovering valuable insights for confident partnership decisions."
    },
    {
      id: 3,
      title: "AML Screening",
      icon: <ShieldIcon className="h-6 w-6 text-indigo-600" />,
      description: "Automates screening against global sanctions, PEP lists, and adverse media to identify high-risk individuals with comprehensive audit trails."
    },
    {
      id: 4,
      title: "Document Verification",
      icon: <FileTextIcon className="h-6 w-6 text-indigo-600" />,
      description: "Authenticates documents with remarkable precision, eliminating manual review bottlenecks and accelerating approvals."
    },
    {
      id: 5,
      title: "Website Analysis",
      icon: <GlobeIcon className="h-6 w-6 text-indigo-600" />,
      description: "Expertly evaluates online business presence to verify claims and enhance due diligence efficiency."
    },
    {
      id: 6,
      title: "MCC & NAICS",
      icon: (
        <div className="flex items-center justify-center">
          <BuildingIcon className="h-4 w-4 text-indigo-600" />
          <DollarSignIcon className="h-5 w-5 text-indigo-600 -ml-1" />
        </div>
      ),
      description: "Assigns accurate classification codes the first time, streamlining regulatory reporting and improving compliance outcomes."
    },
    {
      id: 8,
      title: "Periodic Reviews",
      icon: <ClockIcon className="h-6 w-6 text-indigo-600" />,
      description: "Transforms routine monitoring into strategic risk management, keeping client relationships consistently compliant."
    }
  ]

  // Quick action options
  const quickActions = [
    {
      id: 1,
      title: "Verify a document",
      icon: <FileTextIcon className="h-4 w-4 text-indigo-600" />
    },
    {
      id: 2,
      title: "Research a business",
      icon: <BuildingIcon className="h-4 w-4 text-indigo-600" />
    },
    {
      id: 3,
      title: "Screen a person",
      icon: <UserIcon className="h-4 w-4 text-indigo-600" />
    }
  ]

  // Function to toggle expanded state of a check
  const toggleCheckExpanded = (check: 'sanctions' | 'pep' | 'adverseMedia') => {
    setExpandedChecks(prev => ({
      ...prev,
      [check]: !prev[check]
    }));
  };
  
  // Function to toggle expanded state of an additional check
  const toggleAdditionalCheckExpanded = (checkId: string) => {
    setExpandedAdditionalChecks(prev => ({
      ...prev,
      [checkId]: !prev[checkId]
    }));
  };

  // Function to open the remove confirmation modal
  const confirmRemoveCheck = (id: string, type: 'default' | 'additional') => {
    setCheckToRemove({ id, type });
    setRemoveConfirmOpen(true);
  };
  
  // Function to handle the actual removal after confirmation
  const handleRemoveCheck = () => {
    if (!checkToRemove) return;
    
    if (checkToRemove.type === 'additional') {
      // Remove from additional checks
      setAdditionalChecks(additionalChecks.filter(c => c.id !== checkToRemove.id));
      
      // Also remove from expanded state
      const newExpandedState = {...expandedAdditionalChecks};
      delete newExpandedState[checkToRemove.id];
      setExpandedAdditionalChecks(newExpandedState);
    } else {
      // For default checks, we'll disable them
      if (checkToRemove.id === 'sanctions' || checkToRemove.id === 'pep' || checkToRemove.id === 'adverseMedia') {
        setEnabledDefaultChecks(prev => ({
          ...prev,
          [checkToRemove.id]: false
        }));
        
        // Also close the expanded state if it was open
        if (expandedChecks[checkToRemove.id as keyof typeof expandedChecks]) {
          setExpandedChecks(prev => ({
            ...prev,
            [checkToRemove.id]: false
          }));
        }
      }
    }
    
    // Close the confirmation modal
    setRemoveConfirmOpen(false);
    setCheckToRemove(null);
  };

  // State to track enabled status of default checks
  const [enabledDefaultChecks, setEnabledDefaultChecks] = useState<{
    sanctions: boolean;
    pep: boolean;
    adverseMedia: boolean;
  }>({
    sanctions: true,
    pep: true,
    adverseMedia: true
  });
  
  // Default check type definitions
  const defaultCheckTypes = {
    sanctions: 'verification',
    pep: 'verification',
    adverseMedia: 'verification'
  };

  // Add a handler function to navigate to the Business Onboarding details page
  const handleAgentClick = (agentId: number) => {
    // For existing agents, open the wizard with appropriate settings
    switch(agentId) {
      case 1: // Business Onboarding
        // Find the KYB + KYC template and select it
        const kybTemplate = agentTemplates.find(t => t.id === 1); // KYB + KYC Onboarding
        if (kybTemplate) {
          setSelectedTemplate(kybTemplate);
          setWizardStep(1);
          setShowWizard(true);
        }
        break;
      case 2: // AML for Individuals 
        // Find the AML Screening template and select it
        const amlTemplate = agentTemplates.find(t => t.id === 3); // AML Screening
        if (amlTemplate) {
          handleTemplateSelect(amlTemplate);
        }
        break;
      case 3: // Proof of Residence
        // Find the Document Verification template and select it
        const docTemplate = agentTemplates.find(t => t.id === 4); // Document Verification
        if (docTemplate) {
          handleTemplateSelect(docTemplate);
          // Override the additional checks to include only Proof of Residence
          setAdditionalChecks([
            {
              id: 'proof-of-residence',
              title: 'Proof of Residence',
              icon: <HomeIcon className="h-5 w-5 text-indigo-600" />,
              description: 'Verify residence through utility bills, bank statements, or official documents',
              type: 'verification' as const
            }
          ]);
        }
        break;
      default:
        // For other agents or fallback
        setShowWizard(true);
        setWizardStep(1);
        break;
    }
  };

  // Function to handle running a test with the generated data
  const handleRunTest = () => {
    // In a real app, this would submit the test data to an API
    console.log("Running test with generated data:", generatedTestData);
    
    // Navigate using a direct link for reliability
    window.location.href = "/agent-test-results-list";
  };

  // Function to render the test data table
  const renderTestData = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Generated Test Data</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowGeneratedTestData(false)}>
              <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
              Back
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-1.5" />
              Export as CSV
            </Button>
            <Button size="sm" onClick={handleRunTest}>
              <PlayIcon className="h-4 w-4 mr-1.5" />
              Run Test
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b">
                  {configuredInputs.map((input, i) => (
                    <th key={i} className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      {input.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatedTestData.map((data, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    {configuredInputs.map((input, j) => (
                      <td key={j} className="px-4 py-2.5 text-sm border-b">
                        {data[input.name as keyof typeof data]}
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
  };

  // Function to render the 4th step of wizard (test data)
  const renderTestDataStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Configure Test Data</h2>
        <p className="text-muted-foreground">
          Choose how you want to test this agent before deploying
        </p>
        
        {showGeneratedTestData ? (
          renderTestData()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="overflow-hidden relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200" onClick={() => setShowGeneratedTestData(true)}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center h-48 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <SparklesIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Use Generated Test Data</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll create 10 test cases based on your configured inputs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200" 
              onClick={() => window.location.href = "/upload-csv"}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center h-48 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UploadIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Upload Your Own Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV file with your own test subjects
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center h-48 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CodeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">API Integration Test</h3>
                    <p className="text-sm text-muted-foreground">
                      Test the API endpoints before integrating
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center h-48 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <PencilIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Enter Test Cases Manually</h3>
                    <p className="text-sm text-muted-foreground">
                      Create individual test cases one by one
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // Check for step param in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const stepParam = searchParams.get('step');
    
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (!isNaN(step) && step >= 1 && step <= 5) {
        setWizardStep(step);
        setShowWizard(true);
        
        // If no template selected, use a default one
        if (!selectedTemplate) {
          const defaultTemplate = agentTemplates.find(t => t.id === 3); // AML Screening as default
          if (defaultTemplate) {
            setSelectedTemplate(defaultTemplate);
          }
        }
        
        // Clean up the URL parameter
        const newUrl = window.location.pathname;
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [selectedTemplate]);

  // Handler for generating a test run
  // const handleRunTest = () => {
  //   window.location.href = "/agent-test-results-list";
  // };

  // State for manual data entry
  const [manualEntry, setManualEntry] = useState<Record<string, string>>({});

  // Function to handle manual data input change
  const handleManualInputChange = (key: string, value: string) => {
    setManualEntry(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Function to add new field to manual entry
  const [newFieldName, setNewFieldName] = useState("");
  const [addingNewField, setAddingNewField] = useState(false);

  const handleAddField = () => {
    if (newFieldName.trim()) {
      setManualEntry(prev => ({
        ...prev,
        [newFieldName]: ""
      }));
      setNewFieldName("");
      setAddingNewField(false);
    }
  };

  // Risk criteria state
  const [highRiskCriteria, setHighRiskCriteria] = useState<string[]>([
    "Any sanctions match",
    "Tier 1 PEP match",
    "Violent crime in adverse media"
  ]);
  const [mediumRiskCriteria, setMediumRiskCriteria] = useState<string[]>([
    "Tier 2/3 PEP match",
    "PEP family member match",
    "Financial crime in adverse media"
  ]);
  const [lowRiskCriteria, setLowRiskCriteria] = useState<string[]>([
    "No matches on any lists",
    "Clean adverse media history"
  ]);
  
  // New criteria input state
  const [newHighRiskCriteria, setNewHighRiskCriteria] = useState('');
  const [newMediumRiskCriteria, setNewMediumRiskCriteria] = useState('');
  const [newLowRiskCriteria, setNewLowRiskCriteria] = useState('');
  
  // Edit state
  const [editingHighRiskIndex, setEditingHighRiskIndex] = useState<number | null>(null);
  const [editingMediumRiskIndex, setEditingMediumRiskIndex] = useState<number | null>(null);
  const [editingLowRiskIndex, setEditingLowRiskIndex] = useState<number | null>(null);
  const [editedCriteria, setEditedCriteria] = useState('');

  // Function to add new criteria
  const addCriteria = (type: 'high' | 'medium' | 'low') => {
    if (type === 'high' && newHighRiskCriteria.trim()) {
      setHighRiskCriteria([...highRiskCriteria, newHighRiskCriteria.trim()]);
      setNewHighRiskCriteria('');
    } else if (type === 'medium' && newMediumRiskCriteria.trim()) {
      setMediumRiskCriteria([...mediumRiskCriteria, newMediumRiskCriteria.trim()]);
      setNewMediumRiskCriteria('');
    } else if (type === 'low' && newLowRiskCriteria.trim()) {
      setLowRiskCriteria([...lowRiskCriteria, newLowRiskCriteria.trim()]);
      setNewLowRiskCriteria('');
    }
  };

  // Function to remove criteria
  const removeCriteria = (type: 'high' | 'medium' | 'low', index: number) => {
    if (type === 'high') {
      setHighRiskCriteria(highRiskCriteria.filter((_, i) => i !== index));
    } else if (type === 'medium') {
      setMediumRiskCriteria(mediumRiskCriteria.filter((_, i) => i !== index));
    } else if (type === 'low') {
      setLowRiskCriteria(lowRiskCriteria.filter((_, i) => i !== index));
    }
  };

  // Function to start editing criteria
  const startEditCriteria = (type: 'high' | 'medium' | 'low', index: number) => {
    if (type === 'high') {
      setEditingHighRiskIndex(index);
      setEditedCriteria(highRiskCriteria[index]);
    } else if (type === 'medium') {
      setEditingMediumRiskIndex(index);
      setEditedCriteria(mediumRiskCriteria[index]);
    } else if (type === 'low') {
      setEditingLowRiskIndex(index);
      setEditedCriteria(lowRiskCriteria[index]);
    }
  };

  // Function to save edited criteria
  const saveEditedCriteria = (type: 'high' | 'medium' | 'low') => {
    if (type === 'high' && editingHighRiskIndex !== null) {
      const newCriteria = [...highRiskCriteria];
      newCriteria[editingHighRiskIndex] = editedCriteria;
      setHighRiskCriteria(newCriteria);
      setEditingHighRiskIndex(null);
    } else if (type === 'medium' && editingMediumRiskIndex !== null) {
      const newCriteria = [...mediumRiskCriteria];
      newCriteria[editingMediumRiskIndex] = editedCriteria;
      setMediumRiskCriteria(newCriteria);
      setEditingMediumRiskIndex(null);
    } else if (type === 'low' && editingLowRiskIndex !== null) {
      const newCriteria = [...lowRiskCriteria];
      newCriteria[editingLowRiskIndex] = editedCriteria;
      setLowRiskCriteria(newCriteria);
      setEditingLowRiskIndex(null);
    }
  };

  // Function to cancel editing
  const cancelEditing = (type: 'high' | 'medium' | 'low') => {
    if (type === 'high') {
      setEditingHighRiskIndex(null);
    } else if (type === 'medium') {
      setEditingMediumRiskIndex(null);
    } else if (type === 'low') {
      setEditingLowRiskIndex(null);
    }
    setEditedCriteria('');
  };

  // Function to toggle input field enabled state
  const toggleInputEnabled = (inputName: keyof InputToggleState) => {
    // Don't allow toggling of required inputs (except for Country/Nationality which can be toggled if the other is enabled)
    if (inputName === "Full Name" || inputName === "Date of Birth" || 
        inputName === "Government ID") {
      return;
    }
    
    // Special case for Country of Residence and Nationality
    if (inputName === "Country of Residence" || inputName === "Nationality") {
      const otherField = inputName === "Country of Residence" ? "Nationality" : "Country of Residence";
      
      // Don't allow disabling if the other field is already disabled
      if (!enabledInputs[inputName] || enabledInputs[otherField]) {
        setEnabledInputs(prev => ({
          ...prev,
          [inputName]: !prev[inputName]
        }));
      }
      return;
    }
    
    setEnabledInputs(prev => ({
      ...prev,
      [inputName]: !prev[inputName]
    }));
  };

  // Render the scenario selector component
  const renderScenarioSelector = () => {
    return (
      <div className="mb-4">
        <p className="font-medium mb-1">Select a test scenario:</p>
        <div className="flex flex-wrap gap-2 overflow-x-auto py-2" style={{ maxHeight: "176px" }}>
          {Object.entries(scenarios).map(([key, scenario]) => (
            <div
              key={key}
              className={`flex-none px-4 py-3 rounded border ${
                selectedScenario === key
                  ? "bg-purple-100 border-purple-500 text-purple-700"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              } cursor-pointer transition-colors w-[250px]`}
              onClick={() => handleScenarioSelect(key)}
            >
              <div className="font-medium">{scenario.title}</div>
              <div className="text-xs text-gray-500">{scenario.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to handle testing the agent - redirects to agent detail page
  const handleTestAgent = () => {
    // Navigate to business-onboarding page with show=test parameter
    // Using direct URL navigation for reliability
    window.location.href = `/agents/business-onboarding?show=test`;
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        {!showWizard ? (
          <div className="flex flex-1 flex-col">
            {/* Page Header */}
            <div className="border-b bg-white p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  <BotIcon className="h-5 w-5 text-indigo-600" />
                  Compliance Agents
                </h1>
                <Button 
                  onClick={() => handleTemplateSelect(agentTemplates[0])} // Select blank template
                  className="gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  New Compliance Agent
                </Button>
              </div>
            </div>
            
            {/* Main page search section */}
            <div className="py-12 px-8 bg-gradient-to-b from-indigo-50/50 to-transparent">
              {/* Search input */}
              <div className="flex flex-col items-center max-w-2xl mx-auto">
                <div className="relative w-full">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Search agents by your compliance needs..."
                      className="h-12 pl-10 pr-4 text-base rounded-full border-muted bg-white shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-indigo-500" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions in a separate container */}
            <div className="pb-10 overflow-x-auto px-8 -mt-4 border-b border-slate-200">
              <div className="flex flex-nowrap gap-4 justify-center">
                {quickActions.map((action) => (
                  <Button 
                    key={action.id} 
                    variant="outline" 
                    className="rounded-full gap-2 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 whitespace-nowrap flex-shrink-0 min-w-fit shadow-sm"
                    style={{ padding: "0 16px" }}
                  >
                    <span className="text-indigo-600">{action.icon}</span>
                    {action.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Templates Section - Moved above Your Agents */}
            <div className="px-6 py-10 bg-slate-50/50 border-b">
              <h2 className="mb-6 text-lg font-semibold flex items-center gap-2">
                <ClipboardIcon className="h-5 w-5 text-indigo-600" />
                Select a template to start creating your next compliance agent
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                {agentTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`overflow-hidden transition-all hover:shadow-md bg-white cursor-pointer hover:translate-y-[-2px] ${template.id === 0 ? 'border-dashed border-2 border-indigo-200 hover:border-indigo-300' : ''}`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${template.id === 0 ? 'bg-indigo-50' : 'bg-indigo-50'}`}>
                          {template.icon}
                        </div>
                        <h3 className="text-base font-medium">{template.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm text-sm py-1.5 px-4"
                >
                  Show more templates
                </Button>
              </div>
            </div>

            {/* Your Agents Section - Now below Templates */}
            <div className="px-6 py-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ZapIcon className="h-5 w-5 text-indigo-600" />
                  Your Compliance Agents
                </h2>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-md border-input">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 6H3"></path><path d="M10 12H3"></path><path d="M17 18H3"></path></svg>
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-md border-input">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {existingAgents.map((agent) => (
                  <Card 
                    key={agent.id} 
                    className="overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                    onClick={() => handleAgentClick(agent.id)}
                  >
                    <div className="p-3.5 flex items-start gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${agent.iconBg}`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium">{agent.title}</h3>
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant="secondary" 
                              className={`${
                                agent.status === 'Draft' 
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-100'
                              } text-xs font-medium`}
                            >
                              {agent.status}
                            </Badge>
                            <button 
                              className="text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click event
                              }}
                            >
                              ...
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2.5 mb-1 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                              <span>{agent.stats.completed}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertCircleIcon className="h-3.5 w-3.5 text-red-500" />
                              <span>{agent.stats.failed}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FlagIcon className="h-3.5 w-3.5 text-amber-500" />
                              <span>{agent.stats.flagged}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t px-3.5 py-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <BuildingIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{agent.type}</span>
                        </div>
                        <div className="text-muted-foreground">
                          <span>Updated {agent.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            {/* Wizard Header */}
            <div className="bg-white border-b p-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleCloseWizard}
                    className="h-8 w-8"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                  <h1 className="text-xl font-semibold">
                    {isBlankTemplate() ? 'Create Your Compliance Agent' : `Setup Your ${selectedTemplate?.title || 'Compliance Agent'} Agent`}
                  </h1>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="mr-2">
                    Save as Draft
                  </Button>
                  <Button 
                    variant="default" 
                    size="default"
                    className="h-9 px-4 py-2 text-sm gap-1.5"
                    onClick={wizardStep === 5 ? handleTestAgent : handleNextStep}
                  >
                    {wizardStep === 5 ? 'Test Your Agent' : 'Next'}
                    {wizardStep < 5 && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {isBlankTemplate() ? (
              /* Blank template experience */
              <div className="flex-1">
                {/* Search input in its own container */}
                <div className="py-12 px-8 bg-gradient-to-b from-indigo-50/50 to-transparent">
                  <div className="flex flex-col items-center max-w-2xl mx-auto">
                    <div className="relative w-full">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type="text" 
                          placeholder="Search agents by your compliance needs..."
                          className="h-12 pl-10 pr-4 text-base rounded-full border-muted bg-white shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-indigo-500" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick actions in a separate full-width container */}
                <div className="pb-10 overflow-x-auto px-8 -mt-4 border-b border-slate-200">
                  <div className="flex flex-nowrap gap-4 justify-center">
                    {quickActions.map((action) => (
                      <Button 
                        key={action.id} 
                        variant="outline" 
                        className="rounded-full gap-2 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 whitespace-nowrap flex-shrink-0 min-w-fit shadow-sm"
                        style={{ padding: "0 16px" }}
                      >
                        <span className="text-indigo-600">{action.icon}</span>
                        {action.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Wizard Experience */
              <>
                {/* Wizard Progress Indicator */}
                <div className="bg-white border-b py-4 px-6">
                  <div className="flex items-center justify-between mb-2">
                    {wizardSteps.map((step) => (
                      <div 
                        key={step.number}
                        className={`flex flex-col items-center ${wizardStep === step.number ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        <div 
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs
                            ${wizardStep > step.number ? 'bg-primary text-white' : 
                              wizardStep === step.number ? 'border-2 border-primary' : 'border border-muted-foreground/30'}`}
                        >
                          {wizardStep > step.number ? <CheckIcon className="h-4 w-4" /> : step.number}
                        </div>
                        <span className="text-xs mt-2 text-center">{step.title}</span>
                      </div>
                    ))}
                  </div>
                  <div className="relative h-1 w-full bg-muted mt-3">
                    <div 
                      className="absolute top-0 left-0 h-1 bg-primary transition-all" 
                      style={{ width: `${(wizardStep - 1) * 20}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Wizard Content */}
                <div className="flex-1 p-6 bg-slate-50">
                  {renderWizardStep()}
                </div>
                
                {/* Wizard Navigation */}
                <div className="bg-white border-t p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                    disabled={wizardStep === 1}
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="default"
                    className="h-9 px-4 py-2 text-sm gap-1.5"
                    onClick={wizardStep === 5 ? handleTestAgent : handleNextStep}
                  >
                    {wizardStep === 5 ? 'Test Your Agent' : 'Next'}
                    {wizardStep < 5 && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </SidebarInset>
      
      {/* Remove Check Confirmation Modal */}
      {removeConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Remove Step</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    setRemoveConfirmOpen(false);
                    setCheckToRemove(null);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {checkToRemove?.type === 'default' && (
                  <>
                    Are you sure you want to remove this core check? You can add it back later if needed.
                    {checkToRemove.id === 'sanctions' && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-xs">
                        <div className="flex items-start gap-1.5">
                          <AlertCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Warning: Removing sanctions screening may impact your compliance with regulatory requirements.</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {checkToRemove?.type === 'additional' && (
                  <>Are you sure you want to remove this additional check? This action cannot be undone, but you can add it again later.</>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end border-t px-6 py-4 gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRemoveConfirmOpen(false);
                  setCheckToRemove(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleRemoveCheck}
              >
                Remove
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </SidebarProvider>
  )
} 