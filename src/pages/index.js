import React from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
} from "antd";
import { observer } from "mobx-react";
import { useCartStore } from "../stores/CartStore"; // Updated import

import lp from "../../public/localStorage.json";

const { Meta } = Card;
const { Option } = Select;

const Home = ({ products = [] }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const [cartSummaryVisible, setCartSummaryVisible] = React.useState(false);

  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const showModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const showCartSummary = () => {
    setCartSummaryVisible(true);
  };

  const closeCartSummary = () => {
    setCartSummaryVisible(false);
  };

  const cartStore = useCartStore(); // Updated usage

  const handleFormSubmit = (values) => {
    if (selectedProduct) {
      cartStore.addCartItem({
        product: selectedProduct,
        passenger: values,
      });
    }
    closeModal();
  };

  const calculateTotalPrice = () => {
    const ticketPrice = 1200;
    const totalPrice = cartStore.cart.length * ticketPrice;
    return totalPrice;
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {products.map((product, index) => (
        <Card
          key={index}
          hoverable
          style={{ width: 300, margin: "16px" }}
          cover={<img alt={product.name} src={product.image} />}
        >
          <Meta title={product.name} description={product.description} />
          <Button type="primary" onClick={() => showModal(product)}>
            Add to Cart
          </Button>
        </Card>
      ))}

      <Space direction="vertical" style={{ margin: "16px" }}>
        <Button type="primary" onClick={showCartSummary}>
          View Cart Summary
        </Button>
      </Space>

      <Modal
        title="Passenger Information"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={closeModal}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item name="travelDate" label="Travel Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="nationality" label="Nationality">
            <Input />
          </Form.Item>
          <Form.Item name="passport" label="Passport Number">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cart Summary"
        open={cartSummaryVisible}
        onOk={closeCartSummary}
        onCancel={closeCartSummary}
      >
        <h3>Items in the Cart:</h3>
        {cartStore.cart.map((item, index) => (
          <div key={index}>
            <strong>{item.product.name}</strong>
            <p>Passenger: {item.passenger.name}</p>
            <p>Email: {item.passenger.email}</p>
            <p>Travel Date: {item.passenger.travelDate.toString()}</p>
          </div>
        ))}
        <h3>Total Price:</h3>
        <p>Rs. {calculateTotalPrice()}</p>
      </Modal>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/himanshu7377/products_data/main/products.json"
    );

    if (response.ok) {
      const products = await response.json();
      return {
        props: {
          products,
        },
        revalidate: 10,
      };
    } else {
      console.error(
        "Failed to fetch data:",
        response.status,
        response.statusText
      );
      return {
        props: {
          products: [],
        },
        revalidate: 10,
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        products: [],
      },
      revalidate: 10,
    };
  }
}

export default observer(Home);
