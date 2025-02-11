import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Form, Input, InputNumber, Select } from "antd";
import filter from "lodash.filter";
import { useState } from "react";

import {
  GET_CARS,
  REMOVE_CAR,
  UPDATE_CAR,
} from "../../services/graphql/carQuery";
import { GET_OWNERS } from "../../services/graphql/ownerQuery";

const CarCardView = (props) => {
  const { carId, year, make, model, price, ownerId } = props;

  const [isEditing, setIsEditing] = useState();

  const [form] = Form.useForm();
  const { data: ownersData } = useQuery(GET_OWNERS);
  const [updateCar] = useMutation(UPDATE_CAR);
  const [removeCar] = useMutation(REMOVE_CAR);

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = (values) => {
    const {
      year: newYear,
      make: newMake,
      model: newModel,
      price: newPrice,
      ownerId: newOwnerId,
    } = values;

    updateCar({
      variables: {
        carId,
        year: String(newYear),
        make: newMake,
        model: newModel,
        price: String(newPrice),
        ownerId: newOwnerId,
      },
      update: (cache, { data: { updateCar: updatedCar } }) => {
        const oldQueries = cache.readQuery({
          query: GET_CARS,
          variables: { ownerId },
        });

        if (oldQueries) {
          const existingCars = oldQueries.getCars;
          cache.writeQuery({
            query: GET_CARS,
            variables: { ownerId },
            data: {
              getCars: filter(existingCars, (existingCar) => {
                return existingCar._id !== newOwnerId;
              }),
            },
          });
        }

        const newQueries = cache.readQuery({
          query: GET_CARS,
          variables: { ownerId: newOwnerId },
        });

        if (newQueries) {
          const existingCars = newQueries.getCars;
          cache.writeQuery({
            query: GET_CARS,
            variables: { ownerId: newOwnerId },
            data: {
              getCars: [...existingCars, updatedCar],
            },
          });
        }
      },
    });

    setIsEditing(false);
  };

  const handleRemove = () => {
    removeCar({
      variables: {
        carId,
      },
      update: (cache, { data: { removeCar: result } }) => {
        if (result) {
          const oldQueries = cache.readQuery({
            query: GET_CARS,
            variables: { ownerId },
          });

          if (oldQueries) {
            const existingCars = oldQueries.getCars;
            cache.writeQuery({
              query: GET_CARS,
              variables: { ownerId },
              data: {
                getCars: filter(existingCars, (existingCar) => {
                  return existingCar._id !== carId;
                }),
              },
            });
          }
        }
      },
    });
  };

  return (
    <div>
      {!isEditing ? (
        <Card
          actions={[
            <EditOutlined key="edit" onClick={handleOpenEdit} />,
            <DeleteOutlined
              key="delete"
              onClick={handleRemove}
              style={{ color: "red" }}
            />,
          ]}
          title={`${year} ${make} ${model} -> $${Number(
            price
          ).toLocaleString()}`}
          type="inner"
          style={{ width: "950px" }}
        ></Card>
      ) : (
        <Card style={{ width: "950px" }}>
          <Form
            name="update-car-form"
            layout="vertical"
            form={form}
            initialValues={{ year, make, model, price, ownerId }}
            onFinish={handleUpdate}
          >
            <Form.Item
              label="Year"
              name="year"
              rules={[{ required: true, message: "Please enter the year" }]}
            >
              <InputNumber
                placeholder="Year"
                parser={(value) => parseInt(value)}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Make"
              name="make"
              rules={[{ required: true, message: "Please enter the make" }]}
            >
              <Input placeholder="Make" />
            </Form.Item>
            <Form.Item
              label="Model"
              name="model"
              rules={[{ required: true, message: "Please enter the model" }]}
            >
              <Input placeholder="Model" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter the price" }]}
            >
              <InputNumber
                placeholder="Price"
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                style={{ width: "100%" }}
              />
            </Form.Item>
            {ownersData &&
              ownersData.getOwners &&
              0 < ownersData.getOwners.length && (
                <Form.Item
                  label="Owner"
                  name="ownerId"
                  rules={[
                    { required: true, message: "Please enter the owner" },
                  ]}
                >
                  <Select
                    options={ownersData.getOwners.map((owner) => ({
                      value: owner._id,
                      label: `${owner.firstName} ${owner.lastName}`,
                    }))}
                    style={{ width: "150px" }}
                  />
                </Form.Item>
              )}
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length
                  }
                >
                  Update
                </Button>
              )}
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => <Button onClick={handleCloseEdit}>Cancel</Button>}
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default CarCardView;
