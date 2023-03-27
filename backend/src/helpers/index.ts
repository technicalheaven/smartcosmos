export function findDuplicates(inputArray:any){
return inputArray.reduce(function(acc:any, el:any, i:any, arr:any) {
  if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
}, []);
} 

//return value of a key that starts with a specified prefix
export async function findValueByPrefix(object:any, prefix:any) {
  for (var property in object) {
    if (object.hasOwnProperty(property) && 
       property.toString().startsWith(prefix)) {
       return object[property];
    }
  }
}

//return value of a key that ends with a specified suffix
export async function findValueBySuffix(object:any, suffix:any) {

  const matches = [];
  for (let key of Object.keys(object)) {
    if (key.endsWith(suffix)) {
      matches.push(object[key]);
    }
  }
  return matches;
}

// return value of a key of a object
export async function findValueByKey(object:any, key:any) { 
  return object[key];
}

// get element from array for specified key
export async function getObjectFromArrByKeyValue(arr:any[], key:any, value:any) {
  if(!arr.length) return []
  const result:any = arr.filter((ele:any)=> {return ele[key] === value})
  return result;
}

export const isJsonString = (str:any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}