'use client'

import { useEffect, useState } from "react";

/*type HomeProps = {
  currentTime: string;
}

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:8080/time');
  const data = await res.json();

  return {
    props: {
      currentTime: data.currentTime,
    },
  };
}; */


export default function Todo() {

  const onAll = "visible w-14 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offAll = "visible w-14 h-9 bg-red-custom-3 text-black mx-1";
  const onActive = "visible w-20 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offActive = "visible w-20 h-9 bg-red-custom-3 text-black mx-1";
  const onComplated = "visible w-32 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offComplated = "visible w-32 h-9 bg-red-custom-3 text-black mx-1";

  const [activeButton, setActiveButton] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => { 
    const loadData = async () => {
      const response =  await fetch('http://localhost:8080/time', {method : 'POST', 
        headers: {"Content-Type": "application/json",},
        body : JSON.stringify({time : "2024-08-29"})
        })
      //console.log(await response.json())
    }
    loadData();
  }, [] )


  return(
    <div className="bg-orange-custom-1 flex justify-center min-h-screen items-center">
      <div className="bg-red-custom-1 boxborder rounded-3xl w-120 h-152">
        <div className="h-32 grid place-content-center mt-16">
          <text className="text-white text-2xl text-center">2024-08-29</text>
          <div className="flex text-center">
            <text className="bg-black-custom-1 text-white text-3xl w-10 h-10 rounded-xl mx-1">1</text>
            <text className="bg-black-custom-1 text-white text-3xl w-10 h-10 rounded-xl mx-1">2</text>
            <text className="text-white text-3xl font-black mx-5">:</text>
            <text className="bg-black-custom-1 text-white text-3xl w-10 h-10 rounded-xl mx-1">0</text>
            <text className="bg-black-custom-1 text-white text-3xl w-10 h-10 rounded-xl mx-1">0</text>
          </div>
        </div>
        <div className="flex text-center mx-4 mt-5">
          <button onClick={() => {setActiveButton('all');
            console.log("CLICK")
            }} className={activeButton === 'all' ? onAll : offAll}>ALL</button>
          <button onClick={() => setActiveButton('active')} className={activeButton === 'active' ? onActive : offActive}>ACTIVE</button>
          <button onClick={() => setActiveButton('completed')} className={activeButton === 'completed' ? onComplated : offComplated}>COMPLETED</button>
          <button className="rounded-md bg-black-custom-1 text-white w-20 ml-20 mr-3">Add</button>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
}

