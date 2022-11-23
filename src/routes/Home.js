import React, { useEffect, useState } from 'react';
import {db, storage} from "../fbase";
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import Tweet from '../components/Tweet';
import TweetFactory from 'components/TweetFactory';

function Home({userObj}) {
  console.log(userObj);
  const [tweets, setTweets] = useState([]); 
    //tweets : 저장된 트윗

  // const  getTweets = async() => {
  //   const q = query(collection(db, "tweets"));
  //   //tweets : 저장된 트윗
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     // console.log(doc.id, " => ", doc.data());
  //     // querySnapshot : firebase에서 컬렉션을 마치 사진찍듯이 찍어서 보여준다.
  //     //doc.data() : 내가 입력한 트윗(컬력센에 저장된)
  //     //setTweets(prev => [doc.data(), ...prev]); // 이전에 저장된 값 => 새롭게 저장된 값 , 새 트윗을 제일 먼저 보여주기
  //     const tweetObject = {...doc.data(), id:doc.id};
  //     setTweets(prev => [tweetObject, ...prev]);
  //     //별다른건 아니고 위에 setTweets에 id값 추가해서 보여주기
  //   });
  // }

  //실시간은 어쌩크어웨이가 필요가없음 그래서 위 함수가 필요가없음.... 아까움...

  useEffect(()=>{  //실시간 데이터베이스 문서들 가져오기
    //getTweets();
    const q = query(collection(db, "tweets"),
              orderBy("createAt","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({...doc.data(), id:doc.id});
      });
      // console.log(newArray);
      setTweets(newArray);
    });
  },[]);

  // console.log(tweets)

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />

      <div style={{marginTop: 30}}>
        {tweets.map(tweet => (
          <Tweet 
          key={tweet.id}
          tweetObj={tweet}
          isOwner={tweet.createId === userObj.uid}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
