/**
 * 构建通用的下拉框数据
 * @param list
 * @param name
 * @param value
 */
export function buildCommonSelect(list, name, value) {
    let selectList = [];
    if(list == null || list.length === 0) {
        return [];
    }
    let tempSet = new Set();
    // console.log(list);
    list.forEach((item) => {
        if(!tempSet.has(item[value])) {
            const obj = {
                name: item[name],
                value: item[value]
            };
            selectList.push(obj);
            tempSet.add(item[value]);
        }
    });
    return selectList;
}
