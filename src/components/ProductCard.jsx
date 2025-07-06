import { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image];

  const discountPercentage =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIdx((idx) => (idx - 1 + images.length) % images.length);
  };
  const nextImg = (e) => {
    e.stopPropagation();
    setImgIdx((idx) => (idx + 1) % images.length);
  };

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      {/* Product Image */}
      <img
        src={images[imgIdx]}
        alt={product.name}
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: '4/3',
          objectFit: 'cover',
          borderRadius: 8,
        }}
      />
      {/* Out of Stock Badge */}
      {!product.inStock && (
        <div
          className="discount-badge"
          style={{
            background: '#f59e0b',
            position: 'absolute',
            top: 8,
            left: 8,
          }}
        >
          Out of Stock
        </div>
      )}
      {/* Image Arrows */}
      {images.length > 1 && (
        <>
          <button
            className="img-arrow left"
            onClick={prevImg}
            aria-label="Previous image"
            style={{ position: 'absolute', top: '50%', left: 8 }}
          >
            &#8592;
          </button>
          <button
            className="img-arrow right"
            onClick={nextImg}
            aria-label="Next image"
            style={{ position: 'absolute', top: '50%', right: 8 }}
          >
            &#8594;
          </button>
        </>
      )}
      {/* Product Info */}
      <div>
        {/* Product Name */}
        <div className="product-title">{product.name}</div>
        {/* Price Section */}
        <div>
          <span className="product-price">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="product-oldprice">${product.originalPrice}</span>
          )}
        </div>
        {/* Category Badge */}
        <div className="product-category">{product.category}</div>
        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product.id);
          }}
          disabled={!product.inStock}
          className="add-btn modern"
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
