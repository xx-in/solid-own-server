
import data from "./data.json" with { type: "json" };
import { append, update, remove, getDataFromReq } from "./utils/index.ts"

async function handler(req: Request) {
    const { pathname } = new URL(req.url);
    if (pathname == "/list") {
        return new Response(JSON.stringify(data));
    } else if (pathname == "/append") {
        const body = await getDataFromReq(req)
        await append("./data.json", body)
        return new Response(JSON.stringify({
            message: "新增成功"
        }))
    } else if (pathname == "/remove") {
        const body = await getDataFromReq(req)
        const data = await remove("./data.json", body.id)
        return new Response(JSON.stringify({
            data,
            message: "删除成功"
        }))
    } else if (pathname == "/update") {
        const body = await getDataFromReq(req)
        await update("./data.json", body)
        return new Response(JSON.stringify({
            message: "更新成功"
        }))
    }
    return new Response(JSON.stringify({
        message: "未定义"
    }))
}
Deno.serve(handler);