import { prisma } from '../src/lib/prisma.ts';
import { getOrCreateCompany } from '../src/lib/company.ts';
import { LevelStandardized, Currency, TransportSource } from '@prisma/client';

const BRANDS = [
  { name: 'Google', industry: 'Technology', headquarters: 'Mountain View, CA', founded_year: 1998, headcount_range: '100,000+' },
  { name: 'Amazon', industry: 'E-Commerce & Cloud', headquarters: 'Seattle, WA', founded_year: 1994, headcount_range: '100,000+' },
  { name: 'Meta', industry: 'Social Media', headquarters: 'Menlo Park, CA', founded_year: 2004, headcount_range: '50,000-100,000' },
  { name: 'Microsoft', industry: 'Technology', headquarters: 'Redmond, WA', founded_year: 1975, headcount_range: '100,000+' },
  { name: 'Flipkart', industry: 'E-Commerce', headquarters: 'Bengaluru, India', founded_year: 2007, headcount_range: '10,000-50,000' },
  { name: 'Meesho', industry: 'E-Commerce', headquarters: 'Bengaluru, India', founded_year: 2015, headcount_range: '1,000-5,000' },
  { name: 'NVIDIA', industry: 'Semiconductors', headquarters: 'Santa Clara, CA', founded_year: 1993, headcount_range: '10,000-50,000' },
  { name: 'TCS', industry: 'IT Services', headquarters: 'Mumbai, India', founded_year: 1968, headcount_range: '100,000+' },
  { name: 'Infosys', industry: 'IT Services', headquarters: 'Bengaluru, India', founded_year: 1981, headcount_range: '100,000+' },
  { name: 'Wipro', industry: 'IT Services', headquarters: 'Bengaluru, India', founded_year: 1945, headcount_range: '100,000+' },
  { name: 'Razorpay', industry: 'Fintech', headquarters: 'Bengaluru, India', founded_year: 2014, headcount_range: '1,000-5,000' },
  { name: 'Zepto', industry: 'Quick Commerce', headquarters: 'Mumbai, India', founded_year: 2021, headcount_range: '1,000-5,000' },
];

interface SalarySeedInput {
  companyName: string;
  role: string;
  level: LevelStandardized;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: bigint;
  bonus: bigint;
  stock: bigint;
  source: TransportSource;
  confidence_score: number;
  is_verified: boolean;
}

