'use client'

import { Input } from '@/components/ui/input'
import { Shirt, Scissors, Box } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProductVariant {
  id?: string
  color: string
  size: string
  price: string
  inventory_quantity: number
  part: 'main' | 'top' | 'bottom'
}

interface InventoryTableProps {
  title: string
  variants: ProductVariant[]
  setVariants: (variants: ProductVariant[]) => void
}

export function InventoryTable({ title, variants, setVariants }: InventoryTableProps) {
  const { t } = useLanguage()

  let displayTitle = title;
  if (title === 'Top') displayTitle = t.productUpload?.topInventory || 'Top Inventory';
  if (title === 'Bottom') displayTitle = t.productUpload?.bottomInventory || 'Bottom Inventory';
  if (title === 'Main') displayTitle = t.productUpload?.mainInventory || 'Main Inventory';

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
        {title === 'Top' ? <Shirt className="w-4 h-4"/> : title === 'Bottom' ? <Scissors className="w-4 h-4"/> : <Box className="w-4 h-4"/>}
        {displayTitle}
      </h3>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-2 text-left w-24">{t.productUpload?.size || 'Size'}</th>
              <th className="px-4 py-2 text-left w-32">{t.productUpload?.stock || 'Stock'}</th>
              <th className="px-4 py-2 text-left">{t.productUpload?.priceOverride || 'Price Override'}</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {variants.map((v, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 font-medium text-gray-900 bg-gray-50/50">{v.size}</td>
                <td className="px-4 py-3">
                  <Input 
                    type="number" 
                    value={v.inventory_quantity}
                    onChange={e => updateVariant(idx, 'inventory_quantity', parseInt(e.target.value) || 0)}
                    className={v.inventory_quantity > 0 ? "border-green-500 bg-green-50" : ""}
                  />
                </td>
                <td className="px-4 py-3">
                  <Input 
                    type="number" 
                    placeholder="Default"
                    value={v.price}
                    onChange={e => updateVariant(idx, 'price', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
