import type { NextPage, GetServerSideProps } from 'next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {capitalize} from '@mui/material';
import { ShopLayout } from '@layouts';
import { ProductList } from '@components';
import { getProductByQuery, getAllProducts } from '@services';
import type { IProduct } from '@interfaces';

interface Props {
	products: IProduct[];
	foundProducts: boolean;
	query: string;
}

const SeachPage: NextPage<Props> = ({ products, foundProducts, query }) => {
	return (
		<ShopLayout
			title={`Teslo-Shop - ${capitalize(query)}`}
			pageDescription='Encuentra los mejores productos de Teslo aqui'
		>
			<Typography variant='h1' component='h1'>
				Buscar Productos
			</Typography>
			{foundProducts ? (
				<Typography variant='h2' sx={{ mb: 1 }}>
					Todos los productos
				</Typography>
			) : (
				<Box display='flex' gap={1} sx={{ mb: 2 }}>
					<Typography> No encontramos ningun producto:</Typography>
					<Typography variant='h2' color='secondary'>
						{capitalize(query)}
					</Typography>
				</Box>
			)}
			<ProductList products={products} />
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query } = params as { query: string };
	if (query.length === 0) {
		return {
			redirect: {
				destination: '/',
				permanent: true,
			},
		};
	}
	let products = await getProductByQuery(query);
	const foundProducts = products.length > 0;
	if (!foundProducts) products = await getAllProducts();
	return {
		props: {
			products,
			foundProducts,
			query,
		},
	};
};

export default SeachPage;
