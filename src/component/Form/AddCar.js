import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, Input, Divider, InputNumber, Select } from "antd";
import { ADD_CAR, GET_CARS } from "../../service/graphql/carQuery";
import { GET_OWNERS } from "../../service/graphql/ownerQuery";

const AddCarView = () => {
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(true);

  const { data: ownersData } = useQuery(GET_OWNERS);
  const [addCar] = useMutation(ADD_CAR);

  const handleFinish = (values) => {
    const { year, make, model, price, ownerId } = values;

    addCar({
      variables: {
        year: String(year),
        make,
        model,
        price: String(price),
        ownerId,
      },
      update: (cache, { data: { addCar } }) => {
        const oldQueries = cache.readQuery({
          query: GET_CARS,
          variables: { ownerId: ownerId },
        });

        if (oldQueries) {
          const oldCars = oldQueries.getCars;
          cache.writeQuery({
            query: GET_CARS,
            variables: { ownerId: ownerId },
            data: { getCars: [...oldCars, addCar] },
          });
        }
      },
    });

    form.resetFields();
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <Divider>Add Car</Divider>
      <Form
        name="add-car-form"
        layout="inline"
        size="large"
        form={form}
        onFinish={handleFinish}
        style={{ marginBottom: "40px", justifyContent: "center" }}
      >
        <Form.Item
          label="Year"
          name="year"
          rules={[{ required: true, message: "Please enter the year" }]}
        >
          <InputNumber placeholder="Year" parser={(value) => parseInt(value)} />
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
          />
        </Form.Item>
        {ownersData &&
          ownersData.getOwners &&
          0 < ownersData.getOwners.length && (
            <Form.Item
              label="Owner"
              name="ownerId"
              rules={[{ required: true, message: "Please enter the owner" }]}
            >
              <Select
                options={ownersData.getOwners.map((owner) => ({
                  value: owner.id,
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
                isLoading ||
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Add Car
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default AddCarView;