// Generate salary seed records
const SALARY_SEEDS: SalarySeedInput[] = [
  // --- Google (5 records + Normalization checks) ---
  {
    companyName: 'Google India', // Normalization target: google
    role: 'Software Engineer',
    level: LevelStandardized.L3,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 180000000n, // ₹18,00,000 in paise
    bonus: 20000000n,       // ₹2,00,000 in paise
    stock: 30000000n,       // ₹3,00,000 in paise
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.95,
    is_verified: true,
  },
  {
    companyName: 'GOOGLE', // Normalization target: google
    role: 'Software Engineer',
    level: LevelStandardized.L4,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 280000000n, // ₹28,00,000 in paise
    bonus: 40000000n,       // ₹4,00,000 in paise
    stock: 80000000n,       // ₹8,00,000 in paise
    source: TransportSource.SCRAPED,
    confidence_score: 0.85,
    is_verified: false,
  },
  {
    companyName: 'google ', // Normalization target: google
    role: 'Senior Software Engineer',
    level: LevelStandardized.L5,
    location: 'San Francisco',
    currency: Currency.USD,
    experience_years: 6,
    base_salary: 19000000n,  // $190,000 in cents
    bonus: 3000000n,        // $30,000 in cents
    stock: 12000000n,       // $120,000 in cents
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.98,
    is_verified: true,
  },
  {
    companyName: 'Google',
    role: 'Staff Engineer',
    level: LevelStandardized.STAFF,
    location: 'San Francisco',
    currency: Currency.USD,
    experience_years: 10,
    base_salary: 25000000n,  // $250,000 in cents
    bonus: 5000000n,        // $50,000 in cents
    stock: 20000000n,       // $200,000 in cents
    source: TransportSource.AI_INFERRED,
    confidence_score: 0.70,
    is_verified: false,
  },
  {
    companyName: 'Google',
    role: 'Principal Engineer',
    level: LevelStandardized.PRINCIPAL, // Expert Principal Testing Upper Limits
    location: 'San Francisco',
    currency: Currency.USD,
    experience_years: 15,
    base_salary: 45000000n,  // $450,000 in cents
    bonus: 15000000n,       // $150,000 in cents
    stock: 85000000n,       // $850,000 in cents
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.99,
    is_verified: true,
  },

  // --- Amazon (5 records) ---
  {
    companyName: 'Amazon',
    role: 'SDE I',
    level: LevelStandardized.SDE_I,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 2,
    base_salary: 160000000n, // ₹16,00,000 in paise
    bonus: 35000000n,       // ₹3,50,000 in paise
    stock: 15000000n,       // ₹1,50,000 in paise
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.92,
    is_verified: true,
  },
  {
    companyName: 'Amazon',
    role: 'SDE II',
    level: LevelStandardized.SDE_II,
    location: 'Hyderabad',
    currency: Currency.INR,
    experience_years: 4,
    base_salary: 240000000n, // ₹24,00,000 in paise
    bonus: 0n,              // $0 Performance Bonus Testing Boundary
    stock: 50000000n,       // ₹5,00,000 in paise
    source: TransportSource.SCRAPED,
    confidence_score: 0.88,
    is_verified: false,
  },
  {
    companyName: 'Amazon',
    role: 'SDE III',
    level: LevelStandardized.SDE_III,
    location: 'Seattle',
    currency: Currency.USD,
    experience_years: 7,
    base_salary: 17000000n,  // $170,000 in cents
    bonus: 4000000n,        // $40,000 in cents
    stock: 15000000n,       // $150,000 in cents
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.96,
    is_verified: true,
  },
  {
    companyName: 'Amazon',
    role: 'Principal SDE',
    level: LevelStandardized.PRINCIPAL,
    location: 'Seattle',
    currency: Currency.USD,
    experience_years: 14,
    base_salary: 32000000n,  // $320,000 in cents
    bonus: 8000000n,        // $80,000 in cents
    stock: 45000000n,       // $450,000 in cents
    source: TransportSource.AI_INFERRED,
    confidence_score: 0.75,
    is_verified: false,
  },
  {
    companyName: 'Amazon',
    role: 'SDE I',
    level: LevelStandardized.SDE_I,
    location: 'London',
    currency: Currency.GBP,
    experience_years: 1,
    base_salary: 6500000n,   // £65,000 in pence/cents equivalent
    bonus: 500000n,         // £5,000 in pence
    stock: 800000n,         // £8,000 in pence
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.90,
    is_verified: true,
  },

  // --- Meta (5 records) ---
  {
    companyName: 'Meta',
    role: 'Software Engineer',
    level: LevelStandardized.IC4,
    location: 'Menlo Park',
    currency: Currency.USD,
    experience_years: 3,
    base_salary: 16500000n,  // $165,000 in cents
    bonus: 2400000n,        // $24,000 in cents
    stock: 0n,              // $0 Stock/Equity Testing Boundary
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.94,
    is_verified: true,
  },
  {
    companyName: 'Meta',
    role: 'Software Engineer',
    level: LevelStandardized.IC5,
    location: 'Menlo Park',
    currency: Currency.USD,
    experience_years: 5,
    base_salary: 21000000n,  // $210,000 in cents
    bonus: 3100000n,        // $31,000 in cents
    stock: 14000000n,       // $140,000 in cents
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.97,
    is_verified: true,
  },
  {
    companyName: 'Meta',
    role: 'Software Engineer',
    level: LevelStandardized.IC4,
    location: 'London',
    currency: Currency.GBP,
    experience_years: 4,
    base_salary: 9500000n,   // £95,000 in pence
    bonus: 1400000n,         // £14,000 in pence
    stock: 2500000n,         // £25,000 in pence
    source: TransportSource.SCRAPED,
    confidence_score: 0.86,
    is_verified: false,
  },
  {
    companyName: 'Meta',
    role: 'Asymmetric Growth Engineer', // Asymmetric Entry Testing Boundary
    level: LevelStandardized.IC5,
    location: 'San Francisco',
    currency: Currency.USD,
    experience_years: 6,
    base_salary: 5000000n,   // Low base pay: $50,000 in cents
    bonus: 1000000n,        // $10,000 in cents
    stock: 55000000n,       // Extremely high stock: $550,000 in cents
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.90,
    is_verified: true,
  },
  {
    companyName: 'Meta',
    role: 'Production Engineer',
    level: LevelStandardized.IC4,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 2,
    base_salary: 220000000n, // ₹22,00,000 in paise
    bonus: 33000000n,       // ₹3,30,000 in paise
    stock: 45000000n,       // ₹4,50,000 in paise
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.93,
    is_verified: true,
  },

  // --- Microsoft (5 records) ---
  {
    companyName: 'Microsoft',
    role: 'Software Engineer',
    level: LevelStandardized.SDE_I,
    location: 'Hyderabad',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 135000000n, // ₹13,50,000 in paise
    bonus: 15000000n,       // ₹1,50,000 in paise
    stock: 12000000n,       // ₹1,20,000 in paise
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.91,
    is_verified: true,
  },
  {
    companyName: 'Microsoft',
    role: 'Software Engineer II',
    level: LevelStandardized.SDE_II,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 4,
    base_salary: 210000000n, // ₹21,00,000 in paise
    bonus: 25000000n,       // ₹2,50,000 in paise
    stock: 30000000n,       // ₹3,00,000 in paise
    source: TransportSource.SCRAPED,
    confidence_score: 0.87,
    is_verified: false,
  },
  {
    companyName: 'Microsoft',
    role: 'Senior Software Engineer',
    level: LevelStandardized.SDE_III,
    location: 'Redmond',
    currency: Currency.USD,
    experience_years: 8,
    base_salary: 17500000n,  // $175,000 in cents
    bonus: 3000000n,        // $30,000 in cents
    stock: 4000000n,        // $40,000 in cents
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.95,
    is_verified: true,
  },
  {
    companyName: 'Microsoft',
    role: 'Principal Software Engineer',
    level: LevelStandardized.PRINCIPAL,
    location: 'Redmond',
    currency: Currency.USD,
    experience_years: 13,
    base_salary: 26000000n,  // $260,000 in cents
    bonus: 6000000n,        // $60,000 in cents
    stock: 15000000n,       // $150,000 in cents
    source: TransportSource.AI_INFERRED,
    confidence_score: 0.72,
    is_verified: false,
  },
  {
    companyName: 'Microsoft',
    role: 'Software Engineer II',
    location: 'Dublin',
    level: LevelStandardized.SDE_II,
    currency: Currency.EUR,
    experience_years: 5,
    base_salary: 7800000n,   // €78,00,000 in cents equivalent
    bonus: 800000n,         // €8,000 in cents
    stock: 1200000n,        // €12,000 in cents
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.89,
    is_verified: true,
  },

  // --- Flipkart (5 records) ---
  {
    companyName: 'Flipkart',
    role: 'SDE I',
    level: LevelStandardized.SDE_I,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 150000000n, // ₹15,00,000 in paise
    bonus: 15000000n,
    stock: 10000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.94,
    is_verified: true,
  },
  {
    companyName: 'Flipkart',
    role: 'SDE II',
    level: LevelStandardized.SDE_II,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 230000000n, // ₹23,00,000 in paise
    bonus: 25000000n,
    stock: 25000000n,
    source: TransportSource.SCRAPED,
    confidence_score: 0.89,
    is_verified: false,
  },
  {
    companyName: 'Flipkart',
    role: 'SDE III',
    level: LevelStandardized.SDE_III,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 6,
    base_salary: 360000000n, // ₹36,00,000 in paise
    bonus: 40000000n,
    stock: 60000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.96,
    is_verified: true,
  },
  {
    companyName: 'Flipkart',
    role: 'Staff Engineer',
    level: LevelStandardized.STAFF,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 9,
    base_salary: 500000000n, // ₹50,00,000 in paise
    bonus: 60000000n,
    stock: 120000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.93,
    is_verified: true,
  },
  {
    companyName: 'Flipkart',
    role: 'Architect',
    level: LevelStandardized.PRINCIPAL,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 14,
    base_salary: 750000000n, // ₹75,00,000 in paise
    bonus: 100000000n,
    stock: 250000000n,
    source: TransportSource.AI_INFERRED,
    confidence_score: 0.74,
    is_verified: false,
  },

  // --- Meesho (5 records) ---
  {
    companyName: 'Meesho',
    role: 'SDE I',
    level: LevelStandardized.SDE_I,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 130000000n, // ₹13,00,000 in paise
    bonus: 12000000n,
    stock: 8000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.92,
    is_verified: true,
  },
  {
    companyName: 'Meesho',
    role: 'SDE II',
    level: LevelStandardized.SDE_II,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 210000000n, // ₹21,00,000 in paise
    bonus: 20000000n,
    stock: 18000000n,
    source: TransportSource.SCRAPED,
    confidence_score: 0.88,
    is_verified: false,
  },
  {
    companyName: 'Meesho',
    role: 'SDE III',
    level: LevelStandardized.SDE_III,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 6,
    base_salary: 320000000n, // ₹32,00,000 in paise
    bonus: 35000000n,
    stock: 45000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.95,
    is_verified: true,
  },
  {
    companyName: 'Meesho',
    role: 'Tech Lead',
    level: LevelStandardized.STAFF,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 8,
    base_salary: 440000000n, // ₹44,00,000 in paise
    bonus: 50000000n,
    stock: 80000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.94,
    is_verified: true,
  },
  {
    companyName: 'Meesho',
    role: 'Engineering Manager',
    level: LevelStandardized.IC4,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 10,
    base_salary: 500000000n, // ₹50,00,000 in paise
    bonus: 70000000n,
    stock: 100000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.91,
    is_verified: true,
  },

  // --- NVIDIA (5 records) ---
  {
    companyName: 'NVIDIA',
    role: 'IC1',
    level: LevelStandardized.L3,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 170000000n, // ₹17,00,000 in paise
    bonus: 17000000n,
    stock: 25000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.93,
    is_verified: true,
  },
  {
    companyName: 'NVIDIA',
    role: 'IC2',
    level: LevelStandardized.L4,
    location: 'Pune',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 260000000n, // ₹26,00,000 in paise
    bonus: 26000000n,
    stock: 60000000n,
    source: TransportSource.SCRAPED,
    confidence_score: 0.85,
    is_verified: false,
  },
  {
    companyName: 'NVIDIA',
    role: 'IC3',
    level: LevelStandardized.L5,
    location: 'Santa Clara',
    currency: Currency.USD,
    experience_years: 5,
    base_salary: 17500000n,  // $175,000 in cents
    bonus: 2500000n,
    stock: 11000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.96,
    is_verified: true,
  },
  {
    companyName: 'NVIDIA',
    role: 'IC4',
    level: LevelStandardized.IC4,
    location: 'Santa Clara',
    currency: Currency.USD,
    experience_years: 8,
    base_salary: 22000000n,  // $220,000 in cents
    bonus: 3500000n,
    stock: 18000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.98,
    is_verified: true,
  },
  {
    companyName: 'NVIDIA',
    role: 'IC5',
    level: LevelStandardized.IC5,
    location: 'Santa Clara',
    currency: Currency.USD,
    experience_years: 12,
    base_salary: 28000000n,  // $280,000 in cents
    bonus: 5000000n,
    stock: 35000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.97,
    is_verified: true,
  },

  // --- TCS (5 records) ---
  {
    companyName: 'TCS',
    role: 'Assistant Systems Engineer',
    level: LevelStandardized.L3,
    location: 'Mumbai',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 35000000n,  // ₹3,50,000 in paise
    bonus: 2000000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.90,
    is_verified: true,
  },
  {
    companyName: 'TCS',
    role: 'Systems Engineer',
    level: LevelStandardized.L4,
    location: 'Mumbai',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 60000000n,  // ₹6,00,000 in paise
    bonus: 5000000n,
    stock: 0n,
    source: TransportSource.SCRAPED,
    confidence_score: 0.88,
    is_verified: false,
  },
  {
    companyName: 'TCS',
    role: 'IT Analyst',
    level: LevelStandardized.L5,
    location: 'Pune',
    currency: Currency.INR,
    experience_years: 6,
    base_salary: 95000000n,  // ₹9,50,000 in paise
    bonus: 8000000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.92,
    is_verified: true,
  },
  {
    companyName: 'TCS',
    role: 'Assistant Consultant',
    level: LevelStandardized.L6,
    location: 'Delhi',
    currency: Currency.INR,
    experience_years: 9,
    base_salary: 160000000n, // ₹16,00,000 in paise
    bonus: 15000000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.91,
    is_verified: true,
  },
  {
    companyName: 'TCS',
    role: 'Consultant',
    level: LevelStandardized.STAFF,
    location: 'Mumbai',
    currency: Currency.INR,
    experience_years: 12,
    base_salary: 250000000n, // ₹25,00,000 in paise
    bonus: 25000000n,
    stock: 0n,
    source: TransportSource.AI_INFERRED,
    confidence_score: 0.70,
    is_verified: false,
  },

  // --- Infosys (5 records) ---
  {
    companyName: 'Infosys',
    role: 'Systems Engineer',
    level: LevelStandardized.L3,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 36000000n,  // ₹3,60,000 in paise
    bonus: 1800000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.91,
    is_verified: true,
  },
  {
    companyName: 'Infosys',
    role: 'Senior Systems Engineer',
    level: LevelStandardized.L4,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 62000000n,  // ₹6,20,000 in paise
    bonus: 4500000n,
    stock: 0n,
    source: TransportSource.SCRAPED,
    confidence_score: 0.86,
    is_verified: false,
  },
  {
    companyName: 'Infosys',
    role: 'Technology Analyst',
    level: LevelStandardized.L5,
    location: 'Hyderabad',
    currency: Currency.INR,
    experience_years: 5,
    base_salary: 88000000n,  // ₹8,80,000 in paise
    bonus: 7000000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.93,
    is_verified: true,
  },
  {
    companyName: 'Infosys',
    role: 'Technology Lead',
    level: LevelStandardized.L6,
    location: 'Pune',
    currency: Currency.INR,
    experience_years: 8,
    base_salary: 145000000n, // ₹14,50,000 in paise
    bonus: 12000000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.90,
    is_verified: true,
  },
  {
    companyName: 'Infosys',
    role: 'Project Manager',
    level: LevelStandardized.STAFF,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 11,
    base_salary: 220000000n, // ₹22,00,000 in paise
    bonus: 20000000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.94,
    is_verified: true,
  },

  // --- Wipro (5 records) ---
  {
    companyName: 'Wipro',
    role: 'Project Engineer',
    level: LevelStandardized.L3,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 35000000n,  // ₹3,50,000 in paise
    bonus: 1500000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.90,
    is_verified: true,
  },
  {
    companyName: 'Wipro',
    role: 'Senior Project Engineer',
    level: LevelStandardized.L4,
    location: 'Hyderabad',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 58000000n,  // ₹5,80,000 in paise
    bonus: 3800000n,
    stock: 0n,
    source: TransportSource.SCRAPED,
    confidence_score: 0.85,
    is_verified: false,
  },
  {
    companyName: 'Wipro',
    role: 'Team Leader',
    level: LevelStandardized.L5,
    location: 'Pune',
    currency: Currency.INR,
    experience_years: 6,
    base_salary: 92000000n,  // ₹9,20,000 in paise
    bonus: 6500000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.92,
    is_verified: true,
  },
  {
    companyName: 'Wipro',
    role: 'Architect',
    level: LevelStandardized.L6,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 9,
    base_salary: 155000000n, // ₹15,50,000 in paise
    bonus: 11000000n,
    stock: 0n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.91,
    is_verified: true,
  },
  {
    companyName: 'Wipro',
    role: 'Consultant',
    level: LevelStandardized.STAFF,
    location: 'Delhi',
    currency: Currency.INR,
    experience_years: 12,
    base_salary: 240000000n, // ₹24,00,000 in paise
    bonus: 22000000n,
    stock: 0n,
    source: TransportSource.AI_INFERRED,
    confidence_score: 0.71,
    is_verified: false,
  },

  // --- Razorpay (5 records) ---
  {
    companyName: 'Razorpay',
    role: 'SDE I',
    level: LevelStandardized.SDE_I,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 140000000n, // ₹14,00,000 in paise
    bonus: 10000000n,
    stock: 12000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.95,
    is_verified: true,
  },
  {
    companyName: 'Razorpay',
    role: 'SDE II',
    level: LevelStandardized.SDE_II,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 220000000n, // ₹22,00,000 in paise
    bonus: 18000000n,
    stock: 22000000n,
    source: TransportSource.SCRAPED,
    confidence_score: 0.88,
    is_verified: false,
  },
  {
    companyName: 'Razorpay',
    role: 'SDE III',
    level: LevelStandardized.SDE_III,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 6,
    base_salary: 340000000n, // ₹34,00,000 in paise
    bonus: 30000000n,
    stock: 40000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.97,
    is_verified: true,
  },
  {
    companyName: 'Razorpay',
    role: 'Staff SDE',
    level: LevelStandardized.STAFF,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 9,
    base_salary: 480000000n, // ₹48,00,000 in paise
    bonus: 45000000n,
    stock: 75000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.94,
    is_verified: true,
  },
  {
    companyName: 'Razorpay',
    role: 'Principal Architect',
    level: LevelStandardized.PRINCIPAL,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 13,
    base_salary: 700000000n, // ₹70,00,000 in paise
    bonus: 80000000n,
    stock: 180000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.96,
    is_verified: true,
  },

  // --- Zepto (5 records) ---
  {
    companyName: 'Zepto',
    role: 'SDE I',
    level: LevelStandardized.SDE_I,
    location: 'Mumbai',
    currency: Currency.INR,
    experience_years: 1,
    base_salary: 120000000n, // ₹12,00,000 in paise
    bonus: 10000000n,
    stock: 10000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.93,
    is_verified: true,
  },
  {
    companyName: 'Zepto',
    role: 'SDE II',
    level: LevelStandardized.SDE_II,
    location: 'Mumbai',
    currency: Currency.INR,
    experience_years: 3,
    base_salary: 200000000n, // ₹20,00,000 in paise
    bonus: 15000000n,
    stock: 20000000n,
    source: TransportSource.SCRAPED,
    confidence_score: 0.87,
    is_verified: false,
  },
  {
    companyName: 'Zepto',
    role: 'SDE III',
    level: LevelStandardized.SDE_III,
    location: 'Bengaluru',
    currency: Currency.INR,
    experience_years: 5,
    base_salary: 300000000n, // ₹30,00,000 in paise
    bonus: 25000000n,
    stock: 45000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.96,
    is_verified: true,
  },
  {
    companyName: 'Zepto',
    role: 'Lead SDE',
    level: LevelStandardized.STAFF,
    location: 'Mumbai',
    currency: Currency.INR,
    experience_years: 8,
    base_salary: 420000000n, // ₹42,00,000 in paise
    bonus: 35000000n,
    stock: 70000000n,
    source: TransportSource.CONTRIBUTOR,
    confidence_score: 0.94,
    is_verified: true,
  },
  {
    companyName: 'Zepto',
    role: 'Principal Engineer',
    level: LevelStandardized.PRINCIPAL,
    location: 'Mumbai',
    currency: Currency.INR,
    experience_years: 12,
    base_salary: 650000000n, // ₹65,00,000 in paise
    bonus: 70000000n,
    stock: 150000000n,
    source: TransportSource.AI_INFERRED,
    confidence_score: 0.73,
    is_verified: false,
  },
];

