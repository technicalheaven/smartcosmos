import { LeftOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Row } from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Page } from "../../../routes/config";
import "./role.css";

export const RolePermission = (props: any) => {
  const { item, roleDetails, key } = props;

  //   const [view, setView] = useState(item.isView);
  //   const [edit, setEdit] = useState(item.isEdit);
  return (
    <>
      <div
        className="permissonScreen"
      //   key={(item?.isView + item?.isEdit)?.toString()}
      >
        <Form layout="vertical">
          <Row gutter={[40, 20]}>
            <Col span={6}>
              <span className="permission-description">
                <b>{item?.name}</b>

              </span>
            </Col>
            <Col span={11}>
              <span className="permission-description">
                {item?.description}

              </span>
            </Col>
            <Col span={7}>
              <Row justify="end">
                <Col span={12} >
                  {/* <Radio  name="view"   onChange={handleRadio}>View</Radio>   */}
                  <Checkbox
                    //   key={item?.isView?.toString()}
                    className="rolePermissionCheck"
                    //   id={item?.name}
                    disabled={!roleDetails?.editable}
                    defaultChecked={item?.isView||item?.isEdit}
                    name="view"
                  >
                    <span className="permicheck">View</span>
                  </Checkbox>
                </Col>
                <Col span={12}>
                  {/* <Radio name="edit"  onChange={handleRadio}>Edit </Radio> */}
                  <Checkbox
                    //   key={item?.isEdit?.toString()}
                    className="rolePermissionCheck"
                    //   id={item?.name}
                    disabled={!roleDetails?.editable}
                    defaultChecked={item?.isEdit}
                    name="edit"
                  >
                    <span className="permicheck">Edit</span>
                  </Checkbox>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};
