import { Layout } from "antd";
import UISidebar from "../common/sidebar";
import UIFooter from "../common/footer";
import UIHeader from "../common/header";
import { Outlet } from "react-router-dom";
import { useState } from "react";
const { Content } = Layout;
const UILayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <UIHeader setCollapsed={setCollapsed} collapsed={collapsed}/>
      <Layout className="site-layout" style={{marginTop: "60px"}}>
      <UISidebar setCollapsed={setCollapsed} collapsed={collapsed}/>
        <Content
          style={{
            margin: "0 0px",
            marginLeft: collapsed ? 100: 250,
          }}
        >
        
          <div
            className="site-layout-background"
            style={{
              padding: 24,
            }}
          >
            

            <Outlet />
            
          </div>
        {/* <UIFooter /> */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UILayout;
