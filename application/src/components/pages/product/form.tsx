import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Space } from "antd";
import { Regex } from "../../../config/constants";
import { UIInput } from "../../common/input";
import TextArea from "../../common/textArea";
import { UIErrorAlert } from "../../common/uiAlert";
import { ReactComponent as ErrorCross } from "../../../assets/images/errorCross.svg";
import { useEffect, useRef } from "react";

export const ProductForm = (props: any) => {
  const { onModalSubmit, form, error, formId } =
    props;
    

    // set scroll position to top
    useEffect(() => {
     const scrollElement:any = document.querySelector(".productmodalForm");
     scrollElement.scrollTop = 0;
    });


  return (
    <Form
      id={formId}
      form={form}
      className="productmodalForm"
      layout="vertical"
      onFinish={onModalSubmit}
    >
      {error && (
        <div className="pb-10">
          <UIErrorAlert>{error}</UIErrorAlert>
        </div>
      )}

      <Row gutter={10}>
        <Col span={24}>
          <UIInput
            label="SKU"
            placeholder="SKU"
            name="sku"
            
            // onChange={handleChange}
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Name"
            placeholder="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter Name",
              },
            ]}
          />
        </Col>

        <Col span={24}>
          <TextArea
            label="Description"
            placeholder="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter Description",
              },
              {
                pattern:new RegExp(Regex.VALID_DESCRIPTION),
                message:"Description should have maximum 250 characters."
              }
            ]}
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="ExperienceId"
            placeholder="ExperienceId"
            name="experienceId"
           
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="ExperienceStudioId"
            placeholder="ExperienceStudioId"
            name="experienceStudioId"
           
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="ExperienceTenantId"
            placeholder="ExperienceTenantId"
            name="experienceTenantId"
          
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Manufacturer"
            placeholder="Manufacturer"
            name="manufacturer"
         
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Type"
            placeholder="Type"
            name="type"
         
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Categories"
            placeholder="Categories"
            name="categories"
           
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Subcategories"
            placeholder="Subcategories"
            name="subCategories"
           
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Price"
            placeholder="Price"
            name="price" 
         
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Color"
            placeholder="Color"
            name="color"
          
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Size"
            placeholder="Size"
            name="size"
          
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="Images"
            placeholder="Images"
            name="images"
         
          />
        </Col>

        <Col span={24}>
          <UIInput
            label="ImageURL"
            placeholder="ImageURL"
            name="imageURL"
            
          />
        </Col>
        <Col span={24}>
  
          <span>Other Attribute</span>
          <Form.List name="otherAttributes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                  
                      <UIInput
                        name={[name, "key"]}
                        rules={[{ required: true, message: "This field is required." }]}
                        placeholder="key"
                      />

                      <UIInput
                        name={[name, "value"]}
                        rules={[{ required: true, message: "This field is required." }]}
                        placeholder="Value"
                      />
             
                    <ErrorCross style={{verticalAlign:"top"}} onClick={() => remove(name)} />
                  </Space>
                ))}
                
                  <Button
                    type="dashed"
                    className="otherAttribute"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
             
              </>
            )}
          </Form.List>

         
        
        </Col>
      </Row>
    </Form>
  );
  
};
