import { useMutation } from "@apollo/client";
import { Button, Form, Input, Divider } from "antd";
import { GET_OWNERS, ADD_OWNER } from "../../service/graphql/ownerQuery";
import { useEffect, useState } from "react";

const AddOwnerView = () => {
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(true);

  const [addOwner] = useMutation(ADD_OWNER);

  const handleFinish = (values) => {
    const { firstName, lastName } = values;

    addOwner({
      variables: {
        firstName,
        lastName,
      },
      update: (cache, { data: { addOwner } }) => {
        const oldQueries = cache.readQuery({ query: GET_OWNERS });

        if (oldQueries) {
          const oldOwners = oldQueries.getOwners;
          cache.writeQuery({
            query: GET_OWNERS,
            data: { getOwners: [...oldOwners, addOwner] },
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
      <Divider>Add Owner</Divider>
      <Form
        name="add-owner-form"
        layout="inline"
        size="large"
        form={form}
        onFinish={handleFinish}
        style={{ marginBottom: "40px", justifyContent: "center" }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please enter your first name" }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please enter your last name" }]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>
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
              Add Owner
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default AddOwnerView;
