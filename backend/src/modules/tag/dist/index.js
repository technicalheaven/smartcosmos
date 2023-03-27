'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNfcMemoryFromUri = getNfcMemoryFromUri;
exports.getUriFromNfcMemory = getUriFromNfcMemory;
exports.getUriFromNdefMessage = getUriFromNdefMessage;
exports.getTlvBlocks = getTlvBlocks;

var _ndef = require('ndef');

var _ndef2 = _interopRequireDefault(_ndef);

var _tlvBlock = require('./tlvBlock');

var _tlvBlock2 = _interopRequireDefault(_tlvBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates the memory content for a tag to be written with an URI record.
 *
 * @param uri         stringified URI
 * @returns {Buffer}  bytes to be written to the tag
 */
function getNfcMemoryFromUri(uri) {
  var ndefMessage = _ndef2.default.encodeMessage([_ndef2.default.uriRecord(uri)]);
  var tlvBlocks = [_tlvBlock2.default.fromNdefMessage(Buffer.from(ndefMessage)), _tlvBlock2.default.terminatingTlv()];
  return Buffer.concat(tlvBlocks.map(function (tlv) {
    return tlv.getBytes();
  }));
}

/**
 * Tries to parse a URI from the NFC memory of a tag.
 *
 * @param nfcMemory tag user memory
 * @return tag url URI or null in case of failure
 * @throws IOException if the nfcMemory is incompletely read
 */
// Import this type to stop flow complaining

function getUriFromNfcMemory(nfcMemory) {
  var tlvBlocks = this.getTlvBlocks(nfcMemory);
  for (var i = 0; i < tlvBlocks.length; i++) {
    if (tlvBlocks[i].getType() === _tlvBlock.TYPE_NDEF_MESSAGE_TLV && tlvBlocks[i].getValue() !== null) {
      return this.getUriFromNdefMessage(tlvBlocks[i].getValue());
    }
  }
  return null;
}

/**
 * Parses the URI from the first NDEF Record inside the NDEF message, which contains
 * an URI record or Smart Poster record.
 *
 * @param ndefMessage NDEF Message
 * @return tag URI or null in case of failure
 */
function getUriFromNdefMessage(ndefMessage) {
  var ndefRecords = _ndef2.default.decodeMessage(ndefMessage);
  for (var i = 0; i < ndefRecords.length; i++) {
    if (ndefRecords[i].tnf === _ndef2.default.TNF_WELL_KNOWN && ndefRecords[i].type === _ndef2.default.RTD_URI) {
      var payload = Buffer.from(ndefRecords[i].payload);
      return decodeUri(payload);
    }
  }
  return null;
}

/**
 * Get all TLV blocks from the NFC memory
 * <p>
 * This iterates through all TLV blocks of the tag memory until:
 * - NDEF message TLV found
 * - Terminating TLV found
 * - end of memory reached
 * - error occurred
 *
 * @param nfcMemory
 * @return array of TLV blocks
 * @throws error in case of incomplete NDEF message
 */
function getTlvBlocks(nfcMemory) {
  if (nfcMemory === null || nfcMemory.length === 0) {
    throw new Error('Error parsing NFC Memory, nothing read');
  }

  var tlvBlocks = [];
  var done = false;
  var pos = 0;
  do {
    var parseLength = nfcMemory.length - pos;
    var parseSection = nfcMemory.slice(pos, parseLength);
    try {
      var currentTlvBlock = new _tlvBlock2.default(parseSection);
      if (currentTlvBlock.getType() === _tlvBlock.TYPE_NDEF_MESSAGE_TLV || currentTlvBlock.getType() === _tlvBlock.TYPE_TERMINATOR_TLV) {
        done = true;
      }
      pos += currentTlvBlock.getTotalLength();
      tlvBlocks.push(currentTlvBlock);
    } catch (e) {
      // if an error occours before the NDEF message was captured, rethrow (we don't care about incomplete data when the NDEF is completey read)
      if (!done) {
        throw e;
      }
    }
  } while (!done && pos < nfcMemory.length - 1);

  return tlvBlocks;
}

// URI identifier codes from URI Record Type Definition NFCForum-TS-RTD_URI_1.0 2006-07-24
// index in array matches code in the spec
var URI_PROTOCOLS = ['', 'http://www.', 'https://www.', 'http://', 'https://', 'tel:', 'mailto:', 'ftp://anonymous:anonymous@', 'ftp://ftp.', 'ftps://', 'sftp://', 'smb://', 'nfs://', 'ftp://', 'dav://', 'news:', 'telnet://', 'imap:', 'rtsp://', 'urn:', 'pop:', 'sip:', 'sips:', 'tftp:', 'btspp://', 'btl2cap://', 'btgoep://', 'tcpobex://', 'irdaobex://', 'file://', 'urn:epc:id:', 'urn:epc:tag:', 'urn:epc:pat:', 'urn:epc:raw:', 'urn:epc:', 'urn:nfc:'];

// decode a URI payload bytes
// @returns a string
function decodeUri(data) {
  var prefix = URI_PROTOCOLS[data[0]];
  if (!prefix) {
    return data.length > 1 ? data.slice(1).toString() : null;
  }
  return prefix + data.slice(1).toString();
}