"use client"
import { useState } from 'react';

interface StockResponse {
  [key: string]: number;
  error?: string;
}

interface ProductRecord {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

const HomePage = () => {
  const [item, setItem] = useState<string>('');
  const [stock, setStock] = useState<StockResponse | null>(null);
  const [postResponse, setPostResponse] = useState<StockResponse | null>(null);
  const [productId, setProductId] = useState<string>('');
  const [productData, setProductData] = useState<ProductRecord | null>(null);

  // Fetching stock level from `/stock_level?item=`
  const fetchStockLevel = async () => {
    if (!item) return;
    const res = await fetch(`http://127.0.0.1:8000/stock_level?item=${item}`);
    const result = await res.json();
    setStock(result);
  };

  // Posting data to `/stock_level_from_body`
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:8000/stock_level_from_body', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item }),
    });
    const result = await res.json();
    setPostResponse(result);
  };

  // Fetching product data from `/product_id?id=<id>`
  const fetchProductData = async () => {
    if (!productId) return;
    const res = await fetch(`http://127.0.0.1:8000/product_id?id=${productId}`);
    const result = await res.json();
    setProductData(result[0]); // Assuming we are getting a list and using the first record
  };

  const handleProductSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProductData();
  };

  return (
    <div>
      <h1>Next.js with FastAPI Integration</h1>

      {/* Stock Level Fetch */}
      <section>
        <h2>Check Stock Level</h2>
        <form onSubmit={(e) => { e.preventDefault(); fetchStockLevel(); }}>
          <label>
            Item:
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
            />
          </label>
          <button type="submit">Check Stock</button>
        </form>

        {stock && (
          <div>
            <h3>Stock Level</h3>
            {stock.error ? (
              <p>{stock.error}</p>
            ) : (
              <p>{item}: {stock[item]}</p>
            )}
          </div>
        )}
      </section>

      {/* Stock Level POST */}
      <section>
        <h2>Stock Level (POST)</h2>
        <form onSubmit={handlePostSubmit}>
          <label>
            Item:
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>

        {postResponse && (
          <div>
            <h3>Response</h3>
            {postResponse.error ? (
              <p>{postResponse.error}</p>
            ) : (
              <div>
                <p>{item} Stock: {postResponse[item]}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Product ID Search */}
      <section>
        <h2>Search Product by ID</h2>
        <form onSubmit={handleProductSearch}>
          <label>
            Product ID:
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
          </label>
          <button type="submit">Search</button>
        </form>

        {productData && (
          <div>
            <h3>Product Details</h3>
            <p>ID: {productData.id}</p>
            <p>Product Name: {productData.product_name}</p>
            <p>Quantity: {productData.quantity}</p>
            <p>Price: {productData.price}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
