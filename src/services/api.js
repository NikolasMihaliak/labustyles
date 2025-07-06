// API service for LabuStyles AliExpress integration

const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your deployed backend URL

export const apiService = {
  // Get all categories
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      return data.success ? data.categories : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get products by category
  async getProductsByCategory(category, page = 1, pageSize = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/category/${category}?page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      return data.success ? data : { products: [], total: 0, page, pageSize };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return { products: [], total: 0, page, pageSize };
    }
  },

  // Search products by keywords
  async searchProducts(query, page = 1, pageSize = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/search?q=${encodeURIComponent(
          query
        )}&page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      return data.success ? data : { products: [], total: 0, page, pageSize };
    } catch (error) {
      console.error('Error searching products:', error);
      return { products: [], total: 0, page, pageSize };
    }
  },

  // Get product details
  async getProductDetails(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      const data = await response.json();
      return data.success ? data.product : null;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  },

  // Place order
  async placeOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      return data.success ? data.order : null;
    } catch (error) {
      console.error('Error placing order:', error);
      return null;
    }
  },

  // Get order status
  async getOrderStatus(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      const data = await response.json();
      return data.success ? data.order : null;
    } catch (error) {
      console.error('Error fetching order status:', error);
      return null;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  },
};

// Helper function to transform AliExpress product data to match your product card format
export const transformAliExpressProduct = (aliexpressProduct) => {
  return {
    id: aliexpressProduct.product_id || aliexpressProduct.id,
    name: aliexpressProduct.product_title || aliexpressProduct.title,
    price: parseFloat(
      aliexpressProduct.sale_price || aliexpressProduct.price || 0
    ),
    oldPrice: parseFloat(aliexpressProduct.original_price || 0),
    image: aliexpressProduct.product_main_image || aliexpressProduct.image,
    images: aliexpressProduct.product_images || [aliexpressProduct.image],
    description:
      aliexpressProduct.product_description || aliexpressProduct.description,
    category: aliexpressProduct.category_name || 'Fashion',
    season: determineSeason(aliexpressProduct.product_title || ''),
    rating: parseFloat(aliexpressProduct.evaluate_rate || 4.5),
    reviewCount: parseInt(aliexpressProduct.evaluate_count || 0),
    discount: calculateDiscount(
      aliexpressProduct.original_price,
      aliexpressProduct.sale_price
    ),
    inStock: true,
    aliExpressId: aliexpressProduct.product_id || aliexpressProduct.id,
  };
};

// Helper function to determine season based on product title/keywords
const determineSeason = (title) => {
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.includes('spring') ||
    lowerTitle.includes('floral') ||
    lowerTitle.includes('pastel')
  ) {
    return 'spring';
  } else if (
    lowerTitle.includes('summer') ||
    lowerTitle.includes('tank') ||
    lowerTitle.includes('shorts') ||
    lowerTitle.includes('swim')
  ) {
    return 'summer';
  } else if (
    lowerTitle.includes('fall') ||
    lowerTitle.includes('autumn') ||
    lowerTitle.includes('sweater') ||
    lowerTitle.includes('earth')
  ) {
    return 'fall';
  } else if (
    lowerTitle.includes('winter') ||
    lowerTitle.includes('coat') ||
    lowerTitle.includes('scarf') ||
    lowerTitle.includes('dark')
  ) {
    return 'winter';
  } else if (
    lowerTitle.includes('louis vuitton') ||
    lowerTitle.includes('prada') ||
    lowerTitle.includes('gucci') ||
    lowerTitle.includes('chanel')
  ) {
    return 'luxury';
  }
  return 'fashion';
};

// Helper function to calculate discount percentage
const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};
