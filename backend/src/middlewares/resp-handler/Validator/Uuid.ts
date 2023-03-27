function isUuid(id:string){
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    if(id.match(regexExp)==null){
        return false
    }
    return true
}
module.exports=isUuid