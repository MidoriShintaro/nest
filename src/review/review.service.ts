import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './entity/Review.entity';
import { Product } from 'src/product/entity/Product.entity';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
import { ReviewDTO } from './dto/review.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(reviewDto: ReviewDTO, user: any): Promise<Review> {
    const { comment, productId, rate } = reviewDto;

    const reviewObject = new Review();
    reviewObject.productId = productId;
    reviewObject.comment = comment;

    // reviewObject.image = image;

    reviewObject.rate = rate;
    reviewObject.userId = user.id;

    const reviewModel = new this.reviewModel(reviewObject);
    const reviewSaved = await reviewModel.save();
    const userObject = await this.userModel.findById(
      new Types.ObjectId(user.id),
    );
    userObject.Reviews.push(reviewSaved._id.toHexString());
    const productObject = await this.productModel.findById(
      new Types.ObjectId(productId),
    );
    productObject.reviews.push(reviewSaved._id.toHexString());
    await userObject.save();
    await productObject.save();

    return reviewSaved;
  }

  async update(reviewDto: ReviewDTO, id: string, user: any): Promise<string> {
    // let result = false;
    const role = ['ADMIN', 'MODERATOR'];
    const userObject = await this.userModel.findById(
      new Types.ObjectId(user.id),
    );

    if (userObject.Reviews.includes(id) || role.includes(userObject.role)) {
      //   result = true;
      const objectId = new Types.ObjectId(id);
      const review = await this.reviewModel.findById(objectId);
      const { comment, rate } = reviewDto;
      if (comment != null) {
        review.comment = comment;
      }
      //   if (image != null) {
      //     review.image = image;
      //   }
      if (rate != null) {
        review.rate = rate;
      }
      await new this.reviewModel(review).save();
    } else {
      console.log('error');
      throw new ExceptionsHandler();
    }
    return 'Update review successfully';
  }

  async delete(id: string, user: any): Promise<string> {
    try {
      const objectId = new Types.ObjectId(id);
      const review = await this.reviewModel.findById(objectId);
      await review.deleteOne();
      const productId = new Types.ObjectId(review.productId);
      const product = await this.productModel.findById(productId);
      product.reviews.splice(
        product.reviews.indexOf(
          (await this.reviewModel.findById(id))._id.toHexString(),
        ),
        1,
      );
      console.error('reviews delete', product.reviews);
      const userObject = await this.userModel.findById(
        new Types.ObjectId(user.id),
      );
      userObject.Reviews.splice(
        userObject.Reviews.indexOf(
          (await this.reviewModel.findById(id))._id.toHexString(),
        ),
        1,
      );
      await product.save();
      await userObject.save();
      return 'Delete review successfully';
    } catch (error) {
      return error;
    }
  }

  async findAll(user: any): Promise<Review[]> {
    const userObject = await this.userModel.findById(user);
    const reviewIds = userObject.Reviews;
    const reviews = await Promise.all(
      reviewIds.map(async (reviewId) => {
        return await this.reviewModel
          .findById(reviewId)
          .populate({
            path: 'productId',
            select: 'productName price',
            populate: { path: 'category', select: 'categoryName' },
          })
          .populate({ path: 'userId', select: 'username' })
          .exec();
      }),
    );
    return reviews.filter((review) => review !== null); // Lọc ra những review không null (tức là tồn tại)
  }

  async getReviewByProductId(productId: string): Promise<Review[]> {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const reviews = await this.reviewModel
      .find({ productId: product.id })
      .populate('userId');
    if (reviews.length < 0) throw new NotFoundException('Reviews not found');

    return reviews;
  }

  async getAllReviews(): Promise<Review[]> {
    return await this.reviewModel.find();
  }
}
