const express = require('express');
const cors = require('cors');
const AliExpressAPI = require('./aliexpress-api');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AliExpress API
const aliexpressAPI = new AliExpressAPI(
  process.env.ALIEXPRESS_APP_KEY,
  process.env.ALIEXPRESS_APP_SECRET
);

// Check if AliExpress credentials are configured
const hasAliExpressCredentials = () => {
  return process.env.ALIEXPRESS_APP_KEY && process.env.ALIEXPRESS_APP_SECRET;
};

if (!hasAliExpressCredentials()) {
  console.warn(
    '⚠️  AliExpress credentials not found. Add ALIEXPRESS_APP_KEY and ALIEXPRESS_APP_SECRET environment variables.'
  );
}

// Mock product data for fallback
const mockProducts = {
  spring: [
    {
      product_id: 'mock_spring_1',
      product_title: 'Labubu Spring Floral Dress',
      sale_price: 29.99,
      original_price: 45.0,
      product_main_image:
        'https://via.placeholder.com/300x400/FFB6C1/000000?text=Spring+Dress',
      product_description:
        'Beautiful floral spring dress perfect for the season',
      category_name: 'Spring',
      evaluate_rate: 4.5,
      evaluate_count: 128,
    },
    {
      product_id: 'mock_spring_2',
      product_title: 'Labubu Pastel Cardigan',
      sale_price: 34.99,
      original_price: 52.0,
      product_main_image:
        'https://via.placeholder.com/300x400/98FB98/000000?text=Pastel+Cardigan',
      product_description: 'Soft pastel cardigan for spring days',
      category_name: 'Spring',
      evaluate_rate: 4.3,
      evaluate_count: 95,
    },
  ],
  summer: [
    {
      product_id: 'mock_summer_1',
      product_title: 'Labubu Summer Tank Top',
      sale_price: 19.99,
      original_price: 28.0,
      product_main_image:
        'https://via.placeholder.com/300x400/87CEEB/000000?text=Summer+Tank',
      product_description: 'Comfortable summer tank top',
      category_name: 'Summer',
      evaluate_rate: 4.2,
      evaluate_count: 156,
    },
    {
      product_id: 'mock_summer_2',
      product_title: 'Labubu Beach Shorts',
      sale_price: 24.99,
      original_price: 35.0,
      product_main_image:
        'https://via.placeholder.com/300x400/F0E68C/000000?text=Beach+Shorts',
      product_description: 'Stylish beach shorts for summer',
      category_name: 'Summer',
      evaluate_rate: 4.4,
      evaluate_count: 89,
    },
  ],
  fall: [
    {
      product_id: 'mock_fall_1',
      product_title: 'Labubu Fall Sweater',
      sale_price: 39.99,
      original_price: 58.0,
      product_main_image:
        'https://via.placeholder.com/300x400/D2691E/FFFFFF?text=Fall+Sweater',
      product_description: 'Cozy fall sweater in earth tones',
      category_name: 'Fall',
      evaluate_rate: 4.6,
      evaluate_count: 203,
    },
    {
      product_id: 'mock_fall_2',
      product_title: 'Labubu Autumn Jeans',
      sale_price: 44.99,
      original_price: 65.0,
      product_main_image:
        'https://via.placeholder.com/300x400/8B4513/FFFFFF?text=Autumn+Jeans',
      product_description: 'Comfortable autumn jeans',
      category_name: 'Fall',
      evaluate_rate: 4.1,
      evaluate_count: 167,
    },
  ],
  winter: [
    {
      product_id: 'mock_winter_1',
      product_title: 'Labubu Winter Coat',
      sale_price: 89.99,
      original_price: 120.0,
      product_main_image:
        'https://via.placeholder.com/300x400/2F4F4F/FFFFFF?text=Winter+Coat',
      product_description: 'Warm winter coat for cold days',
      category_name: 'Winter',
      evaluate_rate: 4.7,
      evaluate_count: 312,
    },
    {
      product_id: 'mock_winter_2',
      product_title: 'Labubu Scarf Set',
      sale_price: 29.99,
      original_price: 42.0,
      product_main_image:
        'https://via.placeholder.com/300x400/696969/FFFFFF?text=Scarf+Set',
      product_description: 'Warm scarf set for winter',
      category_name: 'Winter',
      evaluate_rate: 4.3,
      evaluate_count: 178,
    },
  ],
  fashion: [
    {
      product_id: 'mock_fashion_1',
      product_title: 'Labubu Trendy Blouse',
      sale_price: 34.99,
      original_price: 48.0,
      product_main_image:
        'https://via.placeholder.com/300x400/9370DB/FFFFFF?text=Trendy+Blouse',
      product_description: 'Trendy blouse for fashion-forward looks',
      category_name: 'Fashion',
      evaluate_rate: 4.4,
      evaluate_count: 245,
    },
    {
      product_id: 'mock_fashion_2',
      product_title: 'Labubu Stylish Pants',
      sale_price: 49.99,
      original_price: 72.0,
      product_main_image:
        'https://via.placeholder.com/300x400/20B2AA/FFFFFF?text=Stylish+Pants',
      product_description: 'Stylish pants for any occasion',
      category_name: 'Fashion',
      evaluate_rate: 4.2,
      evaluate_count: 189,
    },
  ],
  luxury: [
    {
      product_id: 'mock_luxury_1',
      product_title: 'Louis Vuitton Inspired Bag',
      sale_price: 299.99,
      original_price: 450.0,
      product_main_image:
        'https://via.placeholder.com/300x400/FFD700/000000?text=LV+Bag',
      product_description: 'Luxury inspired handbag',
      category_name: 'Luxury',
      evaluate_rate: 4.8,
      evaluate_count: 89,
    },
    {
      product_id: 'mock_luxury_2',
      product_title: 'Prada Inspired Sunglasses',
      sale_price: 199.99,
      original_price: 280.0,
      product_main_image:
        'https://via.placeholder.com/300x400/C0C0C0/000000?text=Prada+Sunglasses',
      product_description: 'Designer inspired sunglasses',
      category_name: 'Luxury',
      evaluate_rate: 4.6,
      evaluate_count: 67,
    },
  ],
};

