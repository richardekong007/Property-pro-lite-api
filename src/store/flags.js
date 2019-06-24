import Flag from "../entity/flag.js";

const flag1 = new Flag.Builder()
    .setId('001')
    .setPropertyId('003')
    .setReason('Outrageous Pricing!')
    .setDescription('House Report')
    .setCreatedOn()
    .build();

const flag2 = new Flag.Builder()
    .setId('002')
    .setPropertyId('002')
    .setReason('Location does not exist')
    .setDescription('Fake advert')
    .setCreatedOn()
    .build();

const flag3 = new Flag.Builder()
    .setId('003')
    .setPropertyId('003')
    .setReason('Poor facilities')
    .setDescription('Uncondusive house')
    .setCreatedOn()
    .build();

const flags = [flag1, flag2, flag3];

export default flags;

