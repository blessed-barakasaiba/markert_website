import { useEffect, useState } from "react";
import { product } from "../api/product";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { ShoppingCart } from "lucide";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const [cart, setcart] = useState([]);
  const totalPrice = cart.reduce((acc, item) => acc + Number(item.price), 0);


  useEffect(() => {
    setisLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await product();
        setProducts(response.data);
      } catch (e) {
        console.error(e);
      }
      finally{
        setisLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addTocart = (product: any) => {
  setcart((prevCart) => {
    const exists = prevCart.some((p) => p.id === product.id);
    if (exists) return prevCart;
    return [...prevCart, product];
  });
};


  const removeFromCart = (id: number) => {
  setcart((prevCart) => prevCart.filter((item) => item.id !== id));
};



  const handleLogout = async () =>{
    await logout();
    localStorage.removeItem('token');
    navigate("/login");
  }

  useEffect(() => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    setcart(JSON.parse(savedCart));
  }
}, []);


  useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);


  return (
    <div className="bg-gray-50 pt-16">
        <div className="fixed w-full top-0 left-0 bg-gray-400 text-white flex justify-between px-4 py-2 shadow-md z-50">
            <Link to="/uploadproduct" className="text-white font-medium hover:underline">Upload Product</Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md border text-sm">Log out</button>
        </div>

        <div className="max-w-7xl m-auto px-4 md:px-6 lg:px-8">
                    <div className="">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[500px]">
                    <div className="h-10 w-10 rounded-full border-4 border-dashed border-gray-800 mx-auto animate-spin"></div>
                </div>
            ) : (
                <div className="p-8 flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product)=>(
                        <div key={product.id} className="shadow border rounded-xl ">
                            <div>
                            <img src={`http://127.0.0.1:8000${product.product_image}`} alt="" 
                            className="h-60 w-full mb-2 object-cover border p-1 rounded-md "/>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">{product.product_name}</h2>
                                <h2 className="text-gray-700">${product.price}</h2>
                                <button onClick={()=>addTocart(product)}>addTocart</button>
                            </div>

                        </div>
                    ))}
                    </div>
                </div>
            )}
            </div>

        

            <div className="">
                <div className="relative group">
                    <div  className="fixed bottom-4 right-4 rounded-full bg-gray-800 text-white z-50 shadow-lg items-center flex gap-2 cursor-pointer">
                        <p>cart <span className="text-red-600">{cart.length}</span></p>
                    </div>

                    <div className="fixed right-0 bottom-8 mb-2 hidden group-hover:block w-90 bg-white rounded-lg p-4 z-50">
                        <div className="px-4 mt-4 max-w-md mx-auto border shadow-md shadow-gray-400 bg-white rounded-md">
                            <h2 className="text-lg font-semibold mb-2">🛒 Cart Items</h2>
                        {cart.map((item)=>(
                            <div key={item.id} className="flex flex-row list-none border-b pb-2 justify-center items-center">
                                <li>{item.product_name}</li>
                                <li>{item.price}</li>
                                <img src={`http://127.0.0.1:8000${item.product_image}`} alt={product.product_name} className="h-30 w-20 object-cover border p-1 rounded" />
                                <button onClick={() => removeFromCart(item.id)}>Remove item</button>
                                <br />
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <p className="text-left font-semibold mt-4">Total: ${totalPrice.toFixed(2)}</p>
                            <button>CheckOut</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
    </div>
    </div>
  );
};

export default MainPage;
