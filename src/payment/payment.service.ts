import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types, Mongoose, ClientSession} from 'mongoose';

import { Payment } from './entity/Payment.entity';
import { PaymentDto } from './dto/payment.dto';


@Injectable()
export class PaymentService {

    constructor(@InjectModel (Payment.name) private paymentModel: Model<Payment>){}
  
    //async update (updatePaymentDto: PaymentDto, id:string): Promise<Payment>
    //{
    //    const {method, value} = updatePaymentDto;
    //    const idObject = new Types.ObjectId(id);
    //    const oldPayment = await this.paymentModel.findById(idObject).exec();
    //    if(!oldPayment)
    //    {
    //        throw new Error('Payment not found!!!');
    //    }
    //    if(method!= oldPayment.method || method==null)
    //    {
    //        oldPayment.method = method;
    //    }
    //    if(value!= oldPayment.value || method==null)
    //    {
    //        oldPayment.value = value;
    //    }
    //    return await oldPayment.save();
    //}

    //async delete (ids: string[])
    //{
    //    for(const id of ids)
    //    {
    //        const session: ClientSession =await this.paymentModel.startSession();
    //    session.startTransaction();
    //    console.error('idNumber:',id)

    //    const obejctId =new  Types.ObjectId(id);
        
    //    console.error('objcetID',obejctId);

    //    const oldPayment = await this.paymentModel.findById(obejctId).exec();
    //    if(!oldPayment)
    //    {
    //        throw new Error('Category not found!!!');
    //    }
    
        
        
       
    //    }
        
    //}
    //async findByName(categoryName: string): Promise<Payment>{
    //    return null;
       
    //}
    //async findByNameReturnId(categoryName: string): Promise<string>{
    //    return null;
       
    //}
    //async findByIdReturnName(categoryId: string): Promise<String>{
       
    //           return null;;
    //}
    //async deleteOldProductAndAddnewProduct(oldName:string, newName:string, productId: string): Promise<boolean> {
    //    try{

    //    const oldCategory = this.categoryModel.findOne({categoryname:oldName});
    //    const newCategory = this.categoryModel.findOne({categoryname:newName});
    //    const oldProduct = (await oldCategory).Products;
    //    const oldIndex = oldProduct.indexOf(productId);
    //    oldProduct.splice(oldIndex,1);

    //    const newProduct = (await newCategory).Products;
    //    newProduct.push(productId);
    //    (await oldCategory).Products = oldProduct;
    //    (await newCategory).Products = newProduct;
    //    (await oldCategory).save();
    //    (await newCategory).save();
    //    return true;
    //    }
    //    catch(Error)
    //    {
    //        return false;
    //    }
        
        
    //}
    //async findNameAndCode(createCategoryDto: CategoriesDTO): Promise<boolean> {
    //    const category = await this.categoryModel.findOne({ categoryname: createCategoryDto.categoryname }).exec();
    //    if (!category) {
    //        Logger.error('Category not found');
    //        return false;
    //    }
    //    return true;
    //}
    
    //async create(createPaymentDto:PaymentDto ): Promise<Payment> {
    //    const exists = await this.findNameAndCode(createPaymentDto);
    //    if (exists) {
    //        Logger.error('Payment already exists');
    //        return null;
    //    }

    //    const createdPayment = new this.paymentModel(createPaymentDto);
    //    return createdPayment.save();
    //}

    //async findAll (): Promise<Category[]>
    //{
     
    //    return this.categoryModel.find().exec();
    //}
}