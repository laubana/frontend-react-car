import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Form, Input, List } from "antd";
import filter from "lodash.filter";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CarCard from "./CarCard";

import { GET_CARS } from "../../service/graphql/carQuery";
import {
  GET_OWNER,
  GET_OWNERS,
  REMOVE_OWNER,
  UPDATE_OWNER,
} from "../../service/graphql/ownerQuery";

const OwnerCardView = (props) => {
  const { ownerId, firstName, lastName, featured } = props;

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState();

  const [form] = Form.useForm();
  const { data: carsData } = useQuery(GET_CARS, {
    variables: { ownerId },
  });
  const [updateOwner] = useMutation(UPDATE_OWNER);
  const [removeOwner] = useMutation(REMOVE_OWNER);

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleFinish = (values) => {
    const { firstName: newFirstName, lastName: newLastName } = values;

    updateOwner({
      variables: {
        ownerId: ownerId,
        firstName: newFirstName,
        lastName: newLastName,
      },
      update: (cache, { data: { updateOwner: updatedOwner } }) => {
        const oldQuery = cache.readQuery({
          query: GET_OWNER,
          variables: { ownerId },
        });

        if (oldQuery) {
          cache.writeQuery({
            query: GET_OWNER,
            variables: { ownerId },
            data: {
              getOwner: updatedOwner,
            },
          });
        }

        const oldQueries = cache.readQuery({ query: GET_OWNERS });

        if (oldQueries) {
          const existingOwners = oldQueries.getOwners;

          cache.writeQuery({
            query: GET_OWNERS,
            data: {
              getOwners: filter(existingOwners, (existingOwner) => {
                return existingOwner._id !== updatedOwner._id
                  ? existingOwner
                  : updatedOwner;
              }),
            },
          });
        }
      },
    });

    setIsEditing(false);
  };

  const handleRemove = () => {
    removeOwner({
      variables: {
        ownerId,
      },
      update: (cache, { data: { removeOwner: result } }) => {
        if (result) {
          const oldQueries = cache.readQuery({ query: GET_OWNERS });

          if (oldQueries) {
            const existingOwners = oldQueries.getOwners;
            cache.writeQuery({
              query: GET_OWNERS,
              data: {
                getOwners: filter(existingOwners, (owner) => {
                  return owner._id !== ownerId;
                }),
              },
            });
          }
        }
      },
    });

    if (featured) {
      navigate("/");
    }
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
          title={`${firstName} ${lastName}`}
          style={{ width: "1000px" }}
        >
          <List
            dataSource={carsData?.getCars || []}
            renderItem={({ _id, year, make, model, price, owner }) => (
              <List.Item key={_id}>
                <CarCard
                  carId={_id}
                  year={year}
                  make={make}
                  model={model}
                  price={price}
                  ownerId={owner._id}
                />
              </List.Item>
            )}
          />
          {!featured ? (
            <Link to={`/${ownerId}`}>Learn More</Link>
          ) : (
            <Link to={`/`}>Go Back Home</Link>
          )}
        </Card>
      ) : (
        <Card style={{ width: "1000px" }}>
          <Form
            name="update-owner-form"
            layout="vertical"
            form={form}
            initialValues={{ firstName, lastName }}
            onFinish={handleFinish}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
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

export default OwnerCardView;
