"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "./lib/components/sidebar";
import Login from "./lib/components/login";
import Separator from "./lib/components/separator";
import Accounts from "./lib/components/accounts";

export default function Home() {
  const [slider, setSlider] = useState({
    stock: 0,
    banking: 0
  })
  const [showSideBar, setShowSideBar] = useState(false)
  const slideData = [
    {
      type: 'banking',
      data: [
        {
          id: 1,
          title: 'Checking Accounts with no Fees',
          descr: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas quo odit, natus ipsam quia ipsum officiis ducimus recusandae, cumque doloremque vel dolor quis sit perferendis cum! Consequuntur ducimus eveniet optio. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas quo odit, natus ipsam quia ipsum officiis ducimus recusandae, cumque doloremque vel dolor quis sit perferendis cum! Consequuntur ducimus eveniet optio. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas quo odit, natus ipsam quia ipsum officiis ducimus recusandae, cumque doloremque vel dolor quis sit perferendis cum! Consequuntur ducimus eveniet optio.',
          img: '/lady.png',
          altImg: 'Checking'
        },
        {
          id: 2,
          title: 'Savings Accounts with Godly Interest Rates',
          descr: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ipsam doloremque veniam neque, eveniet aliquid praesentium possimus quos sint minima architecto sapiente deleniti maxime ea dolor reprehenderit inventore fugit assumenda.`,
          img: '/books.jpg',
          altImg: 'Stock'
        },
        {
          id: 3,
          title: 'Crypto Wallet for Next Gen payments',
          descr: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ipsam doloremque veniam neque, eveniet aliquid praesentium possimus quos sint minima architecto sapiente deleniti maxime ea dolor reprehenderit inventore fugit assumenda.`,
          img: '/bitcoin.jpg',
          altImg: 'Crypto'
        }
      ]
    }, {
      type: 'stock',
      data: [
        {
          id: 1,
          title: 'Expert Trading Tools with Learning Paths',
          descr: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas quo odit, natus ipsam quia ipsum officiis ducimus recusandae, cumque doloremque vel dolor quis sit perferendis cum! Consequuntur ducimus eveniet optio. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas quo odit, natus ipsam quia ipsum officiis ducimus recusandae, cumque doloremque vel dolor quis sit perferendis cum! Consequuntur ducimus eveniet optio. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas quo odit, natus ipsam quia ipsum officiis ducimus recusandae, cumque doloremque vel dolor quis sit perferendis cum! Consequuntur ducimus eveniet optio.',
          img: '/trading.png',
          altImg: 'Stock'
        },
        {
          id: 2,
          title: 'Utilize Options to Level the Playing Field',
          descr: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ipsam doloremque veniam neque, eveniet aliquid praesentium possimus quos sint minima architecto sapiente deleniti maxime ea dolor reprehenderit inventore fugit assumenda.`,
          img: '/stock.png',
          altImg: 'Options'
        },
        {
          id: 3,
          title: 'Crypto Made Simple',
          descr: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ipsam doloremque veniam neque, eveniet aliquid praesentium possimus quos sint minima architecto sapiente deleniti maxime ea dolor reprehenderit inventore fugit assumenda.`,
          img: '/crypto.webp',
          altImg: 'Crypto'
        }
      ]
    }]
    
  return (
    <>
      {/* <Sidebar></Sidebar> */}
      <Login></Login>
      {/* <Sidebar/>
      <header className="flex flex-col md:w-with-sidebar md:self-end max-md:self-center max-md:w-full">
        <div className="flex flex-col items-center max-md:gap-4 pb-3">
          <h4 className="font-[desmodus] text-[6rem] max-md:text-[3rem] max-md:first-letter:text-[4rem] text-pink-900 dark:text-red-700 tracking-widest first-letter:text-[7.5rem]">Prometheus</h4>
          <p className="font-[ben] max-md:text-sm text-xl upp text-black tracking-widest dark:text-white">Down to earth Financial security</p>
        </div>
        <Image
          src="/v6.png"
          alt="Prometheus Logo"
          className="invert animate-longPulse self-end absolute -z-10 max-md:w-[40%] dark:invert-0"
          width={300}
          height={300}
          priority
        />
      </header> */}
      {/* <main className="flex min-h-screen flex-col gap-10 overflow-x-hidden mb-48  md:w-with-sidebar md:self-end max-md:self-center max-md:w-full">

        <div className="flex flex-col justify-center max-md:justify-normal gap-10">
          <p className="w-1/2 self-center max-md:w-full  max-md:px-4 first-letter:text-3xl text-md dark:text-white">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae recusandae distinctio, perferendis maxime, harum tempore soluta assumenda dolorem reiciendis facere perspiciatis excepturi voluptate cum. Veniam dolorem fugiat at quos quasi.</p>

          <div className="flex flex-col gap-24">
            {slideData.map((holder, holderIndex) => <>

              <div key={holder.type} className={`bg-gradient-to-b from-slate-100 to-slate-300 justify-evenly shadow-md shadow-slate-400 flex m-auto p-4 gap-4 max-md:m-0 max-md:w-full max-md:px-4 max-md:items-center ${holderIndex % 2 === 0 ? 'flex-row max-md:flex-col-reverse' : 'flex-row-reverse max-md:flex-col'} dark:bg-gradient-to-br dark:from-slate-800 dark:to-red-900 dark:text-white dark:from-60% dark:shadow-slate-950`}>
                {holder.data.map((x, index, arr) => <>
                  <div key={index} className={`${index === slider[holder.type] ? '' : 'hidden'}`}>
                    <Image
                      src={x.img}
                      alt={x.altImg}
                      className="rounded-lg shadow-md shadow-slate-600 dark:shadow-slate-950 h-[300px]"
                      width={400}
                      height={400}
                      priority
                    />

                  </div>
                  <div key={x.id} className={`flex flex-col w-1/2 max-md:w-full gap-4 ${index === slider[holder.type] ? '' : 'hidden'}`}>
                    <h4 className="text-3xl text-center">{x.title}</h4>
                    <p className=" max-md:px-4  first-letter:text-3xl text-md rounded-lg">{x.descr}</p>
                    <div className=" flex justify-center gap-4">
                      {arr.map((x, i) => <>
                        <div onClick={() => setSlider({ ...slider, [holder.type]: i })} key={`slide-${x.id}`} className={`cursor-pointer w-3 h-3 rounded-full duration-500 transition-all hover:bg-slate-700 ${i === slider[holder.type] ? 'bg-slate-700' : 'bg-slate-400'}`}></div>
                      </>)}
                    </div>
                  </div>
                </>)}

              </div>
            </>)}
          </div>
        </div>
      </main> */}
    </>
  );
}
