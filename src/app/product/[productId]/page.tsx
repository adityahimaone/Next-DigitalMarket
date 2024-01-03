import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { PRODUCT_CATEGORIES } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { formatPrice } from "@/lib/utils";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import ImageSlider from "@/components/ImageSlider";
import ProductReel from "@/components/ProductReel";
import AddToCartButton from "@/components/AddToCartButton";

interface Props {
  params: {
    // productId same as [productId]
    productId: string;
  };
}

const BREADCRUMBS = [
  {
    id: 1,
    name: "Home",
    href: "/",
  },
  {
    id: 2,
    name: "Products",
    href: "/products",
  },
];

const page = async ({ params }: Props) => {
  const { productId } = params;

  const payload = await getPayloadClient();

  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: "approved",
      },
    },
  });

  const product = products[0];
  // If product is not found, return 404
  if (!product) return notFound();

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 max-w-2xl px-4 py-16 mx-auto">
          {/* Product Details */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((item, idx) => (
                <li key={item.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-gray-600 text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                    {idx !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5 ml-2 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <h1 className="tracking-light sm:text-4xl text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>
            <section className="mt-4">
              <div className="flex items-center">
                <p className="font-medium text-gray-900">
                  {formatPrice(product.price)}
                </p>
                <div className="text-muted-foreground pl-4 ml-4 border-l border-gray-400">
                  {label}
                </div>
              </div>
              <div className="mt-4 space-y-6">
                <p className="text-muted-foreground text-base">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center mt-4">
                <Check
                  aria-hidden="true"
                  className="flex-shrink-0 w-5 h-5 text-green-500"
                />
                <p className="text-muted-foreground ml-2 text-sm">
                  Eligible for instant delivery
                </p>
              </div>
            </section>
          </div>
          {/* Product Images */}
          <div className="lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center mt-10">
            <div className="aspect-square rounded-lg">
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* add to cart part */}
          <div className="lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start mt-10">
            <div>
              <div className="mt-10">
                <AddToCartButton product={product} />
              </div>
              <div className="mt-6 text-center">
                <div className="group inline-flex text-sm font-medium">
                  <Shield
                    aria-hidden="true"
                    className="h5-w-5 flex-shrink-0 mr-2 text-gray-400"
                  />
                  <span className="text-muted-foreground hover:text-gray-700">
                    30 Day Return Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product Reel */}
      <ProductReel
        title={`Similar ${label} Products`}
        subtitle={`Browse similar high-quality ${label} just like ${product.name}`}
        href="/products"
        query={{ category: product.category, limit: 4 }}
      />
    </MaxWidthWrapper>
  );
};

export default page;
