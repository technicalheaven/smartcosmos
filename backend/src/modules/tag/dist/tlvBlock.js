'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Import this type to stop flow complaining

var TYPE_NULL_TLV = 0x00; // Might be used for padding of memory areas


var TYPE_LOCK_CONTROL_TLV = 0x01; // Defines details of the lock bits
var TYPE_MEMORY_CONTROL_TLV = 0x02; // Identifies reserved memory areas
var TYPE_NDEF_MESSAGE_TLV = 0x03; // Contains an NDEF message
var TYPE_PROPRIETARY_TLV = 0xfd; // Tag proprietary information
var TYPE_TERMINATOR_TLV = 0xfe; // Last TLV block in the data area

exports.TYPE_NULL_TLV = TYPE_NULL_TLV;
exports.TYPE_LOCK_CONTROL_TLV = TYPE_LOCK_CONTROL_TLV;
exports.TYPE_MEMORY_CONTROL_TLV = TYPE_MEMORY_CONTROL_TLV;
exports.TYPE_NDEF_MESSAGE_TLV = TYPE_NDEF_MESSAGE_TLV;
exports.TYPE_PROPRIETARY_TLV = TYPE_PROPRIETARY_TLV;
exports.TYPE_TERMINATOR_TLV = TYPE_TERMINATOR_TLV;

var TlvBlock = function () {
  function TlvBlock(tlvBlockData) {
    _classCallCheck(this, TlvBlock);

    this.tlvValue = null;
    this.tlvType = tlvBlockData[0];
    switch (this.tlvType) {
      case TYPE_NULL_TLV:
      case TYPE_TERMINATOR_TLV:
        this.tlvLength = 0;
        this.tlvValue = null;
        break;
      case TYPE_LOCK_CONTROL_TLV:
      case TYPE_MEMORY_CONTROL_TLV:
      case TYPE_NDEF_MESSAGE_TLV:
      case TYPE_PROPRIETARY_TLV:
        if (tlvBlockData[1] === 0) {
          this.tlvLength = 0;
          this.tlvValue = null;
        } else {
          if (tlvBlockData[1] !== 0xff) {
            this.tlvLength = tlvBlockData[1] & 0xff;
            this.tlvValue = tlvBlockData.slice(2, this.tlvLength + 2);
          } else {
            this.tlvLength = (tlvBlockData[2] & 0xff) << 8 | tlvBlockData[3] & 0xff;
            if (this.tlvLength < 256 || this.tlvLength > 65534) {
              throw new Error('Illegal TLV length: ' + this.tlvLength);
            }
            this.tlvValue = tlvBlockData.slice(4, this.tlvLength + 4);
          }
        }
        break;
      default:
        throw new Error('Unsupported TLV type: ' + this.tlvType);
    }
    if (this.tlvValue && this.tlvValue.length !== this.tlvLength) {
      throw new Error('Incomplete TLV data: size of V does not match L');
    }
    this.tlvBytes = tlvBlockData.slice(0, this.getTotalLength());
  }

  _createClass(TlvBlock, [{
    key: 'getBytes',
    value: function getBytes() {
      return this.tlvBytes;
    }
  }, {
    key: 'getType',
    value: function getType() {
      return this.tlvType;
    }
  }, {
    key: 'getLength',
    value: function getLength() {
      return this.tlvLength;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.tlvValue;
    }
  }, {
    key: 'getTotalLength',
    value: function getTotalLength() {
      if (this.tlvType === TYPE_NULL_TLV || this.tlvType === TYPE_TERMINATOR_TLV) {
        return 1;
      }
      return this.tlvLength < 256 ? 2 + this.tlvLength : 4 + this.tlvLength;
    }
  }], [{
    key: 'fromNdefMessage',
    value: function fromNdefMessage(ndefMessage) {
      var ndefLength = ndefMessage.length;
      var extLength = ndefMessage.length > 254;
      var tlvBuffer = Buffer.allocUnsafe(extLength ? ndefLength + 4 : ndefLength + 2);
      tlvBuffer[0] = TYPE_NDEF_MESSAGE_TLV;
      if (extLength) {
        tlvBuffer[1] = 0xFF;
        tlvBuffer.writeUInt16BE(ndefLength, 2);
        ndefMessage.copy(tlvBuffer, 4, 0, ndefLength);
      } else {
        tlvBuffer.writeUInt8(ndefLength, 1);
        ndefMessage.copy(tlvBuffer, 2, 0, ndefLength);
      }
      return new TlvBlock(tlvBuffer);
    }
  }, {
    key: 'terminatingTlv',
    value: function terminatingTlv() {
      return new TlvBlock(Buffer.from([TYPE_TERMINATOR_TLV]));
    }
  }]);

  return TlvBlock;
}();

exports.default = TlvBlock;