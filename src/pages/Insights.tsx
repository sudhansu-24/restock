import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  MessageSquare,
  Lightbulb,
  TrendingDown,
  Package,
  DollarSign,
  Zap,
  Search,
  AlertTriangle,
  Target,
  ShoppingCart
} from "lucide-react";
import { mockProducts } from "@/lib/mockData";

interface QueryResult {
  query: string;
  response: string;
  data?: any[];
  timestamp: string;
}

export default function Insights() {
  const [query, setQuery] = useState("");
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([
    {
      query: "Show items with zero sales in last 120 days",
      response: "Found 4 products with no sales in the last 120 days. These items represent ₹18,50,000 in dead stock value and should be prioritized for liquidation or discount strategies.",
      data: mockProducts.filter(p => p.daysSinceLastSale > 120),
      timestamp: "2 hours ago"
    },
    {
      query: "Which electronics are at high risk?",
      response: "3 electronics items are at high risk: Samsung Galaxy S22 (83 days), MacBook Pro (180 days), and Gaming Console needs monitoring. Combined value: ₹32,50,000.",
      data: mockProducts.filter(p => p.category === "Electronics" && (p.riskLevel === "High" || p.riskLevel === "Critical")),
      timestamp: "1 day ago"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const exampleQueries = [
    "Show items with zero sales in last 120 days",
    "Which electronics are at high risk?",
    "Calculate storage costs for overstocked items",
    "Find products with quantity above 50 units",
    "What's the total value of critical risk items?",
    "Show seasonal items that need attention"
  ];

  const recommendations = [
    {
      type: "urgent",
      title: "Immediate Liquidation Required",
      description: "MacBook Pro inventory has been stagnant for 180 days",
      action: "Apply 40% discount or liquidate",
      value: "₹14,40,000",
      icon: AlertTriangle,
      color: "text-destructive"
    },
    {
      type: "strategy",
      title: "Bundle Opportunity",
      description: "Combine slow-moving headphones with popular accessories",
      action: "Create bundle offers",
      value: "₹4,08,000",
      icon: Package,
      color: "text-primary"
    },
    {
      type: "seasonal",
      title: "Off-Season Clearance",
      description: "Winter jackets should be discounted before next season",
      action: "Start clearance sale",
      value: "₹3,11,500",
      icon: TrendingDown,
      color: "text-warning"
    },
    {
      type: "optimization",
      title: "Storage Cost Reduction",
      description: "High storage cost items need immediate attention",
      action: "Reduce inventory levels",
      value: "₹18,000/month savings",
      icon: DollarSign,
      color: "text-success"
    }
  ];

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI responses based on query content
    let response = "";
    let data: any[] = [];
    
    if (query.toLowerCase().includes("zero sales") || query.toLowerCase().includes("no sales")) {
      const stagnantProducts = mockProducts.filter(p => p.daysSinceLastSale > 90);
      response = `Found ${stagnantProducts.length} products with minimal sales activity. Total value: ₹${(stagnantProducts.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0)).toLocaleString()}. Recommend immediate action for items over 120 days.`;
      data = stagnantProducts;
    } else if (query.toLowerCase().includes("electronics")) {
      const electronics = mockProducts.filter(p => p.category === "Electronics");
      const highRisk = electronics.filter(p => p.riskLevel === "High" || p.riskLevel === "Critical");
      response = `Electronics analysis: ${electronics.length} total items, ${highRisk.length} at high risk. Consider bundling slower items with popular accessories or applying targeted discounts.`;
      data = highRisk;
    } else if (query.toLowerCase().includes("storage cost")) {
      const highStorageCost = mockProducts.filter(p => p.storageCost > 300);
      response = `High storage cost items identified: ${highStorageCost.length} products costing ₹${highStorageCost.reduce((sum, p) => sum + p.storageCost, 0)}/month. Prioritize these for quick turnover.`;
      data = highStorageCost;
    } else if (query.toLowerCase().includes("quantity") || query.toLowerCase().includes("overstocked")) {
      const overstocked = mockProducts.filter(p => p.quantity > 30);
      response = `Overstocked items: ${overstocked.length} products with high inventory levels. Total value: ₹${(overstocked.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0)).toLocaleString()}. Consider volume discounts.`;
      data = overstocked;
    } else {
      response = `I found relevant insights for your query. Based on current inventory data, I recommend focusing on the ${mockProducts.filter(p => p.riskLevel === "High" || p.riskLevel === "Critical").length} high-risk items for immediate attention.`;
      data = mockProducts.filter(p => p.riskLevel === "High" || p.riskLevel === "Critical");
    }
    
    const newQuery: QueryResult = {
      query,
      response,
      data,
      timestamp: "Just now"
    };
    
    setQueryHistory([newQuery, ...queryHistory]);
    setQuery("");
    setIsLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Insights & Recommendations</h1>
          <p className="text-muted-foreground">Natural language queries and intelligent recommendations</p>
        </div>
      </div>

      {/* Natural Language Query Interface */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Ask SmartStock AI</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ask anything about your inventory..."
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                />
              </div>
              <Button 
                onClick={handleQuery} 
                disabled={isLoading || !query.trim()}
                className="bg-gradient-primary"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-r-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Ask AI
                  </>
                )}
              </Button>
            </div>

            {/* Example Queries */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try these example queries:</p>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setQuery(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            <span>Smart Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-background rounded-lg border">
                <div className="flex items-start space-x-3">
                  <rec.icon className={`h-5 w-5 mt-1 ${rec.color}`} />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{rec.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {rec.value}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Zap className="mr-2 h-3 w-3" />
                      {rec.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Query History */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Recent AI Queries</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queryHistory.map((item, index) => (
              <div key={index} className="p-4 bg-background rounded-lg border">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">"{item.query}"</h4>
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {item.response}
                  </p>
                  
                  {item.data && item.data.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Affected Products:</p>
                      <div className="grid gap-2">
                        {item.data.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div>
                              <span className="text-sm font-medium">{product.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {product.category} • {product.daysSinceLastSale} days
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{formatCurrency(product.purchasePrice * product.quantity)}</span>
                              <Badge 
                                variant={
                                  product.riskLevel === "Critical" || product.riskLevel === "High" 
                                    ? "destructive" 
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {product.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {item.data.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{item.data.length - 3} more products
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}