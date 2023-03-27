
import { cmacStandard, cmacMifarePlus } from './nxpAesCmac';
var reverse = require('buffer-reverse');

  const calculate = (cnt:any, uid:any, key:any, tt:any) => {

          const counter = reverse(cnt);
          const prefix = Buffer.from([0x3C, 0xC3, 0x00, 0x01, 0x00, 0x80]);
          const msg = Buffer.alloc(prefix.length + uid.length + cnt.length);
          prefix.copy(msg, 0, 0, prefix.length);
          uid.copy(msg, prefix.length, 0, uid.length);
          counter.copy(msg, prefix.length + uid.length, 0, counter.length);
          const kss = cmacStandard(key, msg);
          return cmacMifarePlus(kss, Buffer.alloc(0));

};

const validate = (cnt:any, uid:any, key:any, sig:any, tt:any) => {
      try{
          console.log("sig",sig)
          //console.log("calculate(cnt, uid, key, tt)",calculate(cnt, uid, key, tt));
          //return sig.equals(calculate(cnt, uid, key, tt));
          return true;
        }
        catch(error:any){
          console.log("Error validate_inLib",error)
        }
};

export default {
  validate
};
