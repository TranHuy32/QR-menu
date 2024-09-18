const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
import { Router } from "express";
const bodyParser = require('body-parser'); // npm install body-parser
const moment = require('moment'); // npm install moment
const qs = require('qs');
import { createZaloPayOrder,callbackUrl } from "../../../services/zaloPayServices";

const route = Router();

const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const zaloPayRoutes = (app) => {
    app.use(bodyParser.json());
    app.use("/payment", route);
    route.post("/zalopay", async (req, res, next) => {
        try {
            const zaloPay = await createZaloPayOrder(req);
            res.status(200).json({ status: 202, listTable: zaloPay.message });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "zaloPay" });
        }
    })


    route.post("/callback", async (req, res, next) => {
        try {
            const zaloPay = await callbackUrl(req);
            res.status(200).json({ status: 202});
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "zaloPay" });
        }
    });



    // route.post("/check-status-order/:app_trans_id", async (req, res, next) => {
    //     const { app_trans_id } = req.params;

    //     let postData = {
    //         app_id: config.app_id,
    //         app_trans_id, // Input your app_trans_id
    //     };

    //     let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    //     postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    //     let postConfig = {
    //         method: 'post',
    //         url: 'https://sb-openapi.zalopay.vn/v2/query',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         data: qs.stringify(postData),
    //     };

    //     try {
    //         const result = await axios(postConfig);
    //         console.log(result.data);
    //         return res.status(200).json(result.data);
    //         /**
    //          * kết quả mẫu
    //           {
    //             "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
    //             "return_message": "",
    //             "sub_return_code": 1,
    //             "sub_return_message": "",
    //             "is_processing": false,
    //             "amount": 50000,
    //             "zp_trans_id": 240331000000175,
    //             "server_time": 1711857138483,
    //             "discount_amount": 0
    //           }
    //         */
    //     } catch (error) {
    //         console.log('lỗi');
    //         console.log(error);
    //     }
    // });
}
export default zaloPayRoutes