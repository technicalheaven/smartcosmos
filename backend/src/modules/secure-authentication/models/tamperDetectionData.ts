
class TamperDetectionData {
  supported:any;
  tampered:any;
  constructor(state = {}) {
  const { isTamperProofTag, tampered }:any = state;
    this.supported = isTamperProofTag;
    this.tampered = this.supported ? tampered : null;
  }
}

export default TamperDetectionData;
