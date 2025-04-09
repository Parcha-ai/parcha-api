"use client"

import React, { useState } from 'react';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  XIcon, 
  PlayIcon,
  FileIcon,
  HomeIcon,
  BriefcaseIcon,
  LandmarkIcon,
  CoinsIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  CreditCardIcon,
  UsersIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ManualDataEntryPage() {
  // State for the form
  const [formData, setFormData] = useState<Record<string, string>>({
    "Full Name": "",
    "Date of Birth": "",
    "Nationality": "",
    "Country of Residence": ""
  });
  
  // State for custom fields
  const [customFields, setCustomFields] = useState<string[]>([]);
  
  // State for adding a new field
  const [newFieldName, setNewFieldName] = useState("");
  const [showNewFieldInput, setShowNewFieldInput] = useState(false);
  
  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle adding a new field
  const handleAddField = () => {
    if (newFieldName.trim() && !formData.hasOwnProperty(newFieldName)) {
      setCustomFields(prev => [...prev, newFieldName]);
      setFormData(prev => ({
        ...prev,
        [newFieldName]: ""
      }));
      setNewFieldName("");
      setShowNewFieldInput(false);
    }
  };
  
  // Handle removing a custom field
  const handleRemoveField = (field: string) => {
    setCustomFields(prev => prev.filter(f => f !== field));
    const newFormData = {...formData};
    delete newFormData[field];
    setFormData(newFormData);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    console.log("Submitting data:", formData);
    window.location.href = "/agent-test-results-list";
  };
  
  // Navigate back to agent wizard
  const navigateBack = () => {
    window.location.href = "/agents?step=6";
  };

  // Suggested field options
  const suggestedFields = [
    { label: "Government ID", value: "Government ID", icon: <CreditCardIcon className="h-4 w-4 text-primary" /> },
    { label: "Occupation", value: "Occupation", icon: <BriefcaseIcon className="h-4 w-4 text-primary" /> },
    { label: "Address", value: "Address", icon: <HomeIcon className="h-4 w-4 text-primary" /> },
    { label: "Business Associations", value: "Business Associations", icon: <UsersIcon className="h-4 w-4 text-primary" /> },
    { label: "Political Affiliations", value: "Political Affiliations", icon: <LandmarkIcon className="h-4 w-4 text-primary" /> },
    { label: "Source of Wealth", value: "Source of Wealth", icon: <CoinsIcon className="h-4 w-4 text-primary" /> },
    { label: "Aliases", value: "Aliases", icon: <UserIcon className="h-4 w-4 text-primary" /> },
    { label: "Phone Number", value: "Phone Number", icon: <PhoneIcon className="h-4 w-4 text-primary" /> },
    { label: "Email", value: "Email", icon: <MailIcon className="h-4 w-4 text-primary" /> }
  ];

  // Pre-filtered suggested fields (those not already in the form)
  const filteredSuggestions = suggestedFields.filter(
    field => !formData.hasOwnProperty(field.value)
  );
  
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={navigateBack}
            className="gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to your agent
          </Button>
          
          {Object.keys(formData).length > 0 && (
            <Button 
              onClick={handleSubmit}
              className="gap-2"
            >
              <PlayIcon className="h-4 w-4" />
              Run Test
            </Button>
          )}
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Enter Test Data</h1>
          <p className="text-muted-foreground">
            Manually enter subject information to test your compliance agent with specific scenarios.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Main form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Subject Information</CardTitle>
                <CardDescription>
                  Enter information about the subject you want to test. All fields are optional but providing more information leads to more thorough results.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Required fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      value={formData["Full Name"]}
                      onChange={(e) => handleInputChange("Full Name", e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input 
                      id="dob"
                      type="date"
                      value={formData["Date of Birth"]}
                      onChange={(e) => handleInputChange("Date of Birth", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input 
                      id="nationality"
                      value={formData["Nationality"]}
                      onChange={(e) => handleInputChange("Nationality", e.target.value)}
                      placeholder="e.g. United States"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country of Residence</Label>
                    <Input 
                      id="country"
                      value={formData["Country of Residence"]}
                      onChange={(e) => handleInputChange("Country of Residence", e.target.value)}
                      placeholder="e.g. United Kingdom"
                    />
                  </div>
                </div>
                
                {/* Custom fields added by the user */}
                {customFields.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {customFields.map((field, index) => (
                        <div key={index} className="space-y-2 relative">
                          <div className="flex justify-between items-center">
                            <Label htmlFor={`field-${index}`}>{field}</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleRemoveField(field)}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input 
                            id={`field-${index}`}
                            value={formData[field] || ""}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            placeholder={`Enter ${field.toLowerCase()}`}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {/* Add new field UI */}
                {showNewFieldInput ? (
                  <div className="border rounded-md p-4 bg-muted/20 space-y-3">
                    <Label>Add New Field</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="Field name (e.g. Occupation)"
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddField}
                        disabled={!newFieldName.trim()}
                      >
                        Add
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setNewFieldName("");
                          setShowNewFieldInput(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => setShowNewFieldInput(true)}
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Custom Field
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Suggested fields now stacked below */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Suggested Fields</CardTitle>
                <CardDescription>
                  Additional fields you may want to include for more accurate screening results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredSuggestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-8">
                    All suggested fields have been added
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {filteredSuggestions.map((field, index) => (
                      <div 
                        key={index} 
                        className="border rounded-md p-3 hover:bg-muted/20 transition-colors flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            {field.icon}
                          </div>
                          <div className="font-medium text-sm">{field.label}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 hover:bg-primary/10"
                          onClick={() => {
                            setCustomFields(prev => [...prev, field.value]);
                            setFormData(prev => ({...prev, [field.value]: ""}));
                          }}
                        >
                          <PlusIcon className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="font-medium text-sm mb-3">Notes & Tips</h3>
                  <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Adding more detail improves screening accuracy</li>
                    <li>Full name and date of birth are most important for PEP and sanctions screening</li>
                    <li>Business associations help identify indirect risks</li>
                    <li>Source of wealth is critical for enhanced due diligence</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 