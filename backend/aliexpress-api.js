// AliExpress API Integration for LabuStyles
// This module handles all AliExpress API interactions

const axios = require('axios');
const crypto = require('crypto');

class AliExpressAPI {
  constructor(appKey, appSecret, accessToken) {
    this.appKey = appKey;
    this.appSecret = appSecret;
    this.accessToken = accessToken;
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

  // Search for products
  async searchProducts(keywords, category = '', page = 1, pageSize = 20) {
    try {
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

      params.sign = this.generateSignature(params);

      const response = await axios.get(this.baseURL, { params });

      if (response.data.error_response) {
        throw new Error(response.data.error_response.msg);
      }

      return response.data.aliexpress_ds_product_search_response.result;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get product details
  async getProductDetails(productId) {
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

  // Get product images
  async getProductImages(productId) {
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

  // Place order
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

  // Get order status
  async getOrderStatus(orderId) {
    try {
      const params = {
        method: 'aliexpress.ds.trade.order.get',
        app_key: this.appKey,
        timestamp: new Date().toISOString(),
        format: 'json',
        v: '2.0',
        sign_method: 'sha256',
        order_id: orderId,
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

  // Get tracking information
  async getTrackingInfo(orderId) {
    try {
      const params = {
        method: 'aliexpress.ds.trade.order.tracking.get',
        app_key: this.appKey,
        timestamp: new Date().toISOString(),
        format: 'json',
        v: '2.0',
        sign_method: 'sha256',
        order_id: orderId,
      };

      params.sign = this.generateSignature(params);

      const response = await axios.get(this.baseURL, { params });

      if (response.data.error_response) {
        throw new Error(response.data.error_response.msg);
      }

      return response.data.aliexpress_ds_trade_order_tracking_get_response
        .result;
    } catch (error) {
      console.error('Error getting tracking info:', error);
      throw error;
    }
  }
}

// Example usage
const aliexpressAPI = new AliExpressAPI(
  process.env.ALIEXPRESS_APP_KEY,
  process.env.ALIEXPRESS_APP_SECRET,
  process.env.ALIEXPRESS_ACCESS_TOKEN
);

module.exports = AliExpressAPI;
