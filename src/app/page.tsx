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
      const response = await fetch('http://localhost:8080/test', {method : 'GET'})
      console.log(await response.json())
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
          const response = await fetch('http://localhost:8080/test', {method : 'POST' , 
            headers: {"Content-Type": "application/json",},
            body : JSON.stringify({id : id, password : password}),
          })
          if(!response.ok) {
            if (password === password) //비밀번호 비교를 같은거 끼리 하는데 그 에러 고치기, 앞에 아이디가 원래 DB에 있는지 확인을 할려하는데 그걸 어떻게 해야하는지
            {
              alert("로그인 성공")
              router.push('/')
            } else {
              return alert("비밀번호가 일치하지 않습니다.")
            }
          }
          console.log("결과 값: " + await response.json())
        } catch (error) {
            alert("error (존재하지 않는 아이디이거나 그 밖의 오류)")
            console.error("Error fetching data", error);
        }
      }
    }
  }
  
  return (
    <div>
      <div>
        <h1><b>로그인</b></h1>
          <div className="flex-col flex">
            <input
              type="text"
              placeholder="id"
              value={id}
              onChange={(e) => setId(e.target.value)} />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </div>
      </div>
      <div className="flex-col flex">
        <button className="flex" onClick={handleLoginClick}>로그인</button>
        <Link href="./signup">회원가입</Link>
      </div>
    </div>
  );
}