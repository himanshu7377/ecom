import React, { useState } from "react";
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
import { useCartStore } from "../stores/CartStore";
import styles from "../styles/Card.module.css";
import Navbar from "./Navbar";

const { Meta } = Card;
const { Option } = Select;

const Home = ({ products = [] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [passengerModalVisible, setPassengerModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passengerForm] = Form.useForm();
  const [cartSummaryVisible, setCartSummaryVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const showPassengerModal = () => {
    setPassengerModalVisible(true);
  };

  const closePassengerModal = () => {
    setPassengerModalVisible(false);
  };

  const showCartSummary = () => {
    setCartSummaryVisible(true);
  };

  const closeCartSummary = () => {
    setCartSummaryVisible(false);
  };

  const cartStore = useCartStore();

  const handleFormSubmit = (values) => {
    if (selectedProduct) {
      cartStore.addCartItem({
        product: selectedProduct,
        passenger: values,
      });
    }
    closeModal();
  };

  const handlePassengerFormSubmit = (values) => {
    cartStore.addCartItem({
      product: selectedProduct,
      passenger: values,
    });
    closePassengerModal();
  };

  const calculateTotalPrice = () => {
    const ticketPrice = 1200;
    const totalPrice = cartStore.cart.length * ticketPrice;
    return totalPrice;
  };

  const hasItemsInCart = cartStore.cart.length > 0;

  return (
    <>
      <Navbar />
      <div className={styles.cardContainer}>
        {products.map((product, index) => (
          <Card
            key={index}
            hoverable
            className={styles.card}
            cover={<img alt={product.name} src={product.image} />}
          >
            <div className={styles.cardContent}>
              <Meta
                title={<div className={styles.cardTitle}>{product.name}</div>}
                description={product.description}
                className={styles.meta}
              />
            </div>
            <div className={styles.priceContainer}>
              <Button type="primary" onClick={() => showModal(product)}>
                Add to Cart
              </Button>
              <span className={styles.price}>Rs. 1200</span>
            </div>
          </Card>
        ))}
      </div>

      {hasItemsInCart && (
        <Button
          type="primary"
          style={{ marginLeft: "40%" }}
          onClick={showCartSummary}
        >
          View Cart Summary
        </Button>
      )}

      <Modal
        title="Passenger Information"
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={closeModal}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item
            name="travelDate"
            label="Travel Date"
            rules={[
              {
                required: true,
                message: "Please select a travel date!",
              },
            ]}
          >
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
          <Form.Item>
            <Button type="default" onClick={showPassengerModal}>
              Add Passenger
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Passenger Modal"
        visible={passengerModalVisible}
        onOk={() => passengerForm.submit()}
        onCancel={closePassengerModal}
      >
        <Form form={passengerForm} onFinish={handlePassengerFormSubmit}>
          {/* Add passenger form fields here */}
          <Form.Item
            name="travelDate"
            label="Travel Date"
            rules={[
              {
                required: true,
                message: "Please select a travel date!",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cart Summary"
        visible={cartSummaryVisible}
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
    </>
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
