'use client';

import useAuth from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Product = {
  _id: string;
  id_product: number;
  url_image: string;
  name: string;
  id_category: number;
  brand: string;
  upc: string;
  size: string;
  availableVariety: boolean;
  variety: string[];
  price: string;
  sku: string;
  desc: string;
  main: string;
  addl: string;
  burst: string[];
  sale_price: string;
  price_text: string;
  reg_price: number;
  save_up_to: string;
  item_code: number;
  group_code: number;
  with_cart: boolean;
  color: string;
  notes: string;
  buyer_notes: string;
  effective: string;
  unit_price: string;
  quality_cf: string;
  type_of_meat: string;
  master_brand: string;
  type_of_cut: string;
  createdById: number;
  status_active: boolean;
  plu: string;
  limit: string;
  must_buy: string;
  limit_type: string;
  per: string;
  pack: number;
  count: number;
  w_simbol: string;
  embase: string;
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, handleVerifyToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const fetchProducts = async (token: string): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}getProducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
        return [];
      }

      const data = await res.json();
      return data.result;
    } catch {
      toast.error('Failed to fetch products.', {
        position: "top-right",
        autoClose: 3000,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleVerifyToken(token ?? '');
  }, []);

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchProducts(token ?? '');
      const selectedProduct = products.find((item) => item.id_product === parseInt(id));
      setProduct(selectedProduct || null);
    };

    fetchData();
  }, [id]);
  if (isLoading) {
    return (
      <div role="status" className='flex justify-center items-center'>
        <svg aria-hidden="true" className="w-44 h-44 text-gray-200 animate-spin dark:text-gray-600 fill-[rgb(255,160,122)] " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 p-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Product Detail
        </h1>
        <button
          onClick={() => router.push('/')}
          className={`py-2 px-4 border border-gray-300 rounded-lg 
              text-gray-700 bg-white hover:bg-gray-100 
              hover:text-gray-900 shadow-sm 
              focus:outline-none focus:ring-2 
              focus:ring-gray-200 
              focus:ring-offset-2 
              disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          return to dashboard
        </button>
      </div>

      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-2xl space-y-4 sm:space-y-6">
        <img
          src={product?.url_image}
          alt={product?.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h2 className="text-2xl font-bold text-gray-900">{product?.master_brand}</h2>
        <p className="text-gray-700 text-sm"><span className="font-bold">Brand:</span> {product?.brand}</p>
        <p className="text-gray-700 text-sm"><span className="font-bold">Description:</span> {product?.desc}</p>
        <p className="text-gray-700 text-sm"><span className="font-bold">Variety:</span> {product?.variety.join(', ')}</p>
        <p className="text-gray-700 text-sm"><span className="font-bold">Must Buy:</span> {product?.must_buy}</p>
        <p className="text-gray-700 text-sm"><span className="font-bold">With Card:</span> {product?.with_cart ? 'Yes' : 'No'}</p>
        <p className="text-gray-700 text-sm"><span className="font-bold">Additional Info:</span> {product?.addl}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-900">${product?.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
