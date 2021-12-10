export function sortToGivenOrder({
    object,
    keys,
}: {
    object: any,
    keys: string[],
}) {
    const orderedObject: any = {};
    keys.forEach((key) => {
        orderedObject[key] = object[key];
    });
    return orderedObject;
}