import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Americano from '../assets/americano.jpg'
import Macchiato from '../assets/macchiato.jpg'
import Cappuccino from '../assets/cappuccino.jpg'
import Cart from '../components/Cart'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'


const POS = () => {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const API_URL = import.meta.env.VITE_API_URL;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('jwtToken');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [retryTime, setRetryTime] = useState(0);
    const [error, setError] = useState(null);
    const [categoryId, setCategoryId] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showActionPopup, setActionPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [itemId, setItemId] = useState(0);
    const [productId, setProductId] = useState(0);
    const [skus, setSkus] = useState([]);
    const bucket = import.meta.env.VITE_S3_BUCKET;
    const region = import.meta.env.VITE_AWS_REGION;
    const [variationSaved, setVariationSaved] = useState(false);
    const [loading, setLoading] = useState(true);
   
    const openModal = (itemId, productId) => {
        setShowModal(true);

        
    
        setItemId(itemId);
        setProductId(productId)
    }

    const closeModal = () => setShowModal(false);

    const cartRef = useRef(); 

    const handlePrint = useReactToPrint({
        contentRef: cartRef, 
    });
       
     
console.log(selectedItems);
    const handleOptionChange = (itemId, variation, option) => {
       if (!option) return;
  setSelectedItems(prevItems => {
    
      const updatedItems = [...prevItems];
    const item = { ...updatedItems[itemId] };

      
      const updatedOptions = [...item?.variationOptions];

      
      const index = updatedOptions.findIndex(vo => vo.variationId === variation.variationId);

      if (index > -1) {
        
        updatedOptions[index] = {
          variationId: variation.variationId,
          variationOptionId: option.variationOptionId,
          variationOptionName: option.variationOptionName,
          variationOptionCode: option.variationOptionCode,
          variationPriceAdjustment: option.variationPriceAdjustment
        };
      } else {
       
        updatedOptions.push({
          variationId: variation.variationId,
          variationOptionId: option.variationOptionId,
          variationOptionName: option.variationOptionName,
          variationOptionCode: option.variationOptionCode,
          variationPriceAdjustment: option.variationPriceAdjustment
        });
      }

     const updatedItem = { ...item, variationOptions: updatedOptions, saleItemQuantity: item.saleItemQuantity || 1  };
    updatedItems[itemId] = updatedItem;

      const existingIndex = updatedItems.findIndex(
        (i, idx) => {
        if (idx === itemId || i.productId !== updatedItem.productId) return false;

        if (i.variationOptions.length !== updatedItem.variationOptions.length) return false;

        return i.variationOptions.every(opt =>
            updatedItem.variationOptions.some(opt2 => 
                opt.variationId === opt2.variationId &&
                opt.variationOptionId === opt2.variationOptionId
            )
        );
        
  });

      if (existingIndex >= 0) {
  
    
    updatedItems[existingIndex].saleItemQuantity = 1 + updatedItem.saleItemQuantity;
    
    updatedItems.splice(itemId, 1);
  } 
    

      return updatedItems;

   
    });
  
};
console.log(showModal);
const getSku = async () => {
       try {
             const response = await axios.get(`${API_URL}/sku/all`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              setSkus(response.data);
            
            
              
              
            } catch (error) {
              console.log(error);
              if (error.response?.data === "Too many requests" || error.response?.status === 429) {
                const retryAfter = parseInt(error.response.headers["retry-after"], 10) || 5;
                setRetryTime(retryAfter);
                setError("Too Many Requests");
                setShowPopup(true);
                }
            }
          }
  
      useEffect(() => {
      getSku();
      
    }, []);
    

    useEffect(() => {
       
        if (localStorage.getItem("showLoginPopup") === "true") {
          setShowLoginPopup(true);
    
          
          const timer = setTimeout(() => {
          setShowLoginPopup(false);
          localStorage.setItem("showLoginPopup", "false"); 
        }, 3000);

    return () => clearTimeout(timer);
    
          
        }
      }, []);

      const getCategories = async () => {
       try {
             const response = await axios.get(`${API_URL}/categories/all`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              setCategories(response.data);
              setShowPopup(false);
              setRetryTime(0);
              setError(null);
            
              
              
            } catch (error) {
              console.log(error);
              if (error.response?.data === "Too many requests" || error.response?.status === 429) {
                const retryAfter = parseInt(error.response.headers["retry-after"], 10) || 5;
                setRetryTime(retryAfter);
                setError("Too Many Requests");
                setShowPopup(true);
                }
            }
          }
  
     useEffect(() => {
      getCategories();
    }, []);

    const handleSearch = () => {
        getProducts();
    };

    console.log(selectedItems);
    const getProducts = async () => {
       try {

        let endpoint = ``;
        if (categoryId !== 0 && searchTerm) {
        endpoint = `products/all?categoryId=${categoryId}&query=${encodeURIComponent(searchTerm)}`;
        } else if (categoryId !== 0) {
        endpoint = `products/all?categoryId=${categoryId}`;
        } else if (searchTerm) {
        endpoint = `products/all?query=${encodeURIComponent(searchTerm)}`;
        } else {
        endpoint = `products/all`;
        }

        const response = await axios.get(`${API_URL}/${endpoint}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
        }); 

        setProducts(response.data);
        setLoading(false);

            } catch (error) {
              console.log(error);
               if (error.response?.data === "Too many requests" || error.response?.status === 429) {
                const retryAfter = parseInt(error.response.headers["retry-after"], 10) || 5;
                setRetryTime(retryAfter);
                setError("Too Many Requests");
                setShowPopup(true);
              
                }
        }    
      }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  
      useEffect(() => {
        setLoading(true);
      getProducts();
      
    }, [categoryId, searchTerm]);

    

    useEffect(() => {
    if (retryTime > 0) {
         const timer = setInterval(() => setRetryTime((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    } else if (retryTime === 0 && showPopup) {
        setShowPopup(false); 
        }
    }, [retryTime, showPopup]);

    const checkoutItems = async(e) => {
        e.preventDefault();

        if(selectedItems.length === 0) {
            alert("Please select at least one product");
            return;
        }

        const checkoutData = {
            salesId: null,
            salesItem: selectedItems,
            customerId: null,
            staffId: Number(userId),
        };

        try {
            const response = await axios.post(`${API_URL}/sales`, checkoutData, {
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data);

            setActionPopup(true);

            setTimeout(() => {
                setActionPopup(false);
            }, 3000)

            handlePrint();
            setSelectedItems([]);
            getProducts();
            setVariationSaved(false);

        } catch (error) {
            console.log(error);
            if(error.response.data.message === "Matching SKU not found for variation options") {
                window.alert("Select a variation.");
            } else if(error.response.data.message === "Validation failed for classes [org.example.Entities.Sku] during update time for groups [jakarta.validation.groups.Default, ]\nList of constraint violations:[\n\tConstraintViolationImpl{interpolatedMessage='Stock must be at least 0', propertyPath=stockQuantity, rootBeanClass=class org.example.Entities.Sku, messageTemplate='Stock must be at least 0'}\n]") {
                window.alert("There is no stock available for this variation.");
            }
        }
    }


const product = products.find((p) => p.productId === productId);
      
console.log(product);
      
    const disableOption = (itemId, variationOption, variationId, variations) => {
        const newOption = {
  ...variationOption,  
  variationId: variationId,  
};

        const item = selectedItems[itemId];
        const currentSelections = item?.variationOptions || [];
        const hasStockForOption = skus.some(sku => 
                sku.product.productId === product.productId &&
                sku.stockQuantity > 0 &&
                sku.variationOptions.some((skuOpt) =>
                    skuOpt.variationOptionId === variationOption.variationOptionId
            ));

            if (!hasStockForOption) return true;
        const hypotheticalCombo = [...currentSelections.filter(opt =>  opt.variationId !== variationId), newOption];
        
       
    

        const matchingSkuCombo = skus.find(sku => 
    sku.product.productId === product.productId &&
    sku.variationOptions.length === hypotheticalCombo.length &&
    sku.variationOptions.every(skuOpt => 
        hypotheticalCombo.some(h => 
            h.variationId === skuOpt.variationId &&
            h.variationOptionId === skuOpt.variationOptionId
        )
    )
);
        console.log(matchingSkuCombo)
        
        if (matchingSkuCombo?.stockQuantity === 0) return true;

        
        return false;
    
    }


    const closeAndClearForm = (productId) => {
          closeModal();

        
          setSelectedItems(prev =>
            prev.map(item => 
                item.productId === productId
                ? {...item, variationOptions: []}
                : item
            )
          )

          setVariationSaved(false);
       
         
      }

   
   

  return (
    <div className="grid grid-cols-1 gap-0">
        <div className="h-full bg-gray-200">
            <div className="grid gap-0 grid-cols-[4fr_1.5fr]">
                <div className="h-18 rounded bg-white col-span-2 border-b border-gray-300 shadow-sm">
                    <Header setSearchTerm={setSearchTerm} searchTerm={searchTerm} handleSearch={handleSearch}/>
                </div>
                <div className="h-screen w-full rounded-lg bg-gray-100 overflow-x-auto ">
                    <div className=" overflow-x-auto w-full scrollbar-hide">
                        
                        <div className="m-6 flex space-x-4 w-max">
                        {categories.map(c => {
                            const selected = Number(categoryId) === Number(c.categoryId);
                            return(
                            <button type="button" onClick={() => {
                                
                            if (categoryId === c.categoryId) {
                                setCategoryId(0);
                            } else {
                                setCategoryId(c.categoryId);
                            }
                            }} className={
                                    `flex-shrink-0 m-3 cursor-pointer px-10 py-4 text-white rounded-4xl font-medium text-m 
                                    bg-gradient-to-r from-black via-gray-800 to-black hover:bg-gradient-to-br 
                                    transition-all duration-200

                                    ${selected ? "ring-4 ring-gray-400 ring-offset-2" : ""}`
                                }
                                >
                            {c.categoryName}
                            </button>
                                );
                            })}
                            </div>
                    </div>
                    {loading  && (
  
                            <div class="flex items-center justify-center">
                        <div class="w-15 h-15 mt-30 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        </div>)}
                    <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-5 m-5">
                        
    
   
    
                        {products.map((p, idx) => {
                        
        
        
                        const isDisabled = p.productStock === 0;
                        return(
                        <button className="cursor-pointer" onClick={() => {
                            if (isDisabled) return;
                           
                            
                             const defaultSelectedIndex = selectedItems.findIndex(item => item.productId === p.productId && item.variationOptions.length == 0);

                            console.log(selectedItems[defaultSelectedIndex])
                            console.log(selectedItems);
                            
                            if(defaultSelectedIndex >= 0) {
                                
                                setSelectedItems(prev =>
                                    prev.map((item, index) =>
                                        index === defaultSelectedIndex
                                        ? {...item, saleItemQuantity: item.saleItemQuantity + 1}
                                        : item
                                ));
                                openModal(defaultSelectedIndex, p.productId);

                                

                               
                            } else {
                                setSelectedItems(prev => {
                                    const newItem = {
                                    productId: p.productId,
                                    saleItemQuantity: 1,
                                    variationOptions: []
                                    }
                                const updated = [...prev, newItem];
                            openModal(updated.length - 1, p.productId);
                            return updated;
                            });

                            
                        }

                        
                        }}>
                        <div className="relative overflow-hidden rounded-4xl shadow-sm transition hover:shadow-lg bg-white h-75 
                active:bg-gradient-to-t active:from-black/90 active:to-black/40 ">
                            
                        <img alt="" src={`https://${bucket}.s3.${region}.amazonaws.com/${p.productImage}`} className="absolute inset-0 w-full h-full object-cover"/>

                        <div className={`
                        absolute bottom-0 left-0 w-full 
                        ${isDisabled
                            ? "bg-gray-300/50 h-full"    
                            : "bg-gradient-to-t from-black/70 to-transparent h-1/3"
                        }
                        
                        
                    `}></div>
                        <div className="relative pt-60">
                           

                                    
                                    <h1 className="text-2xl font-bold flex justify-center text-white">{p.productName}</h1>
                                    {isDisabled && (
                                        <h3 className="text-white text-xl mb-10">(Out of stock)</h3>
                                        
                                    )}
                                    
                                    
                               
                           
                        </div>
                        </div>
                        
                        </button>
                        );
                            })}
                        
                    </div>
                    
                </div>
                <div className="h-screen rounded bg-white col-span-1 border-l border-gray-300 shadow-sm">
                    <h1 className="text-2xl font-bold m-5">Transaction Details</h1>
                    <Cart ref={cartRef}  itemId={itemId} selected={selectedItems} setSelectedItems={setSelectedItems} checkoutItems={checkoutItems} products={products}  skus={skus} openModal={openModal} showModal={showModal} closeModal={closeModal}/>
                </div>
            </div>
        </div>
        {showLoginPopup && (
            <div id="toast-top-right" className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-gray-500 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm top-5 right-5" role="alert">
            <div className="text-m font-normal">Welcome, {username}!</div>
        </div>
        )}

        {showActionPopup && (
           <div>
            <div id="toast-top-right" className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-none divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg  top-5 right-5" role="alert">
            <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-white bg-gray-500 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800" role="alert">
                <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ms-3 text-sm font-normal">Order successfully placed!</div>
            </div>
            </div>
            </div>
        )}

        {showPopup && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center  items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black">
                <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
                    <h3 className="text-lg font-bold mb-2">{error}</h3>
                    <p>Please wait {retryTime} second{retryTime !== 1 ? "s" : ""} before trying again.</p>
                    <button
                    onClick={() => { setShowPopup(false); getProducts(); getCategories();}}
                    disabled={retryTime > 0}
                    className={`text-white inline-flex cursor-pointer items-center bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4 text-center ${
                        retryTime > 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    >
                    Retry Now
                    </button>
                </div>
                </div>
            )}

        {showModal && (
        
        <>
        <div className="fixed inset-0 bg-black/40"></div>
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 h-100 rounded-t-2xl shadow-lg"> <button type="button" onClick={() => closeAndClearForm(product?.productId)} className="text-gray-400 bg-transparent cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
            </button>
            <div className="col-span-2 m-3">
                {product?.variations.sort((a, b) => a.variationId - b.variationId).map(v =>
                <div key={v.variationId} className="mb-4">
                <label htmlFor="variation" className="block mb-2 text-sm font-medium text-gray-900">{v.variationName}</label>
                    <select name={v.variationName} id={v.variationName} onChange={e => {
                        

                              const optionId = Number(e.target.value);
                              const selectedOption = v.variationOptions.find(o => o.variationOptionId === optionId);
                              handleOptionChange(itemId, v, selectedOption);
                             
                 }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 " required>
                        <option value="" className="text-gray-50">Select variation</option>
                        {v.variationOptions.map(o => ( 
                        <option key={o.variationOptionId} value={o.variationOptionId} disabled={disableOption(itemId, o, v.variationId, product?.variations)} className={`variation-button ${disableOption(itemId, o, v.variationId, product?.variations) ? 'disabled' : ''}`}>{o.variationOptionName}</option>
                            ))} 
                        </select>
                        </div>
                )}
            <button type="submit" onClick={() => {closeModal(); setVariationSaved(true); }}className="text-white cursor-pointer inline-flex items-center bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4 text-center">
                         <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                Save variation
            </button>
            </div>
             
             
            </div>
        </>
        )}
    </div>
  )
}

export default POS