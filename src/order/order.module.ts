import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./entity/Order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({

    imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema },
    ])],
    controllers: [OrderController],
    providers: [OrderService]
})
export class ProductModule { }