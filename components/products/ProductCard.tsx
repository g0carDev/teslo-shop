import { type FC, useMemo, useState } from 'react';
import NextLink from 'next/link';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';

import type { IProduct } from '@interfaces';

interface Props {
  product: IProduct;
}
export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImge = useMemo(() => {
    return isHovered
      ? product.images[1]
      : product.images[0]
  }, [isHovered, product.images]);
  return (
    <Grid
      item
      xs={6}
      sm={4}
      key={product.slug}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NextLink href={`/product/${product.slug}`} prefetch={false}>
        <Link>
          <Card>
            <CardActionArea>
              {!product.inStock && (
                <Chip
                  color='primary'
                  label='No hay disponibles'
                  sx={{
                    position: 'absolute',
                    zIndex: 99,
                    top: '10px',
                    left: '10px',
                  }}
                />
              )}
              <CardMedia
                component='img'
                image={productImge}
                alt={product.title}
                onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </Card>
        </Link>
      </NextLink>
      <Box
        sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }}
        className='fadeIn'
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>
          {'$'}
          {product.price}
        </Typography>
      </Box>
    </Grid>
  );
};
