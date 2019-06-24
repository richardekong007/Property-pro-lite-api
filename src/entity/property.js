class Property {

    constructor (builder) {
        this.id = builder.id;
        this.owner = builder.owner;
        this.status = builder.status;
        this.price = builder.price;
        this.state = builder.state;
        this.city = builder.city;
        this.address = builder.address;
        this.type = builder.type;
        this.created_on = builder.created_on;
        this.image_url = builder.image_url;
    }

    static get Builder (){

        class Builder{
            
            setId (id){
                this.id = id;
                return this;
            }

            setOwner (owner){
                this.owner = owner;
                return this;
            }

            setStatus (status){
                this.status = status;
                return status;
            }

            setPrice (price){
                this.price = price;
                return this;
            }

            setState (state){
                this.state = state;
                return this;
            }

            setCity (city){
                this.city = city;
                return this;
            }

            setAddress (address){
                this.address = address;
                return this;
            }

            setType (type){
                this.type = type;
                return this;
            }

            setCreatedOn (){
                this.created_on = new Date();
                return this;
            }

            setImageUrl (url){
                this.image_url = url;
                return this;
            }

            build (){
                return new Property(this);
            }
        }

        return Builder;
    }
 
}

export default Property;