import Property from "../entity/property.js";

const prop1 = new Property.Builder()
    .setId('001')
    .setOwner('002')
    .setStatus('Available')
    .setPrice('50000$')
    .setState('GA')
    .setCity('Austel')
    .setAddress('4568 Maidison circle')
    .setType('Duplex')
    .setCreatedOn()
    .setImageUrl('')
    .build();


const prop2 =  new Property.Builder()
    .setId('002')
    .setOwner('001')
    .setStatus('Sold')
    .setPrice('501200$')
    .setState('NY')
    .setCity('Washinton')
    .setAddress('No.403 Grails Ave')
    .setType('Bungalow')
    .setCreatedOn()
    .setImageUrl('')
    .build();


const prop3 =  new Property.Builder()
    .setId('003')
    .setOwner('003')
    .setStatus('Available')
    .setPrice('45000$')
    .setState('TEX')
    .setCity('Texas')
    .setAddress('NO.45 Yellow Mond field')
    .setType('3 bedrooms')
    .setCreatedOn()
    .setImageUrl('')
    .build();


const props = [prop1, prop2, prop3];

export default props;

