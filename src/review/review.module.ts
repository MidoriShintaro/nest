import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";



import { Product, ProductSchema } from "src/product/entity/Product.entity";

import { User, UserSchema } from "src/user/entity/user.entity";
import { Review, ReviewSchema } from "./entity/Review.entity";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({

    imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema },
        { name: User.name, schema: UserSchema },
        { name: Product.name, schema: ProductSchema }
    ])],
    controllers: [ReviewController],
    providers: [ReviewService]
})
export class ReviewModule { }