import React, { useState } from 'react';
import {db, storage} from "../fbase";
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "styles/tweetfactory.scss";
// import TweetFactory from 'components/TweetFactory';

function TweetFactory({userObj}) {
    const [tweet, setTweet] = useState(""); 
    const [attachment, setAttachment] = useState("");

      const onSubmit = async(e) => {
        e.preventDefault();
        let attachmentUrl = "";
        if(attachment !== ""){
          const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`); // 폴더 이름은 사용자객체 id/ 유니크한 id가 파일이름이 됨
          const response = await uploadString(storageRef, attachment, 'data_url');
          //console.log(response);
          attachmentUrl = await getDownloadURL(ref(storage, response.ref));
        }
    
        await addDoc(collection(db, "tweets"), {
          text: tweet,
          createAt: Date.now(),
          createId: userObj.uid,
          attachmentUrl //attachmentUrl : attachmentUrl 
          //id를 넣어준 이유는 나중에 내 트윗의 수정, 삭제를 해주기위해
        });
        setTweet("");
        setAttachment("");
      }

      const onChange = e => {
        //console.log(e.target.value);
        const {target: {value}} = e;
        setTweet(value);
      }

      const onFileChange = e => {
        //console.log(e.target.files);
        const {target: {files}} = e;
        const theFile = files[0];
        const reader = new FileReader();
        /* 두가지 시점을 가지고 있음
        파일을 인식하는 시점 / 파일 인식을 끝내는 시점
         */

        // 웹브라우저가 파일 인식을 끝낸 시점
        reader.onloadend = (finishedEvent) => {
          // console.log(finishedEvent);
          const {currentTarget:{result}} = finishedEvent;
          setAttachment(result);
        };
        reader.readAsDataURL(theFile);
      };
    
      const onClearAttachment = () => {setAttachment("");};

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input type="text" className="factoryInput__input" placeholder="What's on your mind" value={tweet} onChange={onChange} maxLength={120}/>
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className='factoryInput__label'>
        <span>Add photos</span>
        <FontAwesomeIcon icon="fa-solid fa-plus" />
      </label>
      <input type="file" accept='image/*' onChange={onFileChange} id="attach-file" style={{opacity: 0,}}/>
      {attachment && 
        <div>
          <img src={attachment} style={{backgroundImage: attachment,}} />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </div>
        </div>
      }
    </form>
  )
}

export default TweetFactory
