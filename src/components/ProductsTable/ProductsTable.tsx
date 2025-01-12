'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

interface Product {
  id: number;
  brand: string;
  price: string;
  upc: string;
  desc: string;
}

const ProductTable = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState<number>(0);

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}getProductLimit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ page: page + 1 }),
        }
      );

      if (!response.ok) {
        toast.error('Something wrong was ocurred!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }

      const data = await response.json();
      const { products, totalProducts } = data;
      console.log(products)
      const mappedProducts = products.map((product: any) => ({
        id: product.id_product,
        brand: product.brand || 'N/A',
        masterBrand: product.master_brand || 'N/A',
        price: product.price || 'N/A',
        upc: product.upc || 'N/A',
        desc: product.desc || 'N/A',
        variety: product?.variety?.join(', ')
      }));

      setProducts(mappedProducts);
      setRowCount(totalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(paginationModel.page);
  }, [paginationModel.page]);

  const handleViewDetails = (id: number) => {
    router.push(`/products/${id}`);

  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'brand', headerName: 'Brand', width: 80 },
    { field: 'masterBrand', headerName: 'Master Brand', width: 100 },
    { field: 'price', headerName: 'Price', width: 50 },
    { field: 'upc', headerName: 'UPC', width: 200 },
    { field: 'desc', headerName: 'Description', width: 250 },
    { field: 'variety', headerName: 'Variety', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => handleViewDetails(params.row.id)}
          className='text-[rgb(255,160,122)] hover:bg-[rgb(240,128,102)ounded'
        >
          detail
        </button>
      ),
    },
  ];

  return (
    <div className='h-screen p-4 bg-gray-100'>
      <div className='bg-white p-4 rounded shadow'>
        <h1 className='text-xl font-bold mb-4'>Product Table</h1>
        <DataGrid
          rows={products}
          columns={columns}
          pageSizeOptions={[100]}
          loading={loading}
          rowCount={rowCount}
          paginationMode='server'
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
          autoHeight
        />
      </div>
    </div>
  );
};

export default ProductTable;
