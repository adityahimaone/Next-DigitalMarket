import { Access, CollectionConfig } from "payload/types";
import { PrimaryActionEmailHtml } from "../components/emails/PrimaryActionEmail";

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    id: {
      equals: user.id,
    },
  };
};

export const Users: CollectionConfig = {
  // The slug of the collection. This will be used in the API URL.
  slug: "users",
  // Auth is an object that defines the authentication requirements for the collection.
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "Verify your account",
          href: `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`,
          buttonText: "Verify your account",
        });
      },
    },
  },
  // Fields is an array of fields that will be used to create the schema.
  access: {
    read: adminsAndUser,
    create: () => true,
    // create: ({ req }) => req.session?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
    defaultColumns: ["id"],
  },
  fields: [
    {
      name: "products",
      label: "Products",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product files",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "product_files",
      hasMany: true,
    },
    {
      name: "role",
      required: true,
      defaultValue: "user",
      admin: {
        // to hide the field from the admin UI
        // condition: () => false,
        // condition: ({ req }) => req.user.role == "admin",
      },
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  ],
};
