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

/*let today = "2024-09-28 01:23:06.850"
const year : number = 2024;
const month : number = 9;
const day : number = 28;
const hour : number = 1;
const min : number = 23;*/
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

  const [activeButton, setActiveButton] = useState<'all' | 'active' | 'completed'>('all')
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [content, setContent] = useState("")
  const [addList, setAddList] = useState(false)
  const [monthFilter, setMonthFillter] = useState<number>(month)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dbContent, setDBContent] = useState<string[]>([])
  const [dbIndex, setDBIndex] = useState<number[]>([])
  const [dbData, setDBData] = useState<string[]>([])
  const [updateLists, setUpdateLists] = useState(false)
  const [toggleBtn, setToggleBtn] = useState(false)
  const [descState, setDescState] = useState(false)
  let fetchMonthFilter = month;
  let filterState : string = 'ascending';

  const addToList = (value: string) => {
    setDBContent([...dbContent, value]);
  }

  useEffect(() => {
  }, [dbContent, dbIndex]);

  const toggleAddList = () => {
    if(addList) {
      setAddList(false);
    } else {
      setAddList(true);
    }
  }

  const useToggleBtn = () => {
    if(toggleBtn) {
      setToggleBtn(false);
      Order("asc");
      setDescState(false);
    } else {
      setToggleBtn(true);
      Order("desc");
      setDescState(true);
    }
  }

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

  const handleEdit = (index: number) => {
    setActiveIndex(index);
    setContent(dbData[index])
  };

  const List = () => {
    if(dbIndex.length === 0) {
      return
    }

    for(let i=0; i<dbIndex.length; i++) {
      dbData[i] = dbContent[(dbIndex[i]-1)];
    }
    
    return (
      <div id="List">
      {dbData.map((item, indexList) => (
        <div key={indexList} className="relative">
          <button
            className={`w-110 h-14 rounded-lg mt-4 ${isCheckboxChecked ? `bg-green-custom-1` : `bg-orange-custom-1 hover:bg-orange-custom-2`}`}
            onClick={() => handleEdit(indexList)}
          >
            <label className="relative inline-flex cursor-pointer mr-96 ml-5">
              <input
                type="checkbox"
                className="w-5 h-5 appearance-none checked:bg-green-300 rounded-lg border border-black-custom-1 checked:bg-[url('https://icnlbuaakhminucvvzcj.supabase.co/storage/v1/object/public/assets/checkbox.png')] bg-no-repeat bg-center bg-white"
                onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
              />
              <span className="text-xl ml-2 w-96 text-left">{item}</span>
            </label>
          </button>
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
                  const newList = [...dbData]; // 리스트에 표시된 콘텐츠들 (배열)
                  newList[indexList] = content; //바뀐 콘텐츠 새 배열에 넣기, newList는 수정된 콘텐츠들의 새 배열
                  setDBData(newList); //바뀐 콘텐츠 배열 dbData에 넣기 (dbcontet에도 바꿔야함)
                  for(let i = 0; i < newList.length; i++) { //dbcontet에도 바뀐 내용 넣기
                    dbContent[(dbIndex[i]-1)] = newList[i];
                  }
                  setActiveIndex(null); //수정 UI제거
                  UpdateList(dbIndex[indexList], content) //(리스트 순서0,1,2,3), 수정한내용을 db에 바꾸기
                }}>
                수정
              </button>
              <button
                className="rounded-xl w-16 h-10 ml-2 bg-red-600 text-white"
                onClick={() => {
                  const newList = dbContent.filter((_, i) => i !== dbIndex[indexList]); //이 부분 수정해야함 프론트엔드 리스트를 삭제하고, dbData, dbContent배열을 없에거나 null로 채워야할듯
                  console.log(newList)
                  setDBData(newList) //바뀐 콘텐츠 배열 dbData넣기
                  for(let i = 0; i < newList.length; i++) {
                    dbContent[(dbIndex[i]-1)] = newList[i];
                  }
                  DeleteList(dbIndex[indexList]) //백엔드 삭제
                  setActiveIndex(null); //수정 UI 제거
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
      //console.log(await response.json())
      const data = await response.json();
      
      const contentArray = data.map((item: { content: string }) => item.content);
      
      setDBContent(contentArray);
    } catch(err) {
      console.error(err)
    }
  }
  
  //역순문제는 해결 됬으나 생기는 의문점: 다른월까지 포함한 리스트에도 필터가 적용된 상태에서도 될까? -> 
  //예상: 안됨 이 방법은 한월에만 리스트가 적혀있어야 작동되는걸로 추정, 그 뜻은 다른 월까지 섞이면 수정, 삭제가 불가능함
  //결과: 예상이 맞음.
  //이 모든걸 해결하고 앞으로의 필터 적용에서 꼬이지 않게 할러면, 내림차순,오른차순이 포함된 필터를 적용할 때는 db를 새로 받아서 비교하거나
  //그냥 받을 때 배열을 다 받아버리고 또 다른 배열에서는 필터가 적용된걸 받고 비교해서 해야할것같은데 말이 안되는데 그것도 하
  //이거 될려나? : 필터를 씌울 땐 두개의 배열을 리턴하는데 1.모든 콘텐츠가 들어간 배열, 2.필터가 적용된 id가 들어간 배열로 그게 안되면
  //리턴은 필터가 적용된 id가 들어간 배열만 받고 맨위 패치 어느때나 작동하는 곳에서는 모든 콘텐츠가 들어간 배열을 받으면 될듯
  //그러면 그 필터 받은 펑크션 안에 새 배열을 만들어서 for문을 돌리든지 해서 2번 배열에 맞는 1번 배열만 넣어버려서 그 새로 만든 배열을 map으로 돌리면 되지 않을까?
  //month filter에 적용했더니 되는거 같음. 한번 수정, 삭제도 잘 되는지 보고 잘 되면 오른차순, 내림차순도 건들이기
  async function UpdateList(Updateindex : number, UpdateContent : string) { 
    if(descState === true) {
      Updateindex = (dbContent.length - (Updateindex+1))
      console.log(Updateindex);
    }

    try {
      const response = await fetch('http://localhost:8080/time/update', {method : 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({id : Updateindex, content : UpdateContent}),
      })
    } catch(err) {
      console.error(err)
    }
  }

  async function DeleteList(Updateindex : number) { //지우면 프론트엔드에서는 인덱스가 밀리는데 벡엔드는 인덱스(id 컬럼)이 안 미뤄지고 그대로 남아서 그 후 버그가 남, 삭제하고 id를 재 정렬 해야함 아님 버그남
    try {
      const response = await fetch('http://localhost:8080/time/delete', {method : 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({id : Updateindex}),
      })
    } catch(err) {
      console.error(err)
    }
  }

  async function FilterMonth() {
    try {
      const response = await fetch('http://localhost:8080/time/filter', {method : 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({time : '', month : fetchMonthFilter, filterState : filterState}),
      })
      const data = await response.json();
      if(data.length === 0) {
        setDBIndex([]);
      }
      const indexArray = data.map((item: { id: number }) => item.id);
      setDBIndex(indexArray);

    } catch(err) {
      console.error(err)
    }
  }

  async function Order(order : string) {
    try {
      const response = await fetch('http://localhost:8080/time/order', {method : 'POST',
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({month : fetchMonthFilter, filterState : order}),
      })
      const data = await response.json();
      
      const contentArray = data.map((item: { content: string }) => item.content);
      
      setDBContent(contentArray);
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
              filterState = "month"
              FilterMonth()
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
              filterState = "month"
              FilterMonth()
              setUpdateLists(true)
            }}>&gt;</button>
          </div>
          <div className="pl-16">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer"/>
              <div className="w-20 h-10 bg-gray-300 rounded-full peer transition-all ease-in-out 
                duration-500 peer-checked:after:translate-x-full  after:content-[''] after:absolute 
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

