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
      await fetch('http://localhost:8080/test', {method : 'GET'})
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
          const response = await fetch('http://localhost:8080/test/sign-up', {method : 'POST' , 
            headers: {"Content-Type": "application/json",},
            body : JSON.stringify({id : id, password : password}),
          })
          console.log(await response.json())
          return alert(JSON.stringify(await response.json()))
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
    <div className="bg-orange-custom-1 flex justify-center min-h-screen items-center">
      <div className="bg-red-custom-1 boxborder rounded-3xl w-120 h-152  grid place-items-center">
        <h1 className="text-white font-bold text-7xl w-62">회원가입</h1>   
          <div className="flex-col flex w-36 space-y-5">
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
              onChange={(e) => setPassword(e.target.value)} />
            <input 
              className="rounded text-center"
              type="password" 
              placeholder="password comfirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        <button className="w-26 text-3xl bg-black-custom-1 text-white rounded" onClick={handleSignClick}>가입 하기</button>
        <Link className="w-26 text-3xl bg-black-custom-1 text-white rounded" href="/">뒤로 가기</Link>
        </div>
    </div>
  );
}