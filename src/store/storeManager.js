
class StoreManager {

    constructor(store) {
        this.store = store;
    }

    static mount (store){
        return new StoreManager(store);
    }

    insert (entity){
        return new Promise((res, rej) =>{
            if (this.store.push(entity)){
                res(this.store[this.store.length-1])
            }else{
                rej(new Error('Failed to create record'))
            }
        });
    }

    findById (id){
        return new Promise((res, rej) =>{
            const record = this.store.find(({id:theId}) => theId === id);
            if (record){
                res(record)
            }else{
                rej(new Error('No record'))
            }
        });
    }

    findAll (){
        return new Promise((res, rej) =>{
            const records = this.store;
            if (records){
                res(records);
            }else{
                rej(new Error('No records'));
            }
        });
    
    }

    // eslint-disable-next-line no-dupe-class-members
    findAll (key, val){
        const records = this.store.filter(record => record[key] === val);
        let found = records.length > 0;
        return new Promise((res, rej) =>{
            if (found){
                res(records);
            }else{
                rej(new Error('No records'));
            }
        });
        
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
        return new Promise((res, rej) =>{
            if (updated){
                res(recordToUpdate);
            }else{
                rej(new Error('Operation unsuccessful'));
            }
        });
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
        
        return new Promise((res, rej) => {
            if (deleted){
                res('operation successful')
            }else{
                rej(new Error('Operation unsuccessful'));
            }
        });
    }	
    
    erase (){
        this.store.splice(0, this.store.length);
        let erased = this.store.length === 0;
        return new Promise((res, rej) =>{
            if (erased){
                res("Operation successful");
            }else{
                rej("Operation unsuccessful");
            }
        });

    }

    unmount (){
        this.store = [];
        const unmounted = this.store.length === 0;
        return new Promise((res) =>{
            if(unmounted) res('Operation successful');
        });
    }
}

export default StoreManager;

