import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas"
import { useSelector } from "react-redux";
import { getPermissionsList } from "../redux/features/auth/authSlice";
import { message } from "antd";

export const removeEmptyKeys = (obj: any) => {
  let filtered: any = {};
  Object.keys(obj).forEach(function (key) {
    if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
}

export const isJsonString = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const GetPermissions = (module: string = "") => {
  const permissions = useSelector(getPermissionsList);
  return permissions.find((item: any) => item.name === module);
}
export const forceFileDownload = (response: any, title: any) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", title);
  document.body.appendChild(link);
  link.click();
};


export const downloadHtml2Pdf = (element: any, fileName: any) => {
  element.querySelector('.actions').style.display = 'none';
  var doc = new jsPDF("p", "mm", "a4");
  var width = doc.internal.pageSize.getWidth() - 20;
  html2canvas(element)
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'JPEG', 10, 10, width, 0);
      pdf.save(fileName);
    });
  element.querySelector('.actions').style.display = 'block';
}

export const downloadWithAxios = (url: any, title: any, setLoading: any) => {
  axios({
    method: "GET",
    url,
    responseType: "arraybuffer",
  })
    .then((response: any) => {
      setLoading(false);
      forceFileDownload(response, title);
    })
    .catch(() => {
      console.log("error occured");
      setLoading(false);
      message.error("Something went Wrong")
    }
    );
};

Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});


export const ArrayToPlainObject = (array: any) => {
  const x = array.reduce(function (result: any, item: any) {
    var key = item?.key;
    result[key] = item?.value;
    return result;
  }, {});

  return x;

}