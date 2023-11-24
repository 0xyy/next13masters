import {
	ProductGetByIdDocument,
	ProductListItemFragment,
	ProductsGetByCategorySlugDocument,
	ProductsGetListDocument,
	ProductsGetQuantityByCategorySlugDocument,
	ProductsGetQuantityDocument,
} from "@/gql/graphql";
import { executeGraphql } from "./graphqlApi";
import { notFound } from "next/navigation";

const MAX_PRODUCTS_PER_PAGE = 4;

export const getProductsTotalPages = async () => {
	const graphqlResponse = await executeGraphql(ProductsGetQuantityDocument, {});
	const totalPages = Math.ceil(
		Number(graphqlResponse.productsConnection.aggregate.count) / MAX_PRODUCTS_PER_PAGE,
	);
	return totalPages;
};

export const getProductsTotalPagesByCategorySlug = async (categorySlug: string) => {
	const graphqlResponse = await executeGraphql(ProductsGetQuantityByCategorySlugDocument, {
		where: {
			categories_some: {
				slug: categorySlug,
			},
		},
	});
	const totalPages = Math.ceil(
		Number(graphqlResponse.productsConnection.aggregate.count) / MAX_PRODUCTS_PER_PAGE,
	);
	return totalPages;
};

export const getProductsList = async (page: number) => {
	const offset = (page - 1) * MAX_PRODUCTS_PER_PAGE;
	const graphqlResponse = await executeGraphql(ProductsGetListDocument, {
		first: MAX_PRODUCTS_PER_PAGE,
		skip: offset,
	});
	return graphqlResponse.products;
};

export const getProductByCategorySlug = async (categorySlug: string, page: number) => {
	const offset = (page - 1) * MAX_PRODUCTS_PER_PAGE;
	const graphqlResponse = await executeGraphql(ProductsGetByCategorySlugDocument, {
		slug: categorySlug,
		first: MAX_PRODUCTS_PER_PAGE,
		skip: offset,
	});
	return graphqlResponse.categories[0]?.products;
};

export const getProductById = async (id: ProductListItemFragment["id"]) => {
	const graphqlResponse = await executeGraphql(ProductGetByIdDocument, { id });
	if (!graphqlResponse.product) return notFound();
	return graphqlResponse.product;
};
