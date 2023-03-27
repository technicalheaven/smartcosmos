let tagId = '394950001CF5F2'
const tagIdBytes = Buffer.from(tagId, 'hex');

switch (tagIdBytes[0]) {
    case 0x04: // NXP
        console.log("0x04");
        break;

    case 0x39:
        console.log("ox39")
        break;
    default:
        console.log("error");
        break;
}

console.log("tagId", tagIdBytes,tagIdBytes[0],tagIdBytes.length)