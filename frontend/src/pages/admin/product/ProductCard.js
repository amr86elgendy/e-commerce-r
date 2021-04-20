import React from 'react';
import { Card } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, handleDelete }) => {
  const { title, description, images, slug } = product;
  return (
    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : ''}
          style={{ height: '150px', objectFit: 'cover' }}
          className='p-1'
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}><EditOutlined className='text-primary' /></Link>,
        <DeleteOutlined className='text-danger' onClick={() => handleDelete(slug)} />,
      ]}
    >
      <Card.Meta
        title={title}
        description={`${description && description.substring(0, 40)}...`}
      />
    </Card>
  );
};

export default ProductCard;
