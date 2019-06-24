
class Flag {

    constructor(builder){
        this.id = builder.id;
        this.property_id = builder.property_id;
        this.created_on = builder.created_on;
        this.reason = builder.reason;
        this.description = builder.description;
    }

    static get Builder (){
        class Builder {

            setId (id){
                this.id = id;
                return this;
            }

            setPropertyId (id){
                this.property_id = id;
                return this;
            }

            setCreatedOn (){
                this.created_on = new Date();
                return this;
            }

            setReason (reason){
                this.reason = reason;
                return this;
            }

            setDescription (desc){
                this.description = desc;
                return this;
            }

            build (){
                return new Flag(this);
            }
        }
        return Builder;
    }
}

export default Flag;