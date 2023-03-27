import moment from 'moment-timezone';

export const avatarColors = [
  "#AB84E1",
  "#7CDA7B",
  "#F68282",
  "#56CACC",
  "#FEB354",
  "#BDEAFF",
];

export const page = {
  current: 1,
  pageSize: 10,
  totalrows: 200,
};

export const GOOGLE_API_KEY = "AIzaSyC76a0Bs9KstBFD4zrjCFjAVW-WJglMtoM";

export const Regex = {
  PASSWORD:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&,.#><|~{}():;"'/_=+-])[A-Za-z\d@$!%*?&,.#><|~{}():;"'/_=+-]{8,}$/,
  PASSWORD_VALID_LENGTH: /^\S{8,}$/,
  // VALID_EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  VALID_USERNAME: /^\S{6,}$/,
  VALID_URL: "((http|https)://)(www.)?[a-zA-Z0-9@:%.\\+#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%.\\+#?&//=]*)",
  VALID_NAME:/^.{3,50}$/,
  VALID_ADDRESS:/^.{3,250}$/,
  VALID_DESCRIPTION:/^.{0,250}$/,
  VALID_UUID:/^.{1,36}$/
};

export const Status = {
  INACTIVE: "Inactive",
  ACTIVE: "Active",
  ACTIVE_IDLE: "Active-Idle",
  ACTIVE_RUNNING: "Active-Running"
}

export const TIMEZONE = moment.tz.guess();