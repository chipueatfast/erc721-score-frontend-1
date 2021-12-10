export function reduceAddressForDisplay(address: string) {
    return `${address.substr(0, 3)}...${address.substr(address.length-4, address.length -1)}`;
}
