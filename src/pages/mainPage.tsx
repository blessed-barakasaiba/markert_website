import { useEffect, useState } from "react";
import { addComment, product } from "../api/product";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { ShoppingCart, Upload, LogOut, MessageCircle, Plus, Minus, X, Heart } from "lucide-react";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const [cart, setcart] = useState([]);
  const totalPrice = cart.reduce((acc, item) => acc + Number(item.price), 0);
  const [comments, setComments] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    setisLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await product();
        setProducts(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setisLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sendComment = async (productId) => {
    const comment = comments[productId];
    if (!comment || comment.trim() === "") {
      alert("Please enter a comment");
      return;
    }
    try {
      const res = await addComment({ comment: comment, product: productId });
      console.log(res.data);
      setComments((prev) => ({ ...prev, [productId]: "" }));
      alert("Comment added successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to add comment");
    }
  };

  const addTocart = (product) => {
    setcart((prevCart) => {
      const exists = prevCart.some((p) => p.id === product.id);
      if (exists) return prevCart;
      return [...prevCart, product];
    });
  };

  const removeFromCart = (id) => {
    setcart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setcart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleCommentChange = (productId, value) => {
    setComments(prev => ({ ...prev, [productId]: value }));
  };

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Modern Navigation Header */}
      <nav className="fixed w-full top-0 left-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopHub
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/uploadproduct" 
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Upload Product</span>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Discover Amazing Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our curated collection of premium products
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                >
                  {/* Product Image with Overlay */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={`http://127.0.0.1:8000${product.product_image}`} 
                      alt={product.product_name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-md"
                    >
                      <Heart 
                        size={20} 
                        className={`${favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors duration-300`}
                      />
                    </button>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full font-semibold shadow-lg">
                      ${product.price}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {product.product_name}
                    </h3>

                    {/* Comment Section */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <MessageCircle size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Add a comment</span>
                      </div>
                      
                      <div className="space-y-2">
                        <textarea
                          value={comments[product.id] || ""}
                          placeholder="Share your thoughts..."
                          onChange={(e) => handleCommentChange(product.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                          rows="2"
                        />
                        
                        <button
                          onClick={() => sendComment(product.id)}
                          disabled={!comments[product.id]?.trim()}
                          className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addTocart(product)}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Plus size={20} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600 mb-6">Be the first to upload a product!</p>
              <Link 
                to="/uploadproduct"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <Upload size={20} />
                <span>Upload Product</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Modern Cart Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <ShoppingCart size={24} />
              <span>Shopping Cart</span>
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart size={32} className="text-gray-400" />
                </div>
                <p className="text-xl text-gray-600 mb-2">Your cart is empty</p>
                <p className="text-gray-500">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`http://127.0.0.1:8000${item.product_image}`}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.product_name}</h4>
                        <p className="text-lg font-bold text-green-600">${item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for cart */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
};

export default MainPage;