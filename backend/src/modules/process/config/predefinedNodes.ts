export const SelectDeviceState:any = {
    "PR1": {
      "metadata":{
        "version":""
      },
      "properties": {
        "name": "Select Device",
        "icon": "iconImage.png",
        "validation": "",
        "validationValue":""
      }
    }
}

export const SelectDeviceStateTransition:any = {
    "PR1": {
        "onEnter": {},
        "on": {
          "Select Device": {
            "condition": "",
                "value": "",
                "to": ""
            }
        },
        "onExit": {}
    },
}

export const ReadyState:any = {
  "PR2": {
    "metadata":{
      "version":""
    },
    "properties": {
      "name": "Ready",
      "icon": "iconImage.png",
      "validation": "",
      "validationValue":""
    }
  }
}

export const ReadyStateTransition:any = {
  "PR2": {
      "onEnter": {},
      "on": {
        "Ready": {
          "condition": "",
              "value": "",
              "to": ""
          }
      },
      "onExit": {}
  }
}