async function main() {
  console.log('--- Cleaning Database ---');
  await prisma.salary.deleteMany({});
  await prisma.company.deleteMany({});
  console.log('Database cleaned successfully.');

  console.log('\n--- Seeding Companies and Salaries ---');

  // Let's create companies metadata map first for ease of company metadata details population
  const brandMetaMap = new Map(BRANDS.map(b => [b.name.toLowerCase(), b]));

  let successCount = 0;

  for (const seed of SALARY_SEEDS) {
    const normName = seed.companyName.toLowerCase().trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(w => !['pvt', 'ltd', 'inc', 'llc', 'co', 'com', 'india', 'usa', 'uk', 'us'].includes(w))
      .join(' ')
      .trim();

    // Find original brand metadata matching this normalized name
    const originalMeta = brandMetaMap.get(normName) || {
      name: seed.companyName.trim(),
      industry: 'Technology',
      headquarters: 'Bengaluru, India',
      founded_year: 2010,
      headcount_range: '500-1000'
    };

    // Run within transaction using getOrCreateCompany helper
    await prisma.$transaction(async (tx) => {
      const company = await getOrCreateCompany(tx, {
        name: seed.companyName,
        industry: originalMeta.industry,
        headquarters: originalMeta.headquarters,
        founded_year: originalMeta.founded_year,
        headcount_range: originalMeta.headcount_range,
      });

      const total_compensation = seed.base_salary + seed.bonus + seed.stock;

      await tx.salary.create({
        data: {
          company_id: company.id,
          role: seed.role,
          level: seed.level,
          location: seed.location,
          currency: seed.currency,
          experience_years: seed.experience_years,
          base_salary: seed.base_salary,
          bonus: seed.bonus,
          stock: seed.stock,
          total_compensation,
          source: seed.source,
          confidence_score: seed.confidence_score,
          is_verified: seed.is_verified,
        }
      });

      successCount++;
    });
  }

  console.log(`Successfully seeded ${successCount} salary records.`);

  // Validation Check on Alias Normalization
  console.log('\n--- Verifying Normalization Aliases ---');
  const googleCompany = await prisma.company.findUnique({
    where: { slug: 'google' }
  });

  if (googleCompany) {
    const googleSalaries = await prisma.salary.count({
      where: { company_id: googleCompany.id }
    });
    console.log(`Success! Company with slug 'google' resolves correctly.`);
    console.log(`Number of linked salaries for 'google': ${googleSalaries} (Expected: 5)`);
    if (googleSalaries === 5) {
      console.log('Normalization verification PASSED! "Google India", "GOOGLE", "google " all funnelled to the same company ID.');
    } else {
      console.error('Normalization verification FAILED: unexpected number of google salaries.');
    }
  } else {
    console.error('Normalization verification FAILED: Company with slug "google" not found.');
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
