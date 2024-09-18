import { Sequelize, where, Op, ENUM, or, fn, col, literal } from "sequelize";
import axios from 'axios';
import db from "../models";

const CryptoJS = require('crypto-js'); // npm install crypto-js
const bodyParser = require('body-parser'); // npm install body-parser
const moment = require('moment'); // npm install moment
const qs = require('qs');
const Order = db.Order;


const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const createZaloPayOrder = async (req, res) => {
    const embed_data = {
        //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
        redirecturl: 'http://18.141.222.147:3002/home/cab75b9e-dacd-4a25-8f12-cbd04d066f3f',
    };
    const items = [];
    const transID = Math.floor(Math.random() * 1000000);
    console.log(transID);



    const { price } = req.body

    const order = {

        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: 'user123',
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: price,
        callback_url: 'https://13ee-2001-ee0-7949-48f0-dcaa-aa38-e2b6-77f.ngrok-free.app/v1/payment/callback',
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: '',
    };
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        console.log(result.data);


        return result.data
    } catch (error) {
        console.log(error);
    }
};


const callbackUrl = async (req, res) => {
    let result = {};
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        // Tạo chữ ký từ dữ liệu nhận được
        let mac = CryptoJS.HmacSHA256(dataStr, process.env.ZALOPAY_KEY2).toString();

        // Kiểm tra chữ ký
        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'MAC không hợp lệ';
        } else {
            // Parse dữ liệu JSON
            let dataJson = JSON.parse(dataStr);

            // Lấy thông tin từ dữ liệu phản hồi của ZaloPay
            const appTransId = dataJson['app_trans_id'];
            const orderId = appTransId.split('_')[1]; // Lấy ID đơn hàng
            const amount = dataJson['amount']; // Số tiền thanh toán
            const zpTransId = dataJson['zp_trans_id']; // Mã giao dịch ZaloPay
            const embedData = dataJson['embed_data']; // Dữ liệu nhúng từ ZaloPay

            // Tìm đơn hàng trong cơ sở dữ liệu
            const order = await Order.findByPk(orderId);

            if (order) {
                // Tạm thời bạn có thể kiểm tra số tiền thanh toán trùng khớp
                if (order.total_price === amount) {
                    // Cập nhật trạng thái đơn hàng thành 'completed'
                    order.status = 'completed';
                    await order.save();
                    result.return_code = 1;
                    result.return_message = 'Cập nhật trạng thái thành công';
                } else {
                    result.return_code = -1;
                    result.return_message = 'Số tiền thanh toán không khớp';
                }
            } else {
                result.return_code = -1;
                result.return_message = 'Không tìm thấy đơn hàng';
            }
        }
    } catch (ex) {
        console.log('Lỗi:', ex?.message || ex);
        result.return_code = 0;
        result.return_message = ex?.message || 'Lỗi không xác định';
    }

    // Trả về kết quả
    return result;
};
export { createZaloPayOrder, callbackUrl }