
class AuthenticationData {
  supported:any;
  result:any;
  constructor(state = {}) {
    const { isRollingCodeTag, isValid }:any = state;
    this.supported = isRollingCodeTag;
    this.result = this.supported ? isValid : null;
  }
}

export default AuthenticationData;
