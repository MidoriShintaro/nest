import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "./entity/Review.entity";
import { Product } from "src/product/entity/Product.entity";
import { Payment } from "src/payment/entity/Payment.entity";
import { ClientSession, Model, Types } from "mongoose";
import { User } from "src/user/entity/user.entity";
import { ReviewDTO } from "./dto/review.dto";
import { Type } from "class-transformer";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";



@Injectable()
export class ReviewService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>
) { }

    async create(reviewDto: ReviewDTO, user:any): Promise<Review> {
    const {comment,image,productId,rate} = reviewDto;
    
    const reviewObject = new Review();
    reviewObject.productId = productId;
    reviewObject.comment = comment;

    reviewObject.image = image;

    reviewObject.rate = rate;
    reviewObject.userId = user.id;

    const reviewModel = new this.reviewModel(reviewObject);
    const reviewsaved = await reviewModel.save();
    const userObject = await this.userModel.findById(new Types.ObjectId(user.id));
    userObject.Reviews.push(reviewsaved._id.toHexString());
    const productObject = await this.productModel.findById(new Types.ObjectId(productId));
    console.error('product Object', productObject);
    console.error('reviewsaved.id', reviewsaved._id.toHexString());
    productObject.reviews.push(reviewsaved._id.toHexString());
    console.error('product Object save again', productObject);
    await userObject.save();
    await productObject.save();

    return reviewsaved;
}



    async update(reviewDto: ReviewDTO, id:string, user:any): Promise<Boolean> {
        let result = false;
        const role = ['ADMIN','MODERATOR'];
        const userObject = await this.userModel.findById(new Types.ObjectId(user.id));
        console.error('userobject is', userObject);
        console.error('check is', role.includes(userObject.role));
        console.error('check is', userObject.Reviews.includes(id));




        if( userObject.Reviews.includes(id)||role.includes(userObject.role))
        {
            result = true;
        const objectId = new Types.ObjectId(id);
        const review = await this.reviewModel.findById(objectId);
        const {comment,image,productId,rate} = reviewDto;
        if(comment != null)
        {
            review.comment = comment;
        }
        if(image != null)
        {
            review.image = image;
        }
        if(rate != null)
        {
            review.rate = rate;
        }
         await new this.reviewModel(review).save();
        }
        else{
            console.log('error');
            throw new ExceptionsHandler();
        }
        console.log('result', result);
      return result;
    }

    async delete(id: string, user: any) {
        try{
        const objectId = new Types.ObjectId(id);
        const review = await this.reviewModel.findById(objectId);
        await review.deleteOne();
        const productId = new Types.ObjectId(review.productId);
        const proudct = await this.productModel.findById(productId);
        proudct.reviews.splice(
            proudct.reviews.indexOf((
                await this.reviewModel.findById(id))._id.toHexString()),1);
        console.error('reviews delete', proudct.reviews);
        const userObject = await this.userModel.findById(new Types.ObjectId(user.id));
        userObject.Reviews.splice(
            userObject.Reviews.indexOf((
                await this.reviewModel.findById(id))._id.toHexString()),1);
        await proudct.save();
        await userObject.save();
      
        }
        catch(Error)
        {
          
        }
    }

 

    async findAll(user:any): Promise<Review[]> {
        const userObject = await this.userModel.findById(new Types.ObjectId(user.id));
        const reivewids = userObject.Reviews;
        console.error('review',reivewids);
        const reviews = await Promise.all(reivewids.map(async (reviewId) => {
            return await this.reviewModel.findById(reviewId).exec(); }));
            return reviews.filter(review => review !== null); // Lọc ra những review không null (tức là tồn tại)
      }

}