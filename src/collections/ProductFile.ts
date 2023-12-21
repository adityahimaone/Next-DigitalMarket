import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;

  return { ...data, user: user?.id };
};

const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = (req.user as User) || null;

  // if user role is admin, they can access all products
  if (user?.role === "admin") return true;
  if (!user) return false;

  // find all products that the user owns
  const { docs: products } = await req.payload.find({
    collection: "products",
    // depth is 0 because we don't need to fetch the product files
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const ownProductFileIds = products
    .map((product) => product.product_files)
    .flat();

  const { docs: orders } = await req.payload.find({
    collection: "orders",
    // depth is 2 because we need to fetch the product files
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const purchasedProductFieldIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string")
          return req.payload.logger.error(
            `Search depth not sufficient to find purchased file IDs for order ${order.id}`
          );

        // if product is a string, it's the ID of the product
        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      });
    })
    // filter out any undefined values
    .filter(Boolean)
    // flatten the array
    .flat();

  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFieldIds],
    },
  };
};

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: [
      "image/*",
      "font/*",
      "application/postscript",
      "application/zip",
    ],
  },
  // Linking to User
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};
