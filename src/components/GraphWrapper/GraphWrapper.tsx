'use client';

import useAuth from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Graph from '../Graph/Graph';

interface Product {
  _id: string;
  brand: string;
  master_brand: {
    variety: string;
  };
  desc: string;
}

interface GraphWrapperProps {
  graphType: 'line' | 'bar' | 'pie';
  title: string;
}

async function fetchProducts(token?: string): Promise<Product[]> {
  console.log('token', token);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}getProducts`, {
    headers: {
      Authorization: `Bearer ${token}` ,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    toast.error('There was an issue fetching the products.', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }

  const data = await res.json();
  return data.result;
}

export default function GraphWrapper({ graphType, title }: GraphWrapperProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts(token ?? '');
        setProducts(data);
      } catch {
        toast.error('Something wrong was ocurred!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
<div role="status" className='flex justify-center items-center'>
    <svg aria-hidden="true" className="w-44 h-44 text-gray-200 animate-spin dark:text-gray-600 fill-[rgb(255,160,122)] " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
  )

  const groupedProducts = products?.reduce((acc: Record<string, Product[]>, product) => {
    const key = `${product.brand} - ${product.master_brand || 'No variety'} - ${product.desc}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {});

  const data = {
    labels: Object.keys(groupedProducts) ?? null,
    datasets: [
      {
        label: 'Product ammount',
        data: Object.values(groupedProducts).map((group) => group.length),
        borderColor: 'rgb(255, 160, 122)',
        backgroundColor: 'rgb(255, 160, 122)',
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Graph type={graphType} data={data} options={options} />
    </div>
  );
}
