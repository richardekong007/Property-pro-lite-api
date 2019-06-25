class StoreManager {

    constructor(store) {
        this.store = store;
    }

    static mount (store){
        return new StoreManager(store);
    }

    insert (entity){
        this.store.push(entity);
    }

    findById (id){
        return this.store.find(({id:theId}) => theId === id);
    }

    findAll (){
        return this.store;
    }

    // eslint-disable-next-line no-dupe-class-members
    findAll (key, val){
        return this.store.filter(record => record[key] === val);
    }

    update(id, data){
    
        let updated = false;
        const recordToUpdate = this.store.find((record) => record.id === id);
        if (recordToUpdate){
            Object.keys(data).forEach((key) =>{
                const recordKeys = Object.keys(recordToUpdate)
                    if (recordKeys.includes(key) && data[key]){
                        recordToUpdate[key] = data[key];
                        updated = true;
                    }
            });
        }
        return updated;
    }

    delete (id){
        let deleted;
        const size = this.store.length;
        this.store.filter((record,index,store) => {
          if (record.id === id){
              store.splice(index,1);
          }
          deleted = size > store.length;
        });
        return deleted;
    }		
}

export default StoreManager;

