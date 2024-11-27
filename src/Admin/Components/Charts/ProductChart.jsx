import { Container } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
const RADIAN = Math.PI / 175;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const ProductChart = ({ products, review, cart, paymentData }) => {
  console.log(products);
  const productData = [
    {
      name: "Hand Bag",
      Quantity: products.filter((prod) => prod.categoryName === "handbag")[0]
        ?.products.length,
    },
    {
      name: "Suitcase",
      Quantity: products.filter((prod) => prod.categoryName === "suitcase")[0]
        ?.products.length,
    },
    {
      name: "Backpack",
      Quantity: products.filter((prod) => prod.categoryName === "backpack")[0]
        ?.products.length,
    },
    {
      name: "Accessory",
      Quantity: products.filter((prod) => prod.categoryName === "accessory")[0]
        ?.products.length,
    },
  ];
  const reviewData = [
    {
      name: "One ⭐",
      Reviews: review.filter((prod) => Math.round(prod.rate) === 1).length,
    },
    {
      name: "Two ⭐",
      Reviews: review.filter((prod) => Math.round(prod.rate) === 2).length,
    },
    {
      name: "Three ⭐",
      Reviews: review.filter((prod) => Math.round(prod.rate) === 3).length,
    },
    {
      name: "Four ⭐",
      Reviews: review.filter((prod) => Math.round(prod.rate) === 4).length,
    },
    {
      name: "Five ⭐",
      Reviews: review.filter((prod) => Math.round(prod.rate) === 5).length,
    },
  ];

  const cartData = [
    {
      name: "Hand Bag",
      "Quantity in cart": cart.filter(
        (prod) => prod.product?.category?.categoryName === "handbag"
      ).length,
    },
    {
      name: "Suitcase",
      "Quantity in cart": cart.filter(
        (prod) => prod.product?.category?.categoryName === "suitcase"
      ).length,
    },
    {
      name: "Backpack",
      "Quantity in cart": cart.filter(
        (prod) => prod.product?.category?.categoryName === "backpack"
      ).length,
    },
    {
      name: "Accessory",
      "Quantity in cart": cart.filter(
        (prod) => prod.product?.category?.categoryName === "accessory"
      ).length,
    },
  ];
  const groupedData = paymentData
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .reduce((acc, item) => {
      const month = item.createdAt.substr(0, 7);
      const index = acc.findIndex((el) => el.month === month);
      if (index !== -1 && item.status === "PAID") {
        acc[index].totalAmount += item.totalDue;
      } else {
        acc.push({ month: month, totalAmount: item.totalDue });
      }
      return acc;
    }, []);
  console.log(cart);
  const formatXAxis = (tickItem) => {
    return new Date(tickItem).toLocaleString("default", { month: "short" });
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <>
      <Container sx={{ marginTop: 5 }}>
        <h3 style={{ textAlign: "center", margin: "30px 0", color: "#9932CC" }}>
          Payment
        </h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart
              data={groupedData}
              margin={{
                top: 10,
                right: 30,
                left: 15,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={formatXAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalAmount"
                tickFormatter={formatXAxis}
                stroke="#9932CC"
                activeDot={{ r: 8 }}
                fill="#9932CC"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <h3 style={{ textAlign: "center", margin: "20px 0", color: "#8884d8" }}>
          Products
        </h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart width={150} height={40} data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Quantity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <h3 style={{ textAlign: "center", margin: "15px 0", color: "#17becf" }}>
          Users Cart
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 15,
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ color: "#00C49F" }}>Hand Bag</h3>
          <h2 style={{ color: "#00C49F" }}>&#9632;</h2>
          <h3 style={{ color: "#0088FE" }}>Suitcase</h3>
          <h2 style={{ color: "#0088FE" }}>&#9632;</h2>
          <h3 style={{ color: "#FF8042" }}>Backpack</h3>
          <h2 style={{ color: "#FF8042" }}>&#9632;</h2>
          <h3 style={{ color: "#FFBB28" }}>Accessory</h3>
          <h2 style={{ color: "#FFBB28" }}>&#9632;</h2>
        </div>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip />
              <Pie
                data={cartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150}
                fill="#8884d8"
                dataKey="Quantity in cart"
              >
                <Tooltip />
                {cartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <h3 style={{ textAlign: "center", margin: "30px 0", color: "#83a6ed" }}>
          Reviews
        </h3>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart width={730} height={250} data={reviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Reviews" fill="#83a6ed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Container>
    </>
  );
};

export default ProductChart;
