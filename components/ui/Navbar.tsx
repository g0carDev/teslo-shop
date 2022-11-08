import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
{/* MUI COMPONENTS */}
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
{/* MUI ICONS */}
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import ClearOutlined from '@mui/icons-material/ClearOutlined';
import { CartContext, UIContext } from '@context';

export const Navbar = () => {
  const { asPath, push } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { toggleSideMenu } = useContext(UIContext);
  const { numberOfProducts } = useContext(CartContext);

  const onSearchTerm = () => {
    if (searchTerm.trim().length <= 0) return setSearchTerm('');
    push(`/search/${searchTerm}`);
  };
  const matchPatch = (url: string) => {
    return url === asPath ? 'primary' : 'info';
  };
  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref>
          <Link display='flex' alignItems='center'>
            <Typography variant='h6'>Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Box flex={1} />
        <Box
          className='fadeIn'
          sx={{
            display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' },
          }}
        >
          <NextLink href='/category/men' passHref>
            <Link>
              <Button color={matchPatch('/category/men')}>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/women' passHref>
            <Link>
              <Button color={matchPatch('/category/women')}>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/kid' passHref>
            <Link>
              <Button color={matchPatch('/category/kid')}>Niños</Button>
            </Link>
          </NextLink>
        </Box>
        <Box flex={1} />
        {/* Pantallas grandes */}

        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            autoFocus
            className='fadeIn'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            type='text'
            placeholder='Buscar producto...'
            onKeyUp={e => {
              e.key === 'Enter' ? onSearchTerm() : null;
            }}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => setIsSearchVisible(false)}
                  aria-label='toggle password visibility'
                >
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            className='fadeIn'
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            onClick={() => setIsSearchVisible(true)}
          >
            <SearchOutlined />
          </IconButton>
        )}
        {/* Pantallas peques */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>
        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={numberOfProducts > 9 ? '+9' : numberOfProducts} color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
