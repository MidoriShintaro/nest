import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import * as qs from 'qs';
@Injectable()
export class ZalopayService {
  private readonly config = {
    app_id: process.env.ZALOPAY_APPID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: process.env.ZALOPAY_ENDPOINT,
    endpoint_result: process.env.ZALOPAY_ENDPOINT_RESULT,
    callback_url: process.env.CALLBACK_URL,
    redirect_url: process.env.REDIRECT_URL,
  };

  async createPayment(amount: number, username: string, app_trans_id: string) {
    const embed_data = {
      redirecturl: this.config.redirect_url,
    };
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: this.config.app_id,
      app_trans_id: app_trans_id,
      app_user: username,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      callback_url: this.config.callback_url,
      description: `Payment for the order #${transID}`,
      bank_code: 'zalopayapp',
      mac: '',
    };

    const data = `${order.app_id}|${app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, this.config.key1).toString();

    try {
      const response = await axios.post(this.config.endpoint, null, {
        params: order,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getResult(app_trans_id: number) {
    const postData = {
      app_id: this.config.app_id,
      app_trans_id: app_trans_id,
      mac: '',
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${this.config.key1}`; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, this.config.key1).toString();

    const postConfig = {
      method: 'post',
      url: this.config.endpoint_result,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData),
    };

    try {
      const response = await axios(postConfig);
      console.log(JSON.stringify(response.data));
      return response.data; // Trả về dữ liệu từ response
    } catch (error) {
      console.error('Error while calling API:', error);
      throw error; // Ném lại lỗi để xử lý ở nơi khác nếu cần
    }
  }
}
