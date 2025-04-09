"use client"

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UploadIcon,
  FileTextIcon,
  XIcon,
  AlertCircleIcon,
  CheckIcon,
  LoaderIcon,
  ArrowLeftIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UploadCsvPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [previewData, setPreviewData] = useState<string[][] | null>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      previewCsv(file);
    }
  };

  // Preview CSV contents
  const previewCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const data = lines.slice(0, 6).map(line => line.split(','));
      setPreviewData(data);
    };
    reader.readAsText(file);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!csvFile) return;
    
    setIsUploading(true);
    setUploadStatus("loading");
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus("success");
      
      // Redirect to results page after successful upload
      setTimeout(() => {
        window.location.href = "/agent-test-results-list";
      }, 1500);
    }, 2000);
  };
  
  // Reset the upload form
  const resetUpload = () => {
    setCsvFile(null);
    setPreviewData(null);
    setUploadStatus("idle");
  };

  // Function to go back to agent wizard test step
  const navigateToAgentWizardTestStep = () => {
    window.location.href = "/agents?step=6"; // This will be handled in AgentsPage to show step 6
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" className="gap-2" onClick={navigateToAgentWizardTestStep}>
              <ArrowLeftIcon className="h-4 w-4" />
              Back to your agent
            </Button>
            
            {uploadStatus === "idle" && csvFile && (
              <Button onClick={handleUpload}>
                Upload and Test
              </Button>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-4 mt-8">Upload Test Data CSV</h1>
          <p className="text-lg text-muted-foreground">
            Upload a CSV file with test data to see how your agent performs with your scenarios.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            {uploadStatus === "idle" && (
              <div className="grid gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {!csvFile ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <UploadIcon className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold mb-1">Drag and drop your CSV file here</p>
                        <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                        
                        <Input
                          id="csvFile"
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button variant="outline" onClick={() => document.getElementById('csvFile')?.click()}>
                          Select CSV File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FileTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                          <div>
                            <p className="font-medium">{csvFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(csvFile.size / 1024).toFixed(2)} KB • Last modified: {new Date(csvFile.lastModified).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={resetUpload}>
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {previewData && previewData.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Preview</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {previewData[0].map((header, i) => (
                              <TableHead key={i}>{header}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.slice(1, 5).map((row, i) => (
                            <TableRow key={i}>
                              {row.map((cell, j) => (
                                <TableCell key={j}>{cell}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {previewData.length > 5 ? "Showing first 4 rows of data." : ""}
                    </p>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Expected CSV Format</h4>
                      <p className="text-sm">
                        Your CSV should include the following headers: fullName, dateOfBirth, nationality, countryOfResidence, governmentId (optional), address
                      </p>
                      <Button variant="link" size="sm" className="pl-0 h-auto text-xs font-normal underline">
                        Download sample template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {uploadStatus === "loading" && (
              <div className="flex flex-col items-center justify-center py-12">
                <LoaderIcon className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-semibold mb-2">Processing your data</h3>
                <p className="text-muted-foreground">
                  Please wait while we process your CSV file...
                </p>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckIcon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Successful!</h3>
                <p className="text-muted-foreground">
                  Your test data has been processed. Redirecting to results...
                </p>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-red-100 p-3 mb-4">
                  <AlertCircleIcon className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Failed</h3>
                <p className="text-muted-foreground mb-4">
                  There was an error processing your CSV file. Please try again.
                </p>
                <Button onClick={resetUpload}>
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 