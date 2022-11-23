// export default Profiles
/* 프로필 페이지 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, authService, storage } from 'fbase';
import { addDoc, collection, query, getDocs, onSnapshot, where, orderBy, doc } from 'firebase/firestore';
import Tweet from 'components/Tweet';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { updateProfile} from "firebase/auth";
import "styles/profiles.scss";

function Profiles({ userObj }) {
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [userImage, setUserImage] = useState('');
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  /* 로그아웃 기능 */
  const onLogOutClick = () => {
    authService.signOut();
    navigate('/'); // 홈으로 이동 (다이렉트 기능)
  };

  /* 내가 작성한 글만 가져오는 기능 */
  const getMyTweets = async () => {
    const q = query(
              collection(db, "tweets"), 
              where("createId", "==", userObj.uid), 
              orderBy("createAt", "desc"))
    const querySnapshot = await getDocs(q);
    const newArray = [];
    querySnapshot.forEach((doc) => {
      // const tweetObject = {...doc.data(), id:doc.id} //id 추가
      // setTweets(prev => [tweetObject, ...prev]);
      newArray.push({...doc.data(), id:doc.id});
    });
    setTweets(newArray);
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  const onChange = e => {
    const {target: {value}} = e;
    setNewDisplayName(value);
  }

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   if(userObj.displayName !== newDisplayName){
  //     await updateProfile(userObj, {displayName: newDisplayName, photoURL: ""});
  //   }
  //   setNewDisplayName('');
  // }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {displayName: newDisplayName,
      });
    }
    setNewDisplayName('');
  };

  return (
    <div className='container'>
      <form onSubmit={onSubmit} className="profileForm">
        <input type="text" placeholder='Display name' onChange={onChange} value={newDisplayName} 
        autoFocus className='formInput'/>
        <input type="submit" value="Update Profile" 
        className='formBtn' style={{marginTop: 10}}/>
      </form>
      <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>
        Log Out
      </span>
      <div>
        {tweets.map(tweet => (
          <Tweet 
          key={tweet.id} 
          tweetObj={tweet} 
          isOwner={tweet.createId === userObj.uid} 
          />
        ))}
      </div>
    </div>
  );
}

export default Profiles;

// import React, { useEffect, useState } from 'react'
// import {authService, db} from '../fbase';
// import {useNavigate} from 'react-router-dom';
// import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot } from "firebase/firestore";
// import Tweet from 'components/Tweet';

// function Profiles({userObj}) {
//   const navigate = useNavigate();
//   const [tweets, setTweets] = useState([]); 

//   const onLogOutClick = () => {
//     authService.signOut();
//     navigate('/'); //홈으로 이동 즉 리다이렉트 기능이다.
//   }

//   const getMyTweets = async () => {
//     const q = query(collection(db, "tweets"),
//                     where("createId", "==", userObj.uid), 
//                     orderBy("createAt","asc")) //오름차순으로 가져와라
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//           const tweetObject = {...doc.data(), id:doc.id} //id 추가
//           setTweets(prev => [tweetObject, ...prev]);
//         });
//       }

//   useEffect(() => {
//     getMyTweets();
//   },[]);

//   return (
//     <>
//     <button onClick={onLogOutClick}>Log Out</button>
//     <div>
//     {tweets.map(tweet => (
//       <Tweet 
//       key={tweet.id}
//       tweetObj={tweet}
//       isOwner={tweet.createId === userObj.uid}
//       />
//     ))}
//     </div>
//     </>
//   )
// }
