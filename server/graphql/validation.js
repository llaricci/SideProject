import { ObjectId } from "mongodb";

const validation = {
    checkObjectId: (id) => {
        console.log('checking ID')
        if(!id) throw  `Error you must provide an id}`;
        console.log('frist check')
        if(typeof id === 'string') id = id.trim(); 
            else throw `Error: objectId must be of type string`
        console.log('second check')
        if(id.length === 0 ) throw `Error: objectId cannot be empty spaces`;
        console.log('third check')
        if(!/^[a-zA-Z0-9\s]+$/.test(id)) throw `Error objectId must contain only numbers and letters`
        if(!ObjectId.isValid(id)) throw `Error ${id} is not a valid Object Id`
        return id;
    },

    checkString: (stringVal, varName) =>{
        if(!stringVal) 
            throw  `Error you must provide a ${varName}`;
        if(typeof stringVal === 'string') 
            stringVal = stringVal.trim(); 
            else throw `Error: ${varName} must be of type string`
        if(stringVal.length === 0 ) 
            throw `Error: ${varName} cannot be empty spaces`;
        if (!/^[a-zA-Z0-9\s'",.!?;:()\[\]{}-]+$/.test(stringVal)) {
            throw `Error: ${varName} must contain only numbers, letters, spaces, or valid punctuation`;
        }
        return stringVal;
    },

    checkAlphabet: (stringVal, varName) => {
        if(!stringVal) 
            throw  `Error you must provide a ${varName}`;
        if(typeof stringVal === 'string') 
            stringVal = stringVal.trim(); 
            else throw `Error: ${varName} must be of type string`
        if(stringVal.length === 0 ) 
            throw `Error: ${varName} cannot be empty spaces`;
        if (!/^[a-zA-Z\s,.]+$/.test(stringVal)) {
            throw `Error: ${varName} must contain only alphabetical characters`;
        }
        return stringVal;
    },
}

export default validation;