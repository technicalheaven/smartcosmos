import { seedScanSMRev } from "./20221115061022-scanSMRev"
import { seedSelectDeviceRev } from "./20221116050416-selectDeviceRev"
import { seedReadyWFRev } from "./20221116071006-readyWorkflowRev"
import { seedPredefinedNodes } from './20221122070115-predefinedNodes'
import { seedSelectSiteRev } from "./20221122070116-selectSiteRev"
import { seedSelectZoneRev } from "./20221122070117-selectZoneRev"
import { seedPredefinedNodesSiteZone } from "./20221206070119-predefinedNodes-site-zone"
import { seedInputRevName } from "./20221206070120-inputRev-ChangeName"
import { seedGPIOLightWFRev } from "./20221207071006-gpioLightRev"
import { seedGPIOSoundWFRev } from "./20221207071007-gpioSoundRev"
import { seedPrintLabelWFRev } from "./20221207071008-printLabelRev"
import { seedDigitizationWFRev } from "./20221207071126-Digitization"
import { seedTrackNtraceWFRev } from "./20221207072345-TrackNtrace"
import { seedNodeMapping } from "./20221212071008-nodeMapping"
// import { seedNodeMappingChange } from "./20221212071008-nodeMappingChangeInputName"
import { seedNodeMappingDandT } from "./202212120710298-nodeMappingAddDigitization&TNT"
import { seedPredefinedNodesRev2 } from "./20221214070115-predefinedNodesRev"
import { seedNodeMappingEncodeNFCUHF } from "./202212290710298-nodeMappingEncode"
import { seedEncodeNFC } from "./20221229072345-encodeNfc"
import { seedEncodeUHF } from "./20221229072345-encodeUHF"
import { seedNodeMappingLockTag } from "./202301120710298-nodeMappingLocktag"
import { seedLockTag } from "./20230112072345-locktag"

export const seedMongoDbData = async () => {
    await seedPredefinedNodes()
    await seedPredefinedNodesSiteZone()
    await seedScanSMRev()
    await seedSelectDeviceRev()
    await seedSelectSiteRev()
    await seedSelectZoneRev()
    await seedReadyWFRev();
    await seedGPIOLightWFRev();
    await seedGPIOSoundWFRev();
    await seedPrintLabelWFRev();
  
    await seedNodeMapping()
    await seedPredefinedNodesRev2()
    await seedDigitizationWFRev()
    await seedTrackNtraceWFRev()
    await seedInputRevName()
  //  seedNodeMappingChange()
    await seedNodeMappingDandT()
    await seedEncodeNFC()
    await seedEncodeUHF()
    await seedNodeMappingEncodeNFCUHF()
    await seedLockTag()
    await seedNodeMappingLockTag()
    
}