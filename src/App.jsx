import { useState, useEffect, useRef } from 'react';
import { products as mockProducts, categories } from './data/products';
import ProductCard from './components/ProductCard';
import HeroBanner from './components/HeroBanner';
import { apiService, transformAliExpressProduct } from './services/api';

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

function Navbar({ cartCount, onOpenSearch }) {
  return (
    <header className="main-navbar">
      <div className="main-navbar-top">
        <div className="nav-left">
          <button className="nav-hamburger" aria-label="Menu">
            ☰
          </button>
        </div>
        <div className="nav-logo">LabuStyles</div>
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
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={onClearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4 mb-8">
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

        {/* Checkout Section */}
        <div className="card p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900">Total:</span>
            <span className="text-3xl font-bold text-primary-blue">
              ${total.toFixed(2)}
            </span>
          </div>
          <button className="w-full btn-primary py-4 text-lg">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function Account() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account</h1>
        <div className="card p-8">
          <p className="text-gray-600 text-center">
            Account management coming soon...
          </p>
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

  const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
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
          onAddToCart={addToCart}
          onAddToWishlist={() => {}}
          wishlistItems={[]}
          onBack={() => setShowSearchResults(false)}
        />
      ) : (
        <>
          {current === 'home' && (
            <Home
              onAddToCart={addToCart}
              onAddToWishlist={() => {}}
              wishlistItems={[]}
            />
          )}
          {current === 'shop' && (
            <Shop
              onAddToCart={addToCart}
              onAddToWishlist={() => {}}
              wishlistItems={[]}
            />
          )}
          {current === 'cart' && (
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
            />
          )}
          {current === 'account' && <Account />}
        </>
      )}
    </div>
  );
}
