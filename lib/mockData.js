// Sample data for the SplitEase application
export const members = [
  { id: "user-1", name: "Alex", avatarUrl: "/placeholder.svg?height=40&width=40" },
  { id: "user-2", name: "Jamie", avatarUrl: "/placeholder.svg?height=40&width=40" },
  { id: "user-3", name: "Taylor", avatarUrl: "/placeholder.svg?height=40&width=40" },
  { id: "user-4", name: "Jordan", avatarUrl: "/placeholder.svg?height=40&width=40" },
];

export const receipts = [
  {
    id: "rec-1",
    vendor: "Grocery Store",
    date: "2025-04-15",
    total: 24.99,
    items: [
      { id: "item-1", description: "Milk", amount: 4.99 },
      { id: "item-2", description: "Bread", amount: 3.49 },
      { id: "item-3", description: "Eggs", amount: 5.99 },
      { id: "item-4", description: "Cheese", amount: 6.49 },
      { id: "item-5", description: "Apples", amount: 4.03 },
    ],
    allocations: {
      "item-1": ["user-1", "user-2"],
      "item-2": ["user-1", "user-3"],
      "item-3": ["user-2"],
      "item-4": ["user-3", "user-4"],
      "item-5": ["user-1", "user-2", "user-3", "user-4"],
    },
  },
  {
    id: "rec-2",
    vendor: "Restaurant",
    date: "2025-04-14",
    total: 45.5,
    items: [
      { id: "item-6", description: "Dinner", amount: 35.5 },
      { id: "item-7", description: "Drinks", amount: 10.0 },
    ],
    allocations: {
      "item-6": ["user-1", "user-2", "user-3", "user-4"],
      "item-7": ["user-1", "user-2", "user-3"],
    },
  },
  {
    id: "rec-3",
    vendor: "Gas Station",
    date: "2025-04-13",
    total: 35.75,
    items: [{ id: "item-8", description: "Fuel", amount: 35.75 }],
    allocations: {
      "item-8": ["user-1", "user-4"],
    },
  },
  {
    id: "rec-4",
    vendor: "Pharmacy",
    date: "2025-04-10",
    total: 12.99,
    items: [
      { id: "item-9", description: "Medicine", amount: 8.99 },
      { id: "item-10", description: "Toiletries", amount: 4.00 },
    ],
    allocations: {
      "item-9": ["user-3"],
      "item-10": ["user-2", "user-3"],
    },
  },
  {
    id: "rec-5",
    vendor: "Coffee Shop",
    date: "2025-04-08",
    total: 18.75,
    items: [
      { id: "item-11", description: "Coffee", amount: 5.25 },
      { id: "item-12", description: "Sandwich", amount: 8.50 },
      { id: "item-13", description: "Pastry", amount: 5.00 },
    ],
    allocations: {
      "item-11": ["user-1"],
      "item-12": ["user-3"],
      "item-13": ["user-2"],
    },
  },
];

// Add a delay to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export async function getReceipts() {
  await delay(800); // Simulate network delay
  return [...receipts];
}

export async function getReceipt(id) {
  await delay(600);
  const receipt = receipts.find(r => r.id === id);
  if (!receipt) {
    throw new Error(`Receipt with ID ${id} not found`);
  }
  return { ...receipt };
}

export async function uploadReceipt(file) {
  await delay(1500); // Longer delay to simulate processing
  
  // Create a new receipt with a unique ID
  const newReceipt = {
    id: `rec-${receipts.length + 1}`,
    vendor: "New Vendor",
    date: new Date().toISOString().split('T')[0],
    total: 0,
    items: [],
    allocations: {},
  };
  
  // In a real app, we would process the file to extract data
  // For now, we'll just return the new receipt
  receipts.push(newReceipt);
  
  return newReceipt;
}

export async function updateReceipt(id, data) {
  await delay(700);
  
  const receiptIndex = receipts.findIndex(r => r.id === id);
  if (receiptIndex === -1) {
    throw new Error(`Receipt with ID ${id} not found`);
  }
  
  // Update the receipt with the new data
  receipts[receiptIndex] = {
    ...receipts[receiptIndex],
    ...data,
  };
  
  return receipts[receiptIndex];
}

export async function allocateItems(id, allocations) {
  await delay(900);
  
  const receiptIndex = receipts.findIndex(r => r.id === id);
  if (receiptIndex === -1) {
    throw new Error(`Receipt with ID ${id} not found`);
  }
  
  // Update the allocations
  receipts[receiptIndex].allocations = allocations;
  
  return receipts[receiptIndex];
} 