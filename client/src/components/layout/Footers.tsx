import { Layout } from "antd";

const { Footer } = Layout;
export const Footers = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      Cabinfo!_Edu ©{new Date().getFullYear()} Created by JS592-Karel
    </Footer>
  );
};
