import { Col, Form, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { UIInput } from "../../../../common/input";
import { UIErrorAlert } from "../../../../common/uiAlert";
import Geocode from "react-geocode";
import { GOOGLE_API_KEY, Regex } from "../../../../../config/constants";

export const SiteForm = (props: any) => {
  const {
    id,
    form,
    onModalSubmit,
    error,
  } = props;


  Geocode.setApiKey(GOOGLE_API_KEY);
  let autocomplete: any;

  function initPlaces() {
    autocomplete.addListener("place_changed", fillInAddress);
  }

  useEffect(() => {
    const addInput: HTMLInputElement | any = document.querySelector("#addSite #addressInput");
    const editInput: HTMLInputElement | any = document.querySelector("#editSite #addressInput");
    const autocompleteAdd = new google.maps.places.Autocomplete(addInput, {
      types: ["geocode"],
    });
    const autocompleteEdit = new google.maps.places.Autocomplete(editInput, {
      types: ["geocode"],
    });

    autocomplete = id == 'addSite' ? autocompleteAdd : autocompleteEdit;
    initPlaces();
  });

  const findLatAndLng = (address: any) => {
    Geocode.fromAddress(address).then(
      (response: any) => {
        form.setFieldsValue({
          address: address,
          latitude: response.results[0].geometry.location.lat,
          longitude: response.results[0].geometry.location.lng,
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  };
  const fillInAddress = (e: any) => {
    let place = autocomplete.getPlace();
    findLatAndLng(place?.formatted_address);
  };

  return (
    <Form
      id={id}
      form={form}
      className="modalForm"
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
            label="Name"
            placeholder="Enter Site Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter Site Name",
              },
              {
                pattern: new RegExp(Regex.VALID_NAME),
                message: "Site name should have 3 to 50 character",
              },
            ]}
          />
        </Col>
        <Col span={24} className="inputCss">
          <UIInput
            label="Address"
            id="addressInput"
            placeholder="Enter Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please enter address",
              },
              {
                pattern: new RegExp(Regex.VALID_ADDRESS),
                message: "Site address should have 3 to 250 character",
              },
            ]}
            onChange={() => {
              form.setFieldsValue({
                latitude: null,
                longitude: null
              })
            }}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UIInput
            label="Site Contact Name"
            name="siteContactName"
            placeholder="Enter Site Contact Name"
            rules={[
              {
                pattern: new RegExp(Regex.VALID_NAME),
                message: "Site Contact Name should have 3 to 50 characters",
              },
            ]}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UIInput
            label="Contact Number"
            name="phone"
            placeholder="Enter Contact Number"
            rules={[
              {
                pattern: new RegExp("^[0-9]{3,30}$"),
                message: "Contact Number contains 3 to 30 numeric characters",
              },
            ]}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UIInput
            label="Contact Email"
            name="email"
            placeholder="Enter Contact Email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UIInput
            label="Site Identifier"
            name="siteIdentifier"
            placeholder="Enter Site Identifier"
            rules={[
              {
                pattern: new RegExp("^[a-zA-Z0-9]{2,30}$"),
                message: "Site Identifier contains 2 to 30 alphanumeric characters",
              },
            ]}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UIInput
            label="Latitude"
            name="latitude"
            placeholder="Latitude"
            rules={[
              {
                required: false,
                message: "Please enter username",
              },
              {
                pattern: new RegExp("^[a-zA-Z0-9.-]{3,20}$"),
                message: "Latitude must be of 3 to 20 characters long",
              },
            ]}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UIInput
            label="Longitude"
            name="longitude"
            placeholder="Longitude"
            rules={[
              {
                required: false,
                message: "Please enter username",
              },
              {
                pattern: new RegExp("^[a-zA-Z0-9.-]{3,20}$"),
                message: "Longitude must be of 3 to 20 characters long",
              },
            ]}
          />
        </Col>
      </Row>
    </Form>
  );
};
