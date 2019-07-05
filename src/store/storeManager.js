
import fs from 'fs'; 

class StoreManager {

    constructor(file) {
        this.file = file;
    }

    static mount(file){
        return new StoreManager(file);
    }

    insert (entity){
        
        if (this._isIdDuplicated(entity)) {
            return Promise.reject(new Error(`Duplicate id: ${entity.id}`));
        }
        if (this._isEmailDuplicated(entity)) {
            return Promise.reject(new Error(`${entity.email} already exists`));
        }
        let records = this._readFromJSONFile();
        let newId = records.push(entity);
        entity.id = newId.toString();
        
        return new Promise((res, rej) =>{
            if (newId){
                this._writeToJSONFile(records);
                res(records[records.length-1]);
            }else{
                rej(new Error('Failed to create record'));
            }
        });
    }

    findById (id){
        let records = this._readFromJSONFile();
        return new Promise((res, rej) =>{
            const record = records.find(({id:theId}) => theId === id);
            if (record){
                res(record)
            }else{
                rej(new Error('No record'));
            }
        });
    }

    _checkkeys (keys, record) {
        let found = true;
         keys.forEach(key =>{
             found = found && Object.keys(record).includes(key);
            });
            return found;
    }

    _checkVals (vals, record){
        let found = true;
        vals.forEach(val => {
            found = found && Object.values(record).includes(val);
        });
        return found;
    }

    findOne (data){
        let searchedRecord;
        if (data){
            const dataVals = Object.values(data);
            const dataKeys = Object.keys(data);
            searchedRecord = this._readFromJSONFile().find(record =>
                this._checkkeys(dataKeys, record) 
                && this._checkVals(dataVals, record));
        }

        return new Promise((res, rej) =>{
            if (searchedRecord){
                res(searchedRecord);
            }else{
                rej(new Error('No record'));
            }
        });
    }

    findAll (){
        return new Promise((res, rej) =>{
            const records = this._readFromJSONFile();
            if (records){
                res(records);
            }else{
                rej(new Error('No records'));
            }
        });
    
    }

    // eslint-disable-next-line no-dupe-class-members
    findAll (key, val){
        const records = this._readFromJSONFile().filter(record => record[key] === val);
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
        const records = this._readFromJSONFile();
        const recordToUpdate = records.find((record) => record.id === id);
        if (recordToUpdate){
            Object.keys(data).forEach((key) =>{
                const recordKeys = Object.keys(recordToUpdate);
                    if (recordKeys.includes(key) && data[key]){
                        recordToUpdate[key] = data[key];
                        fs.writeFileSync(this.file,JSON.stringify(records, null, 1, 2));
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
        const records = this._readFromJSONFile();
        const size = records.length;
        records.filter((record,index,store) => {
          if (record.id === id){
              store.splice(index,1);
              fs.writeFileSync(this.file, JSON.stringify(records, null,1, 2))
          }
          deleted = size > store.length;
        });
        
        return new Promise((res, rej) => {
            if (deleted){
                res('operation successful');
            }else{
                rej(new Error('Operation unsuccessful'));
            }
        });
    }	

    erase (){
        let records = this._readFromJSONFile();
        this.erasedRecords = [...records];
        records.splice(0, records.length);
        return new Promise((res, rej) =>{
            if (records.length < 1){
                this._writeToJSONFile(records);
                res('Operation successful');
            }else{
                rej(new Error('Operation unsuccessful'))
            }
        });
    }

    restore (){
        //can only work during runtime, after runtime all erased records will be gone
        if (this.erasedRecords && this.erasedRecords.length > 0){
            this._writeToJSONFile(this.erasedRecords);
        }
    }

    _isIdDuplicated (entity){
        let duplicated;
        if (entity && !(this._isJSONFileEmpty())){
            const recordsWithDupId = this._readFromJSONFile().filter(record => record.id === entity.id);
            duplicated = recordsWithDupId.length > 0;
        }
        return duplicated;
    }

    _isEmailDuplicated (entity){
        let duplicated;
        if (entity && !(this._isJSONFileEmpty())){
            const keys = Object.keys(entity);
            if (keys.includes('email')){
                const recordWithDupEmail = this._readFromJSONFile()
                    .filter(record => record.email === entity.email);
                duplicated = recordWithDupEmail.length > 0;
            }
            
            return duplicated;
        }
    }
    _configureIdIncrement (){
        let records = this._readFromJSONFile();
        if (records.length > 0){
            records.forEach((record, index) => record.id = (index + 1).toString());
        }
    }

    _readFromJSONFile (){
        return JSON.parse(fs.readFileSync(this.file));
    }

    _writeToJSONFile (data){
        // let oldRecords;
        // if (!this._isJSONFileEmpty()){
        //     oldRecords = this._readFromJSONFile();
        //     oldRecords.push(this.buffer[this.buffer.length - 1]);
        // } else{
        //     oldRecords = this.buffer[this.buffer.length - 1];
        // }
        fs.writeFileSync(this.file, JSON.stringify(data, null, 1, 2));
    }

    _isJSONFileEmpty (){
        //for the purpose of this challenge
        let data = this._readFromJSONFile();
        return typeof data instanceof Array 
            && data.length < 1;
    }
}

export default StoreManager;

