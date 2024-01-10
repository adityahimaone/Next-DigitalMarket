import React from "react";
import { PRODUCT_CATEGORIES } from "@/config";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";

type Param = string | string[] | undefined;

interface Props {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const Page = ({ searchParams }: Props) => {
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ?? "Browse high-quality assets"}
        query={{
          category,
          limit: 4,
          sort: sort === "asc" || sort === "desc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
