
import { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import PredictionResult from "@/components/PredictionResult";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeDataset } from "@/lib/predictionService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
  const [data, setData] = useState<{ columns: string[], rows: any[] } | null>(null);
  const [analysis, setAnalysis] = useState<{
    malignantCount: number;
    benignCount: number;
    predictions: any[];
  } | null>(null);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileUpload = (fileData: { columns: string[], rows: any[] }) => {
    setData(fileData);
    setActiveTab("analyze");
  };

  const handleAnalyze = () => {
    if (!data || data.rows.length === 0) {
      toast.error("Please upload a dataset first");
      return;
    }

    try {
      const result = analyzeDataset(data.rows);
      setAnalysis(result);
      setActiveTab("results");
      
      // Select the first row for detailed view
      if (result.predictions.length > 0) {
        setSelectedRow(result.predictions[0]);
      }
      
      toast.success(`Analysis complete: Found ${result.malignantCount} malignant and ${result.benignCount} benign cases`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze the dataset. Please check your data format.");
    }
  };

  const selectRandomSample = () => {
    if (analysis && analysis.predictions.length > 0) {
      const randomIndex = Math.floor(Math.random() * analysis.predictions.length);
      setSelectedRow(analysis.predictions[randomIndex]);
      toast.info("Random sample selected");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="grid gap-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="analyze" disabled={!data}>Analyze</TabsTrigger>
              <TabsTrigger value="results" disabled={!analysis}>Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="max-w-md mx-auto text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Upload Your Dataset</h2>
                <p className="text-muted-foreground">
                  Upload a CSV file containing breast cancer features to begin analysis
                </p>
              </div>
              
              <div className="flex justify-center">
                <FileUpload onFileUpload={handleFileUpload} />
              </div>
            </TabsContent>
            
            <TabsContent value="analyze" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Analyze Your Dataset</h2>
                <p className="text-muted-foreground">
                  Review your uploaded data and start the analysis
                </p>
              </div>
              
              {data && (
                <>
                  <DataTable data={data} />
                  
                  <div className="flex justify-center mt-8">
                    <Button size="lg" onClick={handleAnalyze}>
                      Analyze Dataset
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
                <p className="text-muted-foreground">
                  View the prediction results for your dataset
                </p>
              </div>
              
              {analysis && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Dataset Summary</CardTitle>
                        <CardDescription>
                          Overview of prediction results
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Benign Cases</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                              {analysis.benignCount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {((analysis.benignCount / (analysis.benignCount + analysis.malignantCount)) * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Malignant Cases</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                              {analysis.malignantCount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {((analysis.malignantCount / (analysis.benignCount + analysis.malignantCount)) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        
                        <Button onClick={selectRandomSample} variant="outline" className="w-full">
                          View Random Sample
                        </Button>
                      </CardContent>
                    </Card>
                    
                    {selectedRow && (
                      <PredictionResult 
                        prediction={{
                          malignant: selectedRow.predicted_malignant,
                          benign: selectedRow.predicted_benign
                        }}
                        confidence={Math.max(selectedRow.predicted_malignant, selectedRow.predicted_benign)}
                      />
                    )}
                  </div>
                  
                  <div>
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-xl">Prediction Results</CardTitle>
                        <CardDescription>
                          Detailed view of all predictions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="rounded-md overflow-hidden max-h-[500px] overflow-y-auto">
                          <Table>
                            <TableHeader className="sticky top-0 bg-background">
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Prediction</TableHead>
                                <TableHead>Confidence</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {analysis.predictions.map((row, index) => {
                                const confidence = Math.max(
                                  row.predicted_malignant,
                                  row.predicted_benign
                                ) * 100;
                                
                                return (
                                  <TableRow 
                                    key={index}
                                    className={selectedRow === row ? "bg-muted" : ""}
                                  >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                      <span className={row.prediction === "Malignant" 
                                        ? "text-destructive font-medium"
                                        : "text-green-500 font-medium"
                                      }>
                                        {row.prediction}
                                      </span>
                                    </TableCell>
                                    <TableCell>{confidence.toFixed(1)}%</TableCell>
                                    <TableCell>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setSelectedRow(row)}
                                      >
                                        View
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Mama Mia Cancer Predictor - For educational purposes only. Not for medical diagnosis.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Cancer Research AI
          </p>
        </div>
      </footer>
    </div>
  );
};

// Import Table components for Results tab
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default Index;
