export interface RewardCatalogItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  icon: string;
}

export const rewardsProfile = {
  memberName: "Restaurant Gold Member",
  tier: "Gold",
  points: 1480,
};

export const rewardPerks = [
  {
    title: "Free chai after 1500 points",
    copy: "A near-term unlock positioned to keep weekly customers engaged.",
    icon: "coffee-outline" as const,
  },
  {
    title: "Double points on seafood",
    copy: "Pushes higher-ticket orders without cluttering the main menu screen.",
    icon: "fish" as const,
  },
  {
    title: "Birthday dessert reward",
    copy: "Keeps the reward screen personal instead of purely transactional.",
    icon: "cake-variant-outline" as const,
  },
];

export const rewardGoals = [
  { label: "Reach 1500 points", progress: 92 },
  { label: "Unlock Platinum tier", progress: 68 },
  { label: "Earn one free appetizer", progress: 54 },
];

export const rewardCatalogSeed: RewardCatalogItem[] = [
  {
    id: "reward-chai",
    title: "Free Chai",
    description: "Redeem for one hot chai with your next order.",
    pointsCost: 60,
    category: "Drinks",
    icon: "coffee-outline",
  },
  {
    id: "reward-lime-soda",
    title: "Free Lime Soda",
    description: "Cool down with a sparkling lime soda.",
    pointsCost: 90,
    category: "Drinks",
    icon: "cup-water",
  },
  {
    id: "reward-falooda",
    title: "Free Falooda",
    description: "Use points for a sweet falooda treat.",
    pointsCost: 140,
    category: "Drinks",
    icon: "glass-cocktail",
  },
  {
    id: "reward-cutlet",
    title: "Free Beef Cutlet",
    description: "Redeem for a complimentary beef cutlet.",
    pointsCost: 180,
    category: "Snacks",
    icon: "food-steak",
  },
  {
    id: "reward-idli",
    title: "Free Idli Sambar",
    description: "Claim an idli sambar appetizer on us.",
    pointsCost: 220,
    category: "Food",
    icon: "silverware-fork-knife",
  },
];


