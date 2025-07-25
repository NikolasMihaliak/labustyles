# 🛍️ Labubu Fashion Dropshipping App

A modern, responsive dropshipping web application built with React and Tailwind CSS, featuring trendy Labubu-inspired fashion products.

## ✨ Features

### 🛒 **Shopping Experience**
- **Product Catalog**: 15+ trendy fashion items across multiple categories
- **Smart Search**: Search by product name and description
- **Category Filtering**: Filter by Streetwear, Accessories, Summer, Winter, etc.
- **Sort Options**: Sort by price, rating, and newest items

### 🛍️ **Shopping Cart**
- Add/remove items with quantity management
- Real-time total calculation
- Clear cart functionality
- Persistent cart state

### ❤️ **Wishlist**
- Save favorite products
- Quick add to cart from wishlist
- Remove items easily

### 📱 **Modern UI**
- Responsive design for all devices
- Hover effects and smooth animations
- Professional, clean interface
- Cart/wishlist counters in navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dropshippingapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Product Categories

### Streetwear
- Labubu Street Style Hoodie ($29.99)
- Labubu Cargo Pants Set ($34.99)
- Labubu Oversized T-Shirt ($19.99)

### Accessories
- Labubu Bucket Hat ($15.99)
- Labubu Crossbody Bag ($24.99)
- Labubu Chunky Sneakers ($39.99)

### Seasonal Collections
- **Summer**: Dresses, Bikinis, Beach Wear
- **Winter**: Sweaters, Puffer Jackets, Cozy Items

### Jewelry & Small Items
- Layered Necklace Sets ($12.99)
- Hoop Earrings ($8.99)

### Activewear & Loungewear
- Yoga Sets ($28.99)
- Sports Bras ($16.99)
- Loungewear Sets ($31.99)

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite 4.5.0
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Icons**: Emoji icons (lightweight)

## 📁 Project Structure

```
src/
├── components/
│   └── ProductCard.jsx          # Reusable product card component
├── data/
│   └── products.js              # Product catalog and mock data
├── App.jsx                      # Main application component
├── main.jsx                     # Application entry point
└── index.css                    # Global styles and Tailwind imports
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Manual Build
```bash
npm run build
```
The built files will be in the `dist/` directory.

## 🎨 Customization

### Adding Products
Edit `src/data/products.js` to add new products:

```javascript
{
  id: 16,
  name: "New Product Name",
  price: 25.99,
  originalPrice: 39.99,
  image: "https://your-image-url.com/image.jpg",
  rating: 4.5,
  reviews: 123,
  category: "Streetwear",
  description: "Product description here",
  inStock: true,
  tags: ["tag1", "tag2"]
}
```

### Styling
- Modify Tailwind classes in components
- Update `tailwind.config.js` for custom theme
- Add custom CSS in `src/index.css`

### Features
- Add authentication in `src/components/`
- Implement payment processing
- Add order management system
- Connect to real product APIs

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📈 Next Steps

### Phase 1: Core Features ✅
- [x] Product catalog
- [x] Shopping cart
- [x] Wishlist
- [x] Search and filtering

### Phase 2: Enhanced Features
- [ ] User authentication
- [ ] Order management
- [ ] Payment integration (Stripe/PayPal)
- [ ] Product reviews and ratings
- [ ] Admin dashboard

### Phase 3: Advanced Features
- [ ] Real-time inventory
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

---

**Built with ❤️ for the Labubu Fashion Community**
#   l a b u s t y l e s  
 