// Product Categories for LabuStyles
const categories = {
  spring: {
    keywords:
      'labubu spring fashion, light jacket, floral dress, pastel colors, spring outfit',
    description: 'Fresh spring styles with light fabrics and pastel colors',
  },
  summer: {
    keywords:
      'labubu summer fashion, tank top, shorts, swimwear, bright colors, summer outfit',
    description:
      'Cool summer essentials with bright colors and breathable fabrics',
  },
  fall: {
    keywords: 'labubu fall fashion, sweater, jeans, earth tones, fall outfit',
    description:
      'Cozy fall collection with warm earth tones and comfortable fabrics',
  },
  winter: {
    keywords: 'labubu winter fashion, coat, scarf, dark colors, winter outfit',
    description: 'Warm winter styles with dark colors and cozy materials',
  },
  fashion: {
    keywords: 'labubu fashion, trendy, stylish, casual outfit',
    description: 'Latest fashion trends and stylish pieces',
  },
  luxury: {
    keywords:
      'louis vuitton, prada, gucci, chanel, hermes, luxury fashion, designer clothes',
    description: 'Premium designer fashion and luxury brands',
  },
};

// API Routes

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    res.json({
      success: true,
      categories: Object.keys(categories).map((key) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        description: categories[key].description,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, pageSize = 20 } = req.query;

    console.log(`🔍 API Request: /api/products/category/${category}`);
    console.log(`📊 Page: ${page}, PageSize: ${pageSize}`);

    if (!categories[category]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category',
      });
    }

    // Check if AliExpress credentials are available
    if (!hasAliExpressCredentials()) {
      console.log('❌ Using mock data - AliExpress credentials not configured');
      console.log('🔑 APP_KEY exists:', !!process.env.ALIEXPRESS_APP_KEY);
      console.log('🔑 APP_SECRET exists:', !!process.env.ALIEXPRESS_APP_SECRET);
      const mockData = mockProducts[category] || [];
      return res.json({
        success: true,
        category,
        products: mockData,
        total: mockData.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        using_mock_data: true,
      });
    }

    console.log('✅ AliExpress credentials found, attempting API call...');
    console.log(
      '🔑 APP_KEY:',
      process.env.ALIEXPRESS_APP_KEY ? 'Set' : 'Missing'
    );
    console.log(
      '🔑 APP_SECRET:',
      process.env.ALIEXPRESS_APP_SECRET ? 'Set' : 'Missing'
    );

    try {
      const keywords = categories[category].keywords;
      console.log('🔍 Searching with keywords:', keywords);

      const result = await aliexpressAPI.searchProducts(
        keywords,
        '',
        parseInt(page),
        parseInt(pageSize)
      );

      console.log('✅ AliExpress API call successful');
      console.log('📦 Products returned:', result.products?.length || 0);

      res.json({
        success: true,
        category,
        products: result.products || [],
        total: result.total_results || 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        using_mock_data: false,
      });
    } catch (apiError) {
      console.error('❌ AliExpress API error, falling back to mock data:');
      console.error('Error details:', apiError.message);
      console.error('Full error:', apiError);

      const mockData = mockProducts[category] || [];
      res.json({
        success: true,
        category,
        products: mockData,
        total: mockData.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        using_mock_data: true,
        api_error: apiError.message,
      });
    }
  } catch (error) {
    console.error('❌ Error in products endpoint:', error);
    const mockData = mockProducts[category] || [];
    res.json({
      success: true,
      category,
      products: mockData,
      total: mockData.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      using_mock_data: true,
      error: error.message,
    });
  }
});

