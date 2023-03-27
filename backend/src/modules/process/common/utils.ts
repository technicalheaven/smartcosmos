export const WorkflowStatus = {
    IDLE: 'idle',
    RUNNING: 'running',
    COMPLETED: 'completed'
}

export const WorkflowNodeStatus = {
    IDLE: 'idle',
    RUNNING: 'running',
    COMPLETED: 'completed'
}

export const StateMachineStatus = {
    IDLE: 'idle',
    RUNNING: 'running',
    COMPLETED: 'completed'
}

export const StateStatus = {
    IDLE: 'idle',
    RUNNING: 'running',
    COMPLETED: 'completed'
}

export const StateEvents = {
    //core events
    Start: 'start',
    Stop: 'stop',
    Success: 'success',
    Error: 'error',
    // digitization events
    ScanBarcode: 'Scan Barcode',
    ScanQRCode: 'Scan QRcode',
    ScanNFC: 'Scan NFC',
    ScanUHF: 'Scan UHF',
    EncodeNFC: 'Encode NFC',
    EncodeUHF: 'Encode UHF',
    Input: 'Input',
    //track n trace
    ScanTag: 'Scan Tag',
    GPIOLight: 'GPIO Light',
    GPIOSound: 'GPIO Sound',
    FileUpload: 'File Upload', 
    PrintLabel: 'Print Label'
}

export const NodeNames = {
    ScanBarcode: 'Scan Barcode',
    ScanQRCode: 'Scan QRcode',
    ScanNFC: 'Scan NFC',
    ScanUHF: 'Scan UHF',
    EncodeNFC: 'Encode NFC',
    EncodeUHF: 'Encode UHF',
    //track n trace
    ScanTag: 'Scan Tag',
    GPIOLight: 'GPIO Light',
    GPIOSound: 'GPIO Sound',
    FileUpload: 'File Upload',
    PrintLabel: 'Print Label',
    //common
    Input: 'Add Input Field',
    SelectSite: 'Select Site',
    SelectZone: 'Select Zone',
    SelectDevice: 'Select Device',
    Ready: 'Ready',
    Digitization: 'Digitization',
    TrackNtrace: 'TrackNTrace',
    LockTag :"LockTag"
}

export type Validation = {
    type:string
    value:any
}

export const Conditions = {
    StartsWith : 'startsWith',
    EndsWith : 'endsWith',
    Contains : 'contains',
    None: 'none',
    Regex: 'regex'
}

export const NodeType = [
    {name: 'Select Device', type: 'SM'},
    {name: 'Select Site', type: 'SM'},
    {name: 'Select Zone', type: 'SM'},
    {name: 'Ready', type: 'WF'},
    { name: 'Scan Barcode', type: 'SM' },
    { name: 'Scan QRcode', type: 'SM' },
    { name: 'Scan NFC', type: 'SM' },
    { name: 'Scan UHF', type: 'SM' },
    { name: 'Scan Tag', type: 'SM' },
    { name: 'Encode NFC', type: 'WF' },
    { name: 'Encode UHF', type: 'WF' },
    { name: 'Input', type: 'WF' },
    //track n trace
    { name: 'GPIO Light', type: 'WF' },
    { name: 'GPIO Sound', type: 'WF' },
    { name: 'Print Label', type: 'WF' }
]

export type InputOutputSM = {
    name:string,
    data:any
}

