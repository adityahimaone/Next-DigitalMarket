import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  // The slug of the collection. This will be used in the API URL.
  slug: "users",
  // Auth is an object that defines the authentication requirements for the collection.
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `
        <div>
          <p>Click the link below to verify your email address.</p>
          <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}">Verify Email</a>
        </div>
      `;
      },
    },
  },
  // Fields is an array of fields that will be used to create the schema.
  access: {
    read: () => true,
    create: () => true,
    // create: ({ req }) => req.session?.role === "admin",
    // update: ({ req }) => req.session?.role === "admin",
    // delete: ({ req }) => req.session?.role === "admin",
  },
  fields: [
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
