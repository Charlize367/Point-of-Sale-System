import React from 'react'

const Sidebar = () => {
  return (
   

<div class=" md:flex">
    
    <ul class="flex-column items-center space-y space-y-4 text-sm font-medium text-body md:me-4 mb-4 mt-4 md:mb-0">
        <li className="mt-1 mb-25 ml-3 z-10"><span className="self-center ml-3 text-3xl text-gray-600 text-heading font-semibold whitespace-nowrap z-10">Point of Sale</span></li>
        <li>
            <a href="#" class="items-center px-4 py-2.5 text-gray-400 bg-brand rounded-base active w-full" aria-current="page">
                <svg className="w-10 h-10 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="currentColor" d="M8 1V0v1Zm4 0V0v1Zm2 4v1h1V5h-1ZM6 5H5v1h1V5Zm2-3h4V0H8v2Zm4 0a1 1 0 0 1 .707.293L14.121.879A3 3 0 0 0 12 0v2Zm.707.293A1 1 0 0 1 13 3h2a3 3 0 0 0-.879-2.121l-1.414 1.414ZM13 3v2h2V3h-2Zm1 1H6v2h8V4ZM7 5V3H5v2h2Zm0-2a1 1 0 0 1 .293-.707L5.879.879A3 3 0 0 0 5 3h2Zm.293-.707A1 1 0 0 1 8 2V0a3 3 0 0 0-2.121.879l1.414 1.414ZM2 6h16V4H2v2Zm16 0h2a2 2 0 0 0-2-2v2Zm0 0v12h2V6h-2Zm0 12v2a2 2 0 0 0 2-2h-2Zm0 0H2v2h16v-2ZM2 18H0a2 2 0 0 0 2 2v-2Zm0 0V6H0v12h2ZM2 6V4a2 2 0 0 0-2 2h2Zm16.293 3.293C16.557 11.029 13.366 12 10 12c-3.366 0-6.557-.97-8.293-2.707L.293 10.707C2.557 12.971 6.366 14 10 14c3.634 0 7.444-1.03 9.707-3.293l-1.414-1.414ZM10 9v2a2 2 0 0 0 2-2h-2Zm0 0H8a2 2 0 0 0 2 2V9Zm0 0V7a2 2 0 0 0-2 2h2Zm0 0h2a2 2 0 0 0-2-2v2Z"/></svg>
                <p className="text-xs ml-5">Sales</p>
            </a>
        </li>
        <li>
            <a href="#" class="items-center text-gray-400 px-4 py-3 rounded-base hover:text-heading hover:bg-neutral-secondary-soft w-full">
                <svg class="w-10 h-10 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/></svg>
                <p className="text-xs ml-2">Dashboard</p>
            </a>
        </li>
        <li>
            <a href="#" class="items-center text-gray-400 px-4 py-3 rounded-base hover:text-heading hover:bg-neutral-secondary-soft w-full">
                <svg class="w-10 h-10 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4H1m3 4H1m3 4H1m3 4H1m6.071.286a3.429 3.429 0 1 1 6.858 0M4 1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm9 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>
                <p className="text-xs ml-2">Customers</p>
            </a>
        </li>
        <li>
            <a href="#" class="items-center text-gray-400 px-4 py-3 rounded-base hover:text-heading hover:bg-neutral-secondary-soft w-full">
                <svg class="w-10 h-10 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M8 8v1h4V8m4 7H4a1 1 0 0 1-1-1V5h14v9a1 1 0 0 1-1 1ZM2 1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/></svg>
                <p className="text-xs ml-3">Inventory</p>
            </a>
        </li>
    </ul>
    
</div>


  );
};

export default Sidebar