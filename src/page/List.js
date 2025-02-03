import { useQuery } from "@apollo/client";
import { Divider, List, Typography } from "antd";

import AddCar from "../component/Form/AddCar";
import AddOwner from "../component/Form/AddOwner";
import OwnerCard from "../component/Card/OwnerCard";
import { GET_OWNERS } from "../service/graphql/ownerQuery";

const ListView = () => {
  const { loading, data: ownersData } = useQuery(GET_OWNERS);

  return (
    <div>
      <Typography.Title
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        Owners and Their Cars
      </Typography.Title>
      <Divider />
      <AddOwner />
      {ownersData &&
        ownersData.getOwners &&
        0 < ownersData.getOwners.length && <AddCar />}
      <Divider>Records</Divider>
      {!loading && (
        <List
          dataSource={ownersData?.getOwners || []}
          renderItem={({ _id, firstName, lastName }) => (
            <List.Item key={_id}>
              <OwnerCard
                ownerId={_id}
                firstName={firstName}
                lastName={lastName}
              />
            </List.Item>
          )}
          style={{ display: "flex", justifyContent: "center" }}
        />
      )}
    </div>
  );
};

export default ListView;
