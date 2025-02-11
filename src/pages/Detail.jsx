import { useQuery } from "@apollo/client";
import { Divider, Flex, Typography, Empty } from "antd";
import { useParams } from "react-router-dom";

import AddCar from "../components/Form/AddCar";
import AddOwner from "../components/Form/AddOwner";
import OwnerCard from "../components/Card/OwnerCard";
import { GET_OWNER } from "../services/graphql/ownerQuery";

const DetailView = () => {
  const { ownerId } = useParams();

  const { loading, data: ownerData } = useQuery(GET_OWNER, {
    variables: { ownerId },
  });

  return (
    <div>
      <Typography.Title
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        Owner and Its Cars
      </Typography.Title>
      <Divider />
      <AddOwner />
      <AddCar />
      <Divider>Records</Divider>
      <Flex style={{ padding: "12px 0", justifyContent: "center" }}>
        {!loading && ownerData.getOwner ? (
          <OwnerCard
            ownerId={ownerId}
            firstName={ownerData.getOwner.firstName}
            lastName={ownerData.getOwner.lastName}
            featured
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Flex>
    </div>
  );
};

export default DetailView;
