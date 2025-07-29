import { nanoid } from "npm:nanoid"

/**
 * 含有id的对象类型
 */
interface IObject extends Record<string, unknown> {
    id: string
}

/**
 * 在数组JSON中追加对象数据
 * @param filePath 文件路径
 * @param appendData 对象数据
 */
export async function append(filePath: string, appendData: object) {
    const rawData = await Deno.readTextFile(filePath)
    const parsedData = JSON.parse(rawData)
    const id = nanoid()
    parsedData[id] = appendData;
    await Deno.writeTextFile(filePath, JSON.stringify(parsedData))
}

/**
 * 更新某一项
 * @param filePath 文件路径
 * @param updateData 要更新的数据
 */
export async function update(filePath: string, updateData: IObject) {
    const rawData = await Deno.readTextFile(filePath)
    const parsedData = JSON.parse(rawData)
    const { id, ...rest } = updateData
    parsedData[id] = rest;
    await Deno.writeTextFile(filePath, JSON.stringify(parsedData))
}

/**
 * 移除一项
 * @param filePath 文件路径
 * @param id 删除的元素
 * @returns 
 */
export async function remove(filePath: string, id: string) {
    const rawData = await Deno.readTextFile(filePath)
    const parsedData = JSON.parse(rawData)
    const removeData = parsedData[id]
    delete parsedData[id]
    await Deno.writeTextFile(filePath, JSON.stringify(parsedData))
    return removeData
}

/**
 * 对所有方法
 * @param req 
 * @returns 
 */
export async function getDataFromReq(req: Request) {
    if (["GET", "DELETE"].includes(req.method)) {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.search);
        const dataString = searchParams.get("data")
        console.log(dataString)
        let params = {};
        if (dataString) {
            params = JSON.parse(dataString)
        }
        return params as IObject
    }
    let body = {}
    if (req.body) {
        body = await req.json()
    }
    return body as IObject
}

