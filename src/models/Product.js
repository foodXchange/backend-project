// src/models/Product.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    index: true
  },
  
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  
  sku: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
    uppercase: true
  },
  
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Categorization
  category: {
    type: String,
    required: [true, 'Product category is required'],
    lowercase: true,
    enum: {
      values: ['grains', 'dairy', 'meat', 'seafood', 'produce', 'processed', 'beverages', 'spices', 'oils', 'nuts', 'dried-fruits', 'sweeteners', 'other'],
      message: '{VALUE} is not a valid category'
    },
    index: true
  },
  
  subcategory: {
    type: String,
    lowercase: true,
    index: true
  },
  
  tags: [{
    type: String,
    lowercase: true
  }],
  
  // Supplier Information
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Supplier is required'],
    index: true
  },
  
  // Product Specifications
  specifications: {
    // Physical Characteristics
    physical: {
      weight: {
        value: Number,
        unit: {
          type: String,
          enum: ['g', 'kg', 'ton', 'lb', 'oz'],
          default: 'kg'
        }
      },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
          type: String,
          enum: ['cm', 'm', 'inch', 'ft'],
          default: 'cm'
        }
      },
      color: String,
      texture: String,
      appearance: String
    },
    
    // Origin Information
    origin: {
      country: {
        type: String,
        required: true,
        uppercase: true
      },
      region: String,
      harvestDate: Date,
      harvestSeason: {
        type: String,
        enum: ['spring', 'summer', 'fall', 'winter', 'year-round']
      }
    },
    
    // Quality Specifications
    quality: {
      grade: {
        type: String,
        enum: ['premium', 'grade-a', 'grade-b', 'standard', 'economy']
      },
      moisture: {
        value: Number,
        unit: { type: String, default: '%' }
      },
      purity: {
        value: Number,
        unit: { type: String, default: '%' }
      },
      foreignMatter: {
        value: Number,
        unit: { type: String, default: '%' }
      },
      brokenPieces: {
        value: Number,
        unit: { type: String, default: '%' }
      }
    },
    
    // Storage Requirements
    storage: {
      temperature: {
        min: Number,
        max: Number,
        unit: {
          type: String,
          enum: ['C', 'F'],
          default: 'C'
        }
      },
      humidity: {
        min: Number,
        max: Number,
        unit: { type: String, default: '%' }
      },
      conditions: [String], // e.g., ['dry', 'cool', 'dark', 'ventilated']
      shelfLife: {
        value: Number,
        unit: {
          type: String,
          enum: ['days', 'weeks', 'months', 'years']
        }
      }
    },
    
    // Processing Information
    processing: {
      method: [String], // e.g., ['sun-dried', 'freeze-dried', 'roasted']
      additives: [String],
      preservatives: [String],
      processingDate: Date
    }
  },
  
  // Nutritional Information
  nutritionalInfo: {
    servingSize: {
      value: Number,
      unit: String
    },
    calories: Number,
    protein: {
      value: Number,
      unit: { type: String, default: 'g' }
    },
    carbohydrates: {
      value: Number,
      unit: { type: String, default: 'g' }
    },
    fat: {
      total: { value: Number, unit: { type: String, default: 'g' } },
      saturated: { value: Number, unit: { type: String, default: 'g' } },
      trans: { value: Number, unit: { type: String, default: 'g' } }
    },
    fiber: {
      value: Number,
      unit: { type: String, default: 'g' }
    },
    sugar: {
      value: Number,
      unit: { type: String, default: 'g' }
    },
    sodium: {
      value: Number,
      unit: { type: String, default: 'mg' }
    },
    vitamins: [{
      name: String,
      value: Number,
      unit: String,
      dailyValue: Number // percentage
    }],
    minerals: [{
      name: String,
      value: Number,
      unit: String,
      dailyValue: Number // percentage
    }]
  },
  
  // Certifications & Compliance
  certifications: [{
    type: {
      type: String,
      enum: ['organic', 'fair-trade', 'halal', 'kosher', 'non-gmo', 'brc', 'sqf', 'haccp', 'iso22000', 'fda', 'usda', 'eu-organic', 'rainforest-alliance', 'utz'],
      required: true
    },
    certifier: String,
    certificateNumber: String,
    validFrom: Date,
    validUntil: Date,
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Allergen Information
  allergens: {
    contains: [{
      type: String,
      enum: ['milk', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy', 'sesame', 'mustard', 'celery', 'lupin', 'molluscs']
    }],
    mayContain: [{
      type: String,
      enum: ['milk', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy', 'sesame', 'mustard', 'celery', 'lupin', 'molluscs']
    }],
    free: [{
      type: String,
      enum: ['gluten-free', 'dairy-free', 'nut-free', 'soy-free', 'egg-free', 'vegan', 'vegetarian']
    }]
  },
  
  // Packaging Information
  packaging: {
    type: {
      type: String,
      enum: ['bulk', 'bag', 'box', 'bottle', 'can', 'jar', 'pouch', 'drum', 'container', 'pallet']
    },
    material: [String], // e.g., ['plastic', 'paper', 'glass']
    sizes: [{
      weight: {
        value: Number,
        unit: String
      },
      unitsPerPackage: Number,
      packagesPerCase: Number,
      casesPerPallet: Number,
      price: {
        value: Number,
        currency: { type: String, default: 'USD' }
      }
    }],
    customPackaging: {
      available: { type: Boolean, default: false },
      minimumOrder: Number,
      options: [String]
    }
  },
  
  // Pricing Information
  pricing: {
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    basePrice: {
      value: { type: Number, required: true },
      unit: { type: String, required: true }, // e.g., 'per kg', 'per ton'
    },
    tiers: [{
      minQuantity: { type: Number, required: true },
      maxQuantity: Number,
      price: { type: Number, required: true },
      unit: String
    }],
    negotiable: {
      type: Boolean,
      default: true
    },
    validUntil: Date,
    includedInPrice: [String], // e.g., ['packaging', 'labeling']
    additionalCosts: [{
      type: {
        type: String,
        enum: ['packaging', 'labeling', 'certification', 'testing', 'other']
      },
      description: String,
      cost: Number
    }]
  },
  
  // Availability & Inventory
  availability: {
    status: {
      type: String,
      enum: ['in-stock', 'limited-stock', 'out-of-stock', 'pre-order', 'seasonal'],
      default: 'in-stock'
    },
    quantity: {
      available: Number,
      unit: String,
      lastUpdated: Date
    },
    leadTime: {
      value: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months']
      }
    },
    minimumOrder: {
      value: { type: Number, required: true },
      unit: { type: String, required: true }
    },
    maximumOrder: {
      value: Number,
      unit: String
    },
    seasonality: {
      available: { type: Boolean, default: false },
      months: [{
        type: Number,
        min: 1,
        max: 12
      }]
    }
  },
  
  // Shipping & Logistics
  shipping: {
    methods: [{
      type: String,
      enum: ['sea', 'air', 'road', 'rail', 'multimodal']
    }],
    incoterms: [{
      type: String,
      enum: ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']
    }],
    ports: {
      loading: [String],
      discharge: [String]
    },
    estimatedTransitTime: {
      domestic: { min: Number, max: Number, unit: String },
      international: { min: Number, max: Number, unit: String }
    },
    restrictions: [String], // e.g., ['no air freight', 'refrigerated only']
  },
  
  // Media
  images: [{
    url: { type: String, required: true },
    alt: String,
    isPrimary: { type: Boolean, default: false },
    order: Number
  }],
  
  videos: [{
    url: String,
    title: String,
    description: String,
    thumbnail: String
  }],
  
  documents: [{
    type: {
      type: String,
      enum: ['datasheet', 'certificate', 'test-report', 'msds', 'specification', 'brochure']
    },
    title: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Lab Test Results
  labTests: [{
    testType: String,
    laboratory: String,
    testDate: Date,
    reportNumber: String,
    results: mongoose.Schema.Types.Mixed,
    documentUrl: String,
    validUntil: Date
  }],
  
  // Trading Information
  hsCode: {
    type: String,
    match: [/^\d{6,10}$/, 'Invalid HS Code format']
  },
  
  exportRestrictions: [{
    country: String,
    reason: String
  }],
  
  importRequirements: [{
    country: String,
    requirements: [String]
  }],
  
  // Sample Information
  samples: {
    available: { type: Boolean, default: false },
    freeQuantity: {
      value: Number,
      unit: String
    },
    shippingCost: {
      domestic: Number,
      international: Number,
      currency: { type: String, default: 'USD' }
    },
    preparationTime: Number // in days
  },
  
  // Performance Metrics
  metrics: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    rating: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 }
    },
    conversionRate: { type: Number, default: 0 }
  },
  
  // Reviews
  reviews: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    title: String,
    comment: String,
    verifiedPurchase: { type: Boolean, default: false },
    helpful: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 }
    },
    images: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  
  // SEO
  seo: {
    metaTitle: {
      type: String,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    keywords: [String]
  },
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'inactive', 'discontinued'],
    default: 'draft'
  },
  
  visibility: {
    type: String,
    enum: ['public', 'private', 'verified-only'],
    default: 'public'
  },
  
  featured: {
    type: Boolean,
    default: false
  },
  
  featuredUntil: Date,
  
  // Verification
  verified: {
    status: { type: Boolean, default: false },
    date: Date,
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  },
  
  // Audit Fields
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  deletedAt: Date,
  
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ supplier: 1, category: 1 });
productSchema.index({ 'pricing.basePrice.value': 1 });
productSchema.index({ 'availability.status': 1 });
productSchema.index({ 'specifications.origin.country': 1 });
productSchema.index({ status: 1, isActive: 1 });
productSchema.index({ featured: 1, featuredUntil: 1 });
productSchema.index({ createdAt: -1 });

