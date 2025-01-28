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
        <List style={{ display: "flex", justifyContent: "center" }}>
          {ownersData &&
            ownersData.getOwners &&
            0 < ownersData.getOwners.length &&
            ownersData.getOwners.map(({ id, firstName, lastName }) => (
              <List.Item key={id}>
                <OwnerCard id={id} firstName={firstName} lastName={lastName} />
              </List.Item>
            ))}
        </List>
      )}
    </div>
  );
};

export default ListView;
