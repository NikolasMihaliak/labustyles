const express = require('express');
const cors = require('cors');
const AliExpressAPI = require('./aliexpress-api');

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
  labubu: {
    keywords:
      'labubu, labubu outfit, labubu fashion, labubu clothes, labubu style',
    description: 'Exclusive Labubu brand fashion and accessories',
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

    if (!categories[category]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category',
      });
    }

    const keywords = categories[category].keywords;
    const result = await aliexpressAPI.searchProducts(
      keywords,
      '',
      parseInt(page),
      parseInt(pageSize)
    );

    res.json({
      success: true,
      category,
      products: result.products || [],
      total: result.total_results || 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (error) {
    console.error('Error searching products by category:', error);
    res.status(500).json({ success: false, error: error.message });
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
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, error: error.message });
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