// Compound indexes for common queries
productSchema.index({ category: 1, status: 1, isActive: 1 });
productSchema.index({ supplier: 1, status: 1, isActive: 1 });

// Virtual for full image URL
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Pre-save middleware
productSchema.pre('save', async function(next) {
  // Generate slug from name
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
    
    // Ensure unique slug
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const productsWithSlug = await this.constructor.find({ slug: slugRegEx });
    
    if (productsWithSlug.length) {
      this.slug = `${this.slug}-${productsWithSlug.length + 1}`;
    }
  }
  
  // Generate SKU if not provided
  if (!this.sku && this.isNew) {
    const prefix = this.category.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.sku = `${prefix}-${random}`;
  }
  
  // Update metrics
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.metrics.rating.average = totalRating / this.reviews.length;
    this.metrics.rating.count = this.reviews.length;
  }
  
  next();
});

// Instance methods
productSchema.methods.incrementView = async function() {
  this.metrics.views += 1;
  return this.save();
};

productSchema.methods.incrementInquiry = async function() {
  this.metrics.inquiries += 1;
  return this.save();
};

productSchema.methods.calculateConversionRate = function() {
  if (this.metrics.views === 0) return 0;
  return (this.metrics.orders / this.metrics.views) * 100;
};

productSchema.methods.isAvailable = function(quantity) {
  if (this.availability.status === 'out-of-stock') return false;
  if (!quantity) return true;
  return this.availability.quantity.available >= quantity;
};

