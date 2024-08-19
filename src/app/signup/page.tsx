'use client'
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from 'react';

export default function SignIn() {
  
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter()
  

  useEffect(() => { 
    const loadData = async () => {
      const response = await fetch('http://localhost:8080/test', {method : 'GET'})
      console.log(await response.json())
    }
    loadData();
  }, [] )

  async function handleSignClick() {
    console.log("clicked sign button")
    if(id === "") {            
      return alert("아이디가 존재하지 않습니다.")
    } else {
      if(password === "") {
        return alert("비밀번호가 존재하지 않습니다.")
      }
      if (password === confirmPassword) {
        try{
          const response = await fetch('http://localhost:8080/test', {method : 'POST' , 
            headers: {"Content-Type": "application/json",},       
            body : JSON.stringify({id : id, password : password}),
          })
          console.log(await response.json())
        } catch (error) {
            alert("error")
            console.error("Error fetching data", error);
          }
          router.push('/')
      } else {
        console.log("비밀번호가 다름");
        return alert("비밀번호가 틀렸습니다.");
      }
    }
  }

  return (
    <div>
      <div>
        <h1><b>회원가입</b></h1>   
          <div className="flex-col flex">
            <input 
              type="text" 
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)} />
            <input 
              type="password" 
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <input 
              type="password" 
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>
        <div className="flex-col flex">
        <button onClick={handleSignClick}>가입 하기</button>
        <Link href="/">뒤로 가기</Link>
      </div>
    </div>
  );
}