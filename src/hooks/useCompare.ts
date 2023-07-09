const dateCompare = (a: Date, b: Date) => {
    return a.getTime() - b.getTime();
};

const numberAndStringCompare = <T extends number | string>(a: T, b: T extends number ? number : string) => {
    return a > b ? 1 : -1;
};

export default function useCompare<T>(arr: T[], extractor: (item: T) => Date | number | string, reverse?: boolean): T[] {
    if (arr.length === 0)
        return arr;

    let compareFun: (a: any, b: any) => number;
    switch (typeof extractor(arr[0])) {
        case 'object':
            compareFun = dateCompare;
            break;
        case 'number':
        case 'string':
            compareFun = numberAndStringCompare;
            break;
    }

    if (!reverse)
        return arr.sort((a, b) => compareFun(extractor(a), extractor(b)));
    else
        return arr.sort((a, b) => compareFun(extractor(a), extractor(b))).reverse();
}
