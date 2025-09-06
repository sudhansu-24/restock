import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Package,
  TrendingDown,
  AlertTriangle,
  Target,
  Zap,
  Brain,
  Eye
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { mockMetrics, chartData, mockProducts } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      default: return "default";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "text-risk-critical";
      case "High": return "text-risk-high";
      case "Medium": return "text-risk-medium";
      default: return "text-risk-low";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">AI-powered dead stock insights and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button size="sm" className="bg-gradient-primary">
            <Brain className="mr-2 h-4 w-4" />
            Run AI Analysis
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Dead Stock Value"
          value={formatCurrency(mockMetrics.totalDeadStockValue)}
          change="+12% from last month"
          changeType="negative"
          icon={DollarSign}
        />
        <MetricCard
          title="Monthly Storage Cost"
          value={formatCurrency(mockMetrics.monthlyStorageCost)}
          change="+8% from last month"
          changeType="negative"
          icon={Package}
        />
        <MetricCard
          title="Potential Recovery"
          value={formatCurrency(mockMetrics.potentialRecovery)}
          change="Available for liquidation"
          changeType="positive"
          icon={Target}
        />
        <MetricCard
          title="At-Risk Products"
          value={`${mockMetrics.atRiskProducts}`}
          change={`of ${mockMetrics.totalProducts} total`}
          changeType="neutral"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dead Stock Trends */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              <span>Dead Stock Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.deadStockTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Dead Stock Value"]}
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <span>Category Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Products & AI Recommendations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* High Risk Products */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>High Risk Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProducts
                  .filter(product => product.riskLevel === "High" || product.riskLevel === "Critical")
                  .slice(0, 4)
                  .map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category} • {product.daysSinceLastSale} days</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(product.purchasePrice * product.quantity)}</p>
                          <p className="text-xs text-muted-foreground">{product.quantity} units</p>
                        </div>
                        <Badge 
                          variant={getRiskBadgeVariant(product.riskLevel)}
                          className={cn("text-xs", getRiskColor(product.riskLevel))}
                        >
                          {product.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-warning" />
              <span>AI Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <h4 className="font-medium text-sm text-foreground mb-1">Urgent Action</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Apply 40% discount to MacBook Pro inventory
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Apply Discount
              </Button>
            </div>
            
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-medium text-sm text-foreground mb-1">Bundle Strategy</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Bundle Samsung phones with accessories
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Create Bundle
              </Button>
            </div>
            
            <div className="p-3 bg-success/10 rounded-lg border border-success/20">
              <h4 className="font-medium text-sm text-foreground mb-1">Liquidation</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Consider liquidating winter jackets
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Start Liquidation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

              {/* Monthly Cost Analysis */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            <span>Monthly Cost Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlyCosts}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'storage' ? 'Storage Cost' : 'Lost Revenue'
                ]}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="storage" fill="hsl(var(--primary))" name="storage" />
              <Bar dataKey="lost" fill="hsl(var(--destructive))" name="lost" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}