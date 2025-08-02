// import * as express from "express";
// const router = express.Router();
// import * as common from "../common.ts";
// import * as constants from "../constants.ts";
// import { User } from "../../types/User.ts";

// async function isDuplicateId(id: string) {
//     // バリデーション
//     // const validationResult = common.validation(body.id, body.password);
//     // if (!validationResult.result.is_success) {
//     //     return validationResult;
//     // }

//     // ユーザーが存在するかどうかを確認
//     const result = await common.authUser(body.id, body.password);
//     if (result.result.is_success) {
//         result.result.reason = "ユーザーが既に存在します";
//         result.result.is_success = false;
//     } else {
//         result.result.reason = "";
//         result.result.is_success = true;
//     }
//     return result;
// }

// async function isDuplicateIdHandler(req: express.Request, res: express.Response) {
//     /*
//     idを受け取り、ユーザーが存在するかどうかを返す。
//     入力:
//     {
//         id: 'ユーザーID'
//     }
//     */
//     // パラメータのチェック
//     const allowedParams = [constants.API_PARAM_ID, constants.API_PARAM_PASSWORD];
//     const paramCheckResult = common.check_parameters(req.body, allowedParams);
//     if (!paramCheckResult.getIsSuccess()) {
//         return paramCheckResult;
//     }
//     const result = await isDuplicateId(req.body);
//     res.status(result.status).json(result.result);
//     return;
// }

// router.post("/", isDuplicateIdHandler);
// export { router };