// Search products by keywords
app.get('/api/products/search', async (req, res) => {
  try {
    const { q, page = 1, pageSize = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    // Check if AliExpress credentials are available
    if (!hasAliExpressCredentials()) {
      console.log(
        'Using mock data for search - AliExpress credentials not configured'
      );
      // Return mock data that matches the search query
      const allMockProducts = Object.values(mockProducts).flat();
      const filteredProducts = allMockProducts.filter((product) =>
        product.product_title.toLowerCase().includes(q.toLowerCase())
      );
      return res.json({
        success: true,
        query: q,
        products: filteredProducts,
        total: filteredProducts.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        using_mock_data: true,
      });
    }

    try {
      const result = await aliexpressAPI.searchProducts(
        q,
        '',
        parseInt(page),
        parseInt(pageSize)
      );

      res.json({
        success: true,
        query: q,
        products: result.products || [],
        total: result.total_results || 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        using_mock_data: false,
      });
    } catch (apiError) {
      console.error(
        'AliExpress API error, falling back to mock data:',
        apiError
      );
      const allMockProducts = Object.values(mockProducts).flat();
      const filteredProducts = allMockProducts.filter((product) =>
        product.product_title.toLowerCase().includes(q.toLowerCase())
      );
      res.json({
        success: true,
        query: q,
        products: filteredProducts,
        total: filteredProducts.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        using_mock_data: true,
        api_error: apiError.message,
      });
    }
  } catch (error) {
    console.error('Error in search endpoint:', error);
    const allMockProducts = Object.values(mockProducts).flat();
    const filteredProducts = allMockProducts.filter((product) =>
      product.product_title.toLowerCase().includes(q.toLowerCase())
    );
    res.json({
      success: true,
      query: q,
      products: filteredProducts,
      total: filteredProducts.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      using_mock_data: true,
      error: error.message,
    });
  }
});

// Get product details
app.get('/api/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const [productDetails, productImages] = await Promise.all([
      aliexpressAPI.getProductDetails(productId),
      aliexpressAPI.getProductImages(productId),
    ]);

    res.json({
      success: true,
      product: {
        ...productDetails,
        images: productImages.images || [],
      },
    });
  } catch (error) {
    console.error('Error getting product details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Place order
app.post('/api/orders', async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, buyerMessage } = req.body;

    if (!productId || !quantity || !shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const orderData = {
      productId,
      quantity: parseInt(quantity),
      shippingAddress,
      buyerMessage: buyerMessage || '',
    };

    const result = await aliexpressAPI.placeOrder(orderData);

    res.json({
      success: true,
      order: result,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order status
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await aliexpressAPI.getOrderStatus(orderId);

    res.json({
      success: true,
      order: result,
    });
  } catch (error) {
    console.error('Error getting order status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get tracking information
app.get('/api/orders/:orderId/tracking', async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await aliexpressAPI.getTrackingInfo(orderId);

    res.json({
      success: true,
      tracking: result,
    });
  } catch (error) {
    console.error('Error getting tracking info:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to get the server's public IP address
app.get('/my-ip', async (req, res) => {
  try {
    const ipRes = await axios.get('https://api.ipify.org?format=json');
    res.json({ ip: ipRes.data.ip });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch public IP' });
  }
});

// Debug endpoint to check AliExpress credentials
app.get('/debug/credentials', (req, res) => {
  res.json({
    has_app_key: !!process.env.ALIEXPRESS_APP_KEY,
    has_app_secret: !!process.env.ALIEXPRESS_APP_SECRET,
    app_key_length: process.env.ALIEXPRESS_APP_KEY
      ? process.env.ALIEXPRESS_APP_KEY.length
      : 0,
    app_secret_length: process.env.ALIEXPRESS_APP_SECRET
      ? process.env.ALIEXPRESS_APP_SECRET.length
      : 0,
    app_key_preview: process.env.ALIEXPRESS_APP_KEY
      ? `${process.env.ALIEXPRESS_APP_KEY.substring(0, 8)}...`
      : 'Not set',
    app_secret_preview: process.env.ALIEXPRESS_APP_SECRET
      ? `${process.env.ALIEXPRESS_APP_SECRET.substring(0, 8)}...`
      : 'Not set',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LabuStyles API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`LabuStyles API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
