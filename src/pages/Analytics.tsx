import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Settings,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";
import { mockProducts, mockMetrics, chartData } from "@/lib/mockData";

export default function Analytics() {
  const [thresholds, setThresholds] = useState({
    daysWithoutSale: [90],
    minStockQuantity: [20],
    maxStorageCost: [500],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getFilteredProducts = () => {
    return mockProducts.filter(product => 
      product.daysSinceLastSale >= thresholds.daysWithoutSale[0] ||
      product.quantity >= thresholds.minStockQuantity[0] ||
      product.storageCost >= thresholds.maxStorageCost[0]
    );
  };

  const filteredProducts = getFilteredProducts();
  const totalFilteredValue = filteredProducts.reduce((sum, product) => 
    sum + (product.purchasePrice * product.quantity), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-muted-foreground">Detailed analysis and custom threshold management</p>
        </div>
      </div>

      {/* Custom Thresholds Panel */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Custom Risk Thresholds</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Days Without Sale: {thresholds.daysWithoutSale[0]} days
              </Label>
              <Slider
                value={thresholds.daysWithoutSale}
                onValueChange={(value) => setThresholds({ ...thresholds, daysWithoutSale: value })}
                max={365}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 days</span>
                <span>365 days</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Minimum Stock Quantity: {thresholds.minStockQuantity[0]} units
              </Label>
              <Slider
                value={thresholds.minStockQuantity}
                onValueChange={(value) => setThresholds({ ...thresholds, minStockQuantity: value })}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 units</span>
                <span>100 units</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Max Storage Cost: ₹{thresholds.maxStorageCost[0]}/month
              </Label>
              <Slider
                value={thresholds.maxStorageCost}
                onValueChange={(value) => setThresholds({ ...thresholds, maxStorageCost: value })}
                max={1000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹0</span>
                <span>₹1000</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Flagged Products: <Badge variant="secondary">{filteredProducts.length}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Total Value: <Badge variant="outline">{formatCurrency(totalFilteredValue)}</Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Reset Defaults</Button>
              <Button size="sm" className="bg-gradient-primary">Save Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Impact Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Dead Stock</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(mockMetrics.totalDeadStockValue)}
                </p>
                <p className="text-xs text-destructive flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Costs</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(mockMetrics.monthlyStorageCost)}
                </p>
                <p className="text-xs text-warning flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +8% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recovery Potential</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(mockMetrics.potentialRecovery)}
                </p>
                <p className="text-xs text-success flex items-center">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  73% of dead stock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profit Impact</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(Math.abs(mockMetrics.profitImpact))}
                </p>
                <p className="text-xs text-destructive flex items-center">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Monthly loss
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Cost Analysis */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Cost Analysis</CardTitle>
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
                />
                <Bar dataKey="storage" fill="hsl(var(--primary))" name="storage" />
                <Bar dataKey="lost" fill="hsl(var(--destructive))" name="lost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Low Risk", value: 45, color: "hsl(var(--success))" },
                    { name: "Medium Risk", value: 32, color: "hsl(var(--warning))" },
                    { name: "High Risk", value: 18, color: "hsl(var(--destructive))" },
                    { name: "Critical", value: 5, color: "hsl(var(--risk-critical))" },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: "Low Risk", value: 45, color: "hsl(var(--success))" },
                    { name: "Medium Risk", value: 32, color: "hsl(var(--warning))" },
                    { name: "High Risk", value: 18, color: "hsl(var(--destructive))" },
                    { name: "Critical", value: 5, color: "hsl(var(--risk-critical))" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Threshold-Based Product List */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Products Meeting Risk Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.daysSinceLastSale} days since sale • ₹{product.storageCost}/month storage
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(product.purchasePrice * product.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{product.quantity} units</p>
                  </div>
                  <Badge 
                    variant={
                      product.riskLevel === "Critical" || product.riskLevel === "High" 
                        ? "destructive" 
                        : product.riskLevel === "Medium" 
                        ? "secondary" 
                        : "default"
                    }
                  >
                    {product.riskLevel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}