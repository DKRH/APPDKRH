import { Hono } from "hono";

const products = new Hono()
  .get("/", (c) => {
    return c.json({
      data: [
        {
          id: 1,
          name: "Product A",
        },
      ],
    });
  });

export default products;