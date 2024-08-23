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

let today = new Date();
const year : number = today.getFullYear();
const month : number = today.getMonth() + 1;
const day : number = today.getDate();
const hour : number = today.getHours();
const min : number = today.getMinutes();
var monthFilter : number = 8;

export default function Todo() {

  const onAll = "visible w-14 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offAll = "visible w-14 h-9 bg-red-custom-3 text-black mx-1";
  const onActive = "visible w-20 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offActive = "visible w-20 h-9 bg-red-custom-3 text-black mx-1";
  const onComplated = "visible w-32 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offComplated = "visible w-32 h-9 bg-red-custom-3 text-black mx-1";

  const [activeButton, setActiveButton] = useState<'all' | 'active' | 'completed'>('all')
  const [activeListButton, setActiveListButton] = useState(false)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [content, setContent] = useState("")
  const [addList, setAddList] = useState(false)

  const toggleAddList = () => {
    if(addList) {
      setAddList(false);
    } else {
      setAddList(true);
    }
  }

  useEffect(() => { 
    const loadData = async () => {
      await fetch('http://localhost:8080/time', {method : 'GET', })
      //console.log(await response.json())
    }
    loadData();
  }, [] )

  async function PostList() {
    try {
      const response = await fetch('http://localhost:8080/time', {method : 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({time : today, month : month, content : content}),
      })
      console.log(await response.json())
    } catch(err) {
      console.error(err)
    }
  }

  return(
    <div className="bg-orange-custom-1 flex justify-center min-h-screen items-center">
      <div className="bg-red-custom-1 boxborder rounded-3xl w-120 h-152">
        <div className="h-32 grid place-content-center mt-16">
          <text className="text-white text-3xl text-center">{year}-{String(month).padStart(2,"0")}-{day}</text>
          <div className="flex text-center mt-3 items-center">
            <text className="bg-black-custom-1 text-white text-5xl w-12 h-12 rounded-xl mx-1">{Math.floor(hour/10)}</text>
            <text className="bg-black-custom-1 text-white text-5xl w-12 h-12 rounded-xl mx-1">{hour%10}</text>  
            <text className="text-white text-7xl font-black mx-5 -mt-3">:</text>
            <text className="bg-black-custom-1 text-white text-5xl w-12 h-12 rounded-xl mx-1">{Math.floor(min/10)}</text>
            <text className="bg-black-custom-1 text-white text-5xl w-12 h-12 rounded-xl mx-1">{min%10}</text>
          </div>
        </div>
        <div className="flex text-center mx-4 mt-5">
          <button onClick={() => {setActiveButton('all');
            console.log("CLICK")
            }} className={activeButton === 'all' ? onAll : offAll}>ALL</button>
          <button onClick={() => setActiveButton('active')} className={activeButton === 'active' ? onActive : offActive}>ACTIVE</button>
          <button onClick={() => setActiveButton('completed')} className={activeButton === 'completed' ? onComplated : offComplated}>COMPLETED</button>
          <button className="rounded-md bg-black-custom-1 text-white w-20 ml-20 mr-3" onClick={() => toggleAddList()}>Add</button>
        </div>
        <div className="flex text-center gird place-content-center mt-7 pl-36">
          <div className="flex">
            <button className="rounded-md bg-black-custom-1 text-white w-10 h-10 text-3xl" onClick={() => {
              monthFilter--;
            }}>&lt;</button>
            <text className="text-white text-3xl ml-2">{monthFilter}월</text>
            <button className="rounded-md bg-black-custom-1 text-white w-10 h-10 text-3xl ml-2" onClick={() => {
              monthFilter++;
            }}>&gt;</button>
          </div>
          <div className="pl-16">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-20 h-10 bg-gray-300 rounded-full peer transition-all ease-in-out 
                duration-500 peer-checked:after:translate-x-full  after:content-[''] after:absolute 
                after:top-[0px] after:left-[0px] after:bg-black-custom-1 after:rounded-full 
                after:h-10 after:w-10 after:transition-all peer-checked:bg-gray-200" />
            </label>
          </div>
        </div>
          <div className="gird place-items-center mt-7 ml-5">
            {addList && (
              <div>
                <button className={`w-110 h-14 rounded-lg mt-4 bg-orange-custom-1`}></button>
                <div className={"w-120 -mt-14 ml-2 flex"}>
                  <input type="text" className="w-70 rounded text-center border border-black-custom-1" value={content} onChange={(e) => setContent(e.target.value)}/>
                  <button className="rounded-xl w-16 h-10 ml-2 bg-green-600 text-white" onClick={PostList}>추가</button>
                  <button className="rounded-xl w-16 h-10 ml-2 bg-red-600 text-white" onClick={() => setAddList(true)}>취소</button>
                </div>
              </div>
            )}
            <button className={`w-110 h-14 rounded-lg mt-4 ${isCheckboxChecked ? `bg-green-custom-1` : `bg-orange-custom-1`}`} onClick={() => setActiveListButton(true)}>
              <label className="relative inline-flex cursor-pointer mr-96">
                <input type="checkbox" className="w-5 h-5 appearance-none checked:bg-green-300 rounded-lg border border-black-custom-1
                  checked:bg-[url('https://icnlbuaakhminucvvzcj.supabase.co/storage/v1/object/public/assets/checkbox.png')] bg-no-repeat bg-center bg-white" onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}/>
              </label>
              {activeListButton && (
                <div className={"w-120 -mt-7 ml-16 flex"}>
                  <input type="text" className="rounded text-center border border-black-custom-1" onChange={(e) => setContent(e.target.value)}/>
                  <button className="rounded-xl w-16 h-10 ml-2 bg-green-600 text-white">수정</button>
                  <button className="rounded-xl w-16 h-10 ml-2 bg-red-600 text-white" onClick={() => setActiveListButton(false)}>삭제</button>
                </div>
              )}
            </button>
          </div>
      </div>
    </div>
  );
}

