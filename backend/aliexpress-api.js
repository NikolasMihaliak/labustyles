// AliExpress API Integration for LabuStyles
// This module handles all AliExpress API interactions

const axios = require('axios');
const crypto = require('crypto');

class AliExpressAPI {
  constructor(appKey, appSecret) {
    this.appKey = appKey;
    this.appSecret = appSecret;
    this.baseURL = 'https://api.aliexpress.com/v2/';
  }

  // Generate signature for API requests
  generateSignature(params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}${params[key]}`)
      .join('');

    return crypto
      .createHmac('sha256', this.appSecret)
      .update(sortedParams)
      .digest('hex')
      .toUpperCase();
  }

  // Search for products (access_token optional)
  async searchProducts(
    keywords,
    category = '',
    page = 1,
    pageSize = 20,
    access_token = null
  ) {
    try {
      console.log('🚀 AliExpress API: Starting product search...');

      // Check if credentials are available
      if (!this.appKey || !this.appSecret) {
        console.log('❌ AliExpress API: Credentials missing');
        console.log('🔑 APP_KEY:', this.appKey ? 'Present' : 'Missing');
        console.log('🔑 APP_SECRET:', this.appSecret ? 'Present' : 'Missing');
        throw new Error('AliExpress credentials not configured');
      }

      console.log('✅ AliExpress API: Credentials found');
      console.log('🔍 Keywords:', keywords);
      console.log('📄 Page:', page);
      console.log('📊 PageSize:', pageSize);

      const params = {
        method: 'aliexpress.ds.product.search',
        app_key: this.appKey,
        timestamp: new Date().toISOString(),
        format: 'json',
        v: '2.0',
        sign_method: 'sha256',
        keywords: keywords,
        category_ids: category,
        page_no: page,
        page_size: pageSize,
        sort: 'SALE_PRICE_ASC', // Sort by price
        target_currency: 'USD',
        target_language: 'EN',
      };
      if (access_token) params.access_token = access_token;

      params.sign = this.generateSignature(params);

      console.log('🌐 AliExpress API: Making request to:', this.baseURL);
      console.log('📋 Request params:', JSON.stringify(params, null, 2));

      const response = await axios.get(this.baseURL, { params });

      console.log('📡 AliExpress API: Response received');
      console.log('📊 Response status:', response.status);
      console.log('📄 Response headers:', response.headers);

      console.log(
        '📦 AliExpress API raw response:',
        JSON.stringify(response.data, null, 2)
      );

      if (response.data.error_response) {
        console.error(
          '❌ AliExpress API error_response:',
          response.data.error_response
        );
        throw new Error(response.data.error_response.msg);
      }

      // Check if the expected response structure exists
      if (!response.data.aliexpress_ds_product_search_response) {
        console.error('❌ AliExpress API: Invalid response structure');
        console.error('Response data:', response.data);
        throw new Error('Invalid API response structure');
      }

      const result = response.data.aliexpress_ds_product_search_response.result;
      console.log('✅ AliExpress API: Successfully parsed response');
      console.log('📦 Products found:', result?.products?.length || 0);

      // Return a safe structure even if result is undefined
      return {
        products: result?.products || [],
        total_results: result?.total_results || 0,
        page_no: page,
        page_size: pageSize,
      };
    } catch (error) {
      console.error('❌ AliExpress API: Error searching products:');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }

      throw error;
    }
  }

  // Get product details (access_token optional)
  async getProductDetails(productId, access_token = null) {
    try {
      const params = {
        method: 'aliexpress.ds.product.get',
        app_key: this.appKey,
        timestamp: new Date().toISOString(),
        format: 'json',
        v: '2.0',
        sign_method: 'sha256',
        product_id: productId,
        target_currency: 'USD',
        target_language: 'EN',
      };
      if (access_token) params.access_token = access_token;

      params.sign = this.generateSignature(params);

      const response = await axios.get(this.baseURL, { params });

      if (response.data.error_response) {
        throw new Error(response.data.error_response.msg);
      }

      return response.data.aliexpress_ds_product_get_response.result;
    } catch (error) {
      console.error('Error getting product details:', error);
      throw error;
    }
  }

  // Get product images (access_token optional)
  async getProductImages(productId, access_token = null) {
    try {
      const params = {
        method: 'aliexpress.ds.product.images.get',
        app_key: this.appKey,
        timestamp: new Date().toISOString(),
        format: 'json',
        v: '2.0',
        sign_method: 'sha256',
        product_id: productId,
      };
      if (access_token) params.access_token = access_token;

      params.sign = this.generateSignature(params);

      const response = await axios.get(this.baseURL, { params });

      if (response.data.error_response) {
        throw new Error(response.data.error_response.msg);
      }

      return response.data.aliexpress_ds_product_images_get_response.result;
    } catch (error) {
      console.error('Error getting product images:', error);
      throw error;
    }
  }

  // Place order (access_token required)
  async placeOrder(orderData) {
    try {
      const params = {
        method: 'aliexpress.ds.trade.order.create',
        app_key: this.appKey,
        timestamp: new Date().toISOString(),
        format: 'json',
        v: '2.0',
        sign_method: 'sha256',
        product_id: orderData.productId,
        quantity: orderData.quantity,
        shipping_address: JSON.stringify(orderData.shippingAddress),
        buyer_message: orderData.buyerMessage || '',
        access_token: orderData.access_token,
      };

      params.sign = this.generateSignature(params);

      const response = await axios.post(this.baseURL, params);

      if (response.data.error_response) {
        throw new Error(response.data.error_response.msg);
      }

      return response.data.aliexpress_ds_trade_order_create_response.result;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  // Get order status (access_token required)
  async getOrderStatus(orderId, access_token) {
    try {
      const params = {
        method: 'aliexpress.ds.trade.order.get',
        app_key: this.appKey,
        timestamp: new Date().toISOString(),
        format: 'json',
        v: '2.0',
        sign_method: 'sha256',
        order_id: orderId,
        access_token,
      };

      params.sign = this.generateSignature(params);

      const response = await axios.get(this.baseURL, { params });

      if (response.data.error_response) {
        throw new Error(response.data.error_response.msg);
      }

      return response.data.aliexpress_ds_trade_order_get_response.result;
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  }

  // Get tracking info (access_token required)
  async getTrackingInfo(orderId, access_token) {
    try {
      const params = {
        method: 'aliexpress.ds.order.getlogisticsinfo',
        app_key: this.appKey,
        timestamp: new Date().toISOString(),
        format: 'json',
        v: '2.0',
        sign_method: 'sha256',
        order_id: orderId,
        access_token,
      };

      params.sign = this.generateSignature(params);

      const response = await axios.get(this.baseURL, { params });

      if (response.data.error_response) {
        throw new Error(response.data.error_response.msg);
      }

      return response.data.aliexpress_ds_order_getlogisticsinfo_response.result;
    } catch (error) {
      console.error('Error getting tracking info:', error);
      throw error;
    }
  }
}

// Example usage
const aliexpressAPI = new AliExpressAPI(
  process.env.ALIEXPRESS_APP_KEY,
  process.env.ALIEXPRESS_APP_SECRET
);

module.exports = AliExpressAPI;
