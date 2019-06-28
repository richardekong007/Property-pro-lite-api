
class StoreManager {

    constructor(store) {
        this.store = store;
        this._configureIdIncrement();
    }

    static mount (store){
        return new StoreManager(store);
    }

    insert (entity){
        
        if (this._isIdDuplicated(entity)) {
            return Promise.reject(new Error('Duplicate id'));
        }
        if (this._isEmailDuplicated(entity)) {
            return Promise.reject(new Error('Email already exists'));
        }
        return new Promise((res, rej) =>{
            let newId = this.store.push(entity);
            if (newId){
                entity.id = newId;
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
                res('Operation successful');
            }else{
                rej('Operation unsuccessful');
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

    _isIdDuplicated (entity){
        let duplicated;
        if (entity){
            const recordsWithDupId = this.store.filter(record => record.id === entity.id);
            duplicated = recordsWithDupId.length > 0;
        }
        return duplicated;
    }

    _isEmailDuplicated (entity){
        let duplicated;
        if (entity){
            const keys = Object.keys(entity);
            if (keys.includes('email')){
                const recordWithDupEmail = this.store.filter(record => record.email === entity.email);
                duplicated = recordWithDupEmail.length > 0;
            }
            
            return duplicated;
        }
    }
    _configureIdIncrement (){
        if (this.store.length > 0){
            this.store.forEach((record, index) => record.id = index + 1);
        }
    }
}

export default StoreManager;