productSchema.methods.getPriceForQuantity = function(quantity) {
  if (!this.pricing.tiers || this.pricing.tiers.length === 0) {
    return this.pricing.basePrice.value;
  }
  
  const applicableTier = this.pricing.tiers
    .filter(tier => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity))
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];
  
  return applicableTier ? applicableTier.price : this.pricing.basePrice.value;
};

productSchema.methods.addReview = async function(reviewData) {
  this.reviews.push(reviewData);
  
  // Update rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.metrics.rating.average = totalRating / this.reviews.length;
  this.metrics.rating.count = this.reviews.length;
  
  return this.save();
};

productSchema.methods.updateInventory = async function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.availability.quantity.available -= quantity;
  } else {
    this.availability.quantity.available += quantity;
  }
  
  // Update status based on quantity
  if (this.availability.quantity.available <= 0) {
    this.availability.status = 'out-of-stock';
  } else if (this.availability.quantity.available < 10) {
    this.availability.status = 'limited-stock';
  } else {
    this.availability.status = 'in-stock';
  }
  
  this.availability.quantity.lastUpdated = new Date();
  return this.save();
};

// Static methods
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'active', isActive: true });
};

productSchema.statics.findBySupplier = function(supplierId) {
  return this.find({ supplier: supplierId, status: 'active', isActive: true });
};

