export enum ModalTitle {
  FORGOT_PASSWRD = "Forgot Password",
  CHANGE_PASSWRD = "Change Password",
  RESET_PASSWRD = "Reset Password",
  ADD_TENANT = "Add Tenant",
  EDIT_TENANT = "Edit Tenant Profile",
  ADD_USER = "Add User",
  EDIT_USER = "Edit User",
  ADD_DEVICE = "Add Device",
  EDIT_DEVICE = "Edit Device",
  ADD_SITE = "Add Site",
  EDIT_SITE = "Edit Site",
  ADD_ZONE = "Add Zone",
  EDIT_ZONE = "Edit Zone",
  ADD_DEVICE_MANAGER = "Add Device Manager",
  EDIT_DEVICE_MANAGER = "Edit Device Manager",
  EDIT_PROFILE = "Edit Profile",
  EXPORT_ENABLEMENTS = "Export Enablements",
  EXPORT_PRODUCTS = "Export Products",
  EXPORT_TAGS = "Export Factory Tags",
}

export enum ModalType {
  SUCCESS = "success",
  WARN = "warn",
  INVITE = "invite",
}

export enum ModalPrimaryText {
  ACTIVATE = "Are you sure you want to activate %s?",
  DELETE = "Are you sure you want to delete %s?",
  DEACTIVATE = "Are you sure you want to deactivate %s?",
  INVITE = "Are you sure you want to send invite %s?",
}

export enum ModalButton {
  CANCEL = "CANCEL",
  CONFIRM = "YES",
  OK = "OK"
}

export enum PageTitle {
  HOME = "Home",
  DASHBOARD = "Dashboard",
  TENANTS = "Tenants",
  PLATFORM_USERS = "Platform users",
  ROLES = "Roles",
  ORGANISATION = "My Organisation",
  PRODUCTS = "Products",
  PROCESSES = "Processes",
  PREDEFINED = "Pre-Defined",
  USERDEFINED = "User-Defined",
  PRE_DEFINED_PROCESS = "Pre-Defined Processes",
  USER_DEFINED_PROCESS = "User-Defined Processes",
  DIGITTAL_IDENTITIES = "Digital Identities",
  FACTORY_TAGS = "Factory Tags",
  FACTORY_TAGS_HISTORY = "Upload History",
}

export enum Roles {
  PLATFORM_SUPER_ADMIN = "Platform Super Admin",
  PLATFORM_ADMIN = "Platform Admin",
  TENANT_ADMIN = "Tenant Admin",
  OPERATOR = "Operator",
  SUPERVISOR = "Supervisor",
  PROJECT_MANAGER = "Project Manager",
  FACTORY_OPERATOR = "Factory Tag Operator",
  API_OPERATOR = "API Operator",
  API_OPERATOR_READ_ONLY = "API Operator(Read Only)",

}

export enum Permission {
  TENANT = "Tenant",
  USER = "Users",
  DEVICE = "Device",
  SITE = "Site",
  ZONE = "Zone",
  DEVICEMANAGER = "DeviceManager",
  Product = "Product",
  Process = "Process",
}

export enum processActions {
  SCAN_QRCODE = "Scan QRcode",
  SCAN_BARCODE = "Scan Barcode",
  SCAN_NFC = "Scan NFC",
  ADD_INPUT = "Add Input Field",
  SCAN_UHF = "Scan UHF",
  ENCODE_NFC = "Encode NFC",
  ENCODE_UHF = "Encode UHF",
  SCAN_TAG = "Scan Tag",
  FILE_UPLOAD = "File Upload",
  GPIO_LIGHT = "GPIO Light",
  GPIO_SOUND = "GPIO Sound",
  CREATE_FILE="Create File"
}

export const rolesOrder = [
  { name: "Platform Super Admin", order: 1, isPlatform: true },
  { name: "Platform Admin", order: 2, isPlatform: true },
  { name: "Tenant Admin", order: 3, isPlatform: false },
  { name: "Project Manager", order: 4, isPlatform: false },
  { name: "Supervisor", order: 5, isPlatform: false },
  { name: "Operator", order: 6, isPlatform: false },
  { name: "Factory Tag Operator", order: 7, isPlatform: false },
  { name: "API Operator", order: 8, isPlatform: false },
  { name: "API Operator(Read Only)", order: 9, isPlatform: false },
];

export enum constants {
  PREDEFINED = "predefined",
  USERDEFINED = "userdefined",
}