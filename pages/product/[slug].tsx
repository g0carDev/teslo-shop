import { useContext, useState } from 'react';
import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box  from '@mui/material/Box';
import { ShopLayout } from '@layouts';
import { ProductSlideshow, ProductSizeSelector, ItemCounter } from '@components';
import { CartContext } from '@context';
import { getAllProductSlug, getProductBySlug } from '@services';
import type { ICartProduct, IProduct, ISize } from '@interfaces';

interface Props {
	product: IProduct;
}

const SlugPage: NextPage<Props> = ({ product }) => {
	const { addProductToCart } = useContext(CartContext);
	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});

	const onSelectedSize = (size: ISize) => {
		setTempCartProduct({
			...tempCartProduct,
			size,
		});
	};
	const onUpdatedQuantity = (quantity: number) => {
		setTempCartProduct({
			...tempCartProduct,
			quantity,
		});
	};
	const onAddProductToCart = () => {
		if (!tempCartProduct.size) return;
		addProductToCart(tempCartProduct);
	};
	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideshow images={product.images} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Box display='flex' flexDirection='column'>
						{/* Product title */}
						<Typography variant='h1' component='h1'>
							{product.title}
						</Typography>
						<Typography variant='subtitle1' component='h2'>
							{'$'}
							{product.price}
						</Typography>
						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle2'>Cantidad</Typography>
							<ItemCounter
								currentValue={tempCartProduct.quantity}
								updatedQuantity={onUpdatedQuantity}
								maxValue={product.inStock}
							/>
							<ProductSizeSelector
								sizes={product.sizes}
								selectedSize={tempCartProduct.size}
								onSelectedSize={onSelectedSize}
							/>
						</Box>

						{product.inStock ? (
							<Button
								color='secondary'
								className='circular-btn'
								onClick={onAddProductToCart}
							>
								{tempCartProduct.size
									? 'Agregar al carrito'
									: 'Selecciona una talla'}
							</Button>
						) : (
							<Chip
								label='No hay disponibles'
								color='error'
								variant='outlined'
							/>
						)}
						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2'>Descripción</Typography>
							<Typography variant='body2'>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getStaticPaths: GetStaticPaths = async ctx => {
	const productSlugs = await getAllProductSlug();
	return {
		paths: productSlugs.map(({ slug }) => ({ params: { slug } })),
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params as { slug: string };
	const product = await getProductBySlug(slug);

	if (!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	return {
		props: {
			product,
		},
		revalidate: 86400,
	};
};

export default SlugPage;
