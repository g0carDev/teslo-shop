import { FC, useEffect, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { capitalize } from '@mui/material';

import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import UploadOutlined from '@mui/icons-material/UploadOutlined';

import { useForm } from 'react-hook-form';
import { AdminLayout } from '@layouts';
import { tesloApi } from '@api';
import { getProductBySlug } from '@services';
import { Product } from '@models';
import type { IGender, IProduct, ISize, IType } from '@interfaces';
import { json } from 'stream/consumers';

const validTypes: IType[] = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender: IGender[] = ['men', 'women', 'kid', 'unisex'];
const validSizes: ISize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ISize[];
  slug: string;
  tags: string[];
  title: string;
  type: IType;
  gender: IGender;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const [newTagValue, setNewTagValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: product,
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        const newSlug = value.title?.trim().replaceAll(' ', '_').replaceAll("'", '').toLocaleLowerCase() || '';
        setValue('slug', newSlug);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onProductForm = async (formData: FormData) => {
    if (formData.images.length < 0) return alert('Minimo 2 imagenes');
    setIsSaving(true);

    try {
      const { data } = await tesloApi({
        url: '/admin/products',
        method: formData._id ? 'PUT' : 'POST',
        data: formData,
      });
      if (!formData._id) {
        router.replace(`/admin/products/${formData.slug}`);
        setIsSaving(false);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
      console.log(error);
    }
  };

  const onChangeSize = (size: ISize) => {
    const currentSizes = getValues('sizes');
    if (currentSizes.includes(size)) {
      return setValue(
        'sizes',
        currentSizes.filter((s) => s !== size),
        { shouldValidate: true }
      );
    }
    setValue('sizes', [...currentSizes, size], { shouldValidate: true });
  };
  const onAddTag = () => {
    const newTag = newTagValue.trim().toLocaleLowerCase();
    setNewTagValue('');
    const currentTags = getValues('tags');
    if (currentTags.includes(newTag)) return;
    currentTags.push(newTag);
  };
  const onDeleteTag = (tag: string) => {
    const currentTags = getValues('tags').filter((t) => t !== tag);
    setValue('tags', currentTags, { shouldValidate: true });
  };
  const onFileSelected = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const files = target.files;
    if (!files || files.length === 0) return;
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);
        setValue('images', [...getValues('images'), data.message], { shouldValidate: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteImage = (image: string) => {
    const currentImages = getValues('images').filter((img) => img !== image);
    setValue('images', currentImages, { shouldValidate: true });
  };

  return (
    <AdminLayout title={'Producto'} subtitle={`Editando: ${product.title}`} icon={<DriveFileRenameOutline />}>
      <form onSubmit={handleSubmit(onProductForm)}>
        <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
          <Button
            color='secondary'
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type='submit'
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>{' '}
        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label='Título'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label='Descripción'
              variant='filled'
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label='Inventario'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'Mínimo de valor 0' },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label='Precio'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'Mínimo de valor 0' },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }} fullWidth>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup
                row
                value={getValues('type')}
                onChange={({ target }) => setValue('type', target.value as IType, { shouldValidate: true })}
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color='secondary' />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }} fullWidth>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={getValues('gender')}
                onChange={({ target }) => setValue('gender', target.value as IGender, { shouldValidate: true })}
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color='secondary' />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={<Checkbox checked={getValues('sizes').includes(size)} />}
                  label={size}
                  onChange={() => onChangeSize(size)}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label='Slug - URL'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Este campo es requerido',
                validate: (value) => (value.trim().includes(' ') ? 'No puede tener espacios en blanco' : undefined),
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label='Etiquetas'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              helperText='Presiona [spacebar] para agregar'
              value={newTagValue}
              onChange={({ target }) => setNewTagValue(target.value)}
              onKeyUp={({ code }) => (code === 'Space' ? onAddTag() : undefined)}
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
              component='ul'
            >
              {getValues('tags').map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color='primary'
                    size='small'
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display='flex' flexDirection='column'>
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color='secondary'
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Cargar imagen
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='image/*'
                style={{ display: 'none' }}
                onChange={onFileSelected}
              />

              <Chip
                label='Es necesario al menos 2 imagenes'
                color='error'
                variant='outlined'
                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
              />

              <Grid container spacing={2}>
                {getValues('images').map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia component='img' className='fadeIn' image={img} alt={img} />
                      <CardActions>
                        <Button fullWidth color='error' onClick={() => onDeleteImage(img)}>
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;

  let product: IProduct | null;

  if (slug === 'new') {
    // crar producto nuevo
    const tempProduct = JSON.parse(JSON.stringify(new Product()));
    delete tempProduct._id;
    tempProduct.images = ['img1.jpg', 'img2.jpg'];
    product = tempProduct;
  } else {
    product = await getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
