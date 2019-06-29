import Flag from "../entity/flag.js";

const flag1 = new Flag.Builder()
    .setId("1")
    .setPropertyId('003')
    .setReason('Outrageous Pricing!')
    .setDescription('House Report')
    .setCreatedOn()
    .build();

const flag2 = new Flag.Builder()
    .setId("2")
    .setPropertyId("2")
    .setReason('Location does not exist')
    .setDescription('Fake advert')
    .setCreatedOn()
    .build();

const flag3 = new Flag.Builder()
    .setId("3")
    .setPropertyId("3")
    .setReason('Poor facilities')
    .setDescription('Uncondusive house')
    .setCreatedOn()
    .build();

const flags = [flag1, flag2, flag3];

export default flags;

