'use client'

import { useEffect, useState } from "react";

let today = new Date();
const year : number = today.getFullYear();
const month : number = today.getMonth() + 1;
const day : number = today.getDate();
const hour : number = today.getHours();
const min : number = today.getMinutes();


export default function Todo() {

  const onAll = "visible w-14 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offAll = "visible w-14 h-9 bg-red-custom-3 text-black mx-1";
  const onActive = "visible w-20 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offActive = "visible w-20 h-9 bg-red-custom-3 text-black mx-1";
  const onComplated = "visible w-32 h-9 bg-red-custom-2 text-white border-4 border-white mx-1";
  const offComplated = "visible w-32 h-9 bg-red-custom-3 text-black mx-1";

  const notChecked = "visible bg-orange-custom-1 hover:bg-orange-custom-2";
  const Checked = "visible bg-green-custom-1";

  const [activeButton, setActiveButton] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL')
  const [content, setContent] = useState("")
  const [addList, setAddList] = useState(false)
  const [monthFilter, setMonthFillter] = useState<number>(month)
  const [dbContent, setDBContent] = useState<{id : number, check : number, content : string, clock : Date, month : number}[]>([])
  const [sortingState, setSortingState] = useState< "desc"| "asc">("desc");
  const [updateLists, setUpdateLists] = useState(false)
  const [toggleBtn, setToggleBtn] = useState(false)
  const [editState, setEditState] = useState<boolean[]>([]);
  let fetchMonthFilter = monthFilter;

  const addToList = (value: string) => {
    setDBContent([...dbContent, { id : -1 , content : value, check : 0, clock  : new Date(), month : 0}]);
  }

  const toggleAddList = () => {
    if(addList) {
      setAddList(false);
    } else {
      setAddList(true);
    }
  }

  const useToggleBtn = () => {
    if(toggleBtn) {
      setSortingState('desc');
      setToggleBtn(false);
    } else {
      setSortingState('asc')
      setToggleBtn(true);
    }
    setUpdateLists(true);
  }


  async function loadData() {
    try {
      const response = await fetch(`http://localhost:8080/time?sort=${sortingState}`, { method: 'GET' });
      const data = await response.json();
      
      const contentArray = data.map((item: { content: string, id : number, month : number, clock : Date, check : number }) => item);
      
      setDBContent(contentArray);

      
      const dbData = data.map((o : any) => false)
      setEditState(dbData)
      setUpdateLists(true);
    } catch (error) {
      console.error('Failed to load data', error);
    }
  }

  const List = () => {
    let monthContent
    if(activeButton === 'ACTIVE') {
      monthContent = dbContent.filter((o) => o.month === monthFilter && o.check === 0)
    } else if( activeButton === 'COMPLETED') {
      monthContent = dbContent.filter((o) => o.month === monthFilter && o.check === 1)
    } else {
      monthContent = dbContent.filter((o) => o.month === monthFilter)
    }

    return (
      monthContent.map((o, i) => {
        return (
          <div key = {i}>
            <div className={`w-110 h-14 rounded-lg mt-4  
              ${o.check === 1 ? Checked : notChecked} items-center flex`}  onClick={() => {
                const data = editState.map((x, y) => {
                  return y === i ? true : x
                })
                setEditState(data)
              setUpdateLists(true)
            }}>
            <div className="w-90 bg-black"/>
            <input 
              type="checkbox"
              className="ml-4 mr-5 w-5 h-5 appearance-none rounded-lg checked:bg-green-200 border border-black-custom-1 checked:bg-[url('https://icnlbuaakhminucvvzcj.supabase.co/storage/v1/object/public/assets/checkbox.png')] bg-no-repeat bg-center bg-white"
              onChange={() => {
                UpdateList(o?.id ?? 0, o.content, !o.check ? 1 : 0)
              }}
            />
            {editState[i] === true ? (
              <div className="flex z-10 rounded-lg justify-center">
                <input
                  type="text"
                  className="rounded text-center border border-black-custom-1"
                  onChange={(e) => setContent(e.target.value)}
                  defaultValue = {o.content}
                />
                <button
                  className="rounded-xl w-16 h-10 ml-2 bg-green-600 text-white"
                  onClick={() => {
                    setEditState(editState.map((x, y) => { return y === i ? false : x}))
                    UpdateList(o.id, content, o.check)
                    setUpdateLists(true)
                  }}>
                  수정
                </button>
                <button
                className="rounded-xl w-16 h-10 ml-2 bg-red-600 text-white"
                onClick={() => {
                  editState.length = 0;
                  DeleteList(o.id)
                  setUpdateLists(true)
                }}>
                삭제
                </button>
              </div>
            ) : o.content}
            </div>
          </div>
        )
      })
    )
  }

  async function PostList() {
    try {
      const response = await fetch('http://localhost:8080/time/create', {method : 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({time : today, month : month, content : content}),
      })
      const data = await response.json();
      const contentArray = data.map((item: { content: string }) => item.content);
      setDBContent(contentArray);
      loadData();
    } catch(err) {
      console.error(err)
    }
  }

  async function UpdateList(Updateindex : number, UpdateContent : string, UpdateCheck : number) { 
    try {
      const response = await fetch('http://localhost:8080/time', {method : 'PATCH',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({id : Updateindex, content : UpdateContent, check : UpdateCheck}),
      })
      loadData();
    } catch(err) {
      console.error(err)
    }
  }

  async function DeleteList(Updateindex : number) {
    try {
      const response = await fetch('http://localhost:8080/time', {method : 'DELETE',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({id : Updateindex}),
      })
      loadData();
    } catch(err) {
      console.error(err)
    }
  }
  useEffect(()=>{
    loadData()
  },[sortingState, activeButton]);

  
  useEffect(() => {
  }, []);

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
          <button className={activeButton === 'ALL' ? onAll : offAll} onClick={() => {setActiveButton('ALL');
            setUpdateLists(true);
            }}>ALL
          </button>
          <button className={activeButton === 'ACTIVE' ? onActive : offActive} onClick={() => {setActiveButton('ACTIVE')
            setUpdateLists(true);
            }}>ACTIVE
          </button>
          <button className={activeButton === 'COMPLETED' ? onComplated : offComplated} onClick={() => {setActiveButton('COMPLETED')
            setUpdateLists(true);
          }}>COMPLETED</button>
          <button className="rounded-md bg-black-custom-1 text-white w-20 ml-20 mr-3" onClick={() => {
            toggleAddList()
            setContent("")
            }}>Add
          </button>
        </div>
        <div className="flex text-center gird place-content-center mt-7 pl-36">
          <div className="flex">
            <button className="rounded-md bg-black-custom-1 text-white w-10 h-10 text-3xl" onClick={() => {
              if(monthFilter > 1)
                setMonthFillter(monthFilter-1)
              if(fetchMonthFilter > 1) {
                fetchMonthFilter = monthFilter - 1; 
                if(fetchMonthFilter === 0) fetchMonthFilter = 1;
              }
              setUpdateLists(true)
            }}>&lt;</button>
            <text className="text-white text-3xl ml-2">{monthFilter}월</text>
            <button className="rounded-md bg-black-custom-1 text-white w-10 h-10 text-3xl ml-2" onClick={() => {
              if(monthFilter < 12) 
                setMonthFillter(monthFilter+1)
              if(fetchMonthFilter < 12) {
                fetchMonthFilter = monthFilter + 1;
                if(fetchMonthFilter === 13) fetchMonthFilter = 12;
              }
              setUpdateLists(true)
            }}>&gt;</button>
          </div>
          <div className="pl-16">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer"/>
              <div className="w-20 h-10 bg-gray-300 rounded-full peer transition-all ease-in-out 
                duration-500 peer-checked:after:translate-x-full after:content-[''] after:absolute 
                after:top-[0px] after:left-[0px] after:bg-black-custom-1 after:rounded-full 
                after:h-10 after:w-10 after:transition-all peer-checked:bg-gray-200" onClick={useToggleBtn}
              />
            </label>
          </div>
        </div>
          <div className="gird place-items-center mt-7 ml-5">
            {addList && (
              <div>
                <button className={`w-110 h-14 rounded-lg mt-4 bg-orange-custom-1`}/>
                <div className={"w-110 -mt-14 ml-2 flex"}>
                  <input type="text" className="w-70 rounded text-center border border-black-custom-1" value={content} onChange={(e) => setContent(e.target.value)}/>
                  <button className="rounded-xl w-16 h-10 ml-2 bg-green-600 text-white" onClick={() => {
                    PostList() 
                    setAddList(false)
                    setUpdateLists(true)
                    addToList(content)
                  }}>추가</button>
                  <button className="rounded-xl w-16 h-10 ml-2 bg-red-600 text-white" onClick={() => setAddList(false)}>취소</button>
                </div>
              </div>
            )}
            <div id="todolist" className="overflow-y-auto h-90">
              {updateLists && (
                <div>
                  {List()}
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

