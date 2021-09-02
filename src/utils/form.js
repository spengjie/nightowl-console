export function validateHost(value) {
  return /^\s*[0-9A-Za-z\-.]+\s*$/.test(value);
}

const IP_MATCH = '(?:2[0-4]\\d|25[0-5]|[01]?\\d\\d?)(?:\\.(?:2[0-4]\\d|25[0-5]|[01]?\\d\\d?)){3}';
const IP_REGEX = new RegExp(`^${IP_MATCH}$`);
const SUBNET_REGEX = new RegExp(`^${IP_MATCH}(?:/(?:3[0-2]|[12]\\d|\\d))?$`);
const IPRANGE_REGEX = new RegExp(`^${IP_MATCH}-${IP_MATCH}$`);

export function validateIp(value) {
  return IP_REGEX.test(value);
}

export function validateIplist(value) {
  if (!value) return false;
  const ipdefs = value.split(';');
  return ipdefs.every(ipdef => {
    if (ipdef.includes('-')) return IPRANGE_REGEX.test(ipdef);
    if (ipdef.includes('/')) return SUBNET_REGEX.test(ipdef);
    return validateIp(ipdef);
  });
}
