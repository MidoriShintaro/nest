import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import styles from "./CartCard.module.css";
const CartCard = ({ cart, removeFromCart }) => {
  return (
    <Card className={styles.main_cart}>
      <Link
        to={`/Detail/type/${cart?.product?.category.categoryName}/${cart?.product?.id}`}
      >
        <CardActionArea className={styles.card_action}>
          <Box className={styles.img_box}>
            <img
              alt={cart?.product?.productName}
              loading="lazy"
              src={cart?.product?.image}
              className={styles.img}
            />
          </Box>
          <CardContent>
            <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
              {cart?.product?.productName.length > 20
                ? cart?.product?.productName.slice(0, 20) + "..."
                : cart?.product?.productName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                // background: 'red',
                justifyContent: "center",
                "& > *": {
                  m: 1,
                },
              }}
            >
              {cart?.quantity && (
                <Button>
                  {" "}
                  <Typography variant="body2" color="black">
                    {" "}
                    Quantity {" " + cart?.quantity}{" "}
                  </Typography>
                </Button>
              )}
              <Typography
                gutterBottom
                variant="h6"
                sx={{ textAlign: "center" }}
              >
                ₹{cart?.product?.price}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Tooltip title="Remove From Cart">
          <Button
            className="all-btn"
            sx={{ width: 10, borderRadius: "30px" }}
            variant="contained"
            color="error"
            onClick={() => removeFromCart(cart)}
          >
            <AiFillDelete style={{ fontSize: 15 }} />
          </Button>
        </Tooltip>
        <Typography>
          {" "}
          <Rating
            name="read-only"
            value={
              cart.product.reviews
                ? Math.round(
                    cart?.product?.reviews.reduce(
                      (total, cur) =>
                        ((total.rate + cur.rate) * 1) /
                        cart.product.reviews.length
                    )
                  )
                : 0
            }
            readOnly
            precision={0.5}
          />
        </Typography>
      </CardActions>
    </Card>
  );
};

export default CartCard;
