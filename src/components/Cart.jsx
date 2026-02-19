
import React, { forwardRef } from 'react';

const Cart = forwardRef(({ itemId, selected, setSelectedItems, checkoutItems, products, openModal, showModal, closeModal ,skus }, ref) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const bucket = import.meta.env.VITE_S3_BUCKET;
    const region = import.meta.env.VITE_AWS_REGION;
    const total = selected.reduce((sum, item) => {
    const product = products.find(pr => pr.productId === item.productId);
    if (!product) return sum;
    const adjustmentTotal = item.variationOptions?.reduce(
    (acc, vo) => acc + (vo.variationPriceAdjustment || 0),
    0
  );

  const baseTotal = (product.productPrice + adjustmentTotal) * item.saleItemQuantity;

  return sum + baseTotal;
}, 0);



console.log(skus);

console.log(selected);

const item = selected.map(item => console.log(item.variationOptions));
  

  return (
    <section>
    <div ref={ref} className="printable bg-white text-black p-4">
      <h2 className="text-lg font-bold mb-4">Receipt</h2>
      <ul className="space-y-2">
        {selected.length === 0 && <li>No items selected.</li>}
        {selected.map((item) => {
          const product = products.find(p => p.productId === item.productId);
          if (!product) return null;
          return (
            <button className="hover:bg-gray-200 cursor-pointer active:bg-gray-300">
            <li key={item.productId} className="flex justify-between py-1">
  <div className="flex flex-col">
    <span className="font-medium">{product.productName}</span>
    <span className="text-sm text-gray-600">
      (
      {item.variationOptions?.map(o => o.variationOptionName).join(", ") || "No variation"}
      ) × {item.saleItemQuantity}
    </span>
  </div>

  <div className="text-right font-medium">
    {(product.productPrice * item.saleItemQuantity).toLocaleString(
      "en-PH",
      { style: "currency", currency: "PHP" }
    )}
  </div>
</li>
            </button>
          );
        })}
      </ul>
      <div className="mt-4 font-bold flex justify-between">
        <span>Total</span>
        <span>{total.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
      </div>
    </div>


  <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div className="mx-auto max-w-auto">

      <div className="mt-8">
        
        <ul className="space-y-4">
            
            {selected.length === 0 && (
                
      <h1>No orders yet.</h1>
    )}
            {selected.map((p, index) => {
              

      
        
              
            
            
        const product = products.find(pr => pr.productId === p.productId);
            
       console.log(product);
        return(
        <div className="hover:bg-gray-200 active:bg-gray-300 w-full" >
        <div className="p-3">
            
          <li className="flex items-center gap-4">
            <img src={`https://${bucket}.s3.${region}.amazonaws.com/${product?.productImage}`} alt="" className="size-16 rounded-sm object-cover" />

          
            <div >
              <h3 className="text-sm text-gray-900 w-10">{product.productName}</h3>
              
              <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                <div>
                  <dt className="inline">Price:</dt>
                  <dd className="inline">{product.productPrice}</dd>
                </div>

              </dl>
              <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                <div>

           
           
                  <dt className="inline">Subtotal:</dt>
                  <dd className="inline">{((product.productPrice +
        (p.variationOptions.reduce(
          (sum, vo) => sum + (vo.variationPriceAdjustment || 0),
          0
        ) || 0)
      ) * p.saleItemQuantity).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
      })}</dd>

      
         
   
                </div>

              </dl>
 <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                <div>
              <dt className="inline">Variation:</dt>
      <dd className="inline">
        {p.variationOptions.length > 0
  ? p.variationOptions.map(vo => vo.variationOptionName).join(", ")
  : "None"}
        </dd>
        </div>
        </dl>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
                
              <form>
                
                <label htmlFor="Line1Qty" className="sr-only"> Quantity </label>
                <button type="button"  disabled={p.variationOptions.length === 0} onClick={(e) => {
    
    e.stopPropagation();
   
    setSelectedItems(prev => {

    

    const updated = [...prev];

    const sku = skus.find(s => 
  s.product.productId === product.productId &&
  s.variationOptions.length === p.variationOptions.length &&
  s.variationOptions.every((value, idx) => value.variationOptionId === p.variationOptions[idx].variationOptionId)
  );

  console.log(p);
  console.log(sku);
  console.log(updated[index]);
      updated[index] = {
        ...updated[index],
        saleItemQuantity: Math.min(updated[index].saleItemQuantity + 1, sku?.stockQuantity ?? product.productStock)
        
      };

     

      if(updated[index].saleItemQuantity == sku.stockQuantity ?? product.productStock) {
        window.alert("Max stock reached!");
      }

      
      return updated;
    });
  }}  className="text-white m-1 bg-black box-border cursor-pointer border border-transparent hover:bg-dark-strong focus:ring-4 focus:warning-subtle shadow-xs font-medium leading-5 rounded-full text-sm px-3 py-2.5 focus:outline-none">+</button>
                <input type="number" min="1"   value={p.saleItemQuantity} id="Line1Qty" className="h-8 w-10 rounded-sm border-gray-200 bg-gray-100 p-0 text-center text-sm text-gray-600 [-moz-appearance:_textfield] focus:outline-hidden [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:m-0 [&amp;::-webkit-outer-spin-button]:appearance-none" />
                <button type="button" onClick={(e) => {
    e.stopPropagation();
    setSelectedItems(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        saleItemQuantity: Math.max(1, updated[index]?.saleItemQuantity - 1)
      };
      return updated;
    });
  }} className="text-white m-1 bg-black cursor-pointer box-border border border-transparent hover:bg-dark-strong focus:ring-4 focus:warning-subtle shadow-xs font-medium leading-5 rounded-full text-sm px-3 py-2.5 focus:outline-none">-</button>
                           
                        </form>

              <button onClick={(e) => {
                            e.stopPropagation();
                           
                            setSelectedItems(prev => {
                             if (prev[index]) {         
                                return prev.filter((_, idx) => idx !== index);
                            } else {
                                return [...prev, { productId: p.productId,  saleItemQuantity: 1, variationOptions: exists.variationOptions ?? []}];
                            }
                            });
                        }} className="text-gray-600 transition cursor-pointer hover:text-red-600">
                <span className="sr-only">Remove item</span>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                </svg>
              </button>
            </div>
          </li>
         
          </div>
           </div>
          
         
        
        );
        
            })}
       
        </ul>
         
        <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
          <div className="w-screen max-w-lg space-y-4">
            <dl className="space-y-0.5 text-sm text-gray-700">
            

              <div className="flex justify-between !text-base font-medium">
                <dt>Total</dt>
                <dd>{(total ?? 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</dd>
              </div>
            </dl>

            

            <div className="flex justify-end">
              <button onClick={checkoutItems} className="block cursor-pointer rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600">
                Checkout
              </button>
              
            </div>
            
          </div>
          
        </div>
        
      </div>
      
    
    </div>
    
  </div>
  
</section>
  )
});

export default Cart