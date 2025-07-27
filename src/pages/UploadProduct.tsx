import React, { useState } from 'react'
import { uploadproduct } from '../api/product';



const UploadProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    const [formData, setFormData] = useState({
        product_name: "",
        product_image: null,
        price: "",
    });

    const handleFormDataChange = (e) => {
        const { name, value, type, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value, 
        }));
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback("");
        
        try {
            // Validate form data
            if (!formData.product_name || !formData.price || !formData.product_image) {
                setFeedback("Please fill in all fields");
                return;
            }

            const uploadData = new FormData();
            uploadData.append('product_name', formData.product_name);
            uploadData.append('price', formData.price);
            uploadData.append('product_image', formData.product_image);

            const response = await uploadproduct(uploadData);
            console.log('Upload successful:', response);
            setFeedback("Product uploaded successfully!");
            
            // Reset form
            setFormData({
                product_name: "",
                product_image: null,
                price: "",
            });
            
            // Reset file input
            const fileInput = document.getElementById('product_image');
            if (fileInput) fileInput.value = '';
            
        } catch(e: any) {
            console.error("Upload error:", e.response?.data || e.message);
            alert("Upload failed: " + JSON.stringify(e.response?.data || e.message));
            setFeedback(e.response?.data?.error || "Upload failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    } 

    return (
        <div className='bg-gray-50 min-h-screen py-8'>
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
                <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-6'>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Upload Product
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label htmlFor="product_name" className='block text-sm font-medium mb-2 text-gray-700'>
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="product_name"
                                id="product_name"
                                value={formData.product_name}
                                onChange={handleFormDataChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className='block text-sm font-medium mb-2 text-gray-700'>
                                Price ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="price"
                                id="price"
                                value={formData.price}
                                onChange={handleFormDataChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {/* Product Image */}
                        <div>
                            <label htmlFor="product_image" className='block text-sm font-medium mb-2 text-gray-700'>
                                Product Image
                            </label>
                            <input
                                type="file"
                                name="product_image"
                                id="product_image"
                                onChange={handleFormDataChange}
                                accept="image/*"
                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                required
                            />
                            {formData.product_image && (
                                <p className="mt-1 text-sm text-gray-500">
                                    Selected: {formData.product_image.name}
                                </p>
                            )}
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading} 
                            className='w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center'
                        >
                            {isLoading ? (
                                <>
                                    <div className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2'></div>
                                    Uploading...
                                </>
                            ) : (
                                'Upload Product'
                            )}
                        </button>
                    </form>

                    {feedback && (
                        <div className={`mt-4 p-4 rounded-md text-center font-medium ${
                            feedback.includes("successfully") 
                                ? "bg-green-50 text-green-800 border border-green-200" 
                                : "bg-red-50 text-red-800 border border-red-200"
                        }`}>
                            {feedback}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UploadProduct;