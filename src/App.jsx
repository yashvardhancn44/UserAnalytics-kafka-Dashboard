import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";

const App = () => {
  const productsTest = [
    { id: 1, name: "Product 1", buyClicks: 5, views: 30 },
    { id: 2, name: "Product 2", buyClicks: 2, views: 50 },
    { id: 3, name: "Product 3", buyClicks: 5, views: 30 },
    { id: 4, name: "Product 4", buyClicks: 2, views: 50 },
    { id: 5, name: "Product 5", buyClicks: 5, views: 30 },
    { id: 6, name: "Product 6", buyClicks: 2, views: 50 },
    { id: 7, name: "Product 1", buyClicks: 5, views: 30 },
    { id: 8, name: "Product 2", buyClicks: 2, views: 50 },
    { id: 9, name: "Product 3", buyClicks: 5, views: 30 },
    { id: 10, name: "Product 4", buyClicks: 2, views: 50 },
    // { id: 11, name: "Product 5", buyClicks: 5, views: 30 },
    // { id: 12, name: "Product 6", buyClicks: 2, views: 50 },
    // { id: 13, name: "Product 1", buyClicks: 5, views: 30 },
    // { id: 14, name: "Product 2", buyClicks: 2, views: 50 },
    // { id: 15, name: "Product 3", buyClicks: 5, views: 30 },
    // { id: 16, name: "Product 4", buyClicks: 2, views: 50 },
    // { id: 17, name: "Product 5", buyClicks: 5, views: 30 },
    // { id: 18, name: "Product 6", buyClicks: 2, views: 50 },
  ];

  const [products, setProducts] = useState([]);

  const refreshHandler = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to reset products.");
      }

      const data = await response.json();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchData();

    const socket = new WebSocket("ws://localhost:8080");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data) {
        const updateProduct = (prevProducts, updatedProduct) => {
          return prevProducts.map((prod) =>
            prod.productId === updatedProduct.productId ? updatedProduct : prod
          );
        };

        setProducts((prevProducts) => updateProduct(prevProducts, data));
      }
    };

    return () => {
      console.log("Closing Dashboard");
      socket.close();
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Real-Time User Interation Analytics</h1>
      <div className="paragraph-class">
        When you mousehover on a product for more than 3 sec, it is considered
        as a view. when you click on the buy button, it is considered as a buy.
        The project gives insights on the views over a product vis-a-vis buys,
        giving insights to business to make decisions on devising strategies to
        increase buying behaviour of customers.
      </div>
      <button className="refresh-button" onClick={refreshHandler}>
        Reset views and clicks
      </button>
      <div className="chart-card">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={products}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              label={{
                value: "Product ID",
                position: "insideBottomRight",
                offset: -5,
              }}
              dataKey="productId"
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
              }}
            />
            <Legend verticalAlign="top" align="right" />
            <Bar dataKey="buyClicks" fill="#ff6f61" />
            <Bar dataKey="views" fill="#4a90e2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default App;
