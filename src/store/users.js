import User from "../entity/user.js";

const user1 = new User.Builder()
    .setId('001')
    .setFirstName('Kong')
    .setLastName('Badass')
    .setEmail('kong@mail.net')
    .setAddress('No.5 Makspeson Avenue')
    .setPhoneNumber('0803737646')
    .build();

const user2 = new User.Builder()
    .setId('002')
    .setFirstName('Hong')
    .setLastName('Kelan')
    .setEmail('hong@mail.net')
    .setAddress('No.5 green Avenue')
    .setPhoneNumber('0869737646')
    .build();    

const user3 = new User.Builder()
    .setId('003')
    .setFirstName('Bong')
    .setLastName('Sallim')
    .setEmail('bong@mail.net')
    .setAddress('No.2 RedVille circle')
    .setPhoneNumber('0803737435')
    .build();  
    
//since compiler will  not accept over 7 lines of method chains
user1.password = '@#%^@$*';
user1.is_admin = true;

user2.password = '/%^3#(*$';
user2.is_admin = true;

user3.password = '!@&*#@';
user3.is_admin = true;



const users = [user1, user2, user3];

export default users;