productSchema.statics.searchProducts = async function(query) {
  const searchCriteria = {
    $text: { $search: query },
    status: 'active',
    isActive: true
  };
  
  return this.find(searchCriteria)
    .select({ score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

productSchema.statics.getFeaturedProducts = function() {
  return this.find({
    featured: true,
    featuredUntil: { $gte: new Date() },
    status: 'active',
    isActive: true
  }).limit(10);
};

productSchema.statics.getPopularProducts = function(limit = 10) {
  return this.find({ status: 'active', isActive: true })
    .sort({ 'metrics.orders': -1, 'metrics.views': -1 })
    .limit(limit);
};

// Soft delete
productSchema.methods.softDelete = function() {
  this.isActive = false;
  this.deletedAt = new Date();
  return this.save();
};

// Export the model
module.exports = mongoose.model('Product', productSchema);

// ===================================
// src/models/index.js - UPDATE THIS FILE
// ===================================
const User = require('./User');
const Project = require('./Project');
const Proposal = require('./Proposal');
const Notification = require('./notification');
const Product = require('./Product');

module.exports = {
  User,
  Project,
  Proposal,
  Notification,
  Product
};

// ===================================
// src/controllers/productController.js - NEW FILE
// ===================================
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

class ProductController {
  // Get all products with filters
  async getProducts(req, res) {
    try {
      const {
        category,
        subcategory,
        supplier,
        minPrice,
        maxPrice,
        certifications,
        country,
        status = 'active',
        search,
        sort = '-createdAt',
        page = 1,
        limit = 20
      } = req.query;

      const query = { isActive: true };
      
      if (status !== 'all') query.status = status;
      if (category) query.category = category;
      if (subcategory) query.subcategory = subcategory;
      if (supplier) query.supplier = supplier;
      
      if (minPrice || maxPrice) {
        query['pricing.basePrice.value'] = {};
        if (minPrice) query['pricing.basePrice.value']['$gte'] = Number(minPrice);
        if (maxPrice) query['pricing.basePrice.value']['$lte'] = Number(maxPrice);
      }
      
      if (certifications) {
        const certArray = Array.isArray(certifications) ? certifications : [certifications];
        query['certifications.type'] = { $in: certArray };
      }
      
      if (country) query['specifications.origin.country'] = country.toUpperCase();
      
      if (search) {
        query.$text = { $search: search };
      }

      const products = await Product.find(query)
        .populate('supplier', 'companyName country isVerified')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Product.countDocuments(query);

      res.json({
        success: true,
        count: products.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      });
    }
  }

  // Get single product
  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id)
        .populate('supplier', 'companyName country email phoneNumber isVerified');

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Increment view count
      await product.incrementView();

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching product'
      });
    }
  }

  // Create product (Vendors only)
  async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const productData = {
        ...req.body,
        supplier: req.user._id
      };

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  }

  // Update product
  async updateProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check ownership
      if (product.supplier.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this product'
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body, lastModifiedBy: req.user._id },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating product'
      });
    }
  }

  // Delete product (soft delete)
  async deleteProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check ownership
      if (product.supplier.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this product'
        });
      }

      await product.softDelete();

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting product'
      });
    }
  }

  // Add review
  async addReview(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if user has already reviewed
      const existingReview = product.reviews.find(
        review => review.reviewer.toString() === req.user._id.toString()
      );

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this product'
        });
      }

      const reviewData = {
        reviewer: req.user._id,
        ...req.body
      };

      await product.addReview(reviewData);

      res.json({
        success: true,
        message: 'Review added successfully',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding review'
      });
    }
  }

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const products = await Product.getFeaturedProducts();

      res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching featured products'
      });
    }
  }

  // Get popular products
  async getPopularProducts(req, res) {
    try {
      const { limit = 10 } = req.query;
      const products = await Product.getPopularProducts(Number(limit));

      res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching popular products'
      });
    }
  }

  // Update inventory
  async updateInventory(req, res) {
    try {
      const { quantity, operation } = req.body;
      const product = await Product.findById(req.params.id);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check ownership
      if (product.supplier.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update inventory'
        });
      }

      await product.updateInventory(quantity, operation);

      res.json({
        success: true,
        message: 'Inventory updated successfully',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating inventory'
      });
    }
  }

  // Get price for quantity
  async getPriceQuote(req, res) {
    try {
      const { quantity } = req.query;
      const product = await Product.findById(req.params.id);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const price = product.getPriceForQuantity(Number(quantity));
      const isAvailable = product.isAvailable(Number(quantity));

      res.json({
        success: true,
        data: {
          productId: product._id,
          quantity: Number(quantity),
          unitPrice: price,
          totalPrice: price * Number(quantity),
          currency: product.pricing.currency,
          isAvailable,
          minimumOrder: product.availability.minimumOrder
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error calculating price'
      });
    }
  }
}

module.exports = new ProductController();

// ===================================
// src/routes/products.js - NEW FILE
// ===================================
const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const productController = require('../controllers/productController');
const { uploadMultiple } = require('../middleware/upload');
const { validateProduct, validateReview } = require('../middleware/validation');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/:id', productController.getProduct);
router.get('/:id/price-quote', productController.getPriceQuote);

// Protected routes
router.use(auth); // All routes below require authentication

// Vendor routes
router.post('/', 
  authorize(['vendor', 'admin']), 
  validateProduct,
  uploadMultiple('images', 10),
  productController.createProduct
);

router.put('/:id', 
  authorize(['vendor', 'admin']), 
  productController.updateProduct
);

router.delete('/:id', 
  authorize(['vendor', 'admin']), 
  productController.deleteProduct
);

router.put('/:id/inventory', 
  authorize(['vendor', 'admin']), 
  productController.updateInventory
);

// Buyer routes
router.post('/:id/reviews', 
  authorize(['buyer']), 
  validateReview,
  productController.addReview
);

module.exports = router;