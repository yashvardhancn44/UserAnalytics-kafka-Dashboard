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
  // const productsTest = [
  //   { id: 1, name: "Product 1", buyClicks: 5, views: 30 },
  //   { id: 2, name: "Product 2", buyClicks: 2, views: 50 },
  //   { id: 3, name: "Product 3", buyClicks: 5, views: 30 },
  //   { id: 4, name: "Product 4", buyClicks: 2, views: 50 },
  //   { id: 5, name: "Product 5", buyClicks: 5, views: 30 },
  //   { id: 6, name: "Product 6", buyClicks: 2, views: 50 },
  // ];

  const [products, setProducts] = useState([]);

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
    <div>
      <h1>Product Dashboard</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={products}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis label="ProductId" dataKey="productId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="buyClicks" fill="red" />
          <Bar dataKey="views" fill="blue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default App;
