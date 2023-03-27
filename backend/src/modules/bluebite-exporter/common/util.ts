export const stripKey = (key:any) => key
  .trim()
  .toLowerCase()
  .replace(/ /g, '')
  .replace(/_/g,'')
  .replace(/-/g, '');