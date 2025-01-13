import React from 'react';
import styles from './CardsCarusel.module.scss';
import { Product } from '../../type/Product';
import Slick from './Slick/Slick';

interface Props {
  props: Product[];
  carusel?: boolean;
  amount?: number;
  name?: string;
}

export const CardsCarusel: React.FC<Props> = ({
  props,
  // discount = false,
  name = '',
  carusel = false,
}) => {
  const cards = [...props];

  return (
    <div className={styles.container}>
      <Slick products={cards} name={name} />
    </div>
  );
};
