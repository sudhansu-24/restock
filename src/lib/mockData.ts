export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  lastSaleDate: string;
  storageCost: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  daysSinceLastSale: number;
  confidence?: number;
}

export interface Metrics {
  totalDeadStockValue: number;
  monthlyStorageCost: number;
  potentialRecovery: number;
  profitImpact: number;
  totalProducts: number;
  atRiskProducts: number;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Samsung Galaxy S22",
    category: "Electronics",
    quantity: 45,
    purchasePrice: 50000,
    lastSaleDate: "2024-06-15",
    storageCost: 500,
    riskLevel: "High",
    daysSinceLastSale: 83,
    confidence: 87
  },
  {
    id: 2,
    name: "Nike Air Max Sneakers",
    category: "Clothing",
    quantity: 23,
    purchasePrice: 8000,
    lastSaleDate: "2024-08-20",
    storageCost: 200,
    riskLevel: "Medium",
    daysSinceLastSale: 47,
    confidence: 72
  },
  {
    id: 3,
    name: "MacBook Pro 16-inch",
    category: "Electronics",
    quantity: 8,
    purchasePrice: 180000,
    lastSaleDate: "2024-03-10",
    storageCost: 800,
    riskLevel: "Critical",
    daysSinceLastSale: 180,
    confidence: 95
  },
  {
    id: 4,
    name: "Harry Potter Book Set",
    category: "Books",
    quantity: 67,
    purchasePrice: 2500,
    lastSaleDate: "2024-09-01",
    storageCost: 100,
    riskLevel: "Low",
    daysSinceLastSale: 5,
    confidence: 65
  },
  {
    id: 5,
    name: "Wireless Headphones",
    category: "Electronics",
    quantity: 34,
    purchasePrice: 12000,
    lastSaleDate: "2024-07-10",
    storageCost: 300,
    riskLevel: "Medium",
    daysSinceLastSale: 58,
    confidence: 78
  },
  {
    id: 6,
    name: "Designer Handbag",
    category: "Clothing",
    quantity: 12,
    purchasePrice: 25000,
    lastSaleDate: "2024-05-25",
    storageCost: 400,
    riskLevel: "High",
    daysSinceLastSale: 104,
    confidence: 91
  },
  {
    id: 7,
    name: "Gaming Console",
    category: "Electronics",
    quantity: 19,
    purchasePrice: 45000,
    lastSaleDate: "2024-08-30",
    storageCost: 450,
    riskLevel: "Low",
    daysSinceLastSale: 37,
    confidence: 68
  },
  {
    id: 8,
    name: "Winter Jackets",
    category: "Clothing",
    quantity: 89,
    purchasePrice: 3500,
    lastSaleDate: "2024-04-15",
    storageCost: 150,
    riskLevel: "Critical",
    daysSinceLastSale: 144,
    confidence: 93
  }
];

export const mockMetrics: Metrics = {
  totalDeadStockValue: 2450000,
  monthlyStorageCost: 15000,
  potentialRecovery: 1800000,
  profitImpact: -450000,
  totalProducts: 297,
  atRiskProducts: 156
};

export const chartData = {
  deadStockTrends: [
    { month: "Jan", value: 1200000 },
    { month: "Feb", value: 1350000 },
    { month: "Mar", value: 1680000 },
    { month: "Apr", value: 1890000 },
    { month: "May", value: 2100000 },
    { month: "Jun", value: 2450000 },
  ],
  categoryDistribution: [
    { name: "Electronics", value: 1470000, color: "#3B82F6" },
    { name: "Clothing", value: 735000, color: "#EF4444" },
    { name: "Books", value: 147000, color: "#10B981" },
    { name: "Others", value: 98000, color: "#F59E0B" },
  ],
  monthlyCosts: [
    { month: "Jan", storage: 12000, lost: 8000 },
    { month: "Feb", storage: 13500, lost: 9200 },
    { month: "Mar", storage: 14200, lost: 11500 },
    { month: "Apr", storage: 15800, lost: 13200 },
    { month: "May", storage: 16500, lost: 15800 },
    { month: "Jun", storage: 18000, lost: 18500 },
  ]
};

export function calculateRisk(product: Partial<Product>): {
  level: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  recommendation: string;
} {
  let riskScore = 0;
  const daysSinceLastSale = product.daysSinceLastSale || 0;
  
  // Days since last sale scoring
  if (daysSinceLastSale > 120) riskScore += 40;
  else if (daysSinceLastSale > 90) riskScore += 30;
  else if (daysSinceLastSale > 60) riskScore += 20;
  else if (daysSinceLastSale > 30) riskScore += 10;
  
  // Quantity scoring
  if ((product.quantity || 0) > 50) riskScore += 25;
  else if ((product.quantity || 0) > 30) riskScore += 15;
  else if ((product.quantity || 0) > 15) riskScore += 10;
  
  // Storage cost scoring
  if ((product.storageCost || 0) > 500) riskScore += 20;
  else if ((product.storageCost || 0) > 300) riskScore += 15;
  else if ((product.storageCost || 0) > 100) riskScore += 10;
  
  // Category-based risk
  if (product.category === "Electronics") riskScore += 10;
  else if (product.category === "Clothing") riskScore += 5;
  
  let level: "Low" | "Medium" | "High" | "Critical";
  if (riskScore >= 70) level = "Critical";
  else if (riskScore >= 50) level = "High";
  else if (riskScore >= 30) level = "Medium";
  else level = "Low";
  
  const confidence = Math.min(95, 60 + riskScore);
  
  const recommendations = {
    Critical: "Immediate action required - Consider 40-50% discount or liquidation",
    High: "Apply 20-30% discount or bundle with popular items",
    Medium: "Monitor closely, consider promotional campaigns",
    Low: "Continue normal operations, review in 30 days"
  };
  
  return {
    level,
    confidence,
    recommendation: recommendations[level]
  };
}