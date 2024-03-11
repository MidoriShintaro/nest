import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { privateDecrypt } from 'crypto';
import { Model, Types, Mongoose, ClientSession} from 'mongoose';

import { ObjectId } from 'typeorm';
import { Voucher } from './entity/Voucher.entity';
import { VoucherDto } from './dto/Voucher.dto';


@Injectable()
export class VoucherService {

    constructor(@InjectModel (Voucher.name) private voucherModel: Model<Voucher>){}
    
    async areArraysEqual(arr1:string[], arr2:string[]) {
        // Kiểm tra xem cả hai đối số có phải là mảng không
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            throw new Error('Both inputs must be arrays.');
        }
    
        // Kiểm tra xem độ dài của hai mảng có bằng nhau không
        if (arr1.length !== arr2.length) {
            return false;
        }
    
        // So sánh từng phần tử của hai mảng
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
    
        // Nếu tất cả các phần tử giống nhau, trả về true
        return true;
    }
    async addElement(oldArray:string[],newArray:string[])
    {   
       newArray.forEach(function(elemet){
        if(!oldArray.includes(elemet))
        {
            oldArray.push(elemet)
        }
       })
       return oldArray;
    }
    async update (updateVoucherDto: VoucherDto, id:string): Promise<Voucher>
    {
        const {code,productIds,type,userIds,value} = updateVoucherDto;
        console.error('updateVoucherDto', updateVoucherDto);
        const idObject = new Types.ObjectId(id);
        const oldVoucher = await this.voucherModel.findById(idObject).exec();
        console.error("oldVoucher is:",oldVoucher);
        if(!oldVoucher)
        {
            throw new Error('Category not found!!!');
        }
        if(code != oldVoucher.code && code!=null)
        {
            oldVoucher.code = code;
        }
       
        if(type != oldVoucher.type && type!=null)
        {
            oldVoucher.type = type;
        }
        if(value != oldVoucher.value && value!=null)
        {
            oldVoucher.value = value;
        }
        console.error("oldVoucher is",oldVoucher.Products)
        

        if(productIds!= undefined)
        {
            console.error("type of oldVoucher.Products is ", typeof(oldVoucher.Products));
            console.error("type of prductIds is ", typeof(productIds));

            if(await this.areArraysEqual(oldVoucher.Products, productIds) == false || productIds.length == 0)
            {
                await this.addElement(oldVoucher.Products, productIds);
            }
        }
        
        if(userIds != undefined)
        {
            if(await this.areArraysEqual(oldVoucher.User, userIds) == false || userIds.length == 0)
        {
            await this.addElement(oldVoucher.User, userIds);
        }
        }
        
        console.error("oldVoucher again is:",oldVoucher);
        return await oldVoucher.save();
    }

    async delete (ids: string[])
    {
        for(const id of ids)
        {
            const session: ClientSession =await this.voucherModel.startSession();
        session.startTransaction();
        console.error('idNumber:',id)

        const obejctId =new  Types.ObjectId(id);
        
        console.error('objcetID',obejctId);

        const oldVoucher = await this.voucherModel.findById(obejctId).exec();
        if(!oldVoucher)
        {
            throw new Error('Voucher not found!!!');
        }
    
        
        
        try{
           
       

            const result =  await oldVoucher.deleteOne({_id:obejctId});
            if(result.deletedCount==0)
            {
                throw Error ('No category is deleted')
            }
            session.commitTransaction();
            session.endSession();

        }
        catch(error)
        {
            console.log(error);
            session.abortTransaction();
            session.endSession();
        }
        }
        
    }
   
    async findCode(createVoucherDto: VoucherDto): Promise<boolean> {
        const voucher = await this.voucherModel.findOne({ code:createVoucherDto.code }).exec();
        if (!voucher) {
            Logger.error('Voucher not found');
            return false;
        }
        return true;
    }
    
    async create(createVoucherDto: VoucherDto): Promise<Voucher> 
    {

        var codeR = "";
      
        if( createVoucherDto.code==  undefined)
        {
         codeR = await  this.createRandomString();
         console.error("code is craete random",codeR);
        createVoucherDto.code = codeR;
        console.error("code is craete random",createVoucherDto.code);

      
       
        } 
       else
       {
        codeR = createVoucherDto.code;
        
        if(codeR.length === 7)
        {
            const exists = await this.findCode(createVoucherDto);
        if (exists) {
            Logger.error('Voucher already exists');
            return null;
        }
        }
       }

       
        
        
        

        const voucherSave = new this.voucherModel(createVoucherDto);
        console.error("Voucher save",voucherSave);
        return voucherSave.save();
    }
    async createRandomString()
    {
        var result = "";

        // Generate a random uppercase letter
        var charCode = Math.floor(Math.random() * 26) + 65;
        var firstLetter = String.fromCharCode(charCode);
    
        // Generate a random number between 100000 and 999999
        var randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    
        // Concatenate the letter and the number
        result = firstLetter + randomNumber.toString();
    
        return result;
    }
    

    async findAll (): Promise<Voucher[]>
    {
     
        return this.voucherModel.find().exec();
    }
}  
