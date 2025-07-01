import { NextApiRequest, NextApiResponse } from 'next';
import { productDatabase } from '../../components/productData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

 
  
  // Demo implementation - return random product ID
  const randomProduct = productDatabase[
    Math.floor(Math.random() * productDatabase.length)
  ];
  
  return res.status(200).json({
    productId: randomProduct.id,
    confidence: 0.85 // simulated confidence score
  });
}
