import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CalendarIcon, Plus, Brain, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockProducts, calculateRisk, Product } from "@/lib/mockData";

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    quantity: "",
    purchasePrice: "",
    lastSaleDate: undefined as Date | undefined,
    storageCost: "",
  });
  const [analysisLoading, setAnalysisLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["Electronics", "Clothing", "Books", "Others"];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.quantity || !newProduct.purchasePrice) {
      return;
    }

    const daysSinceLastSale = newProduct.lastSaleDate 
      ? Math.floor((new Date().getTime() - newProduct.lastSaleDate.getTime()) / (1000 * 3600 * 24))
      : 0;

    const product: Product = {
      id: products.length + 1,
      name: newProduct.name,
      category: newProduct.category,
      quantity: parseInt(newProduct.quantity),
      purchasePrice: parseFloat(newProduct.purchasePrice),
      lastSaleDate: newProduct.lastSaleDate ? format(newProduct.lastSaleDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      storageCost: parseFloat(newProduct.storageCost) || 0,
      riskLevel: "Low",
      daysSinceLastSale,
    };

    const risk = calculateRisk(product);
    product.riskLevel = risk.level;
    product.confidence = risk.confidence;

    setProducts([...products, product]);
    setNewProduct({
      name: "",
      category: "",
      quantity: "",
      purchasePrice: "",
      lastSaleDate: undefined,
      storageCost: "",
    });
  };

  const handleAnalyzeRisk = async (productId: number) => {
    setAnalysisLoading(productId);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          const risk = calculateRisk(product);
          return {
            ...product,
            riskLevel: risk.level,
            confidence: risk.confidence,
          };
        }
        return product;
      })
    );
    
    setAnalysisLoading(null);
  };

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Add products and analyze dead stock risks</p>
        </div>
      </div>

      {/* Add Product Form */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-primary" />
            <span>Add New Product</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
              <Input
                id="purchasePrice"
                type="number"
                placeholder="0"
                value={newProduct.purchasePrice}
                onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Last Sale Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newProduct.lastSaleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newProduct.lastSaleDate ? format(newProduct.lastSaleDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newProduct.lastSaleDate}
                    onSelect={(date) => setNewProduct({ ...newProduct, lastSaleDate: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storageCost">Storage Cost/Month (₹)</Label>
              <Input
                id="storageCost"
                type="number"
                placeholder="0"
                value={newProduct.storageCost}
                onChange={(e) => setNewProduct({ ...newProduct, storageCost: e.target.value })}
              />
            </div>
            
            <div className="flex items-end space-x-2 md:col-span-2">
              <Button onClick={handleAddProduct} className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Inventory</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Days Since Sale</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{formatCurrency(product.purchasePrice)}</TableCell>
                  <TableCell>{formatCurrency(product.purchasePrice * product.quantity)}</TableCell>
                  <TableCell>{product.daysSinceLastSale}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(product.riskLevel)}>
                      {product.riskLevel}
                      {product.confidence && (
                        <span className="ml-1 text-xs opacity-75">
                          ({product.confidence}%)
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAnalyzeRisk(product.id)}
                      disabled={analysisLoading === product.id}
                      className="text-xs"
                    >
                      {analysisLoading === product.id ? (
                        <>
                          <div className="animate-spin mr-2 h-3 w-3 border-2 border-primary border-r-transparent rounded-full" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-1 h-3 w-3" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}