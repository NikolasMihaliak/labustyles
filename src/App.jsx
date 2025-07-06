import { useState, useEffect, useRef } from 'react';
import { products as mockProducts, categories } from './data/products';
import ProductCard from './components/ProductCard';
import HeroBanner from './components/HeroBanner';
import { apiService, transformAliExpressProduct } from './services/api';
import './App.css';
import './custom.css';

const NAV = [
  { name: 'Home', id: 'home', icon: '🏠' },
  { name: 'Shop', id: 'shop', icon: '🛍️' },
  { name: 'Cart', id: 'cart', icon: '🛒' },
  { name: 'Wishlist', id: 'wishlist', icon: '❤️' },
  { name: 'Account', id: 'account', icon: '👤' },
];

function SearchModal({ isOpen, onClose, onSearch }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch(query);
              onClose();
            }
          }}
          className="input-field search-modal-input"
        />
        <button
          className="btn-search-modern"
          onClick={() => {
            onSearch(query);
            onClose();
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}

function SearchResults({
  query,
  onAddToCart,
  onAddToWishlist,
  wishlistItems,
  onBack,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        const result = await apiService.searchProducts(query, 1, 20);
        if (result.products && result.products.length > 0) {
          const transformedResults = result.products.map(
            transformAliExpressProduct
          );
          setSearchResults(transformedResults);
        } else {
          // Fallback to mock products search
          const mockResults = mockProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(query.toLowerCase()) ||
              product.description.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(mockResults);
        }
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to mock products search
        const mockResults = mockProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(mockResults);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [query]);

  const results = searchResults;
  return (
    <div className="container-responsive py-8 px-4 md:px-8">
      <button
        className="featured-card-btn search-back-btn"
        style={{
          opacity: 1,
          pointerEvents: 'auto',
          marginTop: 32,
          marginBottom: 24,
          fontSize: '1.08rem',
          fontWeight: 700,
          padding: '12px 32px',
          boxShadow: '0 2px 8px rgba(79,140,255,0.10)',
          background: '#fff',
          color: '#111',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.18s, color 0.18s',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
        }}
        onClick={onBack}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#111';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.color = '#111';
        }}
      >
        <span style={{ fontSize: '1.2em', marginRight: 8 }}>&larr;</span> Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="text-lg">Searching...</div>
        </div>
      ) : results.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              isInWishlist={wishlistItems.includes(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar({ current, setCurrent, cartCount, onOpenSearch }) {
  return (
    <header className="main-navbar">
      <div className="main-navbar-top">
        <div className="nav-left">
          <button
            className="nav-hamburger"
            aria-label="Menu"
            onClick={() => setCurrent('home')}
          >
            ☰
          </button>
          <div className="nav-logo">LabuStyles</div>
        </div>
        <nav className="nav-menu">
          <button
            className={`nav-link ${current === 'home' ? 'active' : ''}`}
            onClick={() => setCurrent('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${current === 'shop' ? 'active' : ''}`}
            onClick={() => setCurrent('shop')}
          >
            Shop
          </button>
          <button
            className={`nav-link ${current === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrent('cart')}
          >
            Cart
          </button>
          <button
            className={`nav-link ${current === 'account' ? 'active' : ''}`}
            onClick={() => setCurrent('account')}
          >
            Account
          </button>
        </nav>
        <div className="nav-actions">
          <button
            className="nav-icon"
            aria-label="Search"
            onClick={onOpenSearch}
          >
            🔍
          </button>
          <button className="nav-icon nav-cart nav-cart-fun" aria-label="Cart">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ verticalAlign: 'middle' }}
            >
              <rect
                x="3"
                y="6"
                width="18"
                height="13"
                rx="3"
                fill="#7dd3fc"
                stroke="#2563eb"
                strokeWidth="2"
              />
              <circle
                cx="8.5"
                cy="19.5"
                r="1.5"
                fill="#fbbf24"
                stroke="#f59e42"
                strokeWidth="1"
              />
              <circle
                cx="15.5"
                cy="19.5"
                r="1.5"
                fill="#fbbf24"
                stroke="#f59e42"
                strokeWidth="1"
              />
              <path
                d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V6"
                stroke="#2563eb"
                strokeWidth="2"
              />
              <path
                d="M7 10h10"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function HorizontalProductSection({
  title,
  products,
  onAddToCart,
  onAddToWishlist,
  wishlistItems,
}) {
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const pageCount = Math.ceil(products.length / pageSize);
  const paginated = products.slice(page * pageSize, (page + 1) * pageSize);

  // Helper to generate page numbers with ellipsis if needed
  function getPageNumbers() {
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i);
    if (page <= 2) return [0, 1, 2, '...', pageCount - 1];
    if (page >= pageCount - 3)
      return [0, '...', pageCount - 3, pageCount - 2, pageCount - 1];
    return [0, '...', page - 1, page, page + 1, '...', pageCount - 1];
  }

  return (
    <div className="product-section">
      <div className="product-section-title">{title}</div>
      <div className="product-grid">
        {paginated.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            isInWishlist={wishlistItems.includes(product.id)}
          />
        ))}
      </div>
      {pageCount > 1 && (
        <div className="pagination-bar">
          <button
            className="page-arrow-sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            aria-label="Previous page"
            disabled={page === 0}
          >
            &#8592;
          </button>
          {getPageNumbers().map((num, idx) =>
            num === '...' ? (
              <span key={idx} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={num}
                className={`pagination-page${page === num ? ' active' : ''}`}
                onClick={() => setPage(num)}
              >
                {num + 1}
              </button>
            )
          )}
          <button
            className="page-arrow-sm"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            aria-label="Next page"
            disabled={page === pageCount - 1}
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
}

function Home({ onAddToCart, onAddToWishlist, wishlistItems }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [aliExpressProducts, setAliExpressProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch AliExpress products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Check if backend is available
        const isBackendHealthy = await apiService.healthCheck();

        if (isBackendHealthy) {
          // Fetch products from AliExpress API
          const result = await apiService.getProductsByCategory(
            'fashion',
            1,
            20
          );
          if (result.products && result.products.length > 0) {
            const transformedProducts = result.products.map(
              transformAliExpressProduct
            );
            setAliExpressProducts(transformedProducts);
          } else {
            // Fallback to mock products if no AliExpress products found
            setAliExpressProducts(mockProducts);
          }
        } else {
          // Fallback to mock products if backend is not available
          setAliExpressProducts(mockProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        // Fallback to mock products
        setAliExpressProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = aliExpressProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason =
      selectedSeason === 'all' || product.season === selectedSeason;
    return matchesSearch && matchesSeason;
  });

  const getProductsByCategory = (category) => {
    return aliExpressProducts
      .filter((product) => product.category === category)
      .slice(0, 10);
  };

  const featuredProducts = aliExpressProducts
    .filter((p) => p.rating >= 4.5)
    .slice(0, 10);
  const newArrivals = aliExpressProducts.slice(-10);
  const bestSellers = aliExpressProducts
    .filter((p) => p.reviewCount > 200)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />
      {/* Main Content */}
      <div className="container-responsive py-8 space-y-16 px-4 md:px-8">
        {/* Featured Marketing Cards */}
        <div className="featured-cards-row">
          <div className="featured-card gradient-bestsellers">
            <div className="featured-card-overlay">
              <div className="featured-card-title">Bestsellers</div>
              <div className="featured-card-desc">
                Fan-Favorite Sneakers, Flats, and Slip-Ons
              </div>
              <button
                className="featured-card-btn"
                onClick={() => {
                  const el = document.getElementById('shop-section');
                  if (el)
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
          <div className="featured-card gradient-newarrivals">
            <div className="featured-card-overlay">
              <div className="featured-card-title">New Arrivals</div>
              <div className="featured-card-desc">
                The Latest Styles & Limited-Edition Colors
              </div>
              <button
                className="featured-card-btn"
                onClick={() => {
                  const el = document.getElementById('shop-section');
                  if (el)
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
          <div className="featured-card gradient-summer">
            <div className="featured-card-overlay">
              <div className="featured-card-title">Summer Essentials</div>
              <div className="featured-card-desc">
                Breezy Shoes For Warmer Days
              </div>
              <button
                className="featured-card-btn"
                onClick={() => {
                  const el = document.getElementById('shop-section');
                  if (el)
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
        {/* Season Filter Buttons */}
        <div
          id="shop-section"
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          {['All', 'Spring', 'Summer', 'Fall', 'Winter', 'Luxury'].map(
            (season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season.toLowerCase())}
                className={`season-btn ${season.toLowerCase()}${
                  selectedSeason === season.toLowerCase() ? ' active' : ''
                }`}
              >
                {season}
              </button>
            )
          )}
        </div>
        {/* Products Section */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg">Loading products...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <div className="text-lg">{error}</div>
          </div>
        ) : selectedSeason === 'all' ? (
          <div>
            <HorizontalProductSection
              title="All Outfits"
              products={aliExpressProducts}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              wishlistItems={wishlistItems}
            />
          </div>
        ) : (
          <div>
            <HorizontalProductSection
              title={`${
                selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)
              } Outfits`}
              products={aliExpressProducts.filter(
                (p) => p.season === selectedSeason
              )}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              wishlistItems={wishlistItems}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Shop({ onAddToCart, onAddToWishlist, wishlistItems }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSeason =
      selectedSeason === 'all' || product.season === selectedSeason;
    return matchesSearch && matchesCategory && matchesSeason;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">Discover our complete collection</p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Season Filter */}
            <div className="flex-1">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="input-field"
              >
                {['Spring', 'Summer', 'Fall', 'Winter', 'Luxury', 'All'].map(
                  (season) => (
                    <option key={season} value={season.toLowerCase()}>
                      {season}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                isInWishlist={wishlistItems.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-description">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSeason('all');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'card',
  });
  const [orderStatus, setOrderStatus] = useState(null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setOrderStatus('processing');

    try {
      // Create order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        customer: checkoutForm,
        total: total,
        shippingAddress: {
          firstName: checkoutForm.firstName,
          lastName: checkoutForm.lastName,
          address: checkoutForm.address,
          city: checkoutForm.city,
          state: checkoutForm.state,
          zipCode: checkoutForm.zipCode,
          country: checkoutForm.country,
          phone: checkoutForm.phone,
        },
      };

      // Call backend to place order
      const response = await fetch(
        'https://labustyles.onrender.com/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();

      if (result.success) {
        setOrderStatus('success');
        // Clear cart after successful order
        onClearCart();
      } else {
        setOrderStatus('error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setOrderStatus('error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="empty-state-title">Your cart is empty</h2>
          <p className="empty-state-description">
            Start shopping to add items to your cart
          </p>
          <button onClick={() => setCurrent('home')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h2 className="empty-state-title">Order Placed Successfully!</h2>
          <p className="empty-state-description">
            Thank you for your order. We'll process it and ship it to you soon.
          </p>
          <button onClick={() => setCurrent('home')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={onClearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Cart Items
            </h2>
            {cartItems.map((item) => (
              <div key={item.id} className="card p-6">
                <div className="flex items-center gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-primary-blue font-bold text-lg">
                      ${item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Form */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Checkout Information
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={checkoutForm.firstName}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        firstName: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={checkoutForm.lastName}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        lastName: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, email: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={checkoutForm.phone}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={checkoutForm.address}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      address: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={checkoutForm.city}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, city: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={checkoutForm.state}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        state: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={checkoutForm.zipCode}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        zipCode: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Subtotal:
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-600">Free</span>
              </div>
              <div className="flex justify-between items-center mb-6 border-t border-gray-200 pt-4">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-primary-blue">
                  ${total.toFixed(2)}
                </span>
              </div>

              {orderStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  There was an error processing your order. Please try again.
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={
                  isCheckingOut ||
                  !checkoutForm.firstName ||
                  !checkoutForm.lastName ||
                  !checkoutForm.email ||
                  !checkoutForm.address
                }
                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Processing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Account() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        'https://labustyles.onrender.com/api/admin/orders'
      );
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Orders
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg">Loading orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">No orders yet</div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order {order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Customer
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.customer.firstName} {order.customer.lastName}
                        <br />
                        {order.customer.email}
                        <br />
                        {order.customer.phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipCode}
                        <br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            Product ID: {item.productId} (Qty: {item.quantity})
                          </span>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        AliExpress Orders
                      </h4>
                      <div className="text-sm text-gray-600">
                        {order.aliexpressOrders.length > 0 ? (
                          order.aliexpressOrders.map(
                            (aliexpressOrder, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    aliexpressOrder.status === 'placed'
                                      ? 'bg-green-500'
                                      : aliexpressOrder.status === 'failed'
                                      ? 'bg-red-500'
                                      : 'bg-gray-500'
                                  }`}
                                ></span>
                                <span>
                                  Product {aliexpressOrder.productId}:{' '}
                                  {aliexpressOrder.status}
                                  {aliexpressOrder.aliexpressOrderId &&
                                    ` (ID: ${aliexpressOrder.aliexpressOrderId})`}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <span>No AliExpress orders placed</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-blue">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchPageQuery, setSearchPageQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('spring');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async (category) => {
    setLoading(true);
    try {
      const result = await apiService.getProductsByCategory(category);
      setProducts(result.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const result = await apiService.searchProducts(searchQuery);
      setProducts(result.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-container">
      <Navbar
        current={current}
        setCurrent={setCurrent}
        cartCount={cartItems.length}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(q) => {
          setSearchPageQuery(q);
          setShowSearchResults(true);
        }}
      />
      {showSearchResults ? (
        <SearchResults
          query={searchPageQuery}
          onAddToCart={() => {}}
          onAddToWishlist={() => {}}
          wishlistItems={[]}
          onBack={() => setShowSearchResults(false)}
        />
      ) : (
        <>
          {current === 'home' && (
            <Home
              onAddToCart={() => {}}
              onAddToWishlist={() => {}}
              wishlistItems={[]}
            />
          )}
          {current === 'shop' && (
            <Shop
              onAddToCart={() => {}}
              onAddToWishlist={() => {}}
              wishlistItems={[]}
            />
          )}
          {current === 'cart' && (
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={(id, quantity) => {
                setCartItems((prev) =>
                  prev.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                  )
                );
              }}
              onRemoveItem={(id) => {
                setCartItems((prev) => prev.filter((item) => item.id !== id));
              }}
              onClearCart={() => {
                setCartItems([]);
              }}
            />
          )}
          {current === 'account' && <Account />}
        </>
      )}
    </div>
  );
}
