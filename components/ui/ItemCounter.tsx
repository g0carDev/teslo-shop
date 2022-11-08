import type { FC } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';

interface Props {
  currentValue: number;
  updatedQuantity: (value: number) => void;
  maxValue: number;
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  updatedQuantity,
  maxValue,
}) => {
  const addOrRemoveQuantity = (value: number) => {
    if (value === -1) {
      if (currentValue === 1) return;
      return updatedQuantity(currentValue - 1);
    }
    if (currentValue >= maxValue) return;
    updatedQuantity(currentValue + 1);
  };
  return (
    <Box display='flex' alignItems='center'>
      <IconButton
        onClick={() => addOrRemoveQuantity(-1)}
        disabled={currentValue <= 1}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>
        {' '}
        {currentValue}{' '}
      </Typography>
      <IconButton
        onClick={() => addOrRemoveQuantity(+1)}
        disabled={currentValue === maxValue}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
