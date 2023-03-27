import { LeftOutlined } from "@ant-design/icons";
import { Card, Col, Divider, Row } from "antd";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { roleIcon } from "../../../assets/icons";
import { setRole } from "../../../redux/features/role/roleSlice";
import { useGetRoleDetailsQuery } from "../../../redux/services/roleApiSlice";
import { Page } from "../../../routes/config";
import { RolePermission } from "./rolePermission";


export const RolesDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isSuccess, refetch } = useGetRoleDetailsQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const roleDetail = data?.result?.message
  const { tenantId, type } = useParams();

  dispatch(setRole({ id: roleDetail?.id, name: roleDetail?.name }));

  console.log("roledata", roleDetail?.permission?.length);

  return (
    <>
      <section className="listing-section">
        <Row>
          <Col span={24} >
            <Card className="uicard table">
              <Row>
                <Col span={24} style={{ marginBottom: "10px" }}>
                  <div className="backButton">
                    <Link className="link" to={Page.ROLES}>
                      <LeftOutlined className="left-back-button" />
                      <b className="top-back-text">BACK</b>
                    </Link>
                  </div>
                </Col>
                <Col>
                  <div
                    className="avatar"
                    style={{
                      height: "45px",
                      width: "45px",
                      backgroundColor: "#227F99",
                    }}
                  >
                    <div className="content" style={{ fontSize: "14px" }}>
                      <img src={roleIcon}></img>
                    </div>
                  </div>
                </Col>
                <Col className="roleDetail">
                  <Row><span className="roleName">{roleDetail?.name}</span></Row>
                  <Row><span className="roleDescription">{roleDetail?.description}</span></Row>
                </Col>
              </Row>
              <Divider />
              <div  className="rolesManage">
                {roleDetail?.permission?.length!==0? roleDetail?.permission?.map((data: any) =>
                 (
                  <RolePermission
                    item={data}
                    roleDetails={roleDetail}
                    key={data.id}
                  />
                )):<div>NO PERMISSIONS</div>}
              </div>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
};
