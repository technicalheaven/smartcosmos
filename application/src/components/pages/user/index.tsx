import { useState } from "react";
import "./style.css";
import { Card, Row, Col, Pagination} from "antd";
import {
  peoplesIcon,
} from "../../../assets/icons";
import { UIImage } from "../../common/image";
import { UISearchBar } from "../../common/searchBar";
import { UIIconbutton} from "../../common/button";
import UsersList from "./list";
import { PageTitle } from "../../../config/enum";
import pagination from "antd/lib/pagination";
import { TablePaginationConfig } from "antd/es/table";
import { SorterResult } from "antd/lib/table/interface";
import { getFilterInfo } from "../../../redux/features/filter/filterSlice";
import { useSelector } from "react-redux";
import { page } from "../../../config/constants";


const Users = () => {

  // state variables
  const [search, setSearch] = useState("");
  interface Params {
    pagination?: TablePaginationConfig;
    sorter?: SorterResult<any> | SorterResult<any>[];
    total?: number;
    sortField?: string;
    sortOrder?: string;
  }

  const [isAddModalVisible, setIsAddModalVisible] = useState<any>(false);
  const filterState = useSelector(getFilterInfo);
  const currentURL = window.location.href;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: filterState?.page &&  currentURL == filterState?.url ?  filterState?.page : page?.current,
    pageSize: filterState.limit && currentURL == filterState?.url ? filterState.limit : page?.pageSize,
    showSizeChanger: true,
  });
  const [checked,setChecked]=useState(false)
  return (
    <>
      <section className="title-section">
        <Card className="uicard topui-card">
          <Row className="front-top-card">
            <Col xl={10} lg={10} md={8} sm={24} xs={24}>
              <div className="d-flex align-items-center">
                
                <div className="icon">
                  <UIImage src={peoplesIcon} text="icon" />
                </div>
                <div className="title">{PageTitle.PLATFORM_USERS}</div>
              </div>
            </Col>
            <Col xl={14} lg={14} md={16} sm={24} xs={24}>
              <div className="actions align-items-center">
                <Row>
                  <Col className="search-icon-align">
                <div className="search">
                  <UISearchBar placeholder="Search user name" pagination={pagination} setPagination={setPagination} setSearch={setSearch} search={search} />
                </div>
                </Col>
                <Col>
                <div className="addbtn">
                  <UIIconbutton
                    onPress={() => {setIsAddModalVisible(true);setChecked(false)}}
                    icon="plus"
                    type="info"
                    size="md"
                    data-testid="addbutton"
                  >
                    ADD USER
                  </UIIconbutton>
                </div>
                </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
      <Card className="uicard table platformUser">
      <UsersList
      search={search}
      inputKey={true}
      isAddModalVisible={isAddModalVisible}
      setIsAddModalVisible={setIsAddModalVisible}
      pagination={pagination}
      setPagination={setPagination}
      checked={checked}
      setChecked={setChecked}
      />
      </Card>
    </>
  );
};

export default Users;
