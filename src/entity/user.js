class User {

    constructor(build){
        this.id = build.id;
        this.email = build.email;
        this.first_name = build.first_name;
        this.last_name = build.last_name;
        this.password = build.password;
        this.phoneNumber = build.phoneNumber;
        this.is_admin = build.is_admin;
    }

    static get Builder (){
        class Builder {
            
            setId (id){
                this.id = id;
                return this;
            }

            setEmail (email){
                this.email = email;
                return this;
            }

            setFirstName (name){
                this.first_name = name;
                return this;
            }

            setLastName (name){
                this.last_name = name;
                return this;
            }

            setPassword (password){
                this.password = password;
                return this;
            }

            setPhoneNumber (phone){
                this.phoneNumber = phone;
                return this;
            }

            setAddress (address){
                this.address = address;
                return this;
            }

            setIsAdmin (predicate) {
                this.is_admin = predicate;
                return this;
            }

            build (){
                return new User(this);
            }
        }

        return Builder;
    }
    
}

export default User;