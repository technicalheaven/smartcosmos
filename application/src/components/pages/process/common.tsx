import { barcodeIcon, createFile, encodeNfcIcon, encodeUhfIcon, fileUploadIcon, gpioLightIcon, gpioSoundIcon, inputIcon, nfcIcon, qrIcon, uhfIcon } from "../../../assets/icons";
import { processActions } from "../../../config/enum";

export const getActionIcon = (actionName: any) => {
    switch (actionName) {
      case processActions.SCAN_QRCODE:
        return qrIcon;
      case processActions.SCAN_BARCODE:
        return barcodeIcon;
      case processActions.SCAN_NFC:
        return nfcIcon;
      case processActions.ADD_INPUT:
        return inputIcon;
      case processActions.SCAN_UHF:
        return uhfIcon;
      case processActions.ENCODE_NFC:
        return encodeNfcIcon;
      case processActions.ENCODE_UHF:
        return encodeUhfIcon;
      case processActions.SCAN_TAG:
        return uhfIcon;
      case processActions.FILE_UPLOAD:
        return fileUploadIcon;
      case processActions.GPIO_LIGHT:
        return gpioLightIcon;
      case processActions.GPIO_SOUND:
        return gpioSoundIcon;
        case processActions.CREATE_FILE:
          return createFile;
      default:
        return qrIcon;
    }
  };

  export const getKeyName = (str: any) => {
    return str.replaceAll(" ", "_").toUpperCase();
  };
  