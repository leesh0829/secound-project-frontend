'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Login() {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  useEffect(() => { 
    const loadData = async () => {
      await fetch('http://localhost:8080/test', {method : 'GET'})
    }
    loadData();
  }, [] )

  async function handleLoginClick() {

    if(id === "") {
      return alert("아이디를 적으세요.")
    }
    else {
      if(password === "") {
        return alert("비밀번호를 적으세요.")
      }
      else {

        //아이디 유무 검사
        try{
          const response = await fetch('http://localhost:8080/test/login', {method : 'POST' , 
            headers: {"Content-Type": "application/json",},
            body : JSON.stringify({id : id, password : password}),
          })
          if(await response.json() === 1) {
            alert("로그인 성공")
            router.push('./todo') //게시판 이동
          } else if (await response.json() === 2) {
            alert("비밀번호가 일치하지 않습니다.")
          } else if (await response.json() === 3) {
            alert("아이디가 존재하지 않거나 다른 오류가 발생했습니다.")
          }
        } catch (error) {
          alert("error")
          console.error("Error fetching data", error);
        }
      }
    }
  }
  
  return (
    <div className="bg-orange-custom-1 flex justify-center min-h-screen items-center">
      <div className="bg-red-custom-1 boxborder rounded-3xl w-120 h-152  grid place-items-center">
          <h1 className="text-white font-bold text-7xl w-56">로그인</h1>
          <div className="flex-col flex w-32 space-y-5">
            <input
              className="rounded text-center"
              type="text"
              placeholder="id"
              value={id}
              onChange={(e) => setId(e.target.value)} />
            <input
              className="rounded text-center"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </div>
        <button className="w-24 text-3xl bg-black-custom-1 text-white rounded" onClick={handleLoginClick}>로그인</button>
        <Link className="w-26 text-3xl bg-black-custom-1 text-white rounded" href="./signup">회원가입</Link>
      </div>
    </div>
  );
}