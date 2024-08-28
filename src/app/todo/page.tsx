'use client'

import { useEffect, useState } from "react";

/*let today = "2024-09-28 01:23:06.850"
const year : number = 2024;
const month : number = 9;
const day : number = 28;
const hour : number = 1;
const min : number = 23; */
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

  const [activeButton, setActiveButton] = useState<'all' | 'active' | 'completed'>('all')
  const [checkState, setCheckState] = useState<"all" | "ACTIVE" | "COMPLETED">("all")
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [content, setContent] = useState("")
  const [addList, setAddList] = useState(false)
  const [monthFilter, setMonthFillter] = useState<number>(month)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [checkedIndex, setCheckedIndex] = useState<number | null>(null);
  const [dbContent, setDBContent] = useState<string[]>([])
  const [dbIndex, setDBIndex] = useState<number[]>([])
  const [dbData, setDBData] = useState<string[]>([])
  const [sortingState, setSortingState] = useState< "desc"| "asc">("desc");
  const [updateLists, setUpdateLists] = useState(false)
  const [toggleBtn, setToggleBtn] = useState(false)
  const [descState, setDescState] = useState(false)
  let fetchMonthFilter = monthFilter;

  const addToList = (value: string) => {
    setDBContent([...dbContent, value]);
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
      setDescState(false);
    } else {
      setSortingState('asc')
      setToggleBtn(true);
      setDescState(true);
    }
    setUpdateLists(true);
    Filter();
  }


  async function loadData() {
    try {
      const response = await fetch('http://localhost:8080/time', { method: 'GET' });
      const data = await response.json();
      
      const contentArray = data.map((item: { content: string }) => item.content);
      
      setDBContent(contentArray);
    } catch (error) {
      console.error('Failed to load data', error);
    }
  }

  const handleEdit = (index: number) => {
    setActiveIndex(index);
    setContent(dbData[index])
  };

  const handleCheck = (index: number) => {
    setCheckedIndex(index);
  };

  const List = () => {
    if(dbIndex.length === 0) {
      return
    }
    dbData.length = 0;
    for(let i=0; i<dbIndex.length; i++) { 
      dbData[i] = dbContent[(dbIndex[i]-1)];
    }
    return (
      <div id="List">
      {dbData.map((item, indexList) => (
        <div key={indexList} className="relative">
          <button
            className={`w-110 h-14 rounded-lg mt-4  ${isCheckboxChecked ? Checked : notChecked}`} //체크를 전부 따로따로 동작되게 해야함, 체크 박스를 누르면 수정 UI가 뜨지 않아야함
            onClick={() => {handleEdit(indexList)
              handleCheck(indexList)}}
          >
            <label className="relative inline-flex cursor-pointer mr-96 ml-5">
              <input
                type="checkbox"
                className="w-5 h-5 appearance-none checked:bg-green-custom-1 rounded-lg border border-black-custom-1 checked:bg-[url('https://icnlbuaakhminucvvzcj.supabase.co/storage/v1/object/public/assets/checkbox.png')] bg-no-repeat bg-center bg-white"
                onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
              />
              <span className="text-xl ml-2 w-96 text-left">{item}</span>
            </label>
          </button>
          {checkedIndex === indexList && ( //각 리스트의 인덱스로 따로 따로 HTML을 실행해 여기서 색을 바꿀 생각 -> 하지만 CSS(백그라운드 색) 이 덮어 씌워지지 않음
            <div>
              
            </div>
          )}
          {activeIndex === indexList && (
            <div className="absolute w-120 -mt-12 ml-10 flex z-10 rounded-lg">
              <input
                type="text"
                className="rounded text-center border border-black-custom-1"
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                className="rounded-xl w-16 h-10 ml-2 bg-green-600 text-white"
                onClick={() => {
                  const newList = [...dbData];
                  newList[indexList] = content;
                  setDBData(newList);
                  for(let i = 0; i < newList.length; i++) {
                    dbContent[(dbIndex[i]-1)] = newList[i];
                  }
                  setActiveIndex(null);
                  UpdateList(dbIndex[indexList], content)
                  setUpdateLists(true)
                }}>
                수정
              </button>
              <button
                className="rounded-xl w-16 h-10 ml-2 bg-red-600 text-white"
                onClick={() => {
                  const newList = dbContent.filter((_, i) => i !== dbIndex[indexList]);
                  setDBData(newList) 
                  for(let i = 0; i < newList.length; i++) {
                    dbContent[(dbIndex[i]-1)] = newList[i];
                  }
                  DeleteList(dbIndex[indexList])
                  setActiveIndex(null);
                  setUpdateLists(true)
                }}>
                삭제
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
    );
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

  async function UpdateList(Updateindex : number, UpdateContent : string) { 
    if(descState === true) {
      Updateindex = (dbContent.length - (Updateindex+1))
    }
    try {
      const response = await fetch('http://localhost:8080/time/update', {method : 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({id : Updateindex, content : UpdateContent}),
      })
      loadData();
    } catch(err) {
      console.error(err)
    }
  }

  async function DeleteList(Updateindex : number) {
    try {
      const response = await fetch('http://localhost:8080/time/delete', {method : 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({id : Updateindex}),
      })
      loadData();
    } catch(err) {
      console.error(err)
    }
  }

  async function Filter() {
    try {
        const response = await fetch('http://localhost:8080/time/filter', {method : 'POST',
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify({month : fetchMonthFilter, checkState : checkState}), //checkState이 string아니여가지고 타입 안맞아서 백엔드에 넘어갈 때 오류 나올듯 1.activeButton을 써서 백엔드를 불리언으로 갖고오기, 2.checkState를 String으로 바꾸기 1번 한번 해보자
        })
        const data = await response.json();
        if(sortingState === "asc") {
          data.reverse(); 
        }
        if(data.length === 0) {
          setDBIndex([]);
        }
        const indexArray = data.map((item: { id: number }) => item.id);
        setDBIndex(indexArray);
        loadData();
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(()=>{
    Filter()
  },[sortingState]);

  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('http://localhost:8080/time', { method: 'GET' });
        const data = await response.json();
        
        const contentArray = data.map((item: { content: string }) => item.content);
        
        setDBContent(contentArray);
      } catch (error) {
        console.error('Failed to load data', error);
      }
    }
    loadData();
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
          <button onClick={() => {setActiveButton('all');
            console.log("CLICK")
            }} className={activeButton === 'all' ? onAll : offAll}>ALL
          </button>
          <button onClick={() => setActiveButton('active')} className={activeButton === 'active' ? onActive : offActive}>ACTIVE</button>
          <button onClick={() => setActiveButton('completed')} className={activeButton === 'completed' ? onComplated : offComplated}>COMPLETED</button>
          <button className="rounded-md bg-black-custom-1 text-white w-20 ml-20 mr-3" onClick={() => {
            toggleAddList()
            setContent("")
            }}>Add</button>
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
              Filter();
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
              Filter()
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